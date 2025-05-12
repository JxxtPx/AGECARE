const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["General", "Medical", "Room", "Complaint", "Other"],
    default: "General"
  },
  status: {
    type: String,
    enum: ["open", "resolved", "pending"],
    default: "open"
  },
  response: {
    type: String // optional admin response
  }
}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
