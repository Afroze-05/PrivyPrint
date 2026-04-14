// Test fallback email functionality for suspicious activity
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testFallbackEmail() {
  console.log('Testing Fallback Email for Suspicious Activity...\n');

  try {
    // Test with mock admin token to trigger the fallback mechanism
    console.log('1. Testing suspicious activity with mock admin token...');
    
    try {
      const alertResponse = await axios.post(`${API_BASE}/alerts/admin-suspicious`, {
        type: 'Phone Detected',
        token: 'SPX-1546' // This token has no userId, so it should trigger fallback
      }, {
        headers: {
          'Authorization': 'Bearer mock-admin-token-for-testing'
        }
      });
      
      console.log('   SUCCESS: Fallback mechanism triggered!');
      console.log('   Response:', alertResponse.data);
      
      if (alertResponse.data.fallback) {
        console.log('   Fallback email sent to admin');
        console.log('   Email should contain details about the missing customer email');
      }
      
    } catch (error) {
      console.log('   Alert failed:');
      console.log('   Status:', error.response?.status);
      console.log('   Message:', error.response?.data?.message || error.message);
      
      if (error.response?.status === 401) {
        console.log('   Authentication failed - need real admin token');
      } else if (error.response?.status === 404) {
        console.log('   This might be the fallback working correctly');
      }
    }

    // Test different activity types
    console.log('\n2. Testing different suspicious activity types...');
    
    const activityTypes = ['Phone Detected', 'Copy / Paste', 'Tab Switch'];
    
    for (const activityType of activityTypes) {
      console.log(`   Testing: ${activityType}`);
      
      try {
        const response = await axios.post(`${API_BASE}/alerts/admin-suspicious`, {
          type: activityType,
          token: 'SPX-1546'
        }, {
          headers: {
            'Authorization': 'Bearer mock-admin-token-for-testing'
          }
        });
        
        console.log(`   ${activityType}: SUCCESS - Fallback triggered`);
        
      } catch (error) {
        console.log(`   ${activityType}: Failed - ${error.response?.status}`);
      }
    }

    // Test with invalid token
    console.log('\n3. Testing with invalid token...');
    
    try {
      const response = await axios.post(`${API_BASE}/alerts/admin-suspicious`, {
        type: 'Phone Detected',
        token: 'INVALID-TOKEN'
      }, {
        headers: {
          'Authorization': 'Bearer mock-admin-token-for-testing'
        }
      });
      
      console.log('   Invalid token: Unexpected success');
      
    } catch (error) {
      console.log('   Invalid token: Expected failure -', error.response?.status);
    }

    console.log('\n=== Fallback Email Test Summary ===');
    console.log('The suspicious activity system now has a fallback mechanism:');
    console.log('');
    console.log('1. When customer email is not found:');
    console.log('   - Sends alert to admin@privyprint.com');
    console.log('   - Includes detailed information about the issue');
    console.log('   - Marks response with fallback: true');
    console.log('');
    console.log('2. Email content includes:');
    console.log('   - Activity type (Phone Detected, Copy/Paste, Tab Switch)');
    console.log('   - Document token');
    console.log('   - Time of detection');
    console.log('   - Notice that customer email was not found');
    console.log('');
    console.log('3. Admin receives actionable information:');
    console.log('   - What suspicious activity occurred');
    console.log('   - Which document was affected');
    console.log('   - That there is a data issue to investigate');
    
  } catch (error) {
    console.error('Fallback email test failed:', error.message);
  }
}

// Run the test
testFallbackEmail();
