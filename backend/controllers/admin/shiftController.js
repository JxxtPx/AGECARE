const Shift = require("../../models/Shift");
const Notification = require("../../models/Notification");

// ✅ Get all shifts
exports.getAllShifts = async (req, res) => {
  const shifts = await Shift.find()
    .populate("assignedTo", "name role")
    .populate("resident", "fullName roomNumber");

  res.json(shifts);
};

// ✅ Create a shift (with notification)
exports.createShift = async (req, res) => {
  const shift = new Shift(req.body);
  const savedShift = await shift.save();

  // Notify assigned user if exists
  if (req.body.assignedTo) {
    const { date, startTime, endTime } = req.body;
    await Notification.create({
      user: req.body.assignedTo,
      message: `New shift assigned: ${date} (${startTime} - ${endTime})`,
      type: "shift",
      link: "/carer/shifts", // frontend can adjust based on role
    });
  }

  res.status(201).json({ message: "Shift created successfully", shift: savedShift });
};

// ✅ Update a shift (with conditional notification)
exports.updateShift = async (req, res) => {
  const { id } = req.params;
  const oldShift = await Shift.findById(id);

  if (!oldShift) {
    res.status(404);
    throw new Error("Shift not found");
  }

  const updatedShift = await Shift.findByIdAndUpdate(id, req.body, { new: true });

  const assignedChanged =
    req.body.assignedTo && req.body.assignedTo !== String(oldShift.assignedTo);
  const timeChanged =
    req.body.date !== oldShift.date?.toISOString().split("T")[0] ||
    req.body.startTime !== oldShift.startTime ||
    req.body.endTime !== oldShift.endTime;

  if (assignedChanged || timeChanged) {
    await Notification.create({
      user: req.body.assignedTo || oldShift.assignedTo,
      message: `Shift updated: ${req.body.date || oldShift.date} (${req.body.startTime || oldShift.startTime} - ${req.body.endTime || oldShift.endTime})`,
      type: "shift",
      link: "/carer/shifts",
    });
  }

  res.json({ message: "Shift updated successfully", shift: updatedShift });
};

// ✅ Delete a shift
exports.deleteShift = async (req, res) => {
  const { id } = req.params;
  const shift = await Shift.findById(id);

  if (!shift) {
    res.status(404);
    throw new Error("Shift not found");
  }

  await shift.deleteOne();
  res.json({ message: "Shift deleted successfully" });
};
