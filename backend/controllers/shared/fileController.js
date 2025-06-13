const File = require("../../models/File");
const Resident = require("../../models/Resident");
const createError = require("http-errors");

// ✅ GET /api/shared/files/:residentId
exports.getAccessibleResidentFiles = async (req, res) => {
  const residentId = req.params.id;
  const role = req.user.role;

  if (!residentId) {
    throw createError(400, "Resident ID is required");
  }

  const files = await File.find({
    resident: residentId,
    rolesAllowed: { $in: [role] },
  }).sort({ createdAt: -1 });

  res.json(files); // files will include title, url, fileType, notes, etc.
};