const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, index: true },
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    printType: { type: String, enum: ["B/W", "Color"], required: true },
    pages: { type: Number, required: true, min: 1 },
    copies: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    time: { type: Date, default: () => new Date(), index: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Log", logSchema);

