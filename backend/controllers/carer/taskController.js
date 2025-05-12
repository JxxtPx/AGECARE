const Task = require("../../models/Task");
const createError = require("http-errors");

exports.updateTaskStatus = async (req, res) => {
  const taskId = req.params.id;
  const { status, notes } = req.body;

  const task = await Task.findById(taskId);
  if (!task) {
    throw createError(404, "Task not found");
  }

  // Only the assigned user (carer/nurse) can update the task
  if (task.assignedTo.toString() !== req.user._id.toString()) {
    throw createError(403, "You are not assigned to this task");
  }

  if (!["completed", "missed"].includes(status)) {
    throw createError(400, "Invalid status. Must be 'completed' or 'missed'");
  }

  task.status = status;
  if (notes) task.notes = notes;

  const updated = await task.save();
  res.json({ message: "Task updated", task: updated });
};
