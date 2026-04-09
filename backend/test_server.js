const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const statsController = require('./controllers/statsController');

const app = express();

// Enable CORS for testing
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

app.use(express.json());

// Mock admin middleware for testing
const mockAuthMiddleware = (req, res, next) => {
  req.user = { id: 'test_admin_id', role: 'admin' };
  next();
};

const mockRequireRole = (role) => (req, res, next) => {
  if (req.user && req.user.role === role) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied' });
  }
};

// Test routes
app.get('/api/stats', mockAuthMiddleware, mockRequireRole('admin'), statsController.getStats);
app.get('/api/stats/charts', mockAuthMiddleware, mockRequireRole('admin'), statsController.getCharts);
app.get('/api/prints/history', mockAuthMiddleware, mockRequireRole('admin'), statsController.getPrintHistory);

// Test endpoint to check server status
app.get('/test', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 5001;

(async () => {
  try {
    await connectDB();
    console.log('Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Test server running on port ${PORT}`);
      console.log(`Test endpoints:`);
      console.log(`  - GET http://localhost:${PORT}/test`);
      console.log(`  - GET http://localhost:${PORT}/api/prints/history`);
      console.log(`  - GET http://localhost:${PORT}/api/stats/charts`);
      console.log(`  - GET http://localhost:${PORT}/api/stats`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
