const mongoose = require("mongoose");

const carePlanSchema = new mongoose.Schema({
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Coordinator
    required: true
  },
  goals: {
    type: [String],
    default: []
  },
  risks: {
    type: [String],
    default: []
  },
  notes: {
    type: String,
    default: ""
  },
  nextReviewDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("CarePlan", carePlanSchema);
