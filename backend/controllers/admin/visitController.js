const VisitRequest = require("../../models/VisitRequest");
const User = require("../../models/User");
const Resident = require("../../models/Resident");
const Notification = require("../../models/Notification");
const createError = require("http-errors"); // ✅ Import createError properly

// ✅ GET all visit requests
exports.getAllVisitRequests = async (req, res) => {
  const visits = await VisitRequest.find()
    .populate("family", "name email")
    .populate("resident", "fullName roomNumber")
    .sort({ createdAt: -1 });

  res.json(visits);
};

// ✅ UPDATE visit request status
exports.updateVisitStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    throw createError(400, "Invalid status value");
  }

  const visit = await VisitRequest.findById(id);
  if (!visit) {
    throw createError(404, "Visit request not found");
  }

  visit.status = status;
  await visit.save();

  // Send notification to family who requested
  const statusMsg = status === "approved" ? "approved ✅" : "rejected ❌";

  await Notification.create({
    user: visit.family,
    message: `Your visit request has been ${statusMsg}`,
    type: "visit",
    link: "/family/visits",
  });

  res.json({ message: `Visit ${status}`, visit });
};
