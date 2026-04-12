const express = require("express");
const router = express.Router();
const Voice = require("../models/Voice");

// ── FIXED: authMiddleware exports { authMiddleware, requireRole } ──
const { authMiddleware: protect } = require("../middleware/authMiddleware");

// POST — customer submits a voice request
router.post("/", protect, async (req, res) => {
  try {
    const { token, transcript, type } = req.body;
    if (!token) return res.status(400).json({ error: "Token is required" });

    const voice = await Voice.create({
      user: req.user.id, // ← FIXED: was req.user._id, your auth sets req.user.id
      token,
      transcript: transcript || "",
      type: type || "print_request",
      requestedAt: new Date(),
    });

    res.status(201).json(voice);
  } catch (err) {
    console.error("Voice POST error:", err.message);
    res.status(500).json({ error: err.message });
  }
});
// GET — admin fetches all voice requests
router.get("/", protect, async (req, res) => {
  try {
    const requests = await Voice.find()
      .populate("user", "name email")
      .sort({ requestedAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — voice history (used by VoicePanel)
router.get("/history", protect, async (req, res) => {
  try {
    const requests = await Voice.find()
      .populate("user", "name email")
      .sort({ requestedAt: -1 })
      .limit(50);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH — admin updates status
router.patch("/:id", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "verified", "rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        error: `Invalid status "${status}". Allowed: ${allowed.join(", ")}`,
      });
    }

    const updated = await Voice.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!updated)
      return res.status(404).json({ error: "Voice request not found" });
    res.json(updated);
  } catch (err) {
    console.error("Voice PATCH error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
