require('dotenv').config();
const express = require('express');

// Create a minimal Express app to test the alert endpoint
const app = express();
app.use(express.json());

// Import the alert routes
const alertRoutes = require('./routes/alertRoutes');
app.use('/api', alertRoutes);

// Start a test server
const port = 5001;
const server = app.listen(port, () => {
  console.log(`🧪 Test server running on port ${port}`);
  
  // Test the suspicious alert endpoint
  testSuspiciousAlert();
});

async function testSuspiciousAlert() {
  const testData = {
    type: 'tab_switch_detected',
    time: new Date().toISOString(),
    token: 'TEST-12345',
    email: 'dikshadhanve4@gmail.com' // Use the real email for testing
  };

  console.log('🚨 Testing suspicious alert with data:', testData);

  try {
    const response = await fetch(`http://localhost:${port}/api/alerts/suspicious`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    console.log('✅ Response:', JSON.stringify(result, null, 2));
    
    if (result.emailSent) {
      console.log('🎉 SUCCESS: Suspicious activity email sent!');
    } else {
      console.log('❌ FAILURE: Email not sent:', result);
    }
  } catch (error) {
    console.error('💥 Test failed:', error);
  } finally {
    // Close the test server
    server.close();
  }
}
