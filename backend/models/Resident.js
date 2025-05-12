const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  fullName: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  dateOfBirth: { type: Date },
  contactInfo: {
    phone: String,
    email: String,
    address: String,
  },
  emergencyContacts: [{
    name: String,
    relation: String,
    phone: String,
    email: String
  }],
  allergies: [String],
  dietaryPreferences: String,
  medicalConditions: [
    {
      bodyPart: { type: String, required: true },
      note: { type: String }
    }
  ],
  medicalHistory: { type: String }, // optional: general notes
  
  roomNumber: String,
  photo: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Resident", residentSchema);
