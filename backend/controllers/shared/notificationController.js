const Notification = require("../../models/Notification");
const createError = require("http-errors");

// ✅ Create auto/manual notification
exports.sendNotification = async (req, res) => {
  const { user, message, type, link } = req.body;

  if (!user || !message || !type) {
    throw createError(400, "User, message, and type are required");
  }

  const newNotification = new Notification({
    user,
    message,
    type,
    link,
  });

  const saved = await newNotification.save();
  res.status(201).json({ message: "Notification sent", data: saved });
};

// ✅ Get all notifications for logged in user
exports.getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.json(notifications);
};

// ✅ Mark a notification as read
exports.markAsRead = async (req, res) => {
  const notif = await Notification.findById(req.params.id);
  if (!notif) {
    throw createError(404, "Notification not found");
  }
  if (notif.user.toString() !== req.user._id.toString()) {
    throw createError(403, "Access denied");
  }

  notif.isRead = true;
  await notif.save();
  res.json({ message: "Notification marked as read" });
};

// ✅ Delete notification
exports.deleteNotification = async (req, res) => {
  const notif = await Notification.findById(req.params.id);
  if (!notif) {
    throw createError(404, "Notification not found");
  }
  if (notif.user.toString() !== req.user._id.toString()) {
    throw createError(403, "Access denied");
  }

  await notif.deleteOne();
  res.json({ message: "Notification deleted successfully" });
};
