const ShiftNote = require("../../models/ShiftNote");
const createError = require("http-errors");

// ➤ POST /api/nurse/shiftnotes
exports.createNurseShiftNote = async (req, res) => {
  const { shift, resident, note } = req.body;

  if (req.user.role !== "nurse") {
    throw createError(403, "Access denied: Not a nurse");
  }

  const newNote = new ShiftNote({
    shift,
    resident,
    note,
    user: req.user._id,
    role: "nurse",
  });

  const saved = await newNote.save();
  res.status(201).json({ message: "Shift note added", note: saved });
};

// ➤ GET /api/nurse/shiftnotes/:shiftId
exports.getNurseNotesByShift = async (req, res) => {
  const { shiftId } = req.params;

  const notes = await ShiftNote.find({
    shift: shiftId,
    role: "nurse",
  })
    .populate("user", "name email")
    .populate("resident", "fullName");

  res.json(notes);
};
