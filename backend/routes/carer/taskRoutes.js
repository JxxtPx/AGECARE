const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const { updateTaskStatus } = require("../../controllers/carer/taskController");

const asyncHandler = require("../../middleware/asyncHandler");
router.put("/:id", protect, asyncHandler(updateTaskStatus));

module.exports = router;
