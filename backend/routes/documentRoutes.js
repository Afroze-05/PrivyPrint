const express = require("express");

const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const documentController = require("../controllers/documentController");

const router = express.Router();

// Upload document (customer only).
router.post(
  "/upload",
  authMiddleware,
  requireRole("customer"),
  upload.single("file"),
  documentController.uploadDocument
);

// Get all documents with tokens (admin only).
router.get("/documents", authMiddleware, requireRole("admin"), documentController.getAllDocuments);

// Get all tokens with status (admin only).
router.get("/tokens", authMiddleware, requireRole("admin"), documentController.getAllTokens);

// Get recent activity (admin only).
router.get("/activity", authMiddleware, requireRole("admin"), documentController.getRecentActivity);

// Test route for debugging
router.post("/test-verify", (req, res) => {
  console.log('🔧 test-verify route called');
  res.json({ message: "Test route works" });
});

console.log("🔧 /verify-token route registered");

// Verify token and fetch document details (admin only).
router.get("/document/:token", authMiddleware, requireRole("admin"), documentController.getDocumentByToken);

// Simulate printing flow waiting -> printing -> completed (admin only).
router.post("/print/:token", authMiddleware, requireRole("admin"), documentController.simulatePrint);

console.log("🔧 documentRoutes module loaded");

module.exports = router;

console.log("🔧 documentRoutes module exported");
