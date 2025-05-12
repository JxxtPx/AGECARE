const ShiftNote = require("../../models/ShiftNote");
const createError = require("http-errors");

// ➤ Get all shift notes for a specific resident
exports.getShiftNotesByResident = async (req, res) => {
  const residentId = req.params.residentId;

  const notes = await ShiftNote.find({ resident: residentId })
    .populate("user", "name role")
    .populate("shift", "date startTime endTime")
    .sort({ createdAt: -1 });

  res.json(notes);
};

// ➤ Flag or unflag a shift note with optional comment (coordinator only)
exports.flagNoteWithComment = async (req, res) => {
  const note = await ShiftNote.findById(req.params.id);
  if (!note) throw createError(404, "Note not found");

  if (req.user.role !== "coordinator") {
    throw createError(403, "Access denied");
  }

  const { isFlagged, flagComment } = req.body;

  note.isFlagged = isFlagged;
  note.flagComment = isFlagged ? flagComment || "" : ""; // clear comment if unflagging

  const updated = await note.save();

  res.json({
    message: isFlagged ? "Note flagged" : "Note unflagged",
    note: updated,
  });
};
