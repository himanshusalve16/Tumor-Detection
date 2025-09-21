# 🧠 Brain Tumor Detection - Training Guide

This guide explains how to train a real brain tumor detection model and integrate it with the frontend.

## 📁 Project Structure

```
backend/
├── app.py                  # Main prediction backend (port 5000)
├── data_upload.py          # Data upload interface (port 5001)
├── train_model.py          # Model training script
├── generate_sample_data.py # Generate synthetic training data
├── start_services.py       # Start all services
├── requirements.txt        # Python dependencies
├── data/                   # Training data directory
│   ├── train/
│   │   ├── no_tumor/       # Images without tumors
│   │   └── tumor/          # Images with tumors
│   └── test/
│       ├── no_tumor/       # Test images without tumors
│       └── tumor/          # Test images with tumors
├── model/                  # Trained model storage
│   └── brain_tumor_model.h5
└── uploads/               # Temporary upload storage
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start All Services

```bash
python start_services.py
```

This will:
- Start the data upload interface at http://localhost:5001
- Start the prediction backend at http://localhost:5000
- Generate sample data if none exists

### 3. Upload Training Data

1. Open http://localhost:5001 in your browser
2. Upload MRI images to the appropriate categories:
   - **No Tumor**: Images without brain tumors
   - **Tumor**: Images with brain tumors
3. Organize into training and test sets
4. Click "Start Model Training" when you have enough data

### 4. Use the Trained Model

Once training is complete, the prediction backend will automatically use the trained model for brain tumor detection.

## 📊 Training Process

### Data Requirements

- **Minimum**: 10 images per class (no_tumor, tumor)
- **Recommended**: 100+ images per class
- **Supported formats**: PNG, JPG, JPEG, TIFF, BMP
- **Image size**: Any size (will be resized to 128x128)
- **Max file size**: 16MB per image

### Data Organization

```
data/
├── train/
│   ├── no_tumor/     # Training images without tumors
│   └── tumor/        # Training images with tumors
└── test/
    ├── no_tumor/     # Test images without tumors
    └── tumor/        # Test images with tumors
```

### Model Architecture

The CNN model includes:
- 5 convolutional blocks with batch normalization
- Max pooling and dropout for regularization
- 3 dense layers for classification
- Binary output (tumor/no tumor)

### Training Features

- **Data Augmentation**: Rotation, shifting, flipping, zooming
- **Early Stopping**: Prevents overfitting
- **Learning Rate Reduction**: Adaptive learning rate
- **Model Checkpointing**: Saves best model
- **Comprehensive Metrics**: Accuracy, precision, recall

## 🔧 Manual Training

If you prefer to train manually:

### 1. Prepare Your Data

```bash
# Create directory structure
mkdir -p data/train/no_tumor data/train/tumor
mkdir -p data/test/no_tumor data/test/tumor

# Add your MRI images to the appropriate folders
```

### 2. Generate Sample Data (Optional)

```bash
python generate_sample_data.py
```

### 3. Train the Model

```bash
python train_model.py
```

### 4. Start the Backend

```bash
python app.py
```

## 📈 Monitoring Training

The training script provides:
- Real-time training progress
- Validation metrics
- Training history plots
- Model evaluation on test data
- Confusion matrix and classification report

## 🔄 Integration with Frontend

The trained model automatically integrates with the frontend:

1. **Upload Image**: User uploads MRI image via frontend
2. **Preprocessing**: Same pipeline as training (grayscale, resize, blur, CLAHE, normalize)
3. **Prediction**: Trained model predicts tumor presence
4. **Response**: Returns prediction with confidence score

## 🎯 API Endpoints

### Prediction Backend (Port 5000)

- `POST /predict` - Upload MRI image and get tumor prediction
- `POST /preprocess` - Upload image and get preprocessing info
- `GET /health` - Health check
- `GET /` - API information

### Data Upload Interface (Port 5001)

- `GET /` - Upload interface
- `POST /upload` - Upload training images
- `GET /stats` - Get data statistics
- `POST /train` - Start model training

## 🛠️ Troubleshooting

### Common Issues

1. **No training data**: Generate sample data or upload your own
2. **Model not loading**: Check if `model/brain_tumor_model.h5` exists
3. **Memory errors**: Reduce batch size in `train_model.py`
4. **Poor accuracy**: Add more training data or adjust model architecture

### Performance Tips

- Use GPU if available (TensorFlow will automatically detect)
- Increase batch size for better GPU utilization
- Add more data augmentation for better generalization
- Tune hyperparameters (learning rate, epochs, etc.)

## 📝 Customization

### Model Architecture

Edit `train_model.py` to modify:
- Number of convolutional layers
- Filter sizes and counts
- Dense layer architecture
- Dropout rates
- Activation functions

### Preprocessing Pipeline

Edit `preprocess_image()` in both `train_model.py` and `app.py` to modify:
- Image resizing
- Noise reduction
- Contrast enhancement
- Normalization

### Training Parameters

Modify training parameters in `train_model.py`:
- Epochs
- Batch size
- Learning rate
- Data augmentation settings
- Callback configurations

## 🎉 Success!

Once training is complete, you'll have:
- A trained model saved as `model/brain_tumor_model.h5`
- Model information in `model/model_info.json`
- Training history plots
- A fully functional prediction API

The model will automatically be used by the prediction backend for real-time brain tumor detection!
