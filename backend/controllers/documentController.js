const Document = require("../models/Document");
const Log = require("../models/Log");
const { generateToken } = require("../utils/tokenGenerator");
const sendEmail = require("../utils/sendEmail");
const { getRatingEmailTemplate, getCompletionEmailTemplate } = require("../utils/emailTemplates");

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

// Pricing constants
const PRICING = {
  'B/W': 2,  // ₹2 per page
  'Color': 5  // ₹5 per page
};

// Calculate price based on type and copies
function calculatePrice(type, copies, pages = 1) {
  const pricePerPage = PRICING[type] || 0;
  return pricePerPage * copies * pages;
}

async function uploadDocument(req, res) {
  try {
    console.log('🔍 Upload Debug - Upload request received');
    console.log('🔍 Upload Debug - User authenticated:', !!req.user);
    console.log('🔍 Upload Debug - User ID:', req.user?.id);
    console.log('🔍 Upload Debug - User role:', req.user?.role);
    console.log('🔍 Upload Debug - File received:', !!req.file);
    console.log('🔍 Upload Debug - File details:', req.file?.originalname, req.file?.mimetype, req.file?.size);
    
    const { type, copies, pages } = req.body;
    console.log('🔍 Upload Debug - Request body - type:', type, 'copies:', copies, 'pages:', pages);

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
    const parsedPages = pages ? Number(pages) : 1;

    if (!Number.isFinite(parsedCopies) || parsedCopies < 1) {
      console.log('❌ Upload Debug - Invalid copies:', parsedCopies);
      return res.status(400).json({ message: "copies must be a positive number." });
    }

    if (!Number.isFinite(parsedPages) || parsedPages < 1) {
      console.log('❌ Upload Debug - Invalid pages:', parsedPages);
      return res.status(400).json({ message: "pages must be a positive number." });
    }

    // Calculate price
    const price = calculatePrice(normalizedType, parsedCopies, parsedPages);

    const token = await generateUniqueDocumentToken();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 2 * 60 * 1000); // 2 minutes

    const fileUrl = `/uploads/${req.file.filename}`;

    const doc = await Document.create({
      fileUrl,
      token,
      type: normalizedType,
      copies: parsedCopies,
      pages: parsedPages,
      price: price,
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
      price: doc.price,
      type: doc.type,
      copies: doc.copies,
      pages: doc.pages
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
    
    // Generate rating URL
    const ratingUrl = `${frontendUrl}/rating?jobId=${document._id}`;
    
    // Extract filename from fileUrl
    const filename = document.fileUrl ? document.fileUrl.split('/').pop() : 'Unknown Document';
    
    // Job details for email template
    const jobDetails = {
      filename: filename,
      type: document.type,
      copies: document.copies || 1,
      token: document.token
    };
    
    // Send completion email with rating request
    const emailHtml = getRatingEmailTemplate(
      document.userId?.name || 'Customer',
      jobDetails,
      ratingUrl
    );

    await sendEmail({
      email: document.userId?.email,
      subject: `🖨️ Your PrivyPrint job is complete - Rate your experience!`,
      message: emailHtml,
      textMessage: `Your print job "${filename}" has been completed. Please rate your experience: ${ratingUrl}`
    });
    
    console.log(`📧 Rating email sent to ${document.userId?.email} for job ${document.token}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send rating email:', error);
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

    // Create enhanced log entry with pricing details
    await Log.create({ 
      token, 
      documentId: completedDoc._id,
      adminId, 
      printType: completedDoc.type,
      pages: completedDoc.pages || 1,
      copies: completedDoc.copies,
      price: completedDoc.price,
      time: new Date() 
    });
    
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
    
    // Get all documents for comprehensive history
    const docs = await Document.find({})
      .select('fileUrl type copies pages createdAt userId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    
    if (!docs || docs.length === 0) {
      return res.json([]);
    }
    
    // Safe data mapping with consistent pricing
    const history = docs.map(doc => {
      const pages = doc.pages || 1;
      const type = doc.printType || doc.type || "bw";
      const copies = doc.copies || 1;
      
      // Consistent pricing logic
      const rate = (type === "color" || type === "Color") ? 5 : 2;
      const price = doc.price || (pages * rate * copies);
      
      // Extract filename from fileUrl safely
      const filename = doc.fileUrl ? doc.fileUrl.split('/').pop() : 'Unknown';
      
      return {
        id: doc._id,
        token: doc.token || 'Unknown',
        filename: filename,
        user: doc.userId?.name || doc.userId?.email || 'Unknown',
        userEmail: doc.userId?.email || 'Unknown',
        userName: doc.userId?.name || 'Unknown',
        printType: type === "color" || type === "Color" ? "Color" : "B/W",
        copies: copies,
        pages: pages,
        price: price,
        currency: '₹',
        createdAt: doc.createdAt,
        uploadedAt: doc.createdAt,
        status: doc.status || 'Unknown'
      };
    });
    
    console.log(`✅ Found ${history.length} print history records`);
    return res.status(200).json(history);
  } catch (err) {
    console.error('❌ Failed to fetch print history:', err);
    return res.status(500).json({ message: "Failed to fetch print history.", error: err.message });
  }
}

// Get document by ID
async function getDocumentById(req, res) {
  try {
    const { id } = req.params;
    
    const document = await Document.findById(id)
      .populate('userId', 'email name role')
      .lean();
    
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    console.log(`📄 Retrieved document by ID: ${id}`);
    return res.status(200).json(document);
    
  } catch (error) {
    console.error('❌ Error fetching document by ID:', error);
    return res.status(500).json({ 
      message: "Failed to fetch document", 
      error: error.message 
    });
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
    });
    
    // Get documents for today's completed prints
    const documentTokens = todayLogs.map(log => log.token);
    const documents = await Document.find({
      token: { $in: documentTokens },
      status: { $in: ['completed', 'printed'] }
    }).populate('userId', 'email name role');

    let totalPrints = 0;
    let bwPages = 0;
    let colorPages = 0;
    let totalRevenue = 0;

    documents.forEach(doc => {
      const pageCount = doc.pages || 1;
      const copies = doc.copies || 1;
      const totalPages = pageCount * copies;
      
      if (doc.type === 'Color') {
        colorPages += totalPages;
        totalRevenue += totalPages * 5;
      } else {
        bwPages += totalPages;
        totalRevenue += totalPages * 2;
      }
      totalPrints += copies;
    });

    const revenueData = {
      date: today.toISOString().split('T')[0],
      totalPrints,
      totalRevenue,
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

// Get real-time print statistics
async function getRealTimeStats(req, res) {
  try {
    console.log('📊 Fetching real-time print statistics...');
    
    // Get all documents for comprehensive stats
    const docs = await Document.find({}) || [];
    
    // Initialize safe defaults
    let totalPrints = 0;
    let bwPrints = 0;
    let colorPrints = 0;
    let totalEarnings = 0;

    // Safe aggregation with null checks and consistent pricing
    if (docs && Array.isArray(docs)) {
      docs.forEach(doc => {
        if (!doc) return;
        
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
    }

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
    
    console.log(`✅ Real-time stats: ${totalPrints} prints, ₹${totalEarnings} earnings`);
    return res.status(200).json(stats);
  } catch (err) {
    console.error('❌ Failed to fetch real-time stats:', err);
    return res.status(500).json({ message: "Failed to fetch real-time stats.", error: err.message });
  }
}

// Get earnings history (today, yesterday, last 7 days)
async function getEarningsHistory(req, res) {
  try {
    console.log('💰 Fetching earnings history...');
    
    // Get all documents for comprehensive earnings data
    const docs = await Document.find({}) || [];
    
    if (!docs || docs.length === 0) {
      return res.json({
        today: { totalEarnings: 0, totalPrints: 0, bwPrints: 0, colorPrints: 0, date: new Date().toISOString().split('T')[0], currency: '₹' },
        yesterday: { totalEarnings: 0, totalPrints: 0, bwPrints: 0, colorPrints: 0, date: new Date(Date.now() - 86400000).toISOString().split('T')[0], currency: '₹' },
        last7Days: { totalEarnings: 0, totalPrints: 0, bwPrints: 0, colorPrints: 0, startDate: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0], currency: '₹' }
      });
    }
    
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    const yesterdayEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() + 1);
    
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Helper function to get earnings for a date range with safe aggregation
    function getEarningsForRange(startDate, endDate, documents) {
      // Initialize safe defaults
      let totalEarnings = 0;
      let totalPrints = 0;
      let bwPrints = 0;
      let colorPrints = 0;
      
      // Safe aggregation with null checks and consistent pricing
      if (documents && Array.isArray(documents)) {
        documents.forEach(doc => {
          if (!doc) return;
          
          const docDate = new Date(doc.createdAt);
          if (docDate >= startDate && docDate < endDate) {
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
          }
        });
      }
      
      return { totalEarnings, totalPrints, bwPrints, colorPrints };
    }
    
    // Get data for each period
    const todayData = getEarningsForRange(todayStart, todayEnd, docs);
    const yesterdayData = getEarningsForRange(yesterdayStart, yesterdayEnd, docs);
    const sevenDaysData = getEarningsForRange(sevenDaysAgo, todayEnd, docs);
    
    const history = {
      today: {
        ...todayData,
        date: today.toISOString().split('T')[0],
        currency: '₹'
      },
      yesterday: {
        ...yesterdayData,
        date: yesterday.toISOString().split('T')[0],
        currency: '₹'
      },
      last7Days: {
        ...sevenDaysData,
        startDate: sevenDaysAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
        currency: '₹'
      }
    };
    
    console.log(`✅ Earnings history fetched`);
    return res.status(200).json(history);
  } catch (err) {
    console.error('❌ Failed to fetch earnings history:', err);
    return res.status(500).json({ message: "Failed to fetch earnings history.", error: err.message });
  }
}

module.exports = {
  uploadDocument,
  getDocumentByToken,
  getDocumentById,
  verifyToken,
  simulatePrint,
  getAllDocuments,
  getAllTokens,
  getRecentActivity,
  getPrintHistory,
  getDailyRevenue,
  getRealTimeStats,
  getEarningsHistory
};
