// Simple Token Test - No external dependencies
const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function runTest() {
  console.log('=== TOKEN DEBUG TEST ===\n');
  
  try {
    // 1. Get available tokens
    console.log('1. Getting available tokens...');
    const tokensData = await makeRequest('/api/debug/check-tokens');
    
    if (tokensData.documents && tokensData.documents.length > 0) {
      console.log('Available tokens:');
      tokensData.documents.forEach((doc, i) => {
        console.log(`  ${i+1}. "${doc.token}" - Status: ${doc.status}`);
      });
      
      // 2. Test a waiting token
      const waitingToken = tokensData.documents.find(doc => doc.status === 'waiting');
      if (waitingToken) {
        console.log(`\n2. Testing waiting token: "${waitingToken.token}"`);
        const searchResult = await makeRequest(`/api/debug/search-token/${waitingToken.token}`);
        console.log(`Found in documents: ${searchResult.foundInDocuments}`);
        console.log(`Status: ${searchResult.document?.status || 'N/A'}`);
        
        console.log(`\n>>> USE THIS TOKEN IN ADMIN PANEL: "${waitingToken.token}" <<<`);
        console.log('Steps:');
        console.log('1. Go to: http://localhost:5173/admin/print');
        console.log('2. Copy-paste the token above exactly');
        console.log('3. Click "Fetch Document"');
        console.log('4. Check backend console for debug logs');
      } else {
        console.log('\nNo waiting tokens found. All tokens may be expired or used.');
      }
    } else {
      console.log('No tokens found in database.');
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

runTest();
