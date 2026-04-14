// Complete test for suspicious activity email flow
const axios = require('axios');
const fs = require('fs');

const API_BASE = 'http://localhost:5000/api';

async function testCompleteFlow() {
  console.log('Complete Suspicious Activity Email Flow Test...\n');

  try {
    // Step 1: Create a test user first
    console.log('1. Creating test user...');
    let userToken = null;
    
    try {
      const signupResponse = await axios.post(`${API_BASE}/auth/signup`, {
        email: 'testuser@privyprint.com',
        password: 'user123',
        name: 'Test User'
      });
      
      console.log('   User signup successful');
      
      // Login the user
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'testuser@privyprint.com',
        password: 'user123'
      });
      
      userToken = loginResponse.data.token;
      console.log('   User login successful');
      console.log('   User token:', userToken.substring(0, 20) + '...');
      
    } catch (error) {
      console.log('   User creation failed:', error.response?.data?.message || error.message);
      
      // Try to login with existing user
      try {
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
          email: 'testuser@privyprint.com',
          password: 'user123'
        });
        
        userToken = loginResponse.data.token;
        console.log('   Existing user login successful');
      } catch (loginError) {
        console.log('   No user available for testing');
        return;
      }
    }

    // Step 2: Upload a test document with the user
    console.log('\n2. Uploading test document...');
    let testToken = null;
    
    try {
      // Create a simple test file
      const testFilePath = './test-document.txt';
      fs.writeFileSync(testFilePath, 'This is a test document for suspicious activity email testing.');
      
      // Create form data for file upload
      const FormData = require('form-data');
      const form = new FormData();
      form.append('file', fs.createReadStream(testFilePath));
      form.append('printType', 'B/W');
      form.append('copies', '1');
      
      const uploadResponse = await axios.post(`${API_BASE}/upload`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${userToken}`
        }
      });
      
      testToken = uploadResponse.data.token;
      console.log('   Document uploaded successfully');
      console.log('   Token:', testToken);
      console.log('   Status:', uploadResponse.data.status);
      
      // Clean up test file
      fs.unlinkSync(testFilePath);
      
    } catch (error) {
      console.log('   Document upload failed:', error.response?.data?.message || error.message);
      console.log('   Using existing token for testing');
      testToken = 'SPX-1546'; // Fallback to existing token
    }

    // Step 3: Create admin user
    console.log('\n3. Creating admin user...');
    let adminToken = null;
    
    try {
      // Try admin signup (if route exists)
      const adminSignupResponse = await axios.post(`${API_BASE}/auth/signup`, {
        email: 'testadmin@privyprint.com',
        password: 'admin123',
        name: 'Test Admin',
        role: 'admin'
      });
      
      console.log('   Admin signup successful');
    } catch (adminSignupError) {
      console.log('   Admin signup failed, trying login...');
    }
    
    try {
      const adminLoginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'testadmin@privyprint.com',
        password: 'admin123'
      });
      
      adminToken = adminLoginResponse.data.token;
      console.log('   Admin login successful');
      console.log('   Admin token:', adminToken.substring(0, 20) + '...');
      
    } catch (adminLoginError) {
      console.log('   Admin login failed:', adminLoginError.response?.data?.message || adminLoginError.message);
      console.log('   Cannot test suspicious activity without admin credentials');
      return;
    }

    // Step 4: Verify the document has user email
    console.log('\n4. Verifying document user email...');
    
    try {
      const searchResponse = await axios.get(`${API_BASE}/debug/search-token/${testToken}`);
      
      if (searchResponse.data.document) {
        const doc = searchResponse.data.document;
        console.log('   Document found:');
        console.log('   - Token:', doc.token);
        console.log('   - User ID:', doc.userId);
        console.log('   - Customer Email:', doc.customerEmail || 'NOT FOUND');
        
        if (!doc.customerEmail) {
          console.log('   WARNING: Document still has no customer email');
          console.log('   This indicates a population issue in the backend');
        }
      }
    } catch (error) {
      console.log('   Document verification failed:', error.message);
    }

    // Step 5: Test suspicious activity alert
    console.log('\n5. Testing suspicious activity alert...');
    
    try {
      const alertResponse = await axios.post(`${API_BASE}/alerts/admin-suspicious`, {
        type: 'Phone Detected',
        token: testToken
      }, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      console.log('   SUCCESS: Suspicious activity alert sent!');
      console.log('   Response:', alertResponse.data);
      console.log('   Email should have been sent to the customer');
      
    } catch (error) {
      console.log('   Suspicious activity alert failed:');
      console.log('   Status:', error.response?.status);
      console.log('   Message:', error.response?.data?.message || error.message);
      
      if (error.response?.status === 404 && error.response?.data?.message.includes('Customer email not found')) {
        console.log('   This confirms the document population issue');
      }
    }

    // Step 6: Test email service directly
    console.log('\n6. Testing email service...');
    
    try {
      const emailResponse = await axios.post(`${API_BASE}/test/test-email`, {
        to: 'testuser@privyprint.com',
        subject: 'Test Suspicious Activity Email',
        message: 'This is a test to verify email sending works'
      });
      
      console.log('   Email service test successful:', emailResponse.data);
    } catch (error) {
      console.log('   Email service test failed:', error.response?.data?.message || error.message);
    }

    console.log('\n=== Complete Flow Test Summary ===');
    console.log('Test completed. Check the following:');
    console.log('1. Document userId population in database');
    console.log('2. User references are properly saved during upload');
    console.log('3. Email service configuration');
    console.log('4. Backend logs for detailed error messages');
    
  } catch (error) {
    console.error('Complete flow test failed:', error.message);
  }
}

// Run the test
testCompleteFlow();
