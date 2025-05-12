const CarePlan = require("../../models/CarePlan");
const Shift = require("../../models/Shift");
const ShiftNote = require("../../models/ShiftNote");
const File = require("../../models/File");
const Resident = require("../../models/Resident");
const createError = require("http-errors");

// ✅ GET /api/resident/profile
exports.getResidentProfile = async (req, res) => {
  const { name, email, role, createdAt } = req.user;

  res.json({
    name,
    email,
    role,
    joined: createdAt,
  });
};

// ✅ GET /api/resident/careplan
exports.getMyCarePlan = async (req, res) => {
  const residentId = req.user._id;

  const carePlan = await CarePlan.findOne({ resident: residentId })
    .populate("createdBy", "name email role");

  if (!carePlan) {
    throw createError(404, "No care plan found");
  }

  res.json(carePlan);
};

// ✅ GET /api/resident/shifts
exports.getResidentShifts = async (req, res) => {
  const residentId = req.user._id;

  const shifts = await Shift.find({ resident: residentId })
    .populate("assignedTo", "name role")
    .sort({ date: -1, startTime: 1 });

  res.json(shifts);
};

// ✅ GET /api/resident/notes
exports.getResidentNotes = async (req, res) => {
  const residentId = req.user._id;

  const notes = await ShiftNote.find({ resident: residentId })
    .populate("user", "name role")
    .populate("shift", "date startTime endTime")
    .sort({ createdAt: -1 });

  res.json(notes);
};

// ✅ GET /api/resident/files
exports.getResidentFiles = async (req, res) => {
  const residentProfile = await Resident.findOne({ user: req.user._id });

  if (!residentProfile) {
    throw createError(404, "Resident profile not found");
  }

  const files = await File.find({
    resident: residentProfile._id,
    rolesAllowed: { $in: ["resident"] },
  }).populate("uploadedBy", "name role");

  res.json(files);
};
