const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authMiddleware } = require('../middleware/authMiddleware');

// POST /api/rate - Submit rating (authenticated users)
router.post('/', authMiddleware, ratingController.submitRating);

// GET /api/rate - Handle rating from email link (no auth required)
router.get('/', ratingController.handleEmailRating);

// GET /api/rate/stats - Get rating statistics (admin only)
router.get('/stats', authMiddleware, ratingController.getRatingStats);

// GET /api/rate/all - Get all ratings with pagination (admin only)
router.get('/all', authMiddleware, ratingController.getAllRatings);

// GET /api/rate/reviews - Get all ratings with details for review log (admin only)
router.get('/reviews', authMiddleware, ratingController.getAllRatingsWithDetails);

// GET /api/rate/:jobId - Get rating for specific job (admin only)
router.get('/:jobId', authMiddleware, ratingController.getJobRating);

module.exports = router;
