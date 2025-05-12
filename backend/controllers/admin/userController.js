const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");

// ✅ GET all users (admin only)
exports.getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// ✅ CREATE new user
exports.createUser = async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  if (!name || !email || !password || !role) {
    throw createError(400, "All fields are required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw createError(400, "Email already exists");
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashed,
    role,
    phone // ✅ Save phone if provided
  });

  await newUser.save();

  res.status(201).json({
    message: "User created",
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone
    }
  });
};

// ✅ UPDATE user
exports.updateUser = async (req, res) => {
  const { name, email, role, isActive, phone, password } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) throw createError(404, "User not found");

  user.name = name ?? user.name;
  user.email = email ?? user.email;
  user.role = role ?? user.role;
  user.isActive = isActive !== undefined ? isActive : user.isActive;
  user.phone = phone ?? user.phone;

  // ✅ Update password only if provided
  if (password && password.trim()) {
    const hashed = await bcrypt.hash(password.trim(), 10);
    user.password = hashed;
  }

  const updated = await user.save();

  res.json({
    message: "User updated",
    user: {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      isActive: updated.isActive,
      phone: updated.phone
    }
  });
};

// ✅ DELETE user
exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw createError(404, "User not found");

  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
};
