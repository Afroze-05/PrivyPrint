const express = require("express");
const router = express.Router();
const Voice = require("../models/Voice");
const User = require("../models/User");
const { authMiddleware } = require("../middleware/authMiddleware");

// POST /api/print — called by VoicePrint.jsx
router.post("/print", authMiddleware, async (req, res) => {
  const { token, transcript } = req.body;

  // Input validation
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ 
      error: "Token is required and must be a string." 
    });
  }

  if (token.trim().length < 3) {
    return res.status(400).json({ 
      error: "Token must be at least 3 characters long." 
    });
  }

  if (transcript && typeof transcript !== 'string') {
    return res.status(400).json({ 
      error: "Transcript must be a string." 
    });
  }

  try {
    // Find the user from the token (assuming token belongs to a document)
    const Document = require("../models/Document");
    const document = await Document.findOne({ 
      token: token.trim() 
    }).populate('userId');
    
    if (!document) {
      return res.status(404).json({ 
        error: "Token not found.",
        message: "The provided token does not match any document in the system."
      });
    }

    // Check if voice request already exists for this token
    const existingVoice = await Voice.findOne({ 
      token: token.trim(),
      status: { $in: ['pending', 'verified'] }
    });

    if (existingVoice) {
      return res.status(409).json({ 
        error: "Voice request already exists.",
        message: "A voice request for this token is already pending or verified."
      });
    }

    const request = await Voice.create({
      user: document.userId,
      token: token.trim(),
      transcript: (transcript || "").trim(),
      type: "print_request"
    });
    
    // Populate user info for response
    await request.populate('user', 'name email');
    
    console.log(`🎙 Voice print request saved: token=${token.trim()}, user=${document.userId.email}`);
    return res.status(201).json({
      message: `Print request for token "${token.trim()}" received. Admin will process it.`,
      requestId: request._id,
      user: {
        name: request.user.name,
        email: request.user.email
      },
      status: request.status
    });
  } catch (err) {
    console.error('Voice print request error:', err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validationErrors 
      });
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(409).json({ 
        error: "Duplicate entry",
        message: "A voice request with this token already exists."
      });
    }
    
    return res.status(500).json({ 
      error: "Failed to save print request.",
      message: "An internal error occurred while processing your request."
    });
  }
});

// GET /api/voice-requests — admin fetches all voice requests
router.get("/voice-requests", authMiddleware, async (req, res) => {
  try {
    const requests = await Voice.find()
      .populate('user', 'name email')
      .sort({ requestedAt: -1 });
    return res.json(requests);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch requests." });
  }
});

// PATCH /api/voice-requests/:id — admin marks as printed/rejected
router.patch("/voice-requests/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Voice.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: "Failed to update request." });
  }
});

// GET /api/voice/history — returns all voice records with user info
router.get("/voice/history", authMiddleware, async (req, res) => {
  try {
    const voices = await Voice.find()
      .populate('user', 'name email')
      .populate('verificationResult.verifiedBy', 'name email')
      .sort({ requestedAt: -1 });
    return res.json(voices);
  } catch (err) {
    console.error('Failed to fetch voice history:', err);
    return res.status(500).json({ error: "Failed to fetch voice history." });
  }
});

// POST /api/voice/verify-token — verifies token against voice and document data
router.post("/voice/verify-token", authMiddleware, async (req, res) => {
  try {
    const { token } = req.body;
    
    // Input validation
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ 
        error: "Token is required and must be a string." 
      });
    }

    if (token.trim().length < 3) {
      return res.status(400).json({ 
        error: "Token must be at least 3 characters long." 
      });
    }

    const trimmedToken = token.trim();

    // Check in Voice records
    const voiceRecord = await Voice.findOne({ token: trimmedToken })
      .populate('user', 'name email')
      .populate('verificationResult.verifiedBy', 'name email');

    // Check in Document records
    const Document = require("../models/Document");
    const documentRecord = await Document.findOne({ token: trimmedToken })
      .populate('userId', 'name email');

    if (!voiceRecord && !documentRecord) {
      return res.status(404).json({ 
        error: "Invalid Token",
        message: "Token not found in voice or document records"
      });
    }

    const verificationData = {
      token: trimmedToken,
      foundIn: [],
      voiceData: null,
      documentData: null,
      verified: false,
      verifiedAt: new Date()
    };

    if (voiceRecord) {
      verificationData.foundIn.push('voice');
      verificationData.voiceData = {
        id: voiceRecord._id,
        user: voiceRecord.user,
        transcript: voiceRecord.transcript,
        status: voiceRecord.status,
        type: voiceRecord.type,
        requestedAt: voiceRecord.requestedAt,
        verificationResult: voiceRecord.verificationResult
      };
    }

    if (documentRecord) {
      verificationData.foundIn.push('document');
      verificationData.documentData = {
        id: documentRecord._id,
        user: documentRecord.userId,
        fileUrl: documentRecord.fileUrl,
        type: documentRecord.type,
        copies: documentRecord.copies,
        pages: documentRecord.pages,
        price: documentRecord.price,
        status: documentRecord.status,
        createdAt: documentRecord.createdAt,
        expiresAt: documentRecord.expiresAt
      };
    }

    verificationData.verified = verificationData.foundIn.length > 0;

    // Log the verification attempt
    console.log(`🔍 Token verification: ${trimmedToken} -> ${verificationData.verified ? 'VERIFIED' : 'NOT FOUND'} (found in: ${verificationData.foundIn.join(', ')})`);

    return res.json({
      message: verificationData.verified ? "Token Verified Successfully" : "Invalid Token",
      ...verificationData
    });

  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(500).json({ 
      error: "Failed to verify token.",
      message: "An internal error occurred while verifying the token."
    });
  }
});

module.exports = router;
