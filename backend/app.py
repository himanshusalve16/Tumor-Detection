from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import os
from werkzeug.utils import secure_filename
import tensorflow as tf

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
MODEL_FOLDER = 'model'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'tiff', 'bmp', 'dcm'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(MODEL_FOLDER, exist_ok=True)

# Global variable to store the loaded model
model = None

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def load_model():
    """Load the trained brain tumor detection model"""
    global model
    if model is None:
        model_path = os.path.join(MODEL_FOLDER, 'brain_tumor_model.h5')
        if os.path.exists(model_path):
            try:
                model = tf.keras.models.load_model(model_path)
                print(f"✅ Trained model loaded successfully from {model_path}")
                print(f"Model input shape: {model.input_shape}")
                print(f"Model output shape: {model.output_shape}")
            except Exception as e:
                print(f"❌ Error loading trained model: {str(e)}")
                print("Creating dummy model for testing...")
                model = create_dummy_model()
        else:
            print(f"⚠️  No trained model found at {model_path}")
            print("Creating dummy model for testing...")
            print("To use a real model, train one using the data upload interface at http://localhost:5001")
            model = create_dummy_model()
    return model

def create_dummy_model():
    """Create a dummy model for testing purposes"""
    # This creates a simple CNN model that outputs random predictions
    # In production, replace this with your actual trained model
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(128, 128, 1)),
        tf.keras.layers.Conv2D(32, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(1, activation='sigmoid')  # Binary classification
    ])
    
    # Compile the model
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    
    # Initialize with random weights (in production, load trained weights)
    dummy_input = np.random.random((1, 128, 128, 1))
    model.predict(dummy_input)
    
    print("Dummy model created for testing")
    return model

def preprocess_mri_image(image_path):
    """
    Preprocess MRI image with the following steps:
    1. Convert to grayscale
    2. Resize to 128x128
    3. Apply Gaussian blur for noise removal
    4. Apply CLAHE for contrast enhancement
    5. Normalize pixel values to 0-1 range
    6. Reshape to (1,128,128,1)
    """
    try:
        # Read the image
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError("Could not read image file")
        
        # Step 1: Convert to grayscale
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image
        
        # Step 2: Resize to 128x128
        resized = cv2.resize(gray, (128, 128), interpolation=cv2.INTER_AREA)
        
        # Step 3: Apply Gaussian blur for noise removal
        blurred = cv2.GaussianBlur(resized, (5, 5), 0)
        
        # Step 4: Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(blurred)
        
        # Step 5: Normalize pixel values to 0-1 range
        normalized = enhanced.astype(np.float32) / 255.0
        
        # Step 6: Reshape to (1,128,128,1) - ready for model
        reshaped = normalized.reshape(1, 128, 128, 1)
        
        return reshaped
        
    except Exception as e:
        raise Exception(f"Error preprocessing image: {str(e)}")

@app.route('/preprocess', methods=['POST'])
def preprocess_image():
    """Handle image upload and preprocessing"""
    try:
        # Check if file is present in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check if file type is allowed
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed. Please upload PNG, JPG, JPEG, TIFF, BMP, or DCM files'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Preprocess the image
            processed_image = preprocess_mri_image(filepath)
            
            # Get image statistics
            shape = processed_image.shape
            min_val = float(np.min(processed_image))
            max_val = float(np.max(processed_image))
            
            # Clean up uploaded file
            os.remove(filepath)
            
            # Return success response
            return jsonify({
                'message': 'Image preprocessed successfully',
                'shape': shape,
                'min_val': min_val,
                'max_val': max_val
            }), 200
            
        except Exception as e:
            # Clean up uploaded file in case of error
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': str(e)}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict_tumor():
    """Handle image upload, preprocessing, and tumor prediction"""
    try:
        # Check if file is present in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check if file type is allowed
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed. Please upload PNG, JPG, JPEG, TIFF, BMP, or DCM files'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Preprocess the image
            processed_image = preprocess_mri_image(filepath)
            
            # Load the model
            model = load_model()
            
            # Make prediction
            prediction = model.predict(processed_image, verbose=0)
            prediction_prob = float(prediction[0][0])
            
            # Determine result based on threshold (0.5 for binary classification)
            threshold = 0.5
            if prediction_prob >= threshold:
                result = "Tumor Detected"
            else:
                result = "No Tumor Detected"
            
            # Clean up uploaded file
            os.remove(filepath)
            
            # Return prediction result
            return jsonify({
                'prediction': result,
                'confidence': round(prediction_prob, 4),
                'threshold': threshold
            }), 200
            
        except Exception as e:
            # Clean up uploaded file in case of error
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': str(e)}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'MRI preprocessing backend is running'}), 200

@app.route('/', methods=['GET'])
def home():
    """Home endpoint with API information"""
    return jsonify({
        'message': 'MRI Brain Tumor Detection Backend',
        'endpoints': {
            'POST /preprocess': 'Upload and preprocess MRI image',
            'POST /predict': 'Upload MRI image and predict brain tumor',
            'GET /health': 'Health check',
            'GET /': 'API information'
        }
    }), 200

if __name__ == '__main__':
    print("Starting MRI Brain Tumor Detection backend...")
    print("Available endpoints:")
    print("  POST /preprocess - Upload and preprocess MRI image")
    print("  POST /predict - Upload MRI image and predict brain tumor")
    print("  GET /health - Health check")
    print("  GET / - API information")
    
    # Load model on startup
    print("Loading model...")
    load_model()
    
    app.run(debug=True, host='0.0.0.0', port=5000)
