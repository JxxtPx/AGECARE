const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const {
  createCarerShiftNote,
  getCarerNotesByShift
} = require("../../controllers/carer/shiftNoteController");

const asyncHandler = require("../../middleware/asyncHandler");

// ➤ POST a new shift note
router.post("/", protect, asyncHandler(createCarerShiftNote));

// ➤ GET all notes for a shift
router.get("/:shiftId", protect, asyncHandler(getCarerNotesByShift));

module.exports = router;
