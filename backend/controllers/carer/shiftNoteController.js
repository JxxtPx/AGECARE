// const ShiftNote = require("../../models/ShiftNote");
// const createError = require("http-errors");

// // ➤ POST /api/carer/shiftnotes
// exports.createCarerShiftNote = async (req, res) => {
//   const { shift, resident, note, category } = req.body;

//   if (req.user.role !== "carer") {
//     throw createError(403, "Access denied: Not a carer");
//   }

//   if (!shift || !resident || !note || !category) {
//     throw createError(400, "Fields shift, resident, note, and category are required");
//   }

//   const newNote = new ShiftNote({
//     shift,
//     resident,
//     note,
//     category,
//     user: req.user._id,
//     role: "carer"
//   });

//   const saved = await newNote.save();
// await saved.populate("user", "name role");

//   res.status(201).json(saved);
// };


// // ➤ GET /api/carer/shiftnotes/:shiftId
// exports.getCarerNotesByShift = async (req, res) => {
//   const { shiftId } = req.params;

//   const notes = await ShiftNote.find({
//     shift: shiftId,
//     role: "carer",
//   })
//     .populate("user", "name email")
//     .populate("resident", "fullName");

//   if (!notes || notes.length === 0) {
//     throw createError(404, "No notes found for this shift");
//   }

//   res.json(notes);
// };


const ShiftNote = require("../../models/ShiftNote");
const createError = require("http-errors");

// ➤ POST /api/carer/shiftnotes/resident/:residentId
exports.createCarerShiftNote = async (req, res) => {
  const residentId = req.params.residentId;
  const { shift, note, category, isFlagged, flagComment } = req.body;

  if (req.user.role !== "carer") {
    throw createError(403, "Access denied: Not a carer");
  }

  if (!shift || !note || !category) {
    throw createError(400, "Missing required fields: shift, note, category");
  }

  const newNote = new ShiftNote({
    shift,
    resident: residentId,
    note,
    category,
    user: req.user._id,
    role: "carer",
    isFlagged: Boolean(isFlagged),
    flagComment: isFlagged ? flagComment : undefined,
  });

  await newNote.save();

  const populatedNote = await ShiftNote.findById(newNote._id).populate("user", "name role");
  res.status(201).json(populatedNote);
};

// ➤ GET /api/carer/shiftnotes/resident/:residentId
exports.getCarerNotesByResident = async (req, res) => {
  const { residentId } = req.params;

  const notes = await ShiftNote.find({
    resident: residentId,
    role: "carer"
  })
    .populate("user", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json(notes);
};
