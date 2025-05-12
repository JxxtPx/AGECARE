const ShiftNote = require("../../models/ShiftNote");

exports.getAllResidentNotes = async (req, res) => {
  const { residentId } = req.params;

  const notes = await ShiftNote.find({ resident: residentId })
    .populate("user", "name role")
    .populate("shift", "date startTime endTime")
    .sort({ createdAt: -1 });

  if (!notes.length) {
    res.status(404);
    throw new Error("No notes found for this resident");
  }

  res.json(notes);
};