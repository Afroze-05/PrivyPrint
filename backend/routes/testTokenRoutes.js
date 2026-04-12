const express = require("express");
const Document = require("../models/Document");
const Log = require("../models/Log");

const router = express.Router();

// Test route to check all tokens in both collections
router.get("/check-tokens", async (req, res) => {
  try {
    console.log(`\n=== TOKEN COLLECTION DEBUG ===`);
    
    // Check documents collection
    const documents = await Document.find({}).select('token status createdAt fileUrl').limit(20);
    console.log(`Documents collection (${documents.length} found):`);
    documents.forEach(doc => {
      console.log(`  - Token: "${doc.token}", Status: ${doc.status}, Created: ${doc.createdAt}`);
    });
    
    // Check logs collection  
    const logs = await Log.find({}).select('token time documentId').limit(20);
    console.log(`\nLogs collection (${logs.length} found):`);
    logs.forEach(log => {
      console.log(`  - Token: "${log.token}", Time: ${log.time}, DocumentId: ${log.documentId}`);
    });
    
    console.log(`=== END TOKEN COLLECTION DEBUG ===\n`);
    
    return res.status(200).json({
      documents: documents.map(doc => ({
        token: doc.token,
        status: doc.status,
        createdAt: doc.createdAt,
        fileUrl: doc.fileUrl
      })),
      logs: logs.map(log => ({
        token: log.token,
        time: log.time,
        documentId: log.documentId
      })),
      summary: {
        totalDocuments: documents.length,
        totalLogs: logs.length
      }
    });
  } catch (err) {
    console.error('Token check error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Test route to search for a specific token
router.get("/search-token/:token", async (req, res) => {
  try {
    const { token } = req.params;
    console.log(`\n=== TOKEN SEARCH DEBUG ===`);
    console.log(`Searching for token: "${token}"`);
    
    // Search in documents
    const doc = await Document.findOne({ 
      token: { $regex: new RegExp(`^${token}$`, 'i') } 
    }).populate("userId", "email name role");
    
    // Search in logs
    const log = await Log.findOne({ 
      token: { $regex: new RegExp(`^${token}$`, 'i') } 
    }).populate("documentId", "token fileUrl");
    
    console.log(`Document search result:`, doc ? `Found - Token: "${doc.token}"` : 'Not found');
    console.log(`Log search result:`, log ? `Found - Token: "${log.token}"` : 'Not found');
    console.log(`=== END TOKEN SEARCH DEBUG ===\n`);
    
    return res.status(200).json({
      searchedToken: token,
      foundInDocuments: !!doc,
      foundInLogs: !!log,
      document: doc ? {
        token: doc.token,
        status: doc.status,
        fileUrl: doc.fileUrl,
        createdAt: doc.createdAt,
        userId: doc.userId?._id,
        customerEmail: doc.userId?.email
      } : null,
      log: log ? {
        token: log.token,
        time: log.time,
        documentId: log.documentId,
        adminId: log.adminId
      } : null
    });
  } catch (err) {
    console.error('Token search error:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
