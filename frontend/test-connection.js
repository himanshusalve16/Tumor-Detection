// Test script to verify frontend-backend connection
// Run this in the browser console or as a Node.js script

const API_BASE_URL = 'http://localhost:5000';

async function testBackendConnection() {
  console.log('🧠 Testing Brain Tumor Detection Backend Connection...');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test API info endpoint
    console.log('2. Testing API info endpoint...');
    const infoResponse = await fetch(`${API_BASE_URL}/`);
    const infoData = await infoResponse.json();
    console.log('✅ API info:', infoData);
    
    // Test prediction endpoint with a sample image
    console.log('3. Testing prediction endpoint...');
    
    // Create a simple test image (1x1 pixel PNG)
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Create a simple pattern
    for (let x = 0; x < 128; x++) {
      for (let y = 0; y < 128; y++) {
        const value = Math.random() * 255;
        ctx.fillStyle = `rgb(${value}, ${value}, ${value})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    
    // Convert to blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', blob, 'test-image.png');
    
    // Make prediction request
    const predictionResponse = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
    });
    
    if (!predictionResponse.ok) {
      throw new Error(`Prediction failed: ${predictionResponse.status}`);
    }
    
    const predictionData = await predictionResponse.json();
    console.log('✅ Prediction result:', predictionData);
    
    console.log('🎉 All tests passed! Backend is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('Make sure the backend is running on http://localhost:5000');
  }
}

// Run the test
testBackendConnection();
