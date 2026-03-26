const mongoose = require("mongoose");

const DOCUMENT_TYPES = ["B/W", "Color"];
const DOCUMENT_STATUSES = ["waiting", "printing", "completed", "expired"];

const documentSchema = new mongoose.Schema(
  {
    fileUrl: { type: String, required: true },
    token: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: DOCUMENT_TYPES, required: true },
    copies: { type: Number, default: 1, min: 1 },
    status: { type: String, enum: DOCUMENT_STATUSES, default: "waiting", index: true },
    expiresAt: { type: Date, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Document", documentSchema);

