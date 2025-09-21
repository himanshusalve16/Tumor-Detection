#!/usr/bin/env python3
"""
Data Upload Interface for Brain Tumor Detection Training

This script provides a simple interface to upload and organize training images
for the brain tumor detection model.
"""

import os
import shutil
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from werkzeug.utils import secure_filename
import cv2
import numpy as np
from PIL import Image

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'data_uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'tiff', 'bmp'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs('data/train/no_tumor', exist_ok=True)
os.makedirs('data/train/tumor', exist_ok=True)
os.makedirs('data/test/no_tumor', exist_ok=True)
os.makedirs('data/test/tumor', exist_ok=True)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_image(image_path):
    """Validate that the uploaded file is a valid image"""
    try:
        # Try to open with PIL
        with Image.open(image_path) as img:
            img.verify()
        
        # Try to read with OpenCV
        img = cv2.imread(image_path)
        if img is None:
            return False, "Image could not be read by OpenCV"
        
        # Check image dimensions
        height, width = img.shape[:2]
        if height < 32 or width < 32:
            return False, "Image too small (minimum 32x32 pixels)"
        
        if height > 2048 or width > 2048:
            return False, "Image too large (maximum 2048x2048 pixels)"
        
        return True, "Valid image"
        
    except Exception as e:
        return False, f"Invalid image: {str(e)}"

@app.route('/')
def index():
    """Main upload interface"""
    return render_template_string('''
<!DOCTYPE html>
<html>
<head>
    <title>Brain Tumor Detection - Data Upload</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; margin-bottom: 30px; }
        .upload-section { margin: 20px 0; padding: 20px; border: 2px dashed #ddd; border-radius: 10px; }
        .upload-section h3 { margin-top: 0; color: #666; }
        input[type="file"] { margin: 10px 0; }
        button { background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
        button:hover { background-color: #0056b3; }
        .status { margin: 10px 0; padding: 10px; border-radius: 5px; }
        .success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .info { background-color: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
        .stats { display: flex; justify-content: space-around; margin: 20px 0; }
        .stat-box { text-align: center; padding: 15px; background: #f8f9fa; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧠 Brain Tumor Detection - Data Upload</h1>
        
        <div class="info">
            <h3>📁 Data Organization</h3>
            <p>Upload your MRI images to train the brain tumor detection model:</p>
            <ul>
                <li><strong>No Tumor Images:</strong> Upload to "No Tumor" section</li>
                <li><strong>Tumor Images:</strong> Upload to "Tumor" section</li>
                <li><strong>Supported Formats:</strong> PNG, JPG, JPEG, TIFF, BMP</li>
                <li><strong>Max File Size:</strong> 16MB per image</li>
            </ul>
        </div>

        <div class="stats" id="stats">
            <div class="stat-box">
                <h4>No Tumor (Train)</h4>
                <div id="no-tumor-train">0</div>
            </div>
            <div class="stat-box">
                <h4>Tumor (Train)</h4>
                <div id="tumor-train">0</div>
            </div>
            <div class="stat-box">
                <h4>No Tumor (Test)</h4>
                <div id="no-tumor-test">0</div>
            </div>
            <div class="stat-box">
                <h4>Tumor (Test)</h4>
                <div id="tumor-test">0</div>
            </div>
        </div>

        <div class="upload-section">
            <h3>📤 Upload No Tumor Images (Training)</h3>
            <input type="file" id="no-tumor-train-files" multiple accept="image/*">
            <button onclick="uploadFiles('no-tumor-train', 'train')">Upload to Training Set</button>
            <button onclick="uploadFiles('no-tumor-train', 'test')">Upload to Test Set</button>
            <div id="no-tumor-train-status"></div>
        </div>

        <div class="upload-section">
            <h3>📤 Upload Tumor Images (Training)</h3>
            <input type="file" id="tumor-train-files" multiple accept="image/*">
            <button onclick="uploadFiles('tumor-train', 'train')">Upload to Training Set</button>
            <button onclick="uploadFiles('tumor-train', 'test')">Upload to Test Set</button>
            <div id="tumor-train-status"></div>
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <button onclick="startTraining()" style="background-color: #28a745; font-size: 16px; padding: 15px 30px;">
                🚀 Start Model Training
            </button>
            <button onclick="loadStats()" style="background-color: #6c757d;">
                📊 Refresh Statistics
            </button>
        </div>

        <div id="training-status"></div>
    </div>

    <script>
        function uploadFiles(category, dataset) {
            const fileInput = document.getElementById(category + '-files');
            const files = fileInput.files;
            const statusDiv = document.getElementById(category + '-status');
            
            if (files.length === 0) {
                statusDiv.innerHTML = '<div class="error">Please select files to upload</div>';
                return;
            }

            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }
            formData.append('category', category.split('-')[0] + '-' + category.split('-')[1]);
            formData.append('dataset', dataset);

            statusDiv.innerHTML = '<div class="info">Uploading files...</div>';

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    statusDiv.innerHTML = `<div class="success">${data.message}</div>`;
                    fileInput.value = '';
                    loadStats();
                } else {
                    statusDiv.innerHTML = `<div class="error">${data.error}</div>`;
                }
            })
            .catch(error => {
                statusDiv.innerHTML = `<div class="error">Upload failed: ${error}</div>`;
            });
        }

        function startTraining() {
            const statusDiv = document.getElementById('training-status');
            statusDiv.innerHTML = '<div class="info">Starting model training... This may take several minutes.</div>';

            fetch('/train', {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    statusDiv.innerHTML = `<div class="success">${data.message}</div>`;
                } else {
                    statusDiv.innerHTML = `<div class="error">${data.error}</div>`;
                }
            })
            .catch(error => {
                statusDiv.innerHTML = `<div class="error">Training failed: ${error}</div>`;
            });
        }

        function loadStats() {
            fetch('/stats')
            .then(response => response.json())
            .then(data => {
                document.getElementById('no-tumor-train').textContent = data.no_tumor_train;
                document.getElementById('tumor-train').textContent = data.tumor_train;
                document.getElementById('no-tumor-test').textContent = data.no_tumor_test;
                document.getElementById('tumor-test').textContent = data.tumor_test;
            });
        }

        // Load stats on page load
        loadStats();
    </script>
</body>
</html>
    ''')

