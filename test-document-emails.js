// Test script to check document user emails and create test admin
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testDocumentEmails() {
  console.log('Testing Document User Emails and Creating Test Admin...\n');

  try {
    // Step 1: Check documents with proper population
    console.log('1. Checking documents with user population...');
    
    try {
      // Use the search-token route which includes population
      const searchResponse = await axios.get(`${API_BASE}/debug/search-token/SPX-1546`);
      console.log('   Document search result:');
      console.log('   Found in documents:', searchResponse.data.foundInDocuments);
      
      if (searchResponse.data.document) {
        const doc = searchResponse.data.document;
        console.log('   Document details:');
        console.log('   - Token:', doc.token);
        console.log('   - Status:', doc.status);
        console.log('   - File URL:', doc.fileUrl);
        console.log('   - User ID:', doc.userId);
        console.log('   - Customer Email:', doc.customerEmail || 'NOT FOUND');
        console.log('   - Created At:', doc.createdAt);
      }
    } catch (error) {
      console.log('   Document search failed:', error.message);
    }

    // Step 2: Try to create a test admin user
    console.log('\n2. Creating test admin user...');
    
    try {
      const signupResponse = await axios.post(`${API_BASE}/auth/admin-signup`, {
        email: 'testadmin@privyprint.com',
        password: 'admin123',
        name: 'Test Admin'
      });
      
      console.log('   Admin signup successful');
      console.log('   Response:', signupResponse.data);
      
      // Now try to login
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'testadmin@privyprint.com',
        password: 'admin123'
      });
      
      if (loginResponse.data.token) {
        console.log('   Admin login successful');
        const adminToken = loginResponse.data.token;
        
        // Step 3: Test suspicious activity with real admin token
        console.log('\n3. Testing suspicious activity with real admin token...');
        
        try {
          const alertResponse = await axios.post(`${API_BASE}/alerts/admin-suspicious`, {
            type: 'Phone Detected',
            token: 'SPX-1546'
          }, {
            headers: {
              'Authorization': `Bearer ${adminToken}`
            }
          });
          
          console.log('   SUCCESS: Suspicious activity alert sent!');
          console.log('   Response:', alertResponse.data);
          
        } catch (alertError) {
          console.log('   Alert failed:');
          console.log('   Status:', alertError.response?.status);
          console.log('   Message:', alertError.response?.data?.message || alertError.message);
          
          if (alertError.response?.status === 404) {
            console.log('   This might mean the document has no user email');
          }
        }
        
        // Step 4: Test email service directly
        console.log('\n4. Testing email service...');
        
        try {
          const emailResponse = await axios.post(`${API_BASE}/test/test-email`, {
            to: 'test@example.com',
            subject: 'Test Email from PrivyPrint',
            message: 'This is a test email to verify the email service is working'
          });
          
          console.log('   Email service test successful:', emailResponse.data);
        } catch (emailError) {
          console.log('   Email service test failed:', emailError.response?.data?.message || emailError.message);
        }
        
      }
      
    } catch (signupError) {
      console.log('   Admin signup failed:', signupError.response?.data?.message || signupError.message);
      
      // Try to login with existing admin
      try {
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
          email: 'admin@privyprint.com',
          password: 'admin123'
        });
        
        if (loginResponse.data.token) {
          console.log('   Existing admin login successful');
          console.log('   You can use this admin account for testing');
        }
      } catch (loginError) {
        console.log('   Existing admin login also failed');
      }
    }

    console.log('\n=== Summary ===');
    console.log('Document Email Test Complete');
    console.log('Key findings:');
    console.log('1. Check if documents have userId populated');
    console.log('2. Verify users exist in the database');
    console.log('3. Test admin authentication flow');
    console.log('4. Verify email service configuration');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testDocumentEmails();
