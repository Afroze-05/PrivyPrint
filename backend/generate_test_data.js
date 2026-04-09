const mongoose = require('mongoose');
const Log = require('./models/Log');
const Document = require('./models/Document');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/privyprint')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Clear existing test data
    await Log.deleteMany({});
    console.log('Cleared existing logs');
    
    // Generate test documents first
    const testDocuments = [];
    const now = new Date();
    
    for (let i = 0; i < 20; i++) {
      const createdAt = new Date(now);
      createdAt.setDate(now.getDate() - Math.floor(Math.random() * 7)); // Last 7 days
      
      const doc = await Document.create({
        fileUrl: `/uploads/test_doc_${i}.pdf`,
        token: `TEST${i.toString().padStart(4, '0')}`,
        type: Math.random() > 0.5 ? 'Color' : 'B/W',
        copies: Math.floor(Math.random() * 3) + 1,
        pages: Math.floor(Math.random() * 10) + 1,
        price: 0,
        status: 'completed',
        createdAt,
        userId: new mongoose.Types.ObjectId() // Mock user ID
      });
      
      testDocuments.push(doc);
    }
    
    console.log('Created test documents:', testDocuments.length);
    
    // Generate print logs for completed documents
    for (const doc of testDocuments) {
      const printTime = new Date(doc.createdAt);
      printTime.setMinutes(printTime.getMinutes() + Math.floor(Math.random() * 60)); // Within an hour of creation
      
      await Log.create({
        token: doc.token,
        documentId: doc._id,
        adminId: new mongoose.Types.ObjectId(), // Mock admin ID
        printType: doc.type,
        pages: doc.pages,
        copies: doc.copies,
        price: doc.type === 'Color' ? doc.pages * doc.copies * 5 : doc.pages * doc.copies * 2,
        time: printTime
      });
    }
    
    console.log('Created test print logs');
    
    // Verify data
    const totalLogs = await Log.countDocuments();
    const totalDocs = await Document.countDocuments();
    const completedDocs = await Document.countDocuments({ status: 'completed' });
    
    console.log(`✅ Test data generated successfully:`);
    console.log(`   - Total documents: ${totalDocs}`);
    console.log(`   - Completed documents: ${completedDocs}`);
    console.log(`   - Print logs: ${totalLogs}`);
    
    // Show recent logs
    const recentLogs = await Log.find().sort({ time: -1 }).limit(5);
    console.log('\nRecent print logs:');
    recentLogs.forEach(log => {
      console.log(`  - ${log.time.toISOString()}: ${log.printType} - ${log.copies} copies, ${log.pages} pages, ₹${log.price}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
