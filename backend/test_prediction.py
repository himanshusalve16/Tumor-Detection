#!/usr/bin/env python3
"""
Test script for the MRI brain tumor detection backend
"""
import requests
import json
import os
from PIL import Image
import numpy as np

def create_test_image():
    """Create a simple test MRI-like image"""
    # Create a 256x256 grayscale image with some patterns
    img_array = np.random.randint(0, 255, (256, 256), dtype=np.uint8)
    
    # Add some structure to make it more MRI-like
    center = 128
    y, x = np.ogrid[:256, :256]
    mask = (x - center) ** 2 + (y - center) ** 2 < 100 ** 2
    img_array[mask] = img_array[mask] * 0.3 + 100
    
    # Save as PNG
    img = Image.fromarray(img_array, mode='L')
    img.save('test_mri.png')
    return 'test_mri.png'

def test_backend():
    """Test the backend endpoints"""
    base_url = 'http://localhost:5000'
    
    print("Testing MRI Brain Tumor Detection backend...")
    
    # Test 1: Health check
    print("\n1. Testing health check endpoint...")
    try:
        response = requests.get(f'{base_url}/health')
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except requests.exceptions.ConnectionError:
        print("❌ Backend not running. Please start the backend first with: python app.py")
        return False
    
    # Test 2: Home endpoint
    print("\n2. Testing home endpoint...")
    try:
        response = requests.get(f'{base_url}/')
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 3: Image preprocessing
    print("\n3. Testing image preprocessing...")
    
    # Create test image
    test_image_path = create_test_image()
    print(f"Created test image: {test_image_path}")
    
    try:
        with open(test_image_path, 'rb') as f:
            files = {'file': (test_image_path, f, 'image/png')}
            response = requests.post(f'{base_url}/preprocess', files=files)
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Image preprocessing successful!")
        else:
            print("❌ Image preprocessing failed!")
            
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 4: Brain tumor prediction
    print("\n4. Testing brain tumor prediction...")
    
    try:
        with open(test_image_path, 'rb') as f:
            files = {'file': (test_image_path, f, 'image/png')}
            response = requests.post(f'{base_url}/predict', files=files)
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Brain tumor prediction successful!")
            print(f"   Prediction: {result.get('prediction', 'N/A')}")
            print(f"   Confidence: {result.get('confidence', 'N/A')}")
        else:
            print("❌ Brain tumor prediction failed!")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Clean up test image
        if os.path.exists(test_image_path):
            os.remove(test_image_path)
            print(f"Cleaned up test image: {test_image_path}")

if __name__ == '__main__':
    test_backend()
