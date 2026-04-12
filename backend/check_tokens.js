const mongoose = require('mongoose');
const Document = require('./models/Document');
const Log = require('./models/Log');

mongoose.connect('mongodb://localhost:27017/privyprint')
.then(async () => {
  console.log('=== CHECKING DOCUMENTS COLLECTION ===');
  const docs = await Document.find({}).select('token status').limit(10);
  console.log('Documents collection tokens:');
  docs.forEach(d => console.log(`  - ${d.token} (status: ${d.status})`));
  
  console.log('\n=== CHECKING LOGS COLLECTION ===');
  const logs = await Log.find({}).select('token time').limit(10);
  console.log('Logs collection tokens:');
  logs.forEach(l => console.log(`  - ${l.token} (time: ${l.time})`));
  
  console.log('\n=== SEARCHING FOR SPX-8F18P ===');
  const docSearch = await Document.findOne({ token: { $regex: new RegExp('^SPX-8F18P$', 'i') } });
  const logSearch = await Log.findOne({ token: { $regex: new RegExp('^SPX-8F18P$', 'i') } });
  console.log('Found in documents:', !!docSearch);
  console.log('Found in logs:', !!logSearch);
  
  console.log('\n=== SEARCHING FOR ANY SPX TOKENS ===');
  const spxDocs = await Document.find({ token: { $regex: /^SPX-/i } }).select('token status');
  const spxLogs = await Log.find({ token: { $regex: /^SPX-/i } }).select('token time');
  console.log('SPX tokens in documents:');
  spxDocs.forEach(d => console.log(`  - ${d.token} (status: ${d.status})`));
  console.log('SPX tokens in logs:');
  spxLogs.forEach(l => console.log(`  - ${l.token} (time: ${l.time})`));
  
  process.exit(0);
})
.catch(err => {
  console.error('Database error:', err);
  process.exit(1);
});
