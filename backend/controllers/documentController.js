const Document = require("../models/Document");
const Log = require("../models/Log");
const { generateToken } = require("../utils/tokenGenerator");

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
    const { type, copies } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Missing file upload. Use field name `file`." });
    }

    const normalizedType =
      DOCUMENT_TYPE_NORMALIZATION[(type || "").toLowerCase().trim()] || type;

    if (!["B/W", "Color"].includes(normalizedType)) {
      return res.status(400).json({ message: "type must be 'B/W' or 'Color'." });
    }

    const parsedCopies = copies ? Number(copies) : 1;

    if (!Number.isFinite(parsedCopies) || parsedCopies < 1) {
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
    );

    if (!completedDoc) {
      return res.status(409).json({ message: "Print simulation failed due to state change." });
    }

    await Log.create({ token, adminId, time: new Date() });
    
    console.log(`✅ Print completed - Token ${token} marked as used`);

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
      .select('token fileUrl type status createdAt expiresAt userId')
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
    return res.status(200).json({
      message: "Token Valid",
      file: doc.fileUrl,
      token: doc.token,
      type: doc.type,
      copies: doc.copies,
      status: doc.status,
      createdAt: doc.createdAt,
      expiresAt: doc.expiresAt
    });
  } catch (err) {
    console.error('❌ Token verification error:', err);
    return res.status(500).json({ message: "Token verification failed", error: err.message });
  }
}

module.exports = {
  uploadDocument,
  getDocumentByToken,
  verifyToken,
  simulatePrint,
  getAllDocuments,
  getAllTokens,
  getRecentActivity
};