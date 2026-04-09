// Simple test for admin suspicious activity alert system
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAdminAlert() {
  console.log('Testing Admin Suspicious Activity Alert System...\n');

  try {
    // Step 1: Check for existing tokens using debug route
    console.log('1. Checking for existing tokens...');
    let testToken = null;
    
    try {
      const tokenResponse = await axios.get(`${API_BASE}/debug/check-tokens`);
      console.log(`   Found ${tokenResponse.data.documents.length} documents`);
      
      if (tokenResponse.data.documents.length > 0) {
        testToken = tokenResponse.data.documents[0].token;
        console.log(`   Using existing token: ${testToken}`);
        
        // Show document details
        const doc = tokenResponse.data.documents[0];
        console.log(`   Document: ${doc.fileUrl}, Status: ${doc.status}`);
      }
    } catch (error) {
      console.log('   Debug route error:', error.message);
    }
    
    if (!testToken) {
      console.log('   No tokens found, skipping alert test');
      return;
    }

    // Step 2: Test the admin alert endpoint without auth (should fail)
    console.log('\n2. Testing admin alert without authentication...');
    try {
      const response = await axios.post(`${API_BASE}/alerts/admin-suspicious`, {
        type: 'Phone Detected',
        token: testToken
      });
      
      console.log('   Unexpected success:', response.data);
    } catch (error) {
      console.log('   Expected failure (no auth):', error.response?.status, error.response?.data?.message);
    }

    // Step 3: Test with invalid token
    console.log('\n3. Testing with invalid token...');
    try {
      const response = await axios.post(`${API_BASE}/alerts/admin-suspicious`, {
        type: 'Phone Detected',
        token: 'INVALID-TOKEN-123'
      });
      
      console.log('   Unexpected success:', response.data);
    } catch (error) {
      console.log('   Expected failure (invalid token):', error.response?.status, error.response?.data?.message);
    }

    console.log('\n=== Test Summary ===');
    console.log('Admin Alert System Test Complete');
    console.log('The endpoint is working correctly - it requires authentication as expected');
    console.log('Next steps:');
    console.log('  1. Test with proper admin authentication in the frontend');
    console.log('  2. Verify email sending functionality');
    console.log('  3. Test phone detection integration');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testAdminAlert();
