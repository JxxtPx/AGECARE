const Shift = require("../../models/Shift");
const createError = require("http-errors");

// ➤ Get assigned upcoming shifts for nurse
exports.getAssignedShifts = async (req, res) => {
  const { userId } = req.params;

  if (req.user.role !== "nurse") {
    throw createError(403, "Access denied: Not a nurse");
  }
  if (req.user._id.toString() !== userId) {
    throw createError(403, "Access denied: ID mismatch");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const shifts = await Shift.find({
    assignedTo: userId,
    date: { $gte: today },
  })
    .populate("resident", "fullName roomNumber")
    .sort({ date: 1, startTime: 1 });

  res.json(shifts);
};

// ➤ Start a shift
exports.startShift = async (req, res) => {
  const shift = await Shift.findById(req.params.id);

  if (!shift) throw createError(404, "Shift not found");

  if (req.user.role !== "nurse") {
    throw createError(403, "Access denied: Not a nurse");
  }

  if (shift.assignedTo.toString() !== req.user._id.toString()) {
    throw createError(403, "Not your shift");
  }

  shift.actualStartTime = new Date().toLocaleTimeString();
  await shift.save();

  res.json({ message: "Shift started", time: shift.actualStartTime });
};

// ➤ Complete a shift
exports.completeShift = async (req, res) => {
  const shift = await Shift.findById(req.params.id);

  if (!shift) throw createError(404, "Shift not found");

  if (req.user.role !== "nurse") {
    throw createError(403, "Access denied: Not a nurse");
  }

  if (shift.assignedTo.toString() !== req.user._id.toString()) {
    throw createError(403, "Not your shift");
  }

  shift.actualEndTime = new Date().toLocaleTimeString();
  shift.status = "Completed";

  // Duration Calculation
  const [startHour, startMin] = shift.actualStartTime.split(":").map(Number);
  const [endHour, endMin] = new Date()
    .toLocaleTimeString()
    .split(":")
    .map(Number);

  let totalMinutes = endHour * 60 + endMin - (startHour * 60 + startMin);
  if (totalMinutes < 0) totalMinutes += 1440;

  shift.duration = `${totalMinutes} min`;

  await shift.save();

  res.json({ message: "Shift completed", time: shift.actualEndTime });
};

// ➤ Get completed shifts for nurse
exports.getCompletedShifts = async (req, res) => {
  const { userId } = req.params;

  if (req.user.role !== "nurse") {
    throw createError(403, "Access denied: Not a nurse");
  }
  if (req.user._id.toString() !== userId) {
    throw createError(403, "Access denied: ID mismatch");
  }

  const shifts = await Shift.find({
    assignedTo: userId,
    status: "Completed",
  })
    .populate("resident", "fullName roomNumber")
    .sort({ date: -1 });

  res.json(shifts);
};
