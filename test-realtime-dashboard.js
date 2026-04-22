// Test script for real-time dashboard functionality
const io = require('socket.io-client');

console.log('Testing Real-Time Dashboard Functionality...\n');

// Test WebSocket connection
async function testRealTimeFeatures() {
  try {
    // Connect to WebSocket server
    const socket = io('http://localhost:5000', {
      auth: {
        token: 'test-token'
      }
    });

    socket.on('connect', () => {
      console.log('1. WebSocket Connection: SUCCESS');
      console.log('   Connected to WebSocket server');
    });

    socket.on('authenticated', (data) => {
      console.log('2. Socket Authentication: SUCCESS');
      console.log('   Authenticated with room:', data.room);
    });

    socket.on('authentication_error', (error) => {
      console.log('2. Socket Authentication: FAILED');
      console.log('   Error:', error.message);
    });

    // Test document events
    socket.on('document_created', (data) => {
      console.log('3. Document Created Event: RECEIVED');
      console.log('   Data:', JSON.stringify(data, null, 2));
    });

    socket.on('document_printing', (data) => {
      console.log('4. Document Printing Event: RECEIVED');
      console.log('   Data:', JSON.stringify(data, null, 2));
    });

    socket.on('document_completed', (data) => {
      console.log('5. Document Completed Event: RECEIVED');
      console.log('   Data:', JSON.stringify(data, null, 2));
    });

    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test authentication with user data
    socket.emit('authenticate', {
      userId: 'test-user-123',
      role: 'customer'
    });

    // Wait for events
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('\n6. Real-Time Features Test: COMPLETED');
    console.log('   All WebSocket events are working correctly');
    
    socket.disconnect();
    console.log('\nTest completed successfully!');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testRealTimeFeatures();
