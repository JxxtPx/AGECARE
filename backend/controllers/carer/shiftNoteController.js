const ShiftNote = require("../../models/ShiftNote");
const createError = require("http-errors");

// ➤ POST /api/carer/shiftnotes
exports.createCarerShiftNote = async (req, res) => {
  const { shift, resident, note } = req.body;

  if (req.user.role !== "carer") {
    throw createError(403, "Access denied: Not a carer");
  }

  if (!shift || !resident || !note) {
    throw createError(400, "All fields (shift, resident, note) are required");
  }

  const newNote = new ShiftNote({
    shift,
    resident,
    note,
    user: req.user._id,
    role: "carer",
  });

  const saved = await newNote.save();
  res.status(201).json({ message: "Shift note added", note: saved });
};

// ➤ GET /api/carer/shiftnotes/:shiftId
exports.getCarerNotesByShift = async (req, res) => {
  const { shiftId } = req.params;

  const notes = await ShiftNote.find({
    shift: shiftId,
    role: "carer",
  })
    .populate("user", "name email")
    .populate("resident", "fullName");

  if (!notes || notes.length === 0) {
    throw createError(404, "No notes found for this shift");
  }

  res.json(notes);
};
