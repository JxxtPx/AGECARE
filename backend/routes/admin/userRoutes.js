const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../../controllers/admin/userController");
const { protect, adminOnly } = require("../../middleware/authMiddleware");
const asyncHandler = require("../../middleware/asyncHandler");

router.get("/", protect, adminOnly, asyncHandler(getUsers));
router.post("/", protect, adminOnly, asyncHandler(createUser));
router.put("/:id", protect,adminOnly, asyncHandler(updateUser)); // ✅ NEW
router.delete("/:id",protect,adminOnly, asyncHandler(deleteUser));

module.exports = router;
