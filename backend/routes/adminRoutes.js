const express = require("express");
const router = express.Router();
const { verifyToken } = require("../controllers/documentController");

// VERIFY TOKEN ROUTE
router.post("/verify-token", verifyToken);

module.exports = router;
