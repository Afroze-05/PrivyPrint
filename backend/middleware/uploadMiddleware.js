const path = require("path");
const multer = require("multer");

const uploadsDir = path.join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, "_");
    const unique = Math.random().toString(36).slice(2, 9).toUpperCase();
    cb(null, `${Date.now()}-${unique}-${base}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const mimetype = file.mimetype;
  const isPdf = mimetype === "application/pdf";
  const isImage = mimetype && mimetype.startsWith("image/");
  if (!isPdf && !isImage) {
    return cb(new Error("Only PDF and image files are allowed."));
  }
  return cb(null, true);
};

// Handles a single file field named `file`.
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter,
});

// Handles multiple files field named `files`.
const uploadMultiple = multer({
  storage,
  limits: { 
    fileSize: 15 * 1024 * 1024, // 15MB per file
    files: 10 // Maximum 10 files at once
  },
  fileFilter,
});

module.exports = { upload, uploadMultiple };

