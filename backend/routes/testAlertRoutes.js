const express = require("express");
const { sendSuspiciousAlert } = require("../controllers/alertController");

const router = express.Router();

// Test suspicious alert email sending
router.post("/test-suspicious-alert", async (req, res) => {
  try {
    const testEmail = req.body.email || "dikshadhanve4@gmail.com";
    const testToken = req.body.token || "TEST-TOKEN-123";
    
    console.log("🧪 Testing suspicious alert email...");
    
    // Create a mock request object with the required body
    const mockReq = {
      body: {
        type: "tab_switch_detected",
        time: new Date().toISOString(),
        token: testToken,
        email: testEmail
      },
      user: null
    };

    // Call the controller function with mock request
    await sendSuspiciousAlert(mockReq, res);
    
  } catch (error) {
    console.error("❌ Test route error:", error);
    res.status(500).json({ message: "Test failed", error: error.message });
  }
});

module.exports = router;
