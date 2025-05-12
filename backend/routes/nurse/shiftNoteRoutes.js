const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const {
  createNurseShiftNote,
  getNurseNotesByShift
} = require("../../controllers/nurse/shiftNoteController");
const asyncHandler = require("../../middleware/asyncHandler");


// ➤ POST a new shift note
router.post("/", protect, asyncHandler(createNurseShiftNote));

// ➤ GET all notes for a shift
router.get("/:shiftId", protect, asyncHandler(getNurseNotesByShift));

module.exports = router;
