const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String, // e.g., "15:00"
    required: true
  },
  endTime: {
    type: String, // e.g., "15:30"
    required: true
  },
  actualStartTime: {
    type: String, // Optional: use Date if you want full datetime format
    default: null
  },
  actualEndTime: {
    type: String,
    default: null
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident"
  },
  type: {
    type: String,
    enum: ["Personal Care", "Medication", "Meal", "Check-in", "General"],
    default: "General"
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Missed"],
    default: "Scheduled"
  },
  duration: {
    type: String,
    default: null
  }
  
}, { timestamps: true });

module.exports = mongoose.model("Shift", shiftSchema);
