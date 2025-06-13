const Shift = require("../../models/Shift");
const File = require("../../models/File");
const createError = require("http-errors");

const getShiftType = (startTime) => {
  const [hour] = startTime.split(":").map(Number);
  if (hour >= 5 && hour < 13) return "morning";
  if (hour >= 13 && hour < 21) return "afternoon";
  return "night";
};

// ✅ Get assigned upcoming shifts for Carer with shiftType
exports.getAssignedShiftsForCarer = async (req, res) => {
  const { userId } = req.params;

  if (req.user.role !== "carer") {
    throw createError(403, "Access denied: Not a carer");
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
    .populate(
      "resident",
      "fullName roomNumber dateOfBirth contactInfo medicalHistory files"
    )
    .sort({ date: 1, startTime: 1 });

  const enrichedShifts = shifts.map((shift) => ({
    ...shift.toObject(),
    shiftType: getShiftType(shift.startTime),
  }));

  res.json(enrichedShifts);
};

// ✅ Start a shift
exports.startShift = async (req, res) => {
  const shift = await Shift.findById(req.params.id).populate(
    "resident",
    "fullName roomNumber"
  );

  if (!shift) {
    throw createError(404, "Shift not found");
  }

  if (req.user.role !== "carer") {
    throw createError(403, "Access denied: Not a carer");
  }

  if (shift.assignedTo.toString() !== req.user._id.toString()) {
    throw createError(403, "Access denied: Not your shift");
  }

  shift.actualStartTime = new Date().toISOString(); // exact UTC time
  shift.status = "in-progress"; // use consistent lowercase

  await shift.save();

  res.json({
    message: "Shift started",
    time: shift.actualStartTime,
    shift,
  });
};

// ✅ Complete a shift
exports.completeShift = async (req, res) => {
  const shift = await Shift.findById(req.params.id).populate(
    "resident",
    "fullName roomNumber"
  );

  if (!shift) throw createError(404, "Shift not found");

  if (req.user.role !== "carer") {
    throw createError(403, "Access denied: Not a carer");
  }

  if (shift.assignedTo.toString() !== req.user._id.toString()) {
    throw createError(403, "Access denied: Not your shift");
  }

  const now = new Date();
  shift.actualEndTime = now.toISOString();
  shift.status = "completed"; // use consistent lowercase

  const start = new Date(shift.actualStartTime);
  const totalMinutes = Math.round((now - start) / (1000 * 60));
  shift.duration = `${totalMinutes} min`;

  await shift.save();

  res.json({
    message: "Shift completed",
    time: shift.actualEndTime,
    duration: shift.duration,
    resident: shift.resident,
  });
};

// ✅ Get all completed shifts for Carer
exports.getCompletedShifts = async (req, res) => {
  const { userId } = req.params;

  if (req.user.role !== "carer") {
    throw createError(403, "Access denied: Not a carer");
  }

  if (req.user._id.toString() !== userId) {
    throw createError(403, "Access denied: ID mismatch");
  }

  const shifts = await Shift.find({
    assignedTo: userId,
    status: "completed", // match lowercase used during saving
  })
    .populate(
      "resident",
      "fullName roomNumber dateOfBirth contactInfo medicalHistory files"
    )
    .sort({ date: -1 });

  const enrichedShifts = shifts.map((shift) => ({
    ...shift.toObject(),
    shiftType: getShiftType(shift.startTime),
  }));

  res.json(enrichedShifts);
};


// ✅ Get single shift by ID
exports.getShiftById = async (req, res) => {
  const shiftId = req.params.id;

  const shift = await Shift.findById(shiftId)
    .populate({
      path: 'resident',
      select: 'fullName gender dateOfBirth allergies roomNumber contactInfo emergencyContacts'
    });

  if (!shift) {
    throw createError(404, "Shift not found");
  }

  // Check carer access
  if (req.user.role !== "carer") {
    throw createError(403, "Access denied: Not a carer");
  }

  if (shift.assignedTo.toString() !== req.user._id.toString()) {
    throw createError(403, "Access denied: Not your shift");
  }
  // console.log("Resident data:", shift.resident);


  res.json(shift);
};
