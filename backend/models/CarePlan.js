const mongoose = require("mongoose");

const carePlanSchema = new mongoose.Schema({
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
    required: true
  },
  entries: [
    {
      title: {
        type: String,
        required: true
      },
      details: {
        type: String,
        required: true
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("CarePlan", carePlanSchema);
