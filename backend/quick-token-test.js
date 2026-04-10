// Quick Token Test - Run this to debug your token issue
const axios = require('axios');

async function quickTest() {
  console.log('=== QUICK TOKEN TEST ===\n');
  
  // 1. Check available tokens
  console.log('1. Available tokens in database:');
  try {
    const response = await axios.get('http://localhost:5000/api/debug/check-tokens');
    const tokens = response.data.documents;
    console.log('Available tokens:');
    tokens.forEach((doc, i) => {
      console.log(`  ${i+1}. "${doc.token}" - Status: ${doc.status} - Created: ${doc.createdAt}`);
    });
    
    // 2. Test each token
    console.log('\n2. Testing each token:');
    for (const doc of tokens.slice(0, 3)) { // Test first 3 tokens
      try {
        console.log(`\nTesting token: "${doc.token}"`);
        const searchResult = await axios.get(`http://localhost:5000/api/debug/search-token/${doc.token}`);
        console.log(`  Found in documents: ${searchResult.data.foundInDocuments}`);
        console.log(`  Status: ${searchResult.data.document?.status || 'N/A'}`);
        
        if (searchResult.data.foundInDocuments && searchResult.data.document.status === 'waiting') {
          console.log(`  >>> THIS TOKEN SHOULD WORK IN ADMIN PANEL: "${doc.token}" <<<`);
        }
        
      } catch (err) {
        console.log(`  Error: ${err.message}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  console.log('\n=== TROUBLESHOOTING STEPS ===');
  console.log('1. Copy one of the "waiting" tokens above');
  console.log('2. Go to admin panel: http://localhost:5173/admin/print');
  console.log('3. Enter the exact token (copy-paste to avoid typos)');
  console.log('4. Check the backend console for debug logs');
  console.log('5. If still failing, check the exact token being sent in network tab');
}

quickTest();
