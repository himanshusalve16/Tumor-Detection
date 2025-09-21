#!/usr/bin/env python3
"""
Start the complete Brain Tumor Detection System

This script starts:
1. Backend services (data upload + prediction)
2. Frontend React development server
"""

import subprocess
import time
import threading
import os
import sys
import webbrowser
from pathlib import Path

def start_backend():
    """Start the backend services"""
    print("🚀 Starting Backend Services...")
    try:
        # Change to backend directory
        backend_dir = Path(__file__).parent / "backend"
        os.chdir(backend_dir)
        
        # Start the backend
        subprocess.run([sys.executable, "start_services.py"])
    except KeyboardInterrupt:
        print("Backend services stopped.")
    except Exception as e:
        print(f"Error starting backend: {e}")

def start_frontend():
    """Start the frontend React development server"""
    print("🚀 Starting Frontend...")
    try:
        # Change to frontend directory
        frontend_dir = Path(__file__).parent / "frontend"
        os.chdir(frontend_dir)
        
        # Start React development server
        subprocess.run(["npm", "start"])
    except KeyboardInterrupt:
        print("Frontend stopped.")
    except Exception as e:
        print(f"Error starting frontend: {e}")

def check_dependencies():
    """Check if all required dependencies are available"""
    print("🔍 Checking dependencies...")
    
    # Check if we're in the right directory
    if not os.path.exists("backend") or not os.path.exists("frontend"):
        print("❌ Please run this script from the MRIS project root directory")
        return False
    
    # Check backend dependencies
    try:
        import tensorflow as tf
        import flask
        print("✅ Backend dependencies OK")
    except ImportError as e:
        print(f"❌ Backend dependencies missing: {e}")
        print("Run: cd backend && pip install -r requirements.txt")
        return False
    
    # Check frontend dependencies
    frontend_dir = Path("frontend")
    if not (frontend_dir / "node_modules").exists():
        print("❌ Frontend dependencies missing")
        print("Run: cd frontend && npm install")
        return False
    else:
        print("✅ Frontend dependencies OK")
    
    return True

def main():
    """Main function to start the complete system"""
    print("=" * 60)
    print("🧠 Brain Tumor Detection System - Full Stack")
    print("=" * 60)
    
    # Check dependencies
    if not check_dependencies():
        return
    
    print("\n🌐 Starting all services...")
    print("=" * 60)
    print("📊 Data Upload Interface: http://localhost:5001")
    print("🔮 Prediction Backend: http://localhost:5000")
    print("🎨 Frontend Application: http://localhost:3000")
    print("=" * 60)
    print("Press Ctrl+C to stop all services")
    print("=" * 60)
    
    try:
        # Start backend in a separate thread
        backend_thread = threading.Thread(target=start_backend)
        backend_thread.daemon = True
        backend_thread.start()
        
        # Wait a moment for backend to start
        time.sleep(3)
        
        # Start frontend in the main thread
        start_frontend()
        
    except KeyboardInterrupt:
        print("\n\n🛑 Stopping all services...")
        print("✅ All services stopped")

if __name__ == '__main__':
    main()
