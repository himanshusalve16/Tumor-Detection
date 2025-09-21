#!/usr/bin/env python3
"""
Script to create a dummy brain tumor detection model for testing purposes.
In production, replace this with your actual trained model.
"""
import tensorflow as tf
import numpy as np
import os

def create_dummy_brain_tumor_model():
    """Create a dummy CNN model for brain tumor detection"""
    
    # Create model architecture
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(128, 128, 1)),
        
        # First convolutional block
        tf.keras.layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Dropout(0.25),
        
        # Second convolutional block
        tf.keras.layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Dropout(0.25),
        
        # Third convolutional block
        tf.keras.layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Dropout(0.25),
        
        # Fourth convolutional block
        tf.keras.layers.Conv2D(256, (3, 3), activation='relu', padding='same'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Dropout(0.25),
        
        # Dense layers
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(512, activation='relu'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(256, activation='relu'),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(1, activation='sigmoid')  # Binary classification
    ])
    
    # Compile the model
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    
    # Print model summary
    print("Model Architecture:")
    model.summary()
    
    # Initialize the model with dummy data to set weights
    print("Initializing model with dummy data...")
    dummy_input = np.random.random((1, 128, 128, 1))
    dummy_output = model.predict(dummy_input, verbose=0)
    
    # Create model directory if it doesn't exist
    os.makedirs('model', exist_ok=True)
    
    # Save the model
    model_path = 'model/brain_tumor_model.h5'
    model.save(model_path)
    print(f"Dummy model saved to: {model_path}")
    
    # Test the model
    print("Testing model with random input...")
    test_input = np.random.random((1, 128, 128, 1))
    prediction = model.predict(test_input, verbose=0)
    print(f"Test prediction: {prediction[0][0]:.4f}")
    
    return model

if __name__ == '__main__':
    print("Creating dummy brain tumor detection model...")
    model = create_dummy_brain_tumor_model()
    print("Dummy model creation completed!")
