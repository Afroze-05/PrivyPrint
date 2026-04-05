const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Schema to store voice print requests
const voiceRequestSchema = new mongoose.Schema({
  token: { type: String, required: true },
  transcript: { type: String, default: "" },
  status: { type: String, default: "pending" }, // pending | printed | rejected
  requestedAt: { type: Date, default: Date.now },
});

const VoiceRequest =
  mongoose.models.VoiceRequest ||
  mongoose.model("VoiceRequest", voiceRequestSchema);

// POST /api/print — called by VoicePrint.jsx
router.post("/print", async (req, res) => {
  const { token, transcript } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required." });
  }

  try {
    const request = await VoiceRequest.create({
      token,
      transcript: transcript || "",
    });
    console.log(`🎙 Voice print request saved: token=${token}`);
    return res.json({
      message: `Print request for token "${token}" received. Admin will process it.`,
      requestId: request._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to save print request." });
  }
});

// GET /api/voice-requests — admin fetches all voice requests
router.get("/voice-requests", async (req, res) => {
  try {
    const requests = await VoiceRequest.find().sort({ requestedAt: -1 });
    return res.json(requests);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch requests." });
  }
});

// PATCH /api/voice-requests/:id — admin marks as printed/rejected
router.patch("/voice-requests/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await VoiceRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: "Failed to update request." });
  }
});

module.exports = router;
