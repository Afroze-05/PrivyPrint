const express = require("express");
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

// Public Routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOTP); // Your OTP Logic
router.post("/verify-token", authController.verifyToken); // Token verification

// Protected Routes
router.put("/update-profile", authMiddleware, authController.updateProfile);
router.post("/logout", authMiddleware, authController.logout);

// Development/Admin Cleanup
router.delete("/delete-all", authController.deleteAllUsers);

module.exports = router;
