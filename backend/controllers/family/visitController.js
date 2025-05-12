const VisitRequest = require("../../models/VisitRequest");
const Family = require("../../models/Family");
const createError = require("http-errors");

// ➤ Family submits a visit request for their linked resident
exports.submitVisitRequest = async (req, res) => {
  const { visitDate, visitTime, reason } = req.body;

  const family = await Family.findOne({
    user: req.user._id,
    status: "approved",
  });

  if (!family || !family.resident) {
    throw createError(403, "Not linked to any resident");
  }

  const newRequest = new VisitRequest({
    family: req.user._id,
    resident: family.resident,
    visitDate,
    visitTime,
    reason,
  });

  await newRequest.save();

  res.status(201).json({
    message: "Visit request submitted",
    request: newRequest,
  });
};
