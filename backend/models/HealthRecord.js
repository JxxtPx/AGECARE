const mongoose = require("mongoose");

const healthRecordSchema = new mongoose.Schema({
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
    required: true
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["Medication", "Assessment", "Vitals", "Diagnosis", "Note", "Other"],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model("HealthRecord", healthRecordSchema);
