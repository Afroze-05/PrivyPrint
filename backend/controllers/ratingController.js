const Rating = require("../models/Rating");
const Document = require("../models/Document");
const User = require("../models/User");

// Submit rating for a print job
async function submitRating(req, res) {
  try {
    const { jobId, rating, feedback } = req.body;

    // Validate required fields
    if (!jobId || !rating) {
      return res.status(400).json({ 
        message: "jobId and rating are required" 
      });
    }

    // Validate rating range
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: "Rating must be an integer between 1 and 5" 
      });
    }

    // Verify the document exists and is completed
    const mongoose = require('mongoose');
    const document = await Document.findById(mongoose.Types.ObjectId.isValid(jobId) ? jobId : null).populate('userId');
    if (!document) {
      return res.status(404).json({ 
        message: "Print job not found" 
      });
    }

    if (document.status !== "completed") {
      return res.status(400).json({ 
        message: "Can only rate completed print jobs" 
      });
    }

    // Check if user has already rated this job
    const existingRating = await Rating.findOne({
      userId: req.user.id,
      jobId: jobId
    });

    if (existingRating) {
      return res.status(409).json({ 
        message: "You have already rated this print job" 
      });
    }

    // Create new rating
    const newRating = await Rating.create({
      userId: req.user.id,
      jobId: jobId,
      rating: rating,
      feedback: feedback || ""
    });

    // Update user's trust score (simple average of all ratings)
    await updateUserTrustScore(req.user.id);

    console.log(`⭐ New rating submitted: User ${req.user.id} rated job ${jobId} with ${rating} stars`);

    return res.status(201).json({
      message: "Rating submitted successfully",
      rating: {
        id: newRating._id,
        rating: newRating.rating,
        feedback: newRating.feedback,
        timestamp: newRating.timestamp
      }
    });

  } catch (error) {
    console.error('❌ Error submitting rating:', error);
    return res.status(500).json({ 
      message: "Failed to submit rating", 
      error: error.message 
    });
  }
}

// Get rating for a specific job
async function getJobRating(req, res) {
  try {
    const { jobId } = req.params;

    const rating = await Rating.findOne({ jobId })
      .populate('userId', 'name email')
      .lean();

    if (!rating) {
      return res.status(404).json({ 
        message: "No rating found for this job" 
      });
    }

    return res.status(200).json(rating);

  } catch (error) {
    console.error('❌ Error fetching job rating:', error);
    return res.status(500).json({ 
      message: "Failed to fetch rating", 
      error: error.message 
    });
  }
}

