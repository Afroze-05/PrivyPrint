const Document = require("../models/Document");
const Log = require("../models/Log");
const { generateToken } = require("../utils/tokenGenerator");
const sendEmail = require("../utils/sendEmail");

const DOCUMENT_TYPE_NORMALIZATION = {
  bw: "B/W",
  "b/w": "B/W",
  "b_w": "B/W",
  color: "Color",
};

async function generateUniqueDocumentToken() {
  // Try a handful of times to avoid collisions.
  for (let attempt = 0; attempt < 10; attempt++) {
    const token = generateToken();
    console.log(` Token generation attempt ${attempt + 1}: ${token}`);
    const exists = await Document.exists({ token });
    if (!exists) {
      console.log(` Unique token generated: ${token}`);
      return token;
    }
  }
  throw new Error("Failed to generate a unique token. Please try again.");
}

async function markExpiredIfNeeded(doc) {
  const now = new Date();
  if (doc.status === "completed") return doc;

  if (doc.expiresAt <= now && doc.status !== "expired") {
    doc.status = "expired";
    await doc.save();
  }
  return doc;
}

async function getDocumentForVerification(token) {
  console.log(`🔍 Document verification - Looking for token: ${token}`);
  const doc = await Document.findOne({ token }).populate("userId", "email name role");
  if (!doc) {
    console.log(`❌ Document verification - Token not found: ${token}`);
    return { ok: false, statusCode: 404, message: "Token not found." };
  }

  await markExpiredIfNeeded(doc);

  if (doc.status === "expired") {
    console.log(`❌ Document verification - Token expired: ${token}`);
    return { ok: false, statusCode: 410, message: "Token expired." };
  }

  if (doc.status === "completed") {
    console.log(`❌ Document verification - Token already used: ${token}`);
    return { ok: false, statusCode: 409, message: "Token already used." };
  }

  console.log(`✅ Document verification - Token valid: ${token}, status: ${doc.status}`);
  return { ok: true, document: doc };
}

async function uploadDocument(req, res) {
  try {
    console.log('🔍 Upload Debug - Upload request received');
    console.log('🔍 Upload Debug - User authenticated:', !!req.user);
    console.log('🔍 Upload Debug - User ID:', req.user?.id);
    console.log('🔍 Upload Debug - User role:', req.user?.role);
    console.log('🔍 Upload Debug - File received:', !!req.file);
    console.log('🔍 Upload Debug - File details:', req.file?.originalname, req.file?.mimetype, req.file?.size);
    
    const { type, copies } = req.body;
    console.log('🔍 Upload Debug - Request body - type:', type, 'copies:', copies);

    if (!req.file) {
      console.log('❌ Upload Debug - Missing file upload');
      return res.status(400).json({ message: "Missing file upload. Use field name `file`." });
    }

    const normalizedType =
      DOCUMENT_TYPE_NORMALIZATION[(type || "").toLowerCase().trim()] || type;

    if (!["B/W", "Color"].includes(normalizedType)) {
      console.log('❌ Upload Debug - Invalid type:', normalizedType);
      return res.status(400).json({ message: "type must be 'B/W' or 'Color'." });
    }

    const parsedCopies = copies ? Number(copies) : 1;

    if (!Number.isFinite(parsedCopies) || parsedCopies < 1) {
      console.log('❌ Upload Debug - Invalid copies:', parsedCopies);
      return res.status(400).json({ message: "copies must be a positive number." });
    }

    const token = await generateUniqueDocumentToken();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 2 * 60 * 1000); // 2 minutes

    const fileUrl = `/uploads/${req.file.filename}`;

    const doc = await Document.create({
      fileUrl,
      token,
      type: normalizedType,
      copies: parsedCopies,
      status: "waiting",
      createdAt,
      expiresAt,
      userId: req.user.id,
    });

    console.log(`📄 Document created with token: ${doc.token}`);
    const response = {
      token: doc.token,
      status: doc.status,
      expiresAt: doc.expiresAt,
    };
    console.log('📤 Upload response:', response);

    return res.status(201).json(response);
  } catch (err) {
    console.log('❌ Upload Debug - Upload failed:', err.message);
    return res.status(500).json({ message: "Upload failed.", error: err.message });
  }
}

