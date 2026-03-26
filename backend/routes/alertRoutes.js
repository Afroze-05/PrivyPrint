const express = require("express");

const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const { createAlert } = require("../controllers/alertController");

const router = express.Router();

// Admin triggers AI alerts.
router.post("/alert", authMiddleware, requireRole("admin"), createAlert);

module.exports = router;

