const express = require("express");

const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const documentController = require("../controllers/documentController");

const router = express.Router();

// Upload document (admin and customer).
router.post(
  "/upload",
  (req, res, next) => {
    console.log('🔍 Upload Route Debug - Route reached');
    console.log('🔍 Upload Route Debug - req.user exists:', !!req.user);
    console.log('🔍 Upload Route Debug - req.user:', req.user);
    console.log('🔍 Upload Route Debug - req.user.role:', req.user?.role);
    console.log('🔍 Upload Route Debug - req.headers:', Object.keys(req.headers));
    console.log('🔍 Upload Route Debug - Authorization header:', req.headers.authorization?.substring(0, 50) + '...');
    next();
  },
  authMiddleware,
  (req, res, next) => {
    console.log('🔍 Upload Route Debug - After authMiddleware');
    console.log('🔍 Upload Route Debug - req.user after auth:', req.user);
    console.log('🔍 Upload Route Debug - req.user.role after auth:', req.user?.role);
    next();
  },
  (req, res, next) => {
    console.log('🔍 Upload Route Debug - Checking role requirements');
    const allowedRoles = ["admin", "customer"];
    const userRole = req.user?.role;
    console.log('🔍 Upload Route Debug - User role:', userRole);
    console.log('🔍 Upload Route Debug - Allowed roles:', allowedRoles);
    console.log('🔍 Upload Route Debug - Role check result:', allowedRoles.includes(userRole));
    
    if (!req.user || !allowedRoles.includes(userRole)) {
      console.log('❌ Upload Route Debug - ROLE CHECK FAILED');
      return res.status(403).json({
        msg: "Role access denied",
        debug: `User role: ${userRole}, Required: ${allowedRoles.join(' or ')}`,
        user: req.user
      });
    }
    
    console.log('✅ Upload Route Debug - Role check passed');
    next();
  },
  upload.single("file"),
  (req, res, next) => {
    console.log('🔍 Upload Route Debug - After multer middleware');
    console.log('🔍 Upload Route Debug - req.file exists:', !!req.file);
    console.log('🔍 Upload Route Debug - req.file:', req.file);
    console.log('🔍 Upload Route Debug - req.body:', req.body);
    next();
  },
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
