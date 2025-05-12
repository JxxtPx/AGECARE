const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  role: {
    type: String,
    enum: ["carer", "nurse", "resident"],
    required: true
  },
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident"
  },
  shift: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shift"
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open"
  }
}, { timestamps: true });

module.exports = mongoose.model("Incident", incidentSchema);
