# MRI Brain Tumor Detection Backend

A Flask-based backend service for preprocessing MRI images and performing brain tumor detection using deep learning.

## Features

- **Image Upload**: Accept MRI images via POST request
- **Preprocessing Pipeline**:
  - Convert to grayscale
  - Resize to 128x128 pixels
  - Apply Gaussian blur for noise removal
  - Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
  - Normalize pixel values to 0-1 range
  - Reshape to (1,128,128,1) for model input
- **Brain Tumor Detection**: Deep learning model for binary classification
- **CORS Support**: Cross-origin requests enabled for frontend integration
- **File Validation**: Supports PNG, JPG, JPEG, TIFF, BMP, and DCM files
- **Error Handling**: Comprehensive error handling and cleanup

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Usage

1. Start the Flask server:
```bash
python app.py
```

The server will start on `http://localhost:5000`

2. Test the backend:
```bash
python test_backend.py
```

## API Endpoints

### POST /preprocess
Upload and preprocess an MRI image.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `file` (image file)

**Response:**
```json
{
  "message": "Image preprocessed successfully",
  "shape": [1, 128, 128, 1],
  "min_val": 0.0,
  "max_val": 1.0
}
```

### POST /predict
Upload an MRI image and predict brain tumor presence.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `file` (image file)

**Response:**
```json
{
  "prediction": "Tumor Detected",
  "confidence": 0.8542,
  "threshold": 0.5
}
```

or

```json
{
  "prediction": "No Tumor Detected",
  "confidence": 0.1234,
  "threshold": 0.5
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "message": "MRI preprocessing backend is running"
}
```

### GET /
API information endpoint.

**Response:**
```json
{
  "message": "MRI Image Preprocessing Backend",
  "endpoints": {
    "POST /preprocess": "Upload and preprocess MRI image",
    "GET /health": "Health check",
    "GET /": "API information"
  }
}
```

## File Structure

```
backend/
├── app.py                  # Flask application
├── requirements.txt        # Python dependencies
├── uploads/               # Temporary storage for uploaded images
├── model/                 # Trained model storage
│   └── brain_tumor_model.h5
├── create_dummy_model.py  # Script to create dummy model
├── test_prediction.py     # Test script for prediction
├── test_backend.py        # Test script for preprocessing
└── README.md              # This file
```

## Dependencies

- Flask 2.3.0+
- Flask-CORS 4.0.0+
- TensorFlow 2.13.0+
- OpenCV 4.8.0+
- NumPy 1.24.0+
- Werkzeug 2.3.0+
- Pillow 9.0.0+

## Error Handling

The backend includes comprehensive error handling for:
- Missing files
- Invalid file types
- Image processing errors
- File system errors
- Automatic cleanup of temporary files

## Notes

- Maximum file size: 16MB
- Supported formats: PNG, JPG, JPEG, TIFF, BMP, DCM
- Images are automatically cleaned up after processing
- The processed image shape is always (1, 128, 128, 1) for model compatibility
