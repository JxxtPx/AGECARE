const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");
const createError = require("http-errors"); // ✅ Added clean error handling

// ✅ LOGIN
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, "Invalid email or password");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw createError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw createError(403, "Account disabled");
  }

  const token = generateToken(user._id, user.role);
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture || null // ✅ add this
    }
  });
};

// ✅ SET INITIAL PASSWORD (for resident/family first login)
exports.setPassword = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, "User not found");
  }

  if (user.isPasswordSet) {
    throw createError(400, "Password already set. Please login normally.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.isPasswordSet = true;

  await user.save();
  res.json({ message: "Password set successfully. You can now login." });
};
