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

// Verify token and fetch document details (admin only).
router.get("/document/:token", authMiddleware, requireRole("admin"), documentController.getDocumentByToken);

// Simulate printing flow waiting -> printing -> completed (admin only).
router.post("/print/:token", authMiddleware, requireRole("admin"), documentController.simulatePrint);

module.exports = router;

