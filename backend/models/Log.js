const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, index: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    time: { type: Date, default: () => new Date(), index: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Log", logSchema);

