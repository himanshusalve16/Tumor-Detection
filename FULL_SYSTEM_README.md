# 🧠 Brain Tumor Detection - Full Stack System

A complete AI-powered brain tumor detection system with React frontend and Flask backend.

## 🏗️ System Architecture

```
MRIS/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   └── App.jsx        # Main application
│   └── package.json
├── backend/               # Flask backend services
│   ├── app.py            # Prediction API (port 5000)
│   ├── data_upload.py    # Data upload interface (port 5001)
│   ├── train_model.py    # Model training script
│   └── model/            # Trained models
└── start_full_system.py  # Start all services
```

## 🚀 Quick Start

### Option 1: Start Everything at Once
```bash
python start_full_system.py
```

### Option 2: Start Services Individually

#### 1. Start Backend Services
```bash
cd backend
python start_services.py
```

#### 2. Start Frontend
```bash
cd frontend
npm start
```

## 🌐 Access Points

- **Frontend Application**: http://localhost:3000
- **Prediction API**: http://localhost:5000
- **Data Upload Interface**: http://localhost:5001

## 📋 Prerequisites

### Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Frontend Dependencies
```bash
cd frontend
npm install
```

## 🔧 System Components

### 1. Frontend (React)
- **Upload Component**: Drag & drop MRI image upload
- **Result Component**: Display prediction results with confidence
- **Real-time API Integration**: Connects to backend prediction API

### 2. Backend Services

#### Prediction API (Port 5000)
- `POST /predict` - Upload MRI image and get tumor prediction
- `POST /preprocess` - Upload image and get preprocessing info
- `GET /health` - Health check
- `GET /` - API information

#### Data Upload Interface (Port 5001)
- Web interface for uploading training data
- Organize images into train/test sets
- Start model training

### 3. AI Model
- **CNN Architecture**: 5 convolutional blocks + dense layers
- **Preprocessing**: Grayscale, resize, blur, CLAHE, normalize
- **Binary Classification**: Tumor vs No Tumor
- **Real-time Prediction**: Fast inference for web interface

## 🎯 How to Use

### For End Users (Frontend)
1. Open http://localhost:3000
2. Upload an MRI image (drag & drop or click to browse)
3. Click "Detect Tumor" to analyze
4. View results with confidence score

### For Data Scientists (Backend)
1. Open http://localhost:5001
2. Upload training images to appropriate categories
3. Click "Start Model Training" when ready
4. Monitor training progress in console

## 🔄 API Integration

The frontend communicates with the backend via REST API:

```javascript
// Frontend API call
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('http://localhost:5000/predict', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
// result: { prediction: "Tumor Detected", confidence: 0.8542, threshold: 0.5 }
```

## 📊 Training Your Own Model

### 1. Prepare Data
```
backend/data/
├── train/
│   ├── no_tumor/     # Images without tumors
│   └── tumor/        # Images with tumors
└── test/
    ├── no_tumor/     # Test images without tumors
    └── tumor/        # Test images with tumors
```

### 2. Upload Data
- Use the web interface at http://localhost:5001
- Or manually place images in the data directories

### 3. Train Model
```bash
cd backend
python train_model.py
```

### 4. Use Trained Model
The prediction API automatically uses the trained model.

## 🛠️ Development

### Frontend Development
```bash
cd frontend
npm start
```
- Hot reload enabled
- Runs on http://localhost:3000

### Backend Development
```bash
cd backend
python app.py
```
- Debug mode enabled
- Auto-reload on changes

### Testing Connection
```bash
# Test backend API
curl http://localhost:5000/health

# Test prediction (with image file)
curl -X POST -F "file=@test_image.png" http://localhost:5000/predict
```

## 🔍 Troubleshooting

### Common Issues

1. **Frontend can't connect to backend**
   - Check if backend is running on port 5000
   - Verify CORS is enabled in backend
   - Check browser console for errors

2. **Backend not starting**
   - Check if port 5000 is available
   - Verify all dependencies are installed
   - Check for Python/TensorFlow errors

3. **Model not loading**
   - Ensure `model/brain_tumor_model.h5` exists
   - Check model file permissions
   - Verify TensorFlow installation

4. **Training fails**
   - Check if training data exists
   - Verify image formats are supported
   - Check available disk space

### Debug Mode

Enable debug logging:
```bash
# Backend
export FLASK_DEBUG=1
python app.py

# Frontend
REACT_APP_DEBUG=true npm start
```

## 📈 Performance

### Model Performance
- **Input Size**: 128x128 grayscale
- **Inference Time**: ~100-500ms per image
- **Memory Usage**: ~50MB for model
- **Accuracy**: Depends on training data quality

### System Requirements
- **CPU**: Multi-core recommended
- **RAM**: 4GB+ recommended
- **Storage**: 1GB+ for models and data
- **GPU**: Optional but recommended for training

## 🔒 Security Notes

- This is a demonstration system
- Not suitable for production medical use
- Always consult medical professionals
- Data is processed locally (no cloud upload)

## 📝 File Structure

```
MRIS/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Upload.jsx
│   │   │   └── Result.jsx
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── backend/
│   ├── app.py
│   ├── data_upload.py
│   ├── train_model.py
│   ├── generate_sample_data.py
│   ├── start_services.py
│   ├── requirements.txt
│   ├── data/
│   ├── model/
│   └── uploads/
├── start_full_system.py
└── README.md
```

## 🎉 Success!

Once everything is running, you'll have:
- ✅ A beautiful React frontend for MRI upload and analysis
- ✅ A powerful Flask backend with AI prediction
- ✅ A data upload interface for training
- ✅ A complete machine learning pipeline
- ✅ Real-time brain tumor detection

The system is now ready for development, testing, and demonstration!
