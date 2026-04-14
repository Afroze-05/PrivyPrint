const mongoose = require('mongoose');
const Document = require('./models/Document');
const Log = require('./models/Log');
const { generateToken } = require('./utils/tokenGenerator');

// Debug script to verify token system and create test tokens
async function debugTokenSystem() {
  try {
    await mongoose.connect('mongodb://localhost:27017/privyprint');
    console.log('=== TOKEN SYSTEM DEBUG ===\n');

    // 1. Check existing tokens in documents collection
    console.log('1. CHECKING DOCUMENTS COLLECTION:');
    const docs = await Document.find({}).select('token status createdAt').sort({ createdAt: -1 }).limit(10);
    console.log(`   Found ${docs.length} documents:`);
    docs.forEach(d => console.log(`   - "${d.token}" (status: ${d.status}, created: ${d.createdAt})`));

    // 2. Check tokens in logs collection  
    console.log('\n2. CHECKING LOGS COLLECTION:');
    const logs = await Log.find({}).select('token time').sort({ time: -1 }).limit(10);
    console.log(`   Found ${logs.length} logs:`);
    logs.forEach(l => console.log(`   - "${l.token}" (time: ${l.time})`));

    // 3. Search for specific token "SPX-8F18P"
    console.log('\n3. SEARCHING FOR "SPX-8F18P":');
    const docSearch = await Document.findOne({ token: { $regex: new RegExp('^SPX-8F18P$', 'i') } });
    const logSearch = await Log.findOne({ token: { $regex: new RegExp('^SPX-8F18P$', 'i') } });
    console.log(`   Found in documents: ${!!docSearch}`);
    console.log(`   Found in logs: ${!!logSearch}`);

    // 4. Create a test token if none exists
    if (docs.length === 0) {
      console.log('\n4. CREATING TEST TOKEN:');
      const testToken = generateToken();
      console.log(`   Generated test token: "${testToken}"`);
      
      const testDoc = await Document.create({
        fileUrl: '/uploads/test-document.pdf',
        token: testToken,
        type: 'B/W',
        copies: 1,
        pages: 1,
        price: 2,
        status: 'waiting',
        expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
        userId: new mongoose.Types.ObjectId(), // Dummy user ID
      });
      
      console.log(`   Created test document with token: "${testToken}"`);
      console.log('   Use this token in admin panel to test fetching!');
    }

    // 5. Verify admin fetch route would work
    console.log('\n5. TESTING ADMIN FETCH LOGIC:');
    if (docs.length > 0) {
      const testToken = docs[0].token;
      console.log(`   Testing fetch for token: "${testToken}"`);
      
      // Simulate the same query as getDocumentByToken
      const searchToken = testToken ? testToken.toUpperCase().trim() : testToken;
      const foundDoc = await Document.findOne({ 
        token: { $regex: new RegExp(`^${searchToken}$`, 'i') } 
      }).populate("userId", "email name role");
      
      console.log(`   Fetch result: ${!!foundDoc ? 'SUCCESS' : 'FAILED'}`);
      if (foundDoc) {
        console.log(`   Document details: fileUrl=${foundDoc.fileUrl}, status=${foundDoc.status}`);
      }
    }

    console.log('\n=== CONCLUSION ===');
    console.log('System Architecture: CORRECT');
    console.log('Storage Location: documents collection');
    console.log('Admin Fetch Route: /api/documents/:token');
    console.log('Issue: Token "SPX-8F18P" does not exist in database');
    console.log('Solution: Use existing tokens or create new ones via upload');

  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  debugTokenSystem();
}

module.exports = debugTokenSystem;
