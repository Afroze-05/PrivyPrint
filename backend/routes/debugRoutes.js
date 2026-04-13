// Debug routes for development testing
const express = require("express");
const Document = require("../models/Document");
const Log = require("../models/Log");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Only allow in development
const requireDev = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: "Debug not available in production" });
  }
  next();
};

// Check all tokens
router.get("/check-tokens", requireDev, authMiddleware, async (req, res) => {
  try {
    // Get recent tokens from documents and logs
    const docs = await Document.find({}).select('token status createdAt').sort({ createdAt: -1 }).limit(20);
    const logs = await Log.find({}).select('token time').sort({ time: -1 }).limit(20);
    
    res.json({
      documents: docs.map(d => ({ token: d.token, status: d.status, createdAt: d.createdAt })),
      logs: logs.map(l => ({ token: l.token, time: l.time })),
      summary: { totalDocuments: docs.length, totalLogs: logs.length, activeTokens: docs.filter(d => d.status === 'waiting').length }
    });
  } catch (error) {
    console.error('Debug error:', error.message);
    res.status(500).json({ error: "Debug operation failed" });
  }
});

// Search specific token
router.get("/search-token/:token", requireDev, authMiddleware, async (req, res) => {
  try {
    const { token } = req.params;
    
    // Basic validation
    if (!token || token.length > 50) {
      return res.status(400).json({ error: "Invalid token" });
    }
    
    // Search in documents and logs
    const docSearch = await Document.findOne({ token: { $regex: new RegExp(`^${token}$`, 'i') } }).populate('userId', 'email name');
    const logSearch = await Log.findOne({ token: { $regex: new RegExp(`^${token}$`, 'i') } });
    
    res.json({
      searchedToken: token,
      foundInDocuments: !!docSearch,
      foundInLogs: !!logSearch,
      documentDetails: docSearch ? {
        token: docSearch.token, status: docSearch.status, fileUrl: docSearch.fileUrl,
        type: docSearch.type, createdAt: docSearch.createdAt, expiresAt: docSearch.expiresAt,
        customerEmail: docSearch.userId?.email, customerName: docSearch.userId?.name
      } : null,
      logDetails: logSearch ? { token: logSearch.token, time: logSearch.time, printType: logSearch.printType } : null
    });
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ error: "Token search failed" });
  }
});

module.exports = router;