// Get all ratings with pagination
async function getAllRatings(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const ratings = await Rating.find({})
      .populate('userId', 'name email')
      .populate('jobId', 'token type copies createdAt')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Rating.countDocuments();

    return res.status(200).json({
      ratings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching ratings:', error);
    return res.status(500).json({ 
      message: "Failed to fetch ratings", 
      error: error.message 
    });
  }
}

// Get rating statistics and trust score
async function getRatingStats(req, res) {
  try {
    const stats = await Rating.aggregate([
      {
        $group: {
          _id: null,
          totalRatings: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          ratingDistribution: {
            $push: "$rating"
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.status(200).json({
        totalRatings: 0,
        averageRating: 0,
        trustScore: 100, // Default trust score
        ratingDistribution: {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        }
      });
    }

    const result = stats[0];
    
    // Calculate distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    result.ratingDistribution.forEach(rating => {
      distribution[rating] = (distribution[rating] || 0) + 1;
    });

    // Calculate trust score (0-1000 scale)
    const trustScore = Math.round((result.averageRating / 5) * 1000);

    return res.status(200).json({
      totalRatings: result.totalRatings,
      averageRating: Math.round(result.averageRating * 10) / 10,
      trustScore,
      ratingDistribution: distribution
    });

  } catch (error) {
    console.error('❌ Error fetching rating stats:', error);
    return res.status(500).json({ 
      message: "Failed to fetch rating statistics", 
      error: error.message 
    });
  }
}

// Update user's trust score based on their ratings
async function updateUserTrustScore(userId) {
  try {
    const userRatings = await Rating.find({ userId });
    
    if (userRatings.length === 0) {
      return;
    }

    const averageRating = userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;
    const trustScore = Math.round((averageRating / 5) * 1000);

    await User.findByIdAndUpdate(userId, { trustScore });
    
    console.log(`📊 Updated trust score for user ${userId}: ${trustScore}`);
  } catch (error) {
    console.error('❌ Error updating user trust score:', error);
  }
}

// Handle rating from email link (GET request)
async function handleEmailRating(req, res) {
  try {
    console.log('🔍 Email Rating Debug - Full URL:', req.originalUrl);
    console.log('🔍 Email Rating Debug - URL parsed:', req.url);
    console.log('🔍 Email Rating Debug - Query string:', req.querystring);
    console.log('🔍 Email Rating Debug - Query params:', req.query);
    console.log('🔍 Email Rating Debug - All params:', req.params);
    console.log('🔍 Email Rating Debug - Raw headers:', req.headers);
    
    // Parse query parameters manually if needed
    let jobId, rating;
    
    // Try multiple parsing methods
    if (req.query.jobId) {
      jobId = req.query.jobId;
    } else if (req.url) {
      // Manual URL parsing
      const urlParts = req.url.split('?');
      if (urlParts.length > 1) {
        const queryString = urlParts[1];
        const params = new URLSearchParams(queryString);
        jobId = params.get('jobId');
        rating = params.get('rating');
      }
    }
    
    console.log('🔍 Email Rating Debug - Parsed jobId:', jobId);
    console.log('🔍 Email Rating Debug - Parsed rating:', rating);

    if (!jobId || !rating) {
      return res.status(400).json({ 
        message: "jobId and rating are required" 
      });
    }

    const ratingValue = parseInt(rating);
    if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ 
        message: "Invalid rating value" 
      });
    }

    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ 
        message: "Invalid job ID format" 
      });
    }
    
    const document = await Document.findById(jobId).populate('userId');
    if (!document) {
      return res.status(404).json({ 
        message: "Print job not found" 
      });
    }

    if (document.status !== "completed") {
      return res.status(400).json({ 
        message: "Can only rate completed print jobs" 
      });
    }

    // Check if already rated
    const existingRating = await Rating.findOne({
      userId: document.userId._id,
      jobId: jobId
    });

    if (existingRating) {
      return res.status(409).json({ 
        message: "You have already rated this print job" 
      });
    }

    // Create rating
    await Rating.create({
      userId: document.userId._id,
      jobId: jobId,
      rating: ratingValue
    });

    // Update trust score
    await updateUserTrustScore(document.userId._id);

    console.log(`⭐ Email rating submitted: User ${document.userId._id} rated job ${jobId} with ${ratingValue} stars`);

    // Redirect to a thank you page or return success
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    return res.redirect(302, `${frontendUrl}/rating-thank-you?rating=${ratingValue}`);

  } catch (error) {
    console.error('❌ Error handling email rating:', error);
    return res.status(500).json({ 
      message: "Failed to submit rating", 
      error: error.message 
    });
  }
}

// Get all ratings with user and document details (for admin review log)
async function getAllRatingsWithDetails(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const ratings = await Rating.find({})
      .populate('userId', 'name email')
      .populate('jobId', 'token type copies createdAt')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Rating.countDocuments();

    return res.status(200).json({
      ratings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching ratings with details:', error);
    return res.status(500).json({ 
      message: "Failed to fetch ratings", 
      error: error.message 
    });
  }
}

module.exports = {
  submitRating,
  getJobRating,
  getAllRatings,
  getRatingStats,
  handleEmailRating,
  updateUserTrustScore,
  getAllRatingsWithDetails
};
