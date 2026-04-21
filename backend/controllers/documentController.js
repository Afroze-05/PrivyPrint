const Document = require("../models/Document");
const Log = require("../models/Log");
const { generateToken } = require("../utils/tokenGenerator");
const sendEmail = require("../utils/sendEmail");
const {
  getRatingEmailTemplate,
  getCompletionEmailTemplate,
} = require("../utils/emailTemplates");

const DOCUMENT_TYPE_NORMALIZATION = {
  //Converting different inputs into standard format
  bw: "B/W",
  "b/w": "B/W",
  b_w: "B/W",
  color: "Color",
};

async function generateUniqueDocumentToken() {
  // Try a handful of times to avoid collisions.
  for (let attempt = 0; attempt < 10; attempt++) {
    const token = generateToken();
    console.log(` Token generation attempt ${attempt + 1}: ${token}`);
    const exists = await Document.exists({ token }); //Check if already exists
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
  const searchToken = token ? token.toUpperCase().trim() : token; //Avoid case issues:"abc123" = "ABC123"
  console.log(` Searching token in Documents collection: "${searchToken}"`);
  console.log(`Original token: "${token}"`);
  console.log(`Processed token: "${searchToken}"`);
  console.log(`Search regex: ^${searchToken}$ (case-insensitive)`);

  // Case-insensitive token search - convert to uppercase for matching
  const doc = await Document.findOne({
    token: { $regex: new RegExp(`^${searchToken}$`, "i") }, //$regex is a MongoDB operator “Match using a pattern instead of exact value”//"i" = case-insensitive
  }).populate("userId", "email name role");

  console.log(`MongoDB query executed...`);

  if (!doc) {
    console.log(`Token Not Found in Documents collection: "${searchToken}"`);

    // Additional debug: Check if any similar tokens exist
    const allDocs = await Document.find({}).select("token status").limit(10);
    console.log(`Existing tokens in database (first 10):`);
    allDocs.forEach((d) =>
      console.log(`  - "${d.token}" (status: ${d.status})`),
    );

    return { ok: false, statusCode: 404, message: "Token not found." };
  }

  console.log(`Token Found: "${doc.token}", status: ${doc.status}`);
  console.log(`Document fileUrl: ${doc.fileUrl}`);
  console.log(`Document userId: ${doc.userId?._id}`);

  await markExpiredIfNeeded(doc);

  if (doc.status === "expired") {
    console.log(`Token expired: "${searchToken}"`);
    return { ok: false, statusCode: 410, message: "Token expired." };
  }

  if (doc.status === "completed") {
    console.log(`Token already used: "${searchToken}"`);
    return { ok: false, statusCode: 409, message: "Token already used." };
  }

  console.log(`Token verification PASSED: "${searchToken}"`);
  return { ok: true, document: doc };
}

// Pricing constants
const PRICING = {
  "B/W": 2, // ₹2 per page
  Color: 5, // ₹5 per page
};

// Calculate price based on type and copies
function calculatePrice(type, copies, pages = 1) {
  const pricePerPage = PRICING[type] || 0;
  return pricePerPage * copies * pages;
}

async function uploadDocument(req, res) {
  try {
    console.log(" Upload Debug - Upload request received");
    console.log(" Upload Debug - User authenticated:", !!req.user);
    console.log(" Upload Debug - User ID:", req.user?.id);
    console.log(" Upload Debug - User role:", req.user?.role);
    console.log(" Upload Debug - Files received:", req.files?.length || 0);
    console.log(" Upload Debug - Single file fallback:", !!req.file);

    const { token, totalFiles } = req.body;
    console.log(
      " Upload Debug - Request body - token:",
      token,
      "totalFiles:",
      totalFiles,
      "printType:",
      req.body.printType,
      "copies:",
      req.body.copies,
    );

    // Handle both single file and multiple files
    const filesToProcess =
      req.files && req.files.length > 0
        ? req.files
        : req.file
          ? [req.file]
          : []; //if files exist, use them; else if single file exists, wrap it in array; else empty array

    if (!filesToProcess || filesToProcess.length === 0) {
      console.log("Upload Debug - Missing file upload");
      return res.status(400).json({
        message:
          "Missing file upload. Use field name `files` for multiple files or `file` for single file.",
      });
    }

    console.log(" Upload Debug - Processing", filesToProcess.length, "files");

    // Use frontend-generated token or fallback to generated token
    let documentToken;
    if (token) {
      const searchToken = token.toUpperCase().trim();
      console.log(" Using frontend-generated token:", searchToken);
      // Check if token already exists in Documents collection
      const existingDoc = await Document.findOne({
        token: { $regex: new RegExp(`^${searchToken}$`, "i") },
      });
      if (existingDoc) {
        console.log("Token already exists, generating new one");
        documentToken = await generateUniqueDocumentToken();
      } else {
        documentToken = searchToken;
      }
    } else {
      console.log(" No token provided, generating new one");
      documentToken = await generateUniqueDocumentToken();
    }

    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 2 * 60 * 1000); // 2 minutes

    let totalPrice = 0;
    let totalCopies = 0;
    const createdDocuments = [];

    // Get printType and copies from request body (assuming single file upload for now)
    const printType = req.body.printType || "B/W";
    const copies = req.body.copies || "1";

    // Process each file (currently only one file is expected from frontend)
    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];

      console.log(
        `Processing file ${i + 1}:`,
        file.originalname,
        "type:",
        printType,
        "copies:",
        copies,
      );

      // Normalize type
      const normalizedType =
        DOCUMENT_TYPE_NORMALIZATION[printType.toLowerCase().trim()] ||
        printType;

      if (!["B/W", "Color"].includes(normalizedType)) {
        console.log("Upload Debug - Invalid type:", normalizedType);
        return res
          .status(400)
          .json({ message: "type must be 'B/W' or 'Color'." });
      }

      const parsedCopies = Number(copies);
      const parsedPages = 1; // Default to 1 page, could be enhanced with PDF page counting

      if (!Number.isFinite(parsedCopies) || parsedCopies < 1) {
        console.log("Upload Debug - Invalid copies:", parsedCopies);
        return res
          .status(400)
          .json({ message: "copies must be a positive number." });
      }

      // Calculate price for this file
      const price = calculatePrice(normalizedType, parsedCopies, parsedPages);
      totalPrice += price;
      totalCopies += parsedCopies;

      const fileUrl = `/uploads/${file.filename}`;

      // Create document for this file
      const doc = await Document.create({
        fileUrl,
        token: documentToken, // Same token for all files in this batch
        type: normalizedType,
        copies: parsedCopies,
        pages: parsedPages,
        price: price,
        status: "waiting",
        createdAt,
        expiresAt,
        userId: req.user.id,
      });

      createdDocuments.push(doc);
      console.log(
        ` Document created for file ${i + 1} with token: ${doc.token}`,
      );
    }

    console.log("Saved Token:", documentToken); // Verification log
    console.log(
      `All ${createdDocuments.length} documents created with shared token: ${documentToken}`,
    );

    const response = {
      token: documentToken,
      status: "waiting",
      expiresAt: expiresAt,
      totalFiles: createdDocuments.length,
      totalPrice: totalPrice,
      totalCopies: totalCopies,
      files: createdDocuments.map((doc) => ({
        filename: doc.fileUrl.split("/").pop(),
        type: doc.type,
        copies: doc.copies,
        pages: doc.pages,
        price: doc.price,
      })),
    };

    console.log(" Multi-file upload response:", response);
    return res.status(201).json(response);
  } catch (err) {
    console.log(" Upload Debug - Upload failed:", err.message);
    return res
      .status(500)
      .json({ message: "Upload failed.", error: err.message });
  }
}

