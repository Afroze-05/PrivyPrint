/**
 * Test file to verify socket connection fix
 * Run this in browser console to test socket initialization
 */

// Test socket connection
import { initializeSocket, isConnected, getConnectionStatus } from './src/services/socket.js';

console.log('Testing socket connection fix...');

try {
  const socket = initializeSocket();
  
  if (socket) {
    console.log('Socket initialized successfully');
    console.log('Connection status:', getConnectionStatus());
    console.log('Is connected:', isConnected());
    
    // Test connection after a delay
    setTimeout(() => {
      console.log('Connection status after 2 seconds:', getConnectionStatus());
    }, 2000);
    
  } else {
    console.log('Socket initialization returned null (no auth token)');
  }
  
} catch (error) {
  console.error('Socket initialization failed:', error);
}

// Check environment variables
console.log('Environment variables:');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
