const Family = require("../../models/Family");
const File = require("../../models/File");
const createError = require("http-errors");

// ➤ Family can view approved resident's files
exports.getResidentFilesForFamily = async (req, res) => {
  const family = await Family.findOne({ user: req.user._id });

  if (!family || family.status !== "approved") {
    throw createError(403, "Access denied");
  }

  if (!family.resident) {
    throw createError(404, "No resident linked to your account");
  }

  const files = await File.find({
    resident: family.resident,
    rolesAllowed: { $in: ["family"] },
  }).populate("uploadedBy", "name role");

  res.json(files);
};
