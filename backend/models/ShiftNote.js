const mongoose = require("mongoose");

const shiftNoteSchema = new mongoose.Schema({
  shift: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shift",
    required: true
  },
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // nurse or carer
    required: true
  },
  role: {
    type: String,
    enum: ["carer", "nurse"],
    required: true
  },
  note: {
    type: String,
    required: true
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  flagComment: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("ShiftNote", shiftNoteSchema);
