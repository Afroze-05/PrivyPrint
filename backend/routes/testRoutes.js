const express = require("express");
const sendEmail = require("../utils/sendEmail");
const router = express.Router();

// Test email endpoint
router.get("/test-email", async (req, res) => {
  try {
    console.log("🧪 Testing email configuration...");
    
    const result = await sendEmail({
      email: "dikshadhanve4@gmail.com", // Test email
      subject: "PrivyPrint - Test Email",
      message: "This is a test email from PrivyPrint to verify email configuration is working.",
    });
    
    console.log("✅ Test email sent successfully:", result.messageId);
    res.status(200).json({ 
      message: "Test email sent successfully!",
      messageId: result.messageId 
    });
  } catch (error) {
    console.error("❌ Test email failed:", error);
    res.status(500).json({ 
      message: "Test email failed",
      error: error.message 
    });
  }
});

// Test OTP generation
router.get("/test-otp", (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("🧪 Generated test OTP:", otp);
  
  res.status(200).json({ 
    message: "Test OTP generated",
    otp: otp,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
