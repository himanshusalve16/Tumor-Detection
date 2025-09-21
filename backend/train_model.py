#!/usr/bin/env python3
"""
Brain Tumor Detection Model Training Script

This script trains a CNN model for brain tumor detection using MRI images.
Place your training images in the following structure:
data/
├── train/
│   ├── no_tumor/     # Images without tumors
│   └── tumor/        # Images with tumors
└── test/
    ├── no_tumor/     # Test images without tumors
    └── tumor/        # Test images with tumors
"""

import os
import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
from PIL import Image
import json

class BrainTumorDetector:
    def __init__(self, img_size=(128, 128), batch_size=32):
        self.img_size = img_size
        self.batch_size = batch_size
        self.model = None
        self.history = None
        
    def preprocess_image(self, image_path):
        """
        Preprocess a single image using the same pipeline as the backend
        """
        try:
            # Read the image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError(f"Could not read image: {image_path}")
            
            # Convert to grayscale
            if len(image.shape) == 3:
                gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            else:
                gray = image
            
            # Resize to target size
            resized = cv2.resize(gray, self.img_size, interpolation=cv2.INTER_AREA)
            
            # Apply Gaussian blur for noise removal
            blurred = cv2.GaussianBlur(resized, (5, 5), 0)
            
            # Apply CLAHE for contrast enhancement
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            enhanced = clahe.apply(blurred)
            
            # Normalize pixel values to 0-1 range
            normalized = enhanced.astype(np.float32) / 255.0
            
            return normalized
            
        except Exception as e:
            print(f"Error preprocessing image {image_path}: {str(e)}")
            return None
    
    def load_data(self, data_dir):
        """
        Load and preprocess training data
        """
        print("Loading and preprocessing data...")
        
        images = []
        labels = []
        
        # Load no_tumor images (label = 0)
        no_tumor_dir = os.path.join(data_dir, 'train', 'no_tumor')
        if os.path.exists(no_tumor_dir):
            for filename in os.listdir(no_tumor_dir):
                if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
                    image_path = os.path.join(no_tumor_dir, filename)
                    processed_img = self.preprocess_image(image_path)
                    if processed_img is not None:
                        images.append(processed_img)
                        labels.append(0)
        
        # Load tumor images (label = 1)
        tumor_dir = os.path.join(data_dir, 'train', 'tumor')
        if os.path.exists(tumor_dir):
            for filename in os.listdir(tumor_dir):
                if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
                    image_path = os.path.join(tumor_dir, filename)
                    processed_img = self.preprocess_image(image_path)
                    if processed_img is not None:
                        images.append(processed_img)
                        labels.append(1)
        
        if len(images) == 0:
            raise ValueError("No training images found! Please add images to data/train/no_tumor/ and data/train/tumor/")
        
        images = np.array(images)
        labels = np.array(labels)
        
        # Reshape images for CNN (add channel dimension)
        images = images.reshape(images.shape[0], self.img_size[0], self.img_size[1], 1)
        
        print(f"Loaded {len(images)} training images")
        print(f"No tumor images: {np.sum(labels == 0)}")
        print(f"Tumor images: {np.sum(labels == 1)}")
        
        return images, labels
    
    def create_model(self):
        """
        Create the CNN model architecture
        """
        print("Creating model architecture...")
        
        model = Sequential([
            # First convolutional block
            Conv2D(32, (3, 3), activation='relu', input_shape=(*self.img_size, 1)),
            BatchNormalization(),
            MaxPooling2D((2, 2)),
            Dropout(0.25),
            
            # Second convolutional block
            Conv2D(64, (3, 3), activation='relu'),
            BatchNormalization(),
            MaxPooling2D((2, 2)),
            Dropout(0.25),
            
            # Third convolutional block
            Conv2D(128, (3, 3), activation='relu'),
            BatchNormalization(),
            MaxPooling2D((2, 2)),
            Dropout(0.25),
            
            # Fourth convolutional block
            Conv2D(256, (3, 3), activation='relu'),
            BatchNormalization(),
            MaxPooling2D((2, 2)),
            Dropout(0.25),
            
            # Fifth convolutional block
            Conv2D(512, (3, 3), activation='relu'),
            BatchNormalization(),
            MaxPooling2D((2, 2)),
            Dropout(0.25),
            
            # Dense layers
            Flatten(),
            Dense(512, activation='relu'),
            BatchNormalization(),
            Dropout(0.5),
            Dense(256, activation='relu'),
            Dropout(0.5),
            Dense(128, activation='relu'),
            Dropout(0.3),
            Dense(1, activation='sigmoid')  # Binary classification
        ])
        
        # Compile the model
        model.compile(
            optimizer=Adam(learning_rate=0.001),
            loss='binary_crossentropy',
            metrics=['accuracy', 'precision', 'recall']
        )
        
        self.model = model
        return model
    
    def train(self, X_train, y_train, X_val, y_val, epochs=100):
        """
        Train the model
        """
        print("Starting model training...")
        
        # Data augmentation
        train_datagen = ImageDataGenerator(
            rotation_range=20,
            width_shift_range=0.2,
            height_shift_range=0.2,
            horizontal_flip=True,
            zoom_range=0.2,
            fill_mode='nearest'
        )
        
        # Callbacks
        callbacks = [
            EarlyStopping(patience=10, restore_best_weights=True),
            ReduceLROnPlateau(factor=0.5, patience=5, min_lr=1e-7),
            ModelCheckpoint(
                'model/brain_tumor_model.h5',
                save_best_only=True,
                monitor='val_accuracy',
                mode='max'
            )
        ]
        
        # Train the model
        self.history = self.model.fit(
            train_datagen.flow(X_train, y_train, batch_size=self.batch_size),
            steps_per_epoch=len(X_train) // self.batch_size,
            epochs=epochs,
            validation_data=(X_val, y_val),
            callbacks=callbacks,
            verbose=1
        )
        
        return self.history
    
    def evaluate(self, X_test, y_test):
        """
        Evaluate the model on test data
        """
        print("Evaluating model...")
        
        # Predictions
        y_pred = self.model.predict(X_test)
        y_pred_binary = (y_pred > 0.5).astype(int).flatten()
        
        # Metrics
        test_loss, test_accuracy, test_precision, test_recall = self.model.evaluate(X_test, y_test, verbose=0)
        
        print(f"\nTest Results:")
        print(f"Accuracy: {test_accuracy:.4f}")
        print(f"Precision: {test_precision:.4f}")
        print(f"Recall: {test_recall:.4f}")
        print(f"Loss: {test_loss:.4f}")
        
        # Classification report
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred_binary, target_names=['No Tumor', 'Tumor']))
        
        # Confusion matrix
        cm = confusion_matrix(y_test, y_pred_binary)
        print("\nConfusion Matrix:")
        print(cm)
        
        return {
            'accuracy': test_accuracy,
            'precision': test_precision,
            'recall': test_recall,
            'loss': test_loss,
            'confusion_matrix': cm.tolist()
        }
    
    def plot_training_history(self):
        """
        Plot training history
        """
        if self.history is None:
            print("No training history available!")
            return
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        
        # Accuracy
        axes[0, 0].plot(self.history.history['accuracy'], label='Training Accuracy')
        axes[0, 0].plot(self.history.history['val_accuracy'], label='Validation Accuracy')
        axes[0, 0].set_title('Model Accuracy')
        axes[0, 0].set_xlabel('Epoch')
        axes[0, 0].set_ylabel('Accuracy')
        axes[0, 0].legend()
        
        # Loss
        axes[0, 1].plot(self.history.history['loss'], label='Training Loss')
        axes[0, 1].plot(self.history.history['val_loss'], label='Validation Loss')
        axes[0, 1].set_title('Model Loss')
        axes[0, 1].set_xlabel('Epoch')
        axes[0, 1].set_ylabel('Loss')
        axes[0, 1].legend()
        
        # Precision
        axes[1, 0].plot(self.history.history['precision'], label='Training Precision')
        axes[1, 0].plot(self.history.history['val_precision'], label='Validation Precision')
        axes[1, 0].set_title('Model Precision')
        axes[1, 0].set_xlabel('Epoch')
        axes[1, 0].set_ylabel('Precision')
        axes[1, 0].legend()
        
        # Recall
        axes[1, 1].plot(self.history.history['recall'], label='Training Recall')
        axes[1, 1].plot(self.history.history['val_recall'], label='Validation Recall')
        axes[1, 1].set_title('Model Recall')
        axes[1, 1].set_xlabel('Epoch')
        axes[1, 1].set_ylabel('Recall')
        axes[1, 1].legend()
        
        plt.tight_layout()
        plt.savefig('training_history.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def save_model_info(self, results):
        """
        Save model information and results
        """
        model_info = {
            'architecture': 'CNN for Brain Tumor Detection',
            'input_shape': [*self.img_size, 1],
            'total_parameters': self.model.count_params(),
            'training_results': results,
            'preprocessing': {
                'resize': self.img_size,
                'grayscale': True,
                'gaussian_blur': True,
                'clahe': True,
                'normalization': '0-1'
            }
        }
        
        with open('model/model_info.json', 'w') as f:
            json.dump(model_info, f, indent=2)
        
        print("Model information saved to model/model_info.json")

def main():
    """
    Main training function
    """
    print("=== Brain Tumor Detection Model Training ===")
    
    # Check if data directory exists
    if not os.path.exists('data'):
        print("Error: Data directory not found!")
        print("Please create the following structure:")
        print("data/")
        print("├── train/")
        print("│   ├── no_tumor/     # Images without tumors")
        print("│   └── tumor/        # Images with tumors")
        print("└── test/")
        print("    ├── no_tumor/     # Test images without tumors")
        print("    └── tumor/        # Test images with tumors")
        return
    
    # Initialize detector
    detector = BrainTumorDetector(img_size=(128, 128), batch_size=32)
    
    try:
        # Load training data
        X, y = detector.load_data('data')
        
        # Split data into train and validation
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        print(f"Training set: {len(X_train)} images")
        print(f"Validation set: {len(X_val)} images")
        
        # Create model
        model = detector.create_model()
        print(f"Model created with {model.count_params():,} parameters")
        
        # Train model
        history = detector.train(X_train, y_train, X_val, y_val, epochs=50)
        
        # Evaluate model
        results = detector.evaluate(X_val, y_val)
        
        # Plot training history
        detector.plot_training_history()
        
        # Save model information
        detector.save_model_info(results)
        
        print("\n=== Training Completed Successfully! ===")
        print("Model saved to: model/brain_tumor_model.h5")
        print("You can now use this model with the Flask backend.")
        
    except Exception as e:
        print(f"Error during training: {str(e)}")
        print("Please check your data directory structure and try again.")

if __name__ == '__main__':
    main()
