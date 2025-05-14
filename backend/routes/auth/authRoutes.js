const express = require("express");
const router = express.Router();

const {
  loginUser,
  setPassword,
  getMe,
} = require("../../controllers/auth/authController");

const asyncHandler = require("../../middleware/asyncHandler");
const { protect } = require("../../middleware/authMiddleware");

// Routes
router.post("/login", asyncHandler(loginUser));
router.put("/set-password", asyncHandler(setPassword));
router.get("/me", protect, asyncHandler(getMe)); // ✅ This supports removing localStorage

module.exports = router;
