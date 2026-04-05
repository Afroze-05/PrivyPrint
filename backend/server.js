const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const alertRoutes = require("./routes/alertRoutes");
const statsRoutes = require("./routes/statsRoutes");
const logsRoutes = require("./routes/logsRoutes");
const testRoutes = require("./routes/testRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"], // Allow your Vite frontend
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files with proper headers
app.use("/uploads", (req, res, next) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Cache control for static files
  res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour cache
  
  next();
}, express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Test route directly in server.js
app.post("/api/direct-test", (req, res) => {
  console.log('🔧 direct-test route called');
  res.json({ message: "Direct test works" });
});

// Test route for API connectivity verification
app.post("/api/test-route", (req, res) => {
  console.log('🔧 test-route called');
  res.json({ message: "API working" });
});


// Routes
console.log("🔧 Registering routes...");
try {
  const authRoutes = require("./routes/authRoutes");
  const documentRoutes = require("./routes/documentRoutes");
  const alertRoutes = require("./routes/alertRoutes");
  const statsRoutes = require("./routes/statsRoutes");
  const logsRoutes = require("./routes/logsRoutes");
  const testRoutes = require("./routes/testRoutes");
  const adminRoutes = require("./routes/adminRoutes");
  
  app.use("/api/auth", authRoutes);
  app.use("/api", documentRoutes);
  app.use("/api", alertRoutes);
  app.use("/api", statsRoutes);
  app.use("/api", logsRoutes);
  app.use("/api/test", testRoutes);
  app.use("/api", adminRoutes);
  console.log("🔧 All routes registered");
} catch (error) {
  console.error("❌ Error loading routes:", error);
}

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Central error handler
app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res
    .status(500)
    .json({ message: "Internal server error.", error: err.message });
});

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`SecurePrint backend listening on port ${PORT}`);
  });
})();
