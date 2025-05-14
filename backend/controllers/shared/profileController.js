const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");

const uploadProfilePicture = require("../../utils/Cloudinary/uploadProfilePicture");

exports.uploadUserProfilePhoto = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const imageUrl = await uploadProfilePicture(req.file);
  user.profilePicture = imageUrl;
  await user.save();

  res.status(200).json({ message: "Profile photo uploaded", photo: imageUrl });
};

// ✅ Change password (manual bcrypt hash like admin flow)
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  if (!user) throw createError(404, "User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw createError(400, "Current password is incorrect");

  if (!newPassword || !newPassword.trim()) {
    throw createError(400, "New password is required");
  }

  const hashed = await bcrypt.hash(newPassword.trim(), 10);
  user.password = hashed;

  await user.save();

  res.json({ message: "Password updated successfully" });
};


// Update profile (name, phone, profilePicture)
exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, phone, profilePicture } = req.body;

  // Optional validation
  if (!name || !name.trim()) {
    res.status(400);
    throw new Error("Name is required");
  }

  user.name = name.trim();
  user.phone = phone?.trim() || '';
  if (profilePicture) user.profilePicture = profilePicture;

  await user.save();

  res.status(200).json({ message: "Profile updated", user });
};
