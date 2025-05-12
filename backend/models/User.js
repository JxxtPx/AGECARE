const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true},
    phone: { type: String },
    role: {
      type: String,
      enum: ["admin", "coordinator", "nurse", "carer", "resident", "family"],
      required: true,
    },
    profilePicture: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    isPasswordSet: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
