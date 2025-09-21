#!/usr/bin/env python3
"""
Start all services for the Brain Tumor Detection system

This script starts:
1. Data upload interface (port 5001)
2. Model training service
3. Prediction backend (port 5000)
"""

import subprocess
import time
import threading
import os
import sys
from pathlib import Path

def start_data_upload():
    """Start the data upload interface"""
    print("🚀 Starting Data Upload Interface on port 5001...")
    try:
        subprocess.run([sys.executable, 'data_upload.py'], cwd='.')
    except KeyboardInterrupt:
        print("Data upload interface stopped.")

def start_prediction_backend():
    """Start the prediction backend"""
    print("🚀 Starting Prediction Backend on port 5000...")
    try:
        subprocess.run([sys.executable, 'app.py'], cwd='.')
    except KeyboardInterrupt:
        print("Prediction backend stopped.")

def check_dependencies():
    """Check if all required dependencies are installed"""
    try:
        import tensorflow as tf
        import cv2
        import numpy as np
        import flask
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please install requirements: pip install -r requirements.txt")
        return False

def main():
    """Main function to start all services"""
    print("=" * 60)
    print("🧠 Brain Tumor Detection System")
    print("=" * 60)
    
    # Check dependencies
    if not check_dependencies():
        return
    
    # Check if we're in the right directory
    if not os.path.exists('app.py'):
        print("❌ Please run this script from the backend directory")
        return
    
    # Create necessary directories
    os.makedirs('data/train/no_tumor', exist_ok=True)
    os.makedirs('data/train/tumor', exist_ok=True)
    os.makedirs('data/test/no_tumor', exist_ok=True)
    os.makedirs('data/test/tumor', exist_ok=True)
    os.makedirs('model', exist_ok=True)
    os.makedirs('uploads', exist_ok=True)
    
    print("\n📁 Directory structure created")
    
    # Check if we have training data
    train_no_tumor = len(os.listdir('data/train/no_tumor')) if os.path.exists('data/train/no_tumor') else 0
    train_tumor = len(os.listdir('data/train/tumor')) if os.path.exists('data/train/tumor') else 0
    
    if train_no_tumor + train_tumor == 0:
        print("\n⚠️  No training data found!")
        print("Options:")
        print("1. Generate sample data: python generate_sample_data.py")
        print("2. Upload your own data via the web interface")
        print("3. Manually place images in data/train/no_tumor/ and data/train/tumor/")
        
        choice = input("\nGenerate sample data now? (y/n): ").lower().strip()
        if choice == 'y':
            print("Generating sample data...")
            subprocess.run([sys.executable, 'generate_sample_data.py'])
            print("✅ Sample data generated!")
        else:
            print("You can generate sample data later with: python generate_sample_data.py")
    
    print("\n🌐 Starting services...")
    print("=" * 60)
    print("📊 Data Upload Interface: http://localhost:5001")
    print("🔮 Prediction Backend: http://localhost:5000")
    print("=" * 60)
    print("Press Ctrl+C to stop all services")
    print("=" * 60)
    
    try:
        # Start data upload interface in a separate thread
        upload_thread = threading.Thread(target=start_data_upload)
        upload_thread.daemon = True
        upload_thread.start()
        
        # Wait a moment for the upload interface to start
        time.sleep(2)
        
        # Start prediction backend in the main thread
        start_prediction_backend()
        
    except KeyboardInterrupt:
        print("\n\n🛑 Stopping all services...")
        print("✅ All services stopped")

if __name__ == '__main__':
    main()