async function getDocumentByToken(req, res) {
  try {
    const { token } = req.params;
    console.log(`\n=== TOKEN FETCH DEBUG ===`);
    console.log(`Admin requested token: "${token}"`);
    console.log(`Token length: ${token?.length}`);
    console.log(`Token uppercase: "${token?.toUpperCase()}"`);

    const result = await getDocumentForVerification(token);

    if (!result.ok) {
      console.log(`Token fetch FAILED: ${result.message}`);
      console.log(`=== END TOKEN FETCH DEBUG ===\n`);
      return res.status(result.statusCode).json({ message: result.message });
    }

    const doc = result.document;
    console.log(
      `Token fetch SUCCESS: Found document with token "${doc.token}"`,
    );
    console.log(`Document fileUrl: ${doc.fileUrl}`);
    console.log(`Document status: ${doc.status}`);
    console.log(`=== END TOKEN FETCH DEBUG ===\n`);

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
    console.log(`Token fetch ERROR: ${err.message}`);
    console.log(`=== END TOKEN FETCH DEBUG ===\n`);
    return res
      .status(500)
      .json({ message: "Failed to fetch document.", error: err.message });
  }
}

async function sendPrintSuccessEmail(document) {
  try {
    // Get the frontend URL from environment or use default
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    // Generate rating URL
    const ratingUrl = `${frontendUrl}/rating?jobId=${document._id}`;

    // Extract filename from fileUrl
    const filename = document.fileUrl
      ? document.fileUrl.split("/").pop()
      : "Unknown Document";

    // Job details for email template
    const jobDetails = {
      filename: filename,
      type: document.type,
      copies: document.copies || 1,
      token: document.token,
      jobId: document._id,
    };

    // Send completion email with rating request
    const emailHtml = getRatingEmailTemplate(
      document.userId?.name || "Customer",
      jobDetails,
      ratingUrl,
    );

    await sendEmail({
      email: document.userId?.email,
      subject: `Your PrivyPrint job is complete -> Rate your experience!`,
      message: emailHtml,
      textMessage: `Your print job "${filename}" has been completed. Please rate your experience: ${ratingUrl}`,
    });

    console.log(
      `Print success email sent to ${document.userId?.email} for job ${document.token}`,
    );
    return true;
  } catch (error) {
    console.error("Failed to send rating email:", error);
    // Don't throw error - print process should continue even if email fails
    return false;
  }
}
//now api function that will be called when the admin tries to print with the token
async function simulatePrint(req, res) {
  try {
    const { token } = req.params; //getting token from url
    const adminId = req.user.id;
    const now = new Date();

    // Case-insensitive token search
    const searchToken = token ? token.toUpperCase() : token;

    // waiting -> printing (atomic)
    const printingDoc = await Document.findOneAndUpdate(
      {
        token: { $regex: new RegExp(`^${searchToken}$`, "i") },
        status: "waiting",
        expiresAt: { $gt: now },
      },
      { $set: { status: "printing" } }, //updated doc status to priting
      { new: true },
    );

    if (!printingDoc) {
      const existing = await Document.findOne({
        token: { $regex: new RegExp(`^${searchToken}$`, "i") },
      });
      if (!existing)
        return res.status(404).json({ message: "Token not found." });

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

      return res
        .status(409)
        .json({ message: "Token cannot be printed in its current state." });
    }

    // Simulate printing time.
    await new Promise((r) => setTimeout(r, 800));

    // printing -> completed (atomic)
    const completedDoc = await Document.findOneAndUpdate(
      {
        token: { $regex: new RegExp(`^${searchToken}$`, "i") },
        status: "printing", //only update if status is still printing (safety check)
      },
      { $set: { status: "completed" } },
      { new: true },
    ).populate("userId", "name email"); //fetch user details for email after print completion

    if (!completedDoc) {
      return res
        .status(409)
        .json({ message: "Print simulation failed due to state change." });
    }

    // Create enhanced log entry in logs collection
    await Log.create({
      token: completedDoc.token,
      documentId: completedDoc._id,
      adminId,
      printType: completedDoc.type,
      pages: completedDoc.pages || 1,
      copies: completedDoc.copies,
      price: completedDoc.price,
      time: new Date(),
    });

    console.log(` Print completed - Token ${token} marked as used`);

    // Send print success email with rating links
    await sendPrintSuccessEmail(completedDoc);

    return res.status(200).json({
      message: "Printing completed.",
      token: completedDoc.token,
      status: completedDoc.status,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Print failed.", error: err.message });
  }
}

// Get all documents with timestamps
async function getAllDocuments(req, res) {
  try {
    const documents = await Document.find({})
      .select("token fileUrl type status createdAt expiresAt userId copies")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    // Transform to match frontend expectations
    const transformedDocs = documents.map((doc) => {
      // Extract filename from fileUrl
      const filename = doc.fileUrl ? doc.fileUrl.split("/").pop() : "unknown";

      return {
        id: doc._id,
        token: doc.token,
        filename: filename,
        type: doc.type,
        status: doc.status,
        createdAt: doc.createdAt,
        expiresAt: doc.expiresAt,
        userId: doc.userId,
      };
    });

    return res.status(200).json(transformedDocs);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch documents.", error: err.message });
  }
}

// Get all tokens with status
async function getAllTokens(req, res) {
  try {
    const tokens = await Document.find({})
      .select("token status createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(tokens);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch tokens.", error: err.message });
  }
}

// Get recent activity
async function getRecentActivity(req, res) {
  try {
    // Get recent logs (prints)
    const printLogs = await Log.find({})
      .select("token adminId time")
      .sort({ time: -1 })
      .limit(10)
      .lean();

    // Get recent document uploads
    const recentUploads = await Document.find({})
      .select("token type createdAt userId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Transform and combine activities
    const activities = [];

    // Add print activities
    printLogs.forEach((log) => {
      activities.push({
        type: "print",
        message: `Document printed (token: ${log.token})`,
        timestamp: log.time,
        adminId: log.adminId,
      });
    });

    // Add upload activities
    recentUploads.forEach((doc) => {
      activities.push({
        type: "upload",
        message: `${doc.userId?.name || "Unknown user"} uploaded ${doc.type} document`,
        timestamp: doc.createdAt,
        userId: doc.userId,
      });
    });

    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Return only the latest 10 activities
    return res.status(200).json(activities.slice(0, 10));
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch activity.", error: err.message });
  }
}

async function verifyToken(req, res) {
  console.log("verifyToken function called");
  try {
    const { token } = req.body;
    console.log(`Token verification request - Token: ${token}`);

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const result = await getDocumentForVerification(token);

    if (!result.ok) {
      console.log(` Token verification failed: ${result.message}`);
      return res.status(result.statusCode).json({ message: result.message });
    }

    const doc = result.document;

    // ⏱ CHECK 2 MINUTE EXPIRY (additional safety check)
    const now = new Date();
    const diff = (now - new Date(doc.createdAt)) / 1000; // seconds

    if (diff > 120) {
      console.log(
        `Token verification - Token expired after 2 minutes: ${token}`,
      );
      // Update document status to expired
      await Document.updateOne({ token }, { $set: { status: "expired" } });
      return res.status(403).json({ message: "Token Expired" });
    }

    console.log(`Token verification - Valid token: ${token}`);

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
      fileName: doc.fileUrl ? doc.fileUrl.split("/").pop() : "unknown",
      fileSize: doc.fileUrl ? null : null, // Could be enhanced to store file size
      customerId: doc.userId?._id,
      customerEmail: doc.userId?.email,
      customerName: doc.userId?.name,
    };

    console.log("Enhanced verify token response:", response);
    return res.status(200).json(response);
  } catch (err) {
    console.error("Token verification error:", err);
    return res
      .status(500)
      .json({ message: "Token verification failed", error: err.message });
  }
}

// Get print history with pricing
async function getPrintHistory(req, res) {
  try {
    console.log("Fetching print history...");

    // Get all documents for comprehensive history
    const docs = await Document.find({}) //get all docs here {} empty means no filter
      .select("fileUrl type copies pages createdAt userId") //only return the fiels mentioned
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    if (!docs || docs.length === 0) {
      return res.json([]);
    }

    // Safe data mapping with consistent pricing
    const history = docs.map((doc) => {
      const pages = doc.pages || 1;
      const type = doc.printType || doc.type || "bw";
      const copies = doc.copies || 1;

      // Consistent pricing logic
      const rate = type === "color" || type === "Color" ? 5 : 2;
      const price = doc.price || pages * rate * copies;

      // Extract filename from fileUrl safely
      const filename = doc.fileUrl ? doc.fileUrl.split("/").pop() : "Unknown";

      return {
        id: doc._id,
        token: doc.token || "Unknown",
        filename: filename,
        user: doc.userId?.name || doc.userId?.email || "Unknown",
        userEmail: doc.userId?.email || "Unknown",
        userName: doc.userId?.name || "Unknown",
        printType: type === "color" || type === "Color" ? "Color" : "B/W",
        copies: copies,
        pages: pages,
        price: price,
        currency: "₹",
        createdAt: doc.createdAt,
        uploadedAt: doc.createdAt,
        status: doc.status || "Unknown",
      };
    });

    console.log(` Found ${history.length} print history records`);
    return res.status(200).json(history);
  } catch (err) {
    console.error(" Failed to fetch print history:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch print history.", error: err.message });
  }
}

