const mongoose = require("mongoose");

const careFormTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin
  rolesAllowed: [{ type: String, enum: ["admin", "carer", "nurse"] }],
  assignedResidents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resident" }],
  questions: [
    {
      questionText: String,
      type: { type: String, enum: ["text", "textarea", "checkbox", "radio", "select"] },
      options: [String],
      isRequired: { type: Boolean, default: false },
      answerText: String // ⬅️ NEW field to hold the answer filled by admin
    }
  ]
  
}, { timestamps: true });

module.exports = mongoose.model("CareFormTemplate", careFormTemplateSchema);