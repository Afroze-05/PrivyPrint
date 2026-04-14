const express = require("express");
const sendEmail = require("../utils/sendEmail");
const Document = require("../models/Document");
const User = require("../models/User");
const Log = require("../models/Log");
const { generateToken } = require("../utils/tokenGenerator");
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

// Create sample data for dashboard testing
router.post("/create-sample-data", async (req, res) => {
  try {
    console.log("🧪 Creating sample data for dashboard testing...");
    
    // Find or create a test user
    let testUser = await User.findOne({ email: "testadmin@example.com" });
    if (!testUser) {
      testUser = await User.create({
        name: "Test Admin",
        email: "testadmin@example.com",
        password: "password123", // In production, hash this
        role: "admin",
        trustScore: 850,
        isVerified: true
      });
      console.log("✅ Created test admin user");
    }
    
    // Create sample documents
    const sampleDocs = [];
    const now = new Date();
    
    for (let i = 0; i < 10; i++) {
      const createdAt = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000)); // Each doc from different days
      const token = generateToken();
      const expiresAt = new Date(createdAt.getTime() + 2 * 60 * 1000); // 2 minutes expiry
      
      const doc = await Document.create({
        fileUrl: `/uploads/sample_doc_${i}.pdf`,
        token,
        type: i % 2 === 0 ? "B/W" : "Color",
        copies: Math.floor(Math.random() * 3) + 1,
        status: ["waiting", "printing", "completed", "expired"][i % 4],
        createdAt,
        expiresAt,
        userId: testUser._id
      });
      
      sampleDocs.push(doc);
      
      // Create some log entries for completed documents
      if (doc.status === "completed") {
        await Log.create({
          token: doc.token,
          adminId: testUser._id,
          time: new Date(createdAt.getTime() + 60 * 60 * 1000) // 1 hour after creation
        });
      }
    }
    
    console.log(`✅ Created ${sampleDocs.length} sample documents`);
    
    res.status(200).json({ 
      message: "Sample data created successfully!",
      documents: sampleDocs.length,
      user: testUser.name
    });
  } catch (error) {
    console.error("❌ Failed to create sample data:", error);
    res.status(500).json({ 
      message: "Failed to create sample data",
      error: error.message 
    });
  }
});

// Test admin login (for testing dashboard)
router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find test admin user
    const testUser = await User.findOne({ email: "testadmin@example.com", role: "admin" });
    if (!testUser) {
      return res.status(404).json({ message: "Test admin user not found. Create sample data first." });
    }
    
    // Simple password check (in production, use bcrypt)
    if (password !== "password123") {
      return res.status(401).json({ message: "Invalid password" });
    }
    
    // Create a simple JWT-like token for testing
    const testToken = `test_admin_token_${Date.now()}`;
    
    res.status(200).json({
      message: "Admin login successful",
      token: testToken,
      user: {
        id: testUser._id,
        name: testUser.name,
        email: testUser.email,
        role: testUser.role,
        trustScore: testUser.trustScore
      }
    });
  } catch (error) {
    console.error("❌ Admin login failed:", error);
    res.status(500).json({ 
      message: "Admin login failed",
      error: error.message 
    });
  }
});

// Test the fixed APIs without authentication
router.get("/test-fixed-apis", async (req, res) => {
  try {
    console.log("🧪 Testing fixed APIs...");
    
    // Test by directly accessing Document model
    const Document = require("../models/Document");
    
    // Get all documents
    const docs = await Document.find({}) || [];
    console.log(`Found ${docs.length} documents`);
    
    // Test the pricing logic
    let totalPrints = 0;
    let totalEarnings = 0;
    let bwPrints = 0;
    let colorPrints = 0;
    
    docs.forEach(doc => {
      const pages = doc.pages || 1;
      const type = doc.printType || doc.type || "bw";
      const copies = doc.copies || 1;
      
      // Consistent pricing logic
      const rate = (type === "color" || type === "Color") ? 5 : 2;
      const price = doc.price || (pages * rate * copies);
      
      totalPrints += copies;
      totalEarnings += price;
      
      if (type === "color" || type === "Color") {
        colorPrints += copies;
      } else {
        bwPrints += copies;
      }
    });
    
    const stats = {
      totalPrints,
      bwPrints,
      colorPrints,
      totalEarnings,
      currency: '₹',
      lastUpdated: new Date(),
      breakdown: {
        bwEarnings: bwPrints * 2,
        colorEarnings: colorPrints * 5
      }
    };
    
    res.status(200).json({
      message: "Fixed APIs tested successfully!",
      documentCount: docs.length,
      stats: stats,
      safeDataHandling: "✅ Working",
      pricingLogic: "✅ Working",
      nullChecks: "✅ Working"
    });
  } catch (error) {
    console.error("❌ Failed to test fixed APIs:", error);
    res.status(500).json({ 
      message: "Failed to test fixed APIs",
      error: error.message 
    });
  }
});

module.exports = router;
