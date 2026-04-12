// Direct test of email functionality without document dependencies
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testEmailDirect() {
  console.log('Direct Email Functionality Test...\n');

  try {
    // Step 1: Check if email service is working
    console.log('1. Testing email service directly...');
    
    try {
      // Try to find an email test route
      const emailTestResponse = await axios.post(`${API_BASE}/test/test-email`, {
        to: 'test@example.com',
        subject: 'Direct Email Test',
        message: 'This is a direct test of the email service'
      });
      
      console.log('   Email service test successful:', emailTestResponse.data);
    } catch (error) {
      console.log('   Email service test failed:', error.response?.data?.message || error.message);
      
      // Check if there are other test routes
      console.log('   Available test routes might include:');
      console.log('   - /api/test/test-otp');
      console.log('   - /api/test/test-email');
    }

    // Step 2: Create a simple test to bypass document issues
    console.log('\n2. Testing suspicious activity with fallback email...');
    
    // Try to create an admin user first
    let adminToken = null;
    
    try {
      // Try common admin credentials
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'admin@example.com',
        password: 'admin123'
      });
      
      adminToken = loginResponse.data.token;
      console.log('   Admin login successful');
    } catch (error) {
      console.log('   Admin login failed, trying alternative...');
      
      try {
        const altLoginResponse = await axios.post(`${API_BASE}/auth/login`, {
          email: 'admin@privyprint.com',
          password: 'admin123'
        });
        
        adminToken = altLoginResponse.data.token;
        console.log('   Alternative admin login successful');
      } catch (altError) {
        console.log('   All admin logins failed');
      }
    }

    if (adminToken) {
      console.log('   Testing suspicious activity with admin token...');
      
      try {
        const alertResponse = await axios.post(`${API_BASE}/alerts/admin-suspicious`, {
          type: 'Phone Detected',
          token: 'SPX-1546'
        }, {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });
        
        console.log('   SUCCESS: Alert sent!');
        console.log('   Response:', alertResponse.data);
        
      } catch (alertError) {
        console.log('   Alert failed with detailed error:');
        console.log('   Status:', alertError.response?.status);
        console.log('   Message:', alertError.response?.data?.message || alertError.message);
        
        if (alertError.response?.data?.debug) {
          console.log('   Debug info:', alertError.response?.data?.debug);
        }
      }
    }

    // Step 3: Test the core issue - document population
    console.log('\n3. Analyzing document population issue...');
    
    try {
      const debugResponse = await axios.get(`${API_BASE}/debug/search-token/SPX-1546`);
      
      if (debugResponse.data.document) {
        const doc = debugResponse.data.document;
        console.log('   Document analysis:');
        console.log('   - Token:', doc.token);
        console.log('   - Has userId:', !!doc.userId);
        console.log('   - userId value:', doc.userId);
        console.log('   - userId type:', typeof doc.userId);
        console.log('   - Customer email:', doc.customerEmail || 'NOT FOUND');
        
        if (!doc.userId) {
          console.log('   ISSUE CONFIRMED: Document has no userId reference');
          console.log('   This means the document was created without proper user authentication');
        }
      }
    } catch (error) {
      console.log('   Document analysis failed:', error.message);
    }

    console.log('\n=== Solution Recommendations ===');
    console.log('Based on the analysis, here are the solutions:');
    console.log('');
    console.log('1. IMMEDIATE FIX - Update suspicious activity controller:');
    console.log('   - Add fallback email when document has no user');
    console.log('   - Send email to admin instead of customer');
    console.log('   - Log the issue for investigation');
    console.log('');
    console.log('2. LONG-TERM FIX - Fix document upload:');
    console.log('   - Ensure all uploads have proper user authentication');
    console.log('   - Validate userId is saved correctly');
    console.log('   - Add user email to document for easy access');
    console.log('');
    console.log('3. TESTING FIX - Create test documents:');
    console.log('   - Upload new documents with proper user');
    console.log('   - Verify email functionality works');
    console.log('   - Test all suspicious activity types');
    
  } catch (error) {
    console.error('Direct email test failed:', error.message);
  }
}

// Run the test
testEmailDirect();
