const express = require("express");
const Document = require("../models/Document");
const Log = require("../models/Log");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Debug route to check all tokens in both collections
router.get("/check-tokens", authMiddleware, async (req, res) => {
  try {
    console.log('=== DEBUG: Checking all tokens ===');
    
    // Get tokens from documents collection
    const docs = await Document.find({})
      .select('token status createdAt')
      .sort({ createdAt: -1 })
      .limit(20);
    
    // Get tokens from logs collection  
    const logs = await Log.find({})
      .select('token time')
      .sort({ time: -1 })
      .limit(20);
    
    const result = {
      documents: docs.map(d => ({
        token: d.token,
        status: d.status,
        createdAt: d.createdAt
      })),
      logs: logs.map(l => ({
        token: l.token,
        time: l.time
      })),
      summary: {
        totalDocuments: docs.length,
        totalLogs: logs.length,
        activeTokens: docs.filter(d => d.status === 'waiting').length
      }
    };
    
    console.log('Debug results:', result);
    res.json(result);
  } catch (error) {
    console.error('Debug route error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug route to search for specific token
router.get("/search-token/:token", authMiddleware, async (req, res) => {
  try {
    const { token } = req.params;
    console.log(`=== DEBUG: Searching for token "${token}" ===`);
    
    // Search in documents collection
    const docSearch = await Document.findOne({ 
      token: { $regex: new RegExp(`^${token}$`, 'i') } 
    }).populate('userId', 'email name');
    
    // Search in logs collection
    const logSearch = await Log.findOne({ 
      token: { $regex: new RegExp(`^${token}$`, 'i') } 
    });
    
    const result = {
      searchedToken: token,
      foundInDocuments: !!docSearch,
      foundInLogs: !!logSearch,
      documentDetails: docSearch ? {
        token: docSearch.token,
        status: docSearch.status,
        fileUrl: docSearch.fileUrl,
        type: docSearch.type,
        createdAt: docSearch.createdAt,
        expiresAt: docSearch.expiresAt,
        customerEmail: docSearch.userId?.email,
        customerName: docSearch.userId?.name
      } : null,
      logDetails: logSearch ? {
        token: logSearch.token,
        time: logSearch.time,
        printType: logSearch.printType
      } : null
    };
    
    console.log('Search results:', result);
    res.json(result);
  } catch (error) {
    console.error('Search route error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
