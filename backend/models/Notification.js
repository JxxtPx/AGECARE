const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  link: {
    type: String, // e.g., "/resident/profile" or "/tasks/123"
    default: ""
  },
  type: {
    type: String,
    enum: ["system", "task", "shift", "note", "visit", "file", "alert"],
    default: "system"
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
