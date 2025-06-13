// const express = require("express");
// const Shift = require("../../models/Shift");
// const router = express.Router();
// const { protect } = require("../../middleware/authMiddleware");
// const {
//   createCarerShiftNote,
//   getCarerNotesByShift
// } = require("../../controllers/carer/shiftNoteController");

// const asyncHandler = require("../../middleware/asyncHandler");
// const ShiftNote = require("../../models/ShiftNote");

// // ➤ POST a new shift note
// // router.post("/", protect, asyncHandler(createCarerShiftNote));
// router.post("/shift/:id/notes", protect, asyncHandler(async (req, res) => {
//   const shift = await Shift.findById(req.params.id);
//   if (!shift) throw createError(404, "Shift not found");

//   req.body.shift = shift._id;
//   req.body.resident = shift.resident;

//   return createCarerShiftNote(req, res);
// }));


// // ➤ GET all notes for a shift
// router.get("/:shiftId", protect, asyncHandler(getCarerNotesByShift));

// module.exports = router;


const express = require("express");
const router = express.Router();
const Shift = require("../../models/Shift");
const { protect } = require("../../middleware/authMiddleware");
const {
  createCarerShiftNote,
  getCarerNotesByResident
} = require("../../controllers/carer/shiftNoteController");
const asyncHandler = require("../../middleware/asyncHandler");
const createError = require("http-errors");

// ➤ POST a new note (shift-based, auto-links resident)
router.post("/shift/:id/notes", protect, asyncHandler(async (req, res) => {
  const shift = await Shift.findById(req.params.id);
  if (!shift) throw createError(404, "Shift not found");

  req.body.shift = shift._id;
  req.body.resident = shift.resident;

  return createCarerShiftNote(req, res);
}));
router.post("/resident/:residentId", protect, asyncHandler(createCarerShiftNote));


// ➤ GET all notes for a resident (resident-wide visibility)
router.get("/resident/:residentId", protect, asyncHandler(getCarerNotesByResident));

module.exports = router;

