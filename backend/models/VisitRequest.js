const mongoose = require("mongoose");

const visitRequestSchema = new mongoose.Schema({
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // role: 'family'
    required: true
  },
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
    required: true
  },
  visitDate: {
    type: Date,
    required: true
  },
  visitTime: {
    type: String, // e.g., "10:30 AM"
    required: true
  },
  reason: {
    type: String
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("VisitRequest", visitRequestSchema);
