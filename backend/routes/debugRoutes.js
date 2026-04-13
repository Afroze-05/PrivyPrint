/**
 * Debug Routes - Development and Testing Endpoints
 * 
 * These routes provide debugging capabilities for the PrivyPrint system.
 * Only accessible in development environment with proper authentication.
 * 
 * @author PrivyPrint Team
 * @version 1.1.0
 */

const express = require("express");
const Document = require("../models/Document");
const Log = require("../models/Log");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Middleware to restrict debug routes to development environment
const requireDevelopment = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ 
      error: "Debug routes are not available in production" 
    });
  }
  next();
};

/**
 * GET /debug/check-tokens
 * 
 * Retrieves and displays tokens from both Documents and Logs collections
 * for debugging purposes. Returns the most recent 20 tokens from each collection.
 * 
 * @access Private (requires authentication)
 * @environment Development only
 */
router.get("/check-tokens", requireDevelopment, authMiddleware, async (req, res) => {
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
    console.error('Debug route error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // Return structured error response
    res.status(500).json({ 
      error: "Internal server error during debug operation",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /debug/search-token/:token
 * 
 * Searches for a specific token across both Documents and Logs collections.
 * Provides detailed information about the token if found.
 * 
 * @param {string} token - The token to search for
 * @access Private (requires authentication)
 * @environment Development only
 */
router.get("/search-token/:token", requireDevelopment, authMiddleware, async (req, res) => {
  try {
    const { token } = req.params;
    
    // Input validation
    if (!token || token.trim().length === 0) {
      return res.status(400).json({
        error: "Token parameter is required",
        timestamp: new Date().toISOString()
      });
    }
    
    if (token.length > 50) {
      return res.status(400).json({
        error: "Token parameter too long (max 50 characters)",
        timestamp: new Date().toISOString()
      });
    }
    
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
    console.error('Search route error:', {
      message: error.message,
      stack: error.stack,
      token: req.params.token,
      timestamp: new Date().toISOString()
    });
    
    // Return structured error response
    res.status(500).json({ 
      error: "Internal server error during token search",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
