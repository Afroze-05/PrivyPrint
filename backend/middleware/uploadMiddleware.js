// File upload middleware
const path = require("path");
const multer = require("multer");

const uploadsDir = path.join(__dirname, "..", "uploads");
const MAX_SIZE = 15 * 1024 * 1024; // 15MB
const MAX_FILES = 10;

// File storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, "_");
    const unique = Math.random().toString(36).slice(2, 9).toUpperCase();
    cb(null, `${Date.now()}-${unique}-${base}${ext}`);
  },
});

// File type filter
const fileFilter = (_req, file, cb) => {
  const isPdf = file.mimetype === "application/pdf";
  const isImage = file.mimetype.startsWith("image/");
  
  if (!isPdf && !isImage) {
    return cb(new Error("Only PDF and image files allowed"));
  }
  cb(null, true);
};

// Single file upload
const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE, files: 1 },
  fileFilter,
});

// Multiple files upload
const uploadMultiple = multer({
  storage,
  limits: { fileSize: MAX_SIZE, files: MAX_FILES },
  fileFilter,
});

module.exports = { upload, uploadMultiple };

