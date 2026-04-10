// Test script to debug admin authentication and suspicious activity email flow
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAuthFlow() {
  console.log('Testing Admin Authentication and Suspicious Activity Flow...\n');

  try {
    // Step 1: Try to login as admin to get a token
    console.log('1. Testing admin login...');
    let adminToken = null;
    
    try {
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'admin@privyprint.com', // Common admin email
        password: 'admin123' // Common admin password
      });
      
      if (loginResponse.data.token) {
        adminToken = loginResponse.data.token;
        console.log('   Admin login successful');
        console.log('   Token:', adminToken.substring(0, 20) + '...');
      }
    } catch (error) {
      console.log('   Admin login failed:', error.response?.data?.message || error.message);
      
      // Try alternative admin credentials
      try {
        const altLoginResponse = await axios.post(`${API_BASE}/auth/login`, {
          email: 'admin@example.com',
          password: 'password'
        });
        
        if (altLoginResponse.data.token) {
          adminToken = altLoginResponse.data.token;
          console.log('   Alternative admin login successful');
        }
      } catch (altError) {
        console.log('   Alternative admin login also failed');
      }
    }
    
    if (!adminToken) {
      console.log('   No admin token available, testing with mock token...');
      adminToken = 'mock-admin-token-for-testing';
    }

    // Step 2: Get existing documents
    console.log('\n2. Getting existing documents...');
    let testToken = null;
    let userEmail = null;
    
    try {
      const docsResponse = await axios.get(`${API_BASE}/debug/check-tokens`);
      if (docsResponse.data.documents.length > 0) {
        const doc = docsResponse.data.documents[0];
        testToken = doc.token;
        console.log(`   Found token: ${testToken}`);
        console.log(`   Document status: ${doc.status}`);
        
        // Try to get user email for this document
        try {
          const searchResponse = await axios.get(`${API_BASE}/debug/search-token/${testToken}`);
          if (searchResponse.data.document && searchResponse.data.document.customerEmail) {
            userEmail = searchResponse.data.document.customerEmail;
            console.log(`   Customer email: ${userEmail}`);
          } else {
            console.log('   No customer email found for document');
          }
        } catch (searchError) {
          console.log('   Could not get customer email:', searchError.message);
        }
      }
    } catch (error) {
      console.log('   Could not get documents:', error.message);
      testToken = 'SPX-1546'; // Fallback token
    }

    if (!testToken) {
      console.log('   No test token available, using fallback');
      testToken = 'SPX-1546';
    }

    // Step 3: Test suspicious activity alert with authentication
    console.log('\n3. Testing suspicious activity alert with authentication...');
    console.log(`   Using token: ${testToken}`);
    console.log(`   Admin auth: ${adminToken.substring(0, 20)}...`);
    
    try {
      const alertResponse = await axios.post(`${API_BASE}/alerts/admin-suspicious`, {
        type: 'Phone Detected',
        token: testToken
      }, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      console.log('   SUCCESS: Alert sent successfully');
      console.log('   Response:', alertResponse.data);
      
      if (userEmail) {
        console.log(`   Email should have been sent to: ${userEmail}`);
      }
      
    } catch (error) {
      console.log('   Alert failed:');
      console.log('   Status:', error.response?.status);
      console.log('   Message:', error.response?.data?.message || error.message);
      
      if (error.response?.status === 401) {
        console.log('   Authentication failed - admin credentials may be incorrect');
      } else if (error.response?.status === 404) {
        console.log('   Token not found - document may not exist');
      } else if (error.response?.status === 500) {
        console.log('   Server error - check backend logs');
      }
    }

    // Step 4: Test email sending directly
    console.log('\n4. Testing email sending system...');
    try {
      const emailTestResponse = await axios.post(`${API_BASE}/test/test-email`, {
        to: userEmail || 'test@example.com',
        subject: 'Test Suspicious Activity Email',
        message: 'This is a test email from the suspicious activity system'
      });
      
      console.log('   Email test successful:', emailTestResponse.data);
    } catch (emailError) {
      console.log('   Email test failed:', emailError.response?.data?.message || emailError.message);
    }

    console.log('\n=== Debug Summary ===');
    console.log('Authentication and Email Flow Test Complete');
    console.log('Check the following:');
    console.log('1. Admin login credentials are correct');
    console.log('2. Documents have valid user emails');
    console.log('3. Email service is configured properly');
    console.log('4. Backend logs for detailed error messages');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testAuthFlow();
