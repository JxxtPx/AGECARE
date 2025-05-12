const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ["pdf", "image", "doc", "other"],
    default: "other"
  },
  url: {
    type: String,
    required: true
  },
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  rolesAllowed: {
    type: [String], // e.g., ["admin", "nurse", "coordinator"]
    default: ["admin"]
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model("File", fileSchema);
