const Family = require("../../models/Family");
const ShiftNote = require("../../models/ShiftNote");
const createError = require("http-errors");

// ➤ Family can view notes of their approved resident
exports.getResidentNotesForFamily = async (req, res) => {
  const family = await Family.findOne({ user: req.user._id });

  if (!family || family.status !== "approved") {
    throw createError(403, "Access denied");
  }

  if (!family.resident) {
    throw createError(404, "No resident linked to your account");
  }

  const notes = await ShiftNote.find({ resident: family.resident })
    .populate("user", "name role")
    .populate("shift", "date startTime endTime")
    .sort({ createdAt: -1 });

  res.json(notes);
};