// Get document by ID
async function getDocumentById(req, res) {
  try {
    const { id } = req.params;

    const document = await Document.findById(id)
      .populate("userId", "email name role")
      .lean();

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    console.log(`Retrieved document by ID: ${id}`);
    return res.status(200).json(document);
  } catch (error) {
    console.error(" Error fetching document by ID:", error);
    return res.status(500).json({
      message: "Failed to fetch document",
      error: error.message,
    });
  }
}

// Get daily revenue statistics
async function getDailyRevenue(req, res) {
  try {
    console.log("  Calculating daily revenue...");

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    // Get today's print logs
    const todayLogs = await Log.find({
      time: { $gte: startOfDay, $lt: endOfDay },
    });

    // Get documents for today's completed prints
    const documentTokens = todayLogs.map((log) => log.token);
    const documents = await Document.find({
      token: { $in: documentTokens },
      status: { $in: ["completed", "printed"] },
    }).populate("userId", "email name role");

    let totalPrints = 0;
    let bwPages = 0;
    let colorPages = 0;
    let totalRevenue = 0;

    documents.forEach((doc) => {
      const pageCount = doc.pages || 1;
      const copies = doc.copies || 1;
      const totalPages = pageCount * copies;

      if (doc.type === "Color") {
        colorPages += totalPages;
        totalRevenue += totalPages * 5;
      } else {
        bwPages += totalPages;
        totalRevenue += totalPages * 2;
      }
      totalPrints += copies;
    });

    const revenueData = {
      date: today.toISOString().split("T")[0],
      totalPrints,
      totalRevenue,
      bwPages,
      colorPages,
      currency: "₹",
      breakdown: {
        bwRevenue: bwPages * 2,
        colorRevenue: colorPages * 5,
      },
    };

    console.log(`Today's revenue: ₹${totalRevenue} from ${totalPrints} prints`);
    return res.status(200).json(revenueData);
  } catch (err) {
    console.error(" Failed to calculate daily revenue:", err);
    return res.status(500).json({
      message: "Failed to calculate daily revenue.",
      error: err.message,
    });
  }
}

