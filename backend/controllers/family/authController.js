const User = require("../../models/User");
const Family = require("../../models/Family");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");

// ➤ Family Registration
exports.registerFamily = async (req, res) => {
  const { name, email, password, requestMessage } = req.body;

  if (!name || !email || !password) {
    throw createError(400, "All fields are required");
  }

  const existing = await User.findOne({ email });
  if (existing) throw createError(400, "Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "family",
  });

  await Family.create({
    user: user._id,
    status: "pending",
    requestMessage,
  });

  res.status(201).json({
    message: "Signup successful. Awaiting admin verification.",
  });
};
