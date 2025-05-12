const Task = require("../../models/Task");
const Notification = require("../../models/Notification");
const createError = require("http-errors");

// ➤ Create Task (Coordinator Only)
exports.createTask = async (req, res) => {
  const { assignedTo, shift, resident, description, dueTime, notes } = req.body;

  if (req.user.role !== "coordinator") {
    throw createError(403, "Access denied: Not a coordinator");
  }

  const newTask = new Task({
    assignedTo,
    shift,
    resident,
    description,
    dueTime,
    notes,
  });

  const savedTask = await newTask.save();

  // Send notification
  await Notification.create({
    user: assignedTo,
    message: `New task assigned: ${description}`,
    type: "task",
  });

  res.status(201).json({ message: "Task assigned successfully", task: savedTask });
};

// ➤ Get Tasks (Filter by resident and/or assigned user)
exports.getTasks = async (req, res) => {
  const { resident, assignedTo } = req.query;

  const filter = {};
  if (resident) filter.resident = resident;
  if (assignedTo) filter.assignedTo = assignedTo;

  const tasks = await Task.find(filter)
    .populate("assignedTo", "name role")
    .populate("resident", "fullName roomNumber")
    .populate("shift", "date startTime endTime")
    .sort({ createdAt: -1 });

  res.json(tasks);
};
