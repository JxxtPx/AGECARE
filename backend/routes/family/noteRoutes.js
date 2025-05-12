const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const { getResidentNotesForFamily } = require("../../controllers/family/noteController");
const asyncHandler = require("../../middleware/asyncHandler");


router.get("/", protect, asyncHandler(getResidentNotesForFamily));

module.exports = router;
