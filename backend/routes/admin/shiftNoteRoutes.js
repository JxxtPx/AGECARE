const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../../middleware/authMiddleware");
const { getAllResidentNotes } = require("../../controllers/admin/shiftNoteController");
const asyncHandler = require("../../middleware/asyncHandler");

router.get("/:residentId", protect, adminOnly, asyncHandler(getAllResidentNotes));
module.exports = router;
