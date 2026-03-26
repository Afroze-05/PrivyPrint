const mongoose = require("mongoose");

const ALERT_TYPES = ["mobile_detected", "multiple_faces"];

const alertSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ALERT_TYPES, required: true, index: true },
    token: { type: String, required: true, index: true },
    timestamp: { type: Date, default: () => new Date(), index: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Alert", alertSchema);