async function getDocumentByToken(req, res) {
  try {
    const { token } = req.params;
    const result = await getDocumentForVerification(token);

    if (!result.ok) {
      return res.status(result.statusCode).json({ message: result.message });
    }

    const doc = result.document;

    return res.status(200).json({
      token: doc.token,
      fileUrl: doc.fileUrl,
      type: doc.type,
      copies: doc.copies,
      status: doc.status,
      createdAt: doc.createdAt,
      expiresAt: doc.expiresAt,
      userId: doc.userId?._id,
      customerEmail: doc.userId?.email,
      customerName: doc.userId?.name,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch document.", error: err.message });
  }
}

async function sendPrintSuccessEmail(document) {
  try {
    // Get the frontend URL from environment or use default
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    // Generate rating links for each star
    const ratingLinks = [];
    for (let i = 1; i <= 5; i++) {
      ratingLinks.push(`${frontendUrl}/api/rate?jobId=${document._id}&rating=${i}`);
    }

    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Print is Complete!</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f4f4f4;
            padding: 20px;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 12px; 
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
        }
        .header h1 { 
            font-size: 28px; 
            margin-bottom: 10px; 
            font-weight: 600;
        }
        .header p { 
            font-size: 16px; 
            opacity: 0.9;
        }
        .content { 
            padding: 40px 30px; 
        }
        .greeting { 
            font-size: 18px; 
            margin-bottom: 20px; 
            color: #555;
        }
        .message { 
            font-size: 16px; 
            margin-bottom: 30px; 
            line-height: 1.7;
        }
        .document-info { 
            background: #f8f9fa; 
            padding: 25px; 
            border-radius: 8px; 
            margin: 25px 0;
            border-left: 4px solid #FF6B35;
        }
        .document-info h3 { 
            color: #333; 
            margin-bottom: 15px; 
            font-size: 18px;
        }
        .document-info p { 
            margin: 8px 0; 
            font-size: 14px;
        }
        .document-info strong { 
            color: #FF6B35; 
        }
        .rating-section { 
            text-align: center; 
            margin: 40px 0; 
            padding: 30px;
            background: linear-gradient(135deg, #fff8f3 0%, #fff 100%);
            border-radius: 12px;
            border: 1px solid #ffe5d6;
        }
        .rating-section h3 { 
            color: #333; 
            margin-bottom: 10px; 
            font-size: 20px;
        }
        .rating-section p { 
            color: #666; 
            margin-bottom: 25px; 
            font-size: 15px;
        }
        .stars-container { 
            display: flex; 
            justify-content: center; 
            gap: 8px; 
            margin: 20px 0;
        }
        .star { 
            font-size: 40px; 
            color: #ddd; 
            text-decoration: none; 
            transition: all 0.3s ease;
            display: inline-block;
            transform: scale(1);
        }
        .star:hover { 
            color: #ffd700; 
            transform: scale(1.2);
            filter: drop-shadow(0 2px 8px rgba(255,215,0,0.4));
        }
        .rating-hint { 
            font-size: 12px; 
            color: #888; 
            margin-top: 15px;
            font-style: italic;
        }
        .footer { 
            text-align: center; 
            padding: 30px; 
            color: #666; 
            font-size: 13px; 
            background: #f8f9fa;
            border-top: 1px solid #eee;
        }
        .footer p { 
            margin: 5px 0;
        }
        .brand-name { 
            font-weight: bold; 
            color: #FF6B35;
        }
        @media (max-width: 600px) {
            .container { margin: 10px; }
            .header { padding: 30px 20px; }
            .content { padding: 30px 20px; }
            .star { font-size: 35px; }
            .stars-container { gap: 5px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Your Print is Complete!</h1>
            <p>Your document has been successfully printed and is ready for collection</p>
        </div>
        <div class="content">
            <p class="greeting">Dear ${document.userId?.name || 'Valued Customer'},</p>
            <p class="message">
                Great news! Your document has been successfully printed and is ready for collection. 
                We appreciate your trust in PrivyPrint for your printing needs.
            </p>
            
            <div class="document-info">
                <h3>📄 Document Details</h3>
                <p><strong>Document:</strong> ${document.fileUrl ? document.fileUrl.split('/').pop() : 'N/A'}</p>
                <p><strong>Type:</strong> ${document.type}</p>
                <p><strong>Copies:</strong> ${document.copies}</p>
                <p><strong>Token:</strong> ${document.token}</p>
                <p><strong>Completed:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="rating-section">
                <h3>⭐ Rate Your Experience</h3>
                <p>Your feedback helps us serve you better! How was your printing experience?</p>
                <div class="stars-container">
                    <a href="${ratingLinks[0]}" class="star" title="Poor">⭐</a>
                    <a href="${ratingLinks[1]}" class="star" title="Fair">⭐</a>
                    <a href="${ratingLinks[2]}" class="star" title="Good">⭐</a>
                    <a href="${ratingLinks[3]}" class="star" title="Very Good">⭐</a>
                    <a href="${ratingLinks[4]}" class="star" title="Excellent">⭐</a>
                </div>
                <p class="rating-hint">Click on the stars to rate (Poor = 1 star, Excellent = 5 stars)</p>
            </div>
            
            <p class="message">
                Thank you for choosing PrivyPrint! We look forward to serving you again.
            </p>
        </div>
        <div class="footer">
            <p><span class="brand-name">PrivyPrint</span> - Your Trusted Printing Partner</p>
            <p>If you didn't request this print, please contact us immediately.</p>
            <p>© 2024 PrivyPrint. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

    await sendEmail({
      email: document.userId?.email,
      subject: "Your print has been completed successfully 🎉",
      message: emailContent
    });

    console.log(`📧 Print success email sent to ${document.userId?.email}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send print success email:', error);
    // Don't throw error - print process should continue even if email fails
    return false;
  }
}

async function simulatePrint(req, res) {
  try {
    const { token } = req.params;
    const adminId = req.user.id;
    const now = new Date();

    // waiting -> printing (atomic)
    const printingDoc = await Document.findOneAndUpdate(
      { token, status: "waiting", expiresAt: { $gt: now } },
      { $set: { status: "printing" } },
      { new: true }
    );

    if (!printingDoc) {
      const existing = await Document.findOne({ token });
      if (!existing) return res.status(404).json({ message: "Token not found." });

      await markExpiredIfNeeded(existing);

      if (existing.status === "expired") {
        return res.status(410).json({ message: "Token expired." });
      }

      if (existing.status === "completed") {
        return res.status(409).json({ message: "Token already used." });
      }

      if (existing.status === "printing") {
        return res.status(409).json({ message: "Token is already printing." });
      }

      return res.status(409).json({ message: "Token cannot be printed in its current state." });
    }

    // Simulate printing time.
    await new Promise((r) => setTimeout(r, 800));

    // printing -> completed (atomic)
    const completedDoc = await Document.findOneAndUpdate(
      { token, status: "printing" },
      { $set: { status: "completed" } },
      { new: true }
    ).populate('userId', 'name email');

    if (!completedDoc) {
      return res.status(409).json({ message: "Print simulation failed due to state change." });
    }

    await Log.create({ token, adminId, time: new Date() });
    
    console.log(`✅ Print completed - Token ${token} marked as used`);

    // Send print success email with rating links
    await sendPrintSuccessEmail(completedDoc);

    return res.status(200).json({
      message: "Printing completed.",
      token: completedDoc.token,
      status: completedDoc.status,
    });
  } catch (err) {
    return res.status(500).json({ message: "Print failed.", error: err.message });
  }
}

// Get all documents with timestamps
async function getAllDocuments(req, res) {
  try {
    const documents = await Document.find({})
      .select('token fileUrl type status createdAt expiresAt userId copies')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    
    // Transform to match frontend expectations
    const transformedDocs = documents.map(doc => {
      // Extract filename from fileUrl
      const filename = doc.fileUrl ? doc.fileUrl.split('/').pop() : 'unknown';
      
      return {
        id: doc._id,
        token: doc.token,
        filename: filename,
        type: doc.type,
        status: doc.status,
        createdAt: doc.createdAt,
        expiresAt: doc.expiresAt,
        userId: doc.userId
      };
    });
    
    return res.status(200).json(transformedDocs);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch documents.", error: err.message });
  }
}

// Get all tokens with status
async function getAllTokens(req, res) {
  try {
    const tokens = await Document.find({})
      .select('token status createdAt')
      .sort({ createdAt: -1 })
      .lean();
    
    return res.status(200).json(tokens);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch tokens.", error: err.message });
  }
}

// Get recent activity
async function getRecentActivity(req, res) {
  try {
    // Get recent logs (prints)
    const printLogs = await Log.find({})
      .select('token adminId time')
      .sort({ time: -1 })
      .limit(10)
      .lean();
    
    // Get recent document uploads
    const recentUploads = await Document.find({})
      .select('token type createdAt userId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    // Transform and combine activities
    const activities = [];
    
    // Add print activities
    printLogs.forEach(log => {
      activities.push({
        type: 'print',
        message: `Document printed (token: ${log.token})`,
        timestamp: log.time,
        adminId: log.adminId
      });
    });
    
    // Add upload activities
    recentUploads.forEach(doc => {
      activities.push({
        type: 'upload',
        message: `${doc.userId?.name || 'Unknown user'} uploaded ${doc.type} document`,
        timestamp: doc.createdAt,
        userId: doc.userId
      });
    });
    
    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Return only the latest 10 activities
    return res.status(200).json(activities.slice(0, 10));
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch activity.", error: err.message });
  }
}

async function verifyToken(req, res) {
  console.log('🔧 verifyToken function called');
  try {
    const { token } = req.body;
    console.log(`🔍 Token verification request - Token: ${token}`);
    
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const result = await getDocumentForVerification(token);

    if (!result.ok) {
      console.log(`❌ Token verification failed: ${result.message}`);
      return res.status(result.statusCode).json({ message: result.message });
    }

    const doc = result.document;
    
    // ⏱️ CHECK 2 MINUTE EXPIRY (additional safety check)
    const now = new Date();
    const diff = (now - new Date(doc.createdAt)) / 1000; // seconds
    
    if (diff > 120) {
      console.log(`❌ Token verification - Token expired after 2 minutes: ${token}`);
      // Update document status to expired
      await Document.updateOne(
        { token },
        { $set: { status: "expired" } }
      );
      return res.status(403).json({ message: "Token Expired" });
    }

    console.log(`✅ Token verification - Valid token: ${token}`);
    
    // Enhanced response with file metadata
    const response = {
      message: "Token Valid",
      token: doc.token,
      file: doc.fileUrl,
      type: doc.type,
      copies: doc.copies,
      status: doc.status,
      createdAt: doc.createdAt,
      expiresAt: doc.expiresAt,
      // Additional metadata for frontend
      fileUrl: doc.fileUrl,
      fileName: doc.fileUrl ? doc.fileUrl.split('/').pop() : 'unknown',
      fileSize: doc.fileUrl ? null : null, // Could be enhanced to store file size
      customerId: doc.userId?._id,
      customerEmail: doc.userId?.email,
      customerName: doc.userId?.name
    };
    
    console.log('📤 Enhanced verify token response:', response);
    return res.status(200).json(response);
  } catch (err) {
    console.error('❌ Token verification error:', err);
    return res.status(500).json({ message: "Token verification failed", error: err.message });
  }
}

// Get print history with pricing
async function getPrintHistory(req, res) {
  try {
    console.log('📄 Fetching print history...');
    
    // Get all completed prints (from logs) with document details
    const printLogs = await Log.find({})
      .select('token adminId time')
      .sort({ time: -1 })
      .lean();
    
    // Get document details for each print log
    const history = [];
    
    for (const log of printLogs) {
      try {
        const doc = await Document.findOne({ token: log.token })
          .select('fileUrl type copies createdAt userId')
          .populate('userId', 'name email')
          .lean();
        
        if (doc) {
          // Calculate pricing
          let price = 0;
          if (doc.type === 'B/W') {
            price = doc.copies * 2; // ₹2 per page for B/W
          } else if (doc.type === 'Color') {
            price = doc.copies * 5; // ₹5 per page for Color
          }
          
          // Extract filename from fileUrl
          const filename = doc.fileUrl ? doc.fileUrl.split('/').pop() : 'unknown';
          
          history.push({
            id: log._id,
            token: log.token,
            filename: filename,
            userEmail: doc.userId?.email || 'Unknown',
            userName: doc.userId?.name || 'Unknown',
            printType: doc.type,
            copies: doc.copies,
            pages: doc.copies, // Assuming copies = pages for now
            price: price,
            currency: '₹',
            timestamp: log.time,
            status: 'Printed', // All logs are completed prints
            uploadedAt: doc.createdAt,
            printedAt: log.time,
            adminId: log.adminId
          });
        }
      } catch (err) {
        console.error(`Error fetching document for token ${log.token}:`, err);
        // Continue with next log even if document fetch fails
      }
    }
    
    console.log(`✅ Found ${history.length} print history records`);
    return res.status(200).json(history);
  } catch (err) {
    console.error('❌ Failed to fetch print history:', err);
    return res.status(500).json({ message: "Failed to fetch print history.", error: err.message });
  }
}

// Get daily revenue statistics
async function getDailyRevenue(req, res) {
  try {
    console.log('💰 Calculating daily revenue...');
    
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    // Get today's print logs
    const todayLogs = await Log.find({
      time: { $gte: startOfDay, $lt: endOfDay }
    }).select('token').lean();
    
    let totalRevenue = 0;
    let bwPages = 0;
    let colorPages = 0;
    let totalPrints = 0;
    
    // Calculate revenue for today's prints
    for (const log of todayLogs) {
      try {
        const doc = await Document.findOne({ token: log.token })
          .select('type copies')
          .lean();
        
        if (doc) {
          totalPrints++;
          if (doc.type === 'B/W') {
            bwPages += doc.copies;
            totalRevenue += doc.copies * 2;
          } else if (doc.type === 'Color') {
            colorPages += doc.copies;
            totalRevenue += doc.copies * 5;
          }
        }
      } catch (err) {
        console.error(`Error calculating revenue for token ${log.token}:`, err);
      }
    }
    
    const revenueData = {
      date: today.toISOString().split('T')[0],
      totalRevenue,
      totalPrints,
      bwPages,
      colorPages,
      currency: '₹',
      breakdown: {
        bwRevenue: bwPages * 2,
        colorRevenue: colorPages * 5
      }
    };
    
    console.log(`✅ Today's revenue: ₹${totalRevenue} from ${totalPrints} prints`);
    return res.status(200).json(revenueData);
  } catch (err) {
    console.error('❌ Failed to calculate daily revenue:', err);
    return res.status(500).json({ message: "Failed to calculate daily revenue.", error: err.message });
  }
}

module.exports = {
  uploadDocument,
  getDocumentByToken,
  verifyToken,
  simulatePrint,
  getAllDocuments,
  getAllTokens,
  getRecentActivity,
  getPrintHistory,
  getDailyRevenue
};
