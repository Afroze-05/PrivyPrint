const { sendSuspiciousAlert } = require('./controllers/alertController');

// Mock request and response objects
const mockReq = {
  body: {
    type: 'tab_switch_detected',
    time: new Date().toISOString(),
    token: 'TEST-12345',
    email: 'test@example.com'
  }
};

const mockRes = {
  json: (data) => {
    console.log('✅ Response:', JSON.stringify(data, null, 2));
  },
  status: (code) => {
    console.log('❌ Status:', code);
    return {
      json: (data) => console.log('Error Response:', JSON.stringify(data, null, 2))
    };
  }
};

console.log('🧪 Testing suspicious activity email sending...');
console.log('Request data:', mockReq.body);

sendSuspiciousAlert(mockReq, mockRes).catch(err => {
  console.error('💥 Test failed:', err);
});
