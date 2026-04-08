const mongoose = require("mongoose");

const VOICE_STATUSES = ["pending", "verified", "rejected"];
const VOICE_TYPES = ["print_request", "verification"];

const voiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true
    },
    token: { 
      type: String, 
      required: [true, "Token is required"],
      trim: true,
      minlength: [3, "Token must be at least 3 characters"],
      maxlength: [50, "Token cannot exceed 50 characters"],
      index: true 
    },
    transcript: { 
      type: String, 
      default: "",
      maxlength: [1000, "Transcript cannot exceed 1000 characters"]
    },
    audioFile: {
      filename: { type: String, maxlength: [255, "Filename cannot exceed 255 characters"] },
      originalName: { type: String, maxlength: [255, "Original filename cannot exceed 255 characters"] },
      path: { type: String, maxlength: [500, "File path cannot exceed 500 characters"] },
      size: { 
        type: Number, 
        min: [0, "File size cannot be negative"],
        max: [50 * 1024 * 1024, "File size cannot exceed 50MB"] // 50MB limit
      },
      mimetype: { 
        type: String, 
        enum: {
          values: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/webm'],
          message: 'Invalid audio file type'
        }
      }
    },
    status: { 
      type: String, 
      enum: {
        values: VOICE_STATUSES,
        message: 'Invalid voice status'
      },
      default: "pending",
      index: true
    },
    type: {
      type: String,
      enum: {
        values: VOICE_TYPES,
        message: 'Invalid voice type'
      },
      default: "print_request"
    },
    verificationResult: {
      verified: { type: Boolean, default: false },
      verifiedAt: { type: Date },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    },
    requestedAt: { 
      type: Date, 
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Add validation for verification result
voiceSchema.pre('save', function(next) {
  if (this.status === 'verified' && !this.verificationResult.verified) {
    this.verificationResult.verified = true;
    this.verificationResult.verifiedAt = new Date();
  }
  next();
});

// Index for efficient queries
voiceSchema.index({ user: 1, requestedAt: -1 });
voiceSchema.index({ token: 1, status: 1 });
voiceSchema.index({ status: 1, requestedAt: -1 });

module.exports = mongoose.model("Voice", voiceSchema);
