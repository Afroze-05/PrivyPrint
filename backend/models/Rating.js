const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true 
    },
    jobId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Document", 
      required: true,
      index: true 
    },
    rating: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer between 1 and 5'
      }
    },
    feedback: { 
      type: String, 
      trim: true,
      maxlength: 500 
    },
    timestamp: { 
      type: Date, 
      default: () => new Date(),
      index: true 
    }
  },
  { 
    timestamps: true,
    versionKey: false 
  }
);

// Ensure one rating per user per document
ratingSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
