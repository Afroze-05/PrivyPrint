/**
 * Upload Middleware - File Upload Configuration
 * 
 * Configures multer for handling file uploads in the PrivyPrint system.
 * Supports both single and multiple file uploads with security validations.
 * 
 * @author PrivyPrint Team
 * @version 1.1.0
 */

const path = require("path");
const multer = require("multer");

// Upload directory configuration
const uploadsDir = path.join(__dirname, "..", "uploads");

// Supported file types and their MIME types
const SUPPORTED_TYPES = {
  PDF: "application/pdf",
  IMAGES: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
};

// File size limits (in bytes)
const FILE_SIZE_LIMITS = {
  MAX_FILE_SIZE: 15 * 1024 * 1024, // 15MB
  MAX_FILES_COUNT: 10 // Maximum 10 files at once
};

/**
 * Multer storage configuration
 * 
 * Generates unique filenames with timestamp and random string
 * to prevent filename conflicts and ensure file security.
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // Store files in the uploads directory
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    // Generate unique filename: timestamp-randomstring-basename.extension
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, "_");
    const unique = Math.random().toString(36).slice(2, 9).toUpperCase();
    const filename = `${Date.now()}-${unique}-${base}${ext}`;
    
    console.log(`Generated filename for upload: ${filename}`);
    cb(null, filename);
  },
});

/**
 * File filter for security validation
 * 
 * Only allows PDF and image files to be uploaded.
 * Rejects potentially dangerous file types.
 * 
 * @param {Object} _req - Express request object (unused)
 * @param {Object} file - Multer file object
 * @param {Function} cb - Callback function
 */
const fileFilter = (_req, file, cb) => {
  const mimetype = file.mimetype;
  const isPdf = mimetype === SUPPORTED_TYPES.PDF;
  const isImage = SUPPORTED_TYPES.IMAGES.includes(mimetype);
  
  if (!isPdf && !isImage) {
    console.warn(`Rejected file upload: ${file.originalname} (${mimetype}) - Unsupported file type`);
    return cb(new Error("Only PDF and image files are allowed. Supported formats: PDF, JPG, PNG, GIF, WebP"));
  }
  
  console.log(`Accepted file upload: ${file.originalname} (${mimetype})`);
  return cb(null, true);
};

/**
 * Single file upload configuration
 * 
 * Handles single file uploads with field name 'file'.
 * Configured for secure file handling with size limits.
 */
const upload = multer({
  storage,
  limits: { 
    fileSize: FILE_SIZE_LIMITS.MAX_FILE_SIZE,
    files: 1 // Single file only
  },
  fileFilter,
});

/**
 * Multiple files upload configuration
 * 
 * Handles multiple file uploads with field name 'files'.
 * Supports batch uploads with enhanced security limits.
 */
const uploadMultiple = multer({
  storage,
  limits: { 
    fileSize: FILE_SIZE_LIMITS.MAX_FILE_SIZE, // Per file limit
    files: FILE_SIZE_LIMITS.MAX_FILES_COUNT // Maximum files per request
  },
  fileFilter,
});

// Export configurations for use in routes
module.exports = { 
  upload,           // Single file upload
  uploadMultiple    // Multiple files upload
};

// Export constants for potential reuse
module.exports.constants = {
  SUPPORTED_TYPES,
  FILE_SIZE_LIMITS,
  uploadsDir
};

