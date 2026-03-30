const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

// Public Routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOTP); // Your OTP Logic

// Development/Admin Cleanup
router.delete("/delete-all", authController.deleteAllUsers);

module.exports = router;
