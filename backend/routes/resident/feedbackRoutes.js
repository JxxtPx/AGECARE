const express = require("express");
const router = express.Router();
const { protect, residentOnly } = require("../../middleware/authMiddleware");
const { submitFeedback } = require("../../controllers/resident/feedbackController");
const asyncHandler = require("../../middleware/asyncHandler");


router.post("/", protect, residentOnly, asyncHandler(submitFeedback));

module.exports = router;
