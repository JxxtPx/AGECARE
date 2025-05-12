const Feedback = require("../../models/Feedback");
const createError = require("http-errors");

// ✅ GET /api/shared/feedback
exports.getAllFeedbacks = async (req, res) => {
  const feedbacks = await Feedback.find()
    .populate("resident", "fullName roomNumber")
    .sort({ createdAt: -1 });

  res.json(feedbacks);
};

// ✅ PUT /api/shared/feedback/:id
exports.updateFeedback = async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    throw createError(404, "Feedback not found");
  }

  const { status, response } = req.body;

  if (status) feedback.status = status;
  if (response) feedback.response = response;

  const updated = await feedback.save();

  res.json({ message: "Feedback updated", feedback: updated });
};
