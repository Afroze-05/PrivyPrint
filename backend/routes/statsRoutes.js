// const express = require("express");
// const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const express = require("express");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const statsController = require("../controllers/statsController");

const router = express.Router();

// Only Admins can see these stats
router.get(
  "/stats",
  authMiddleware,
  requireRole("admin"),
  statsController.getStats,
);
router.get(
  "/stats/prints",
  authMiddleware,
  requireRole("admin"),
  statsController.getPrintStats,
);
router.get(
  "/stats/charts",
  authMiddleware,
  requireRole("admin"),
  statsController.getCharts,
);

module.exports = router;
