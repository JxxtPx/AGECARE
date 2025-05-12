const mongoose = require("mongoose");

const familySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident"
    // Optional at first, set by admin after verification
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  relation: {
    type: String,
    default: "family"
  },
  requestMessage: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Family", familySchema);
