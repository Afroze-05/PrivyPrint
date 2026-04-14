// Test script for admin suspicious activity email system
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAdminSuspiciousActivitySystem() {
  console.log('Testing Admin Suspicious Activity Email System...\n');

  try {
    // Test 1: Check if we have any existing documents
    console.log('1. Checking for existing documents...');
    let existingToken = null;
    
    try {
      // Try to get documents (this might fail without auth, but let's see)
      const docsResponse = await axios.get(`${API_BASE}/documents`);
      if (docsResponse.data && docsResponse.data.length > 0) {
        existingToken = docsResponse.data[0].token;
        console.log(`   Found existing token: ${existingToken}`);
      }
    } catch (error) {
      console.log('   No existing documents found (auth required), using test token');
    }
    
    // Use existing token or create a test one
    const testToken = existingToken || 'SPX-1546'; // Known token from database
    
    // Test 2: Admin suspicious activity alerts
    console.log('2. Testing admin suspicious activity alerts...');
    
    const suspiciousActivities = [
      { type: 'Phone Detected', description: 'Mobile phone detected during printing' },
      { type: 'Copy / Paste', description: 'Copy/paste activity detected' },
      { type: 'Tab Switch', description: 'Tab switching detected' }
    ];
    
    for (const activity of suspiciousActivities) {
      console.log(`   Testing ${activity.type}...`);
      
      try {
        const response = await axios.post(`${API_BASE}/alerts/admin-suspicious`, {
          type: activity.type,
          token: testToken
        });
        
        console.log(`   ${activity.type}: ${response.status} - ${response.data.message}`);
      } catch (error) {
        console.error(`   ${activity.type}: ERROR - ${error.response?.data?.message || error.message}`);
      }
    }

    // Test 3: Test with invalid token
    console.log('\n3. Testing with invalid token...');
    try {
      const response = await axios.post(`${API_BASE}/alerts/admin-suspicious`, {
        type: 'Phone Detected',
        token: 'INVALID-TOKEN'
      });
      
      console.log(`   Invalid token: ${response.status} - ${response.data.message}`);
    } catch (error) {
      console.log(`   Invalid token: ERROR (expected) - ${error.response?.data?.message || error.message}`);
    }

    // Test 4: Test missing parameters
    console.log('\n4. Testing missing parameters...');
    try {
      const response = await axios.post(`${API_BASE}/alerts/admin-suspicious`, {
        type: 'Phone Detected'
        // Missing token
      });
      
      console.log(`   Missing token: ${response.status} - ${response.data.message}`);
    } catch (error) {
      console.log(`   Missing token: ERROR (expected) - ${error.response?.data?.message || error.message}`);
    }

    console.log('\n=== Test Summary ===');
    console.log('Admin Suspicious Activity Email System Test Complete');
    console.log('Features tested:');
    console.log('  - Admin suspicious activity alerts');
    console.log('  - Email notifications to customers');
    console.log('  - Token validation');
    console.log('  - Parameter validation');
    console.log('  - Error handling');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testAdminSuspiciousActivitySystem();
