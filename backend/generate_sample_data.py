#!/usr/bin/env python3
"""
Generate sample training data for brain tumor detection

This script creates synthetic MRI-like images for testing the training pipeline.
In production, replace these with real MRI images.
"""

import os
import numpy as np
import cv2
from PIL import Image
import random

def create_synthetic_mri_image(has_tumor=False, size=(256, 256)):
    """
    Create a synthetic MRI-like image
    """
    # Create base image with noise
    img = np.random.normal(128, 30, size).astype(np.uint8)
    
    # Add some structure to make it more realistic
    center = (size[0] // 2, size[1] // 2)
    
    # Create brain-like structure
    y, x = np.ogrid[:size[0], :size[1]]
    brain_mask = (x - center[1]) ** 2 + (y - center[0]) ** 2 < (min(size) // 3) ** 2
    
    # Apply brain mask
    img[~brain_mask] = 0
    
    # Add some anatomical features
    # Ventricles (darker regions)
    ventricle_mask = (x - center[1]) ** 2 + (y - center[0]) ** 2 < (min(size) // 6) ** 2
    img[ventricle_mask] = img[ventricle_mask] * 0.3 + 50
    
    if has_tumor:
        # Add tumor-like structure (brighter, irregular shape)
        tumor_center = (
            center[0] + random.randint(-30, 30),
            center[1] + random.randint(-30, 30)
        )
        
        # Create irregular tumor shape
        tumor_mask = np.zeros_like(img, dtype=bool)
        for i in range(5):  # Multiple circles for irregular shape
            offset_x = random.randint(-15, 15)
            offset_y = random.randint(-15, 15)
            radius = random.randint(10, 25)
            
            y_tumor, x_tumor = np.ogrid[:size[0], :size[1]]
            tumor_circle = (x_tumor - tumor_center[1] - offset_x) ** 2 + (y_tumor - tumor_center[0] - offset_y) ** 2 < radius ** 2
            tumor_mask |= tumor_circle
        
        # Apply tumor (brighter, more contrast)
        img[tumor_mask] = np.clip(img[tumor_mask] * 1.5 + 50, 0, 255)
        
        # Add some texture variation
        noise = np.random.normal(0, 20, img.shape)
        img[tumor_mask] = np.clip(img[tumor_mask] + noise[tumor_mask], 0, 255)
    
    # Apply some smoothing
    img = cv2.GaussianBlur(img, (3, 3), 0)
    
    # Add some noise
    noise = np.random.normal(0, 5, img.shape)
    img = np.clip(img + noise, 0, 255).astype(np.uint8)
    
    return img

def generate_sample_dataset():
    """
    Generate sample training and test data
    """
    print("Generating sample MRI dataset...")
    
    # Create directories
    os.makedirs('data/train/no_tumor', exist_ok=True)
    os.makedirs('data/train/tumor', exist_ok=True)
    os.makedirs('data/test/no_tumor', exist_ok=True)
    os.makedirs('data/test/tumor', exist_ok=True)
    
    # Generate training data
    print("Generating training data...")
    
    # No tumor images (training)
    for i in range(50):
        img = create_synthetic_mri_image(has_tumor=False)
        filename = f'no_tumor_train_{i:03d}.png'
        filepath = os.path.join('data/train/no_tumor', filename)
        Image.fromarray(img).save(filepath)
    
    # Tumor images (training)
    for i in range(50):
        img = create_synthetic_mri_image(has_tumor=True)
        filename = f'tumor_train_{i:03d}.png'
        filepath = os.path.join('data/train/tumor', filename)
        Image.fromarray(img).save(filepath)
    
    # Generate test data
    print("Generating test data...")
    
    # No tumor images (test)
    for i in range(15):
        img = create_synthetic_mri_image(has_tumor=False)
        filename = f'no_tumor_test_{i:03d}.png'
        filepath = os.path.join('data/test/no_tumor', filename)
        Image.fromarray(img).save(filepath)
    
    # Tumor images (test)
    for i in range(15):
        img = create_synthetic_mri_image(has_tumor=True)
        filename = f'tumor_test_{i:03d}.png'
        filepath = os.path.join('data/test/tumor', filename)
        Image.fromarray(img).save(filepath)
    
    print("✅ Sample dataset generated successfully!")
    print(f"Training data: 50 no-tumor + 50 tumor = 100 images")
    print(f"Test data: 15 no-tumor + 15 tumor = 30 images")
    print(f"Total: 130 synthetic MRI images")
    print("\nYou can now:")
    print("1. Start the data upload interface: python data_upload.py")
    print("2. Train the model: python train_model.py")
    print("3. Start the prediction backend: python app.py")

if __name__ == '__main__':
    generate_sample_dataset()
