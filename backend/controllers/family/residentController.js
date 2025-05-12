const Family = require("../../models/Family");
const createError = require("http-errors");

// ➤ Family can view their linked resident details
exports.getLinkedResident = async (req, res) => {
  const familyRecord = await Family.findOne({ user: req.user._id }).populate("resident");

  if (!familyRecord) {
    throw createError(404, "Family record not found");
  }

  if (familyRecord.status !== "approved") {
    throw createError(403, "Access denied. Not yet approved by admin.");
  }

  if (!familyRecord.resident) {
    throw createError(404, "Resident not linked yet.");
  }

  res.json(familyRecord.resident);
};