@app.route('/upload', methods=['POST'])
def upload_files():
    """Handle file uploads"""
    try:
        if 'files' not in request.files:
            return jsonify({'success': False, 'error': 'No files provided'})
        
        files = request.files.getlist('files')
        category = request.form.get('category')  # 'no-tumor' or 'tumor'
        dataset = request.form.get('dataset')    # 'train' or 'test'
        
        if not category or not dataset:
            return jsonify({'success': False, 'error': 'Missing category or dataset'})
        
        uploaded_count = 0
        errors = []
        
        for file in files:
            if file and file.filename and allowed_file(file.filename):
                # Save to temporary location
                filename = secure_filename(file.filename)
                temp_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(temp_path)
                
                # Validate image
                is_valid, message = validate_image(temp_path)
                if not is_valid:
                    errors.append(f"{filename}: {message}")
                    os.remove(temp_path)
                    continue
                
                # Determine destination
                if category == 'no-tumor':
                    dest_dir = f'data/{dataset}/no_tumor'
                else:
                    dest_dir = f'data/{dataset}/tumor'
                
                # Move to final location
                dest_path = os.path.join(dest_dir, filename)
                shutil.move(temp_path, dest_path)
                uploaded_count += 1
            else:
                errors.append(f"{file.filename}: Invalid file type")
        
        if uploaded_count > 0:
            message = f"Successfully uploaded {uploaded_count} files to {dataset} set"
            if errors:
                message += f". {len(errors)} files failed validation."
            return jsonify({'success': True, 'message': message})
        else:
            return jsonify({'success': False, 'error': 'No valid files uploaded'})
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/stats', methods=['GET'])
def get_stats():
    """Get current data statistics"""
    try:
        stats = {
            'no_tumor_train': len(os.listdir('data/train/no_tumor')) if os.path.exists('data/train/no_tumor') else 0,
            'tumor_train': len(os.listdir('data/train/tumor')) if os.path.exists('data/train/tumor') else 0,
            'no_tumor_test': len(os.listdir('data/test/no_tumor')) if os.path.exists('data/test/no_tumor') else 0,
            'tumor_test': len(os.listdir('data/test/tumor')) if os.path.exists('data/test/tumor') else 0
        }
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/train', methods=['POST'])
def start_training():
    """Start model training"""
    try:
        # Check if we have enough data
        stats = get_stats().get_json()
        total_train = stats['no_tumor_train'] + stats['tumor_train']
        
        if total_train < 10:
            return jsonify({
                'success': False, 
                'error': f'Not enough training data. Need at least 10 images, have {total_train}'
            })
        
        # Start training in background (in production, use a proper task queue)
        import subprocess
        import threading
        
        def run_training():
            subprocess.run(['python', 'train_model.py'], cwd='.')
        
        training_thread = threading.Thread(target=run_training)
        training_thread.daemon = True
        training_thread.start()
        
        return jsonify({
            'success': True,
            'message': f'Training started with {total_train} images. Check the console for progress.'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    print("Starting Data Upload Interface...")
    print("Open http://localhost:5001 in your browser to upload training data")
    app.run(debug=True, host='0.0.0.0', port=5001)
