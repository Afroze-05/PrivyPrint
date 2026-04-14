const express = require("express");

const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const { getPrintLogs } = require("../controllers/logsController");

const router = express.Router();

// Admin view of print logs.
router.get("/logs", authMiddleware, requireRole("admin"), getPrintLogs);

module.exports = router;