// Get real-time print statistics
async function getRealTimeStats(req, res) {
  try {
    console.log("Fetching real-time print statistics...");

    // Get all documents for comprehensive stats
    const docs = (await Document.find({})) || [];

    // Initialize safe defaults
    let totalPrints = 0;
    let bwPrints = 0;
    let colorPrints = 0;
    let totalEarnings = 0;

    // Safe aggregation with null checks and consistent pricing
    if (docs && Array.isArray(docs)) {
      docs.forEach((doc) => {
        if (!doc) return;

        const pages = doc.pages || 1;
        const type = doc.printType || doc.type || "bw";
        const copies = doc.copies || 1;

        // Consistent pricing logic
        const rate = type === "color" || type === "Color" ? 5 : 2;
        const price = doc.price || pages * rate * copies;

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
      currency: "₹",
      lastUpdated: new Date(),
      breakdown: {
        bwEarnings: bwPrints * 2,
        colorEarnings: colorPrints * 5,
      },
    };

    console.log(
      `Real-time stats: ${totalPrints} prints, ₹${totalEarnings} earnings`,
    );
    return res.status(200).json(stats);
  } catch (err) {
    console.error(" Failed to fetch real-time stats:", err);
    return res.status(500).json({
      message: "Failed to fetch real-time stats.",
      error: err.message,
    });
  }
}

// Get earnings history (today, yesterday, last 7 days)
async function getEarningsHistory(req, res) {
  try {
    console.log("Fetching earnings history...");

    // Get all documents for comprehensive earnings data
    const docs = (await Document.find({})) || [];

    if (!docs || docs.length === 0) {
      return res.json({
        today: {
          totalEarnings: 0,
          totalPrints: 0,
          bwPrints: 0,
          colorPrints: 0,
          date: new Date().toISOString().split("T")[0],
          currency: "₹",
        },
        yesterday: {
          totalEarnings: 0,
          totalPrints: 0,
          bwPrints: 0,
          colorPrints: 0,
          date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
          currency: "₹",
        },
        last7Days: {
          totalEarnings: 0,
          totalPrints: 0,
          bwPrints: 0,
          colorPrints: 0,
          startDate: new Date(Date.now() - 6 * 86400000)
            .toISOString()
            .split("T")[0],
          endDate: new Date().toISOString().split("T")[0],
          currency: "₹",
        },
      });
    }

    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const todayEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStart = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
    );
    const yesterdayEnd = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate() + 1,
    );

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
        documents.forEach((doc) => {
          if (!doc) return;

          const docDate = new Date(doc.createdAt);
          if (docDate >= startDate && docDate < endDate) {
            const pages = doc.pages || 1;
            const type = doc.printType || doc.type || "bw";
            const copies = doc.copies || 1;

            // Consistent pricing logic
            const rate = type === "color" || type === "Color" ? 5 : 2;
            const price = doc.price || pages * rate * copies;

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
    const yesterdayData = getEarningsForRange(
      yesterdayStart,
      yesterdayEnd,
      docs,
    );
    const sevenDaysData = getEarningsForRange(sevenDaysAgo, todayEnd, docs);

    const history = {
      today: {
        ...todayData,
        date: today.toISOString().split("T")[0],
        currency: "₹",
      },
      yesterday: {
        ...yesterdayData,
        date: yesterday.toISOString().split("T")[0],
        currency: "₹",
      },
      last7Days: {
        ...sevenDaysData,
        startDate: sevenDaysAgo.toISOString().split("T")[0],
        endDate: today.toISOString().split("T")[0],
        currency: "₹",
      },
    };

    console.log(`Earnings history fetched`);
    return res.status(200).json(history);
  } catch (err) {
    console.error(" Failed to fetch earnings history:", err);
    return res.status(500).json({
      message: "Failed to fetch earnings history.",
      error: err.message,
    });
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
  getEarningsHistory,
};
