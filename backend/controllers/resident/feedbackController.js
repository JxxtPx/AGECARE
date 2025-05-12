const Feedback = require("../../models/Feedback");
const Resident = require("../../models/Resident");
const createError = require("http-errors");

exports.submitFeedback = async (req, res) => {
  const resident = await Resident.findOne({ user: req.user._id });

  if (!resident) {
    throw createError(404, "Resident profile not found");
  }

  const { message, category } = req.body;

  if (!message || !category) {
    throw createError(400, "Message and category are required");
  }

  const feedback = new Feedback({
    resident: resident._id,
    message,
    category,
  });

  await feedback.save();

  res.status(201).json({ message: "Feedback submitted", feedback });
};
