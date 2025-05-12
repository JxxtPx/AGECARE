const File = require("../../models/File");
const uploadToCloudinary = require("../../utils/Cloudinary/uploadToCloudinary");
const deleteFromCloudinary = require("../../utils/Cloudinary/deleteFromCloudinary");
const createError = require("http-errors");

// Upload and attach file to resident
exports.uploadResidentFile = async (req, res) => {
  const { title, fileType, rolesAllowed, notes } = req.body;
  const residentId = req.params.id;

  if (!req.file) {
    throw createError(400, "No file uploaded");
  }

  const uploadedUrl = await uploadToCloudinary(req.file);

  const fileRecord = new File({
    title,
    fileType,
    url: uploadedUrl,
    resident: residentId,
    uploadedBy: req.user.id,
    rolesAllowed: rolesAllowed ? JSON.parse(rolesAllowed) : ["admin"],
    notes
  });

  await fileRecord.save();

  res.status(201).json({ message: "File uploaded", file: fileRecord });
};

// Get all files for a resident
exports.getResidentFiles = async (req, res) => {
  const residentId = req.params.id;

  const allFiles = await File.find({ resident: residentId })
    .populate("uploadedBy", "name role");

  if (req.user.role === "admin") {
    return res.json(allFiles);
  }

  const filteredFiles = allFiles.filter((file) =>
    file.rolesAllowed.includes(req.user.role)
  );

  res.json(filteredFiles);
};

// Delete a resident file
exports.deleteResidentFile = async (req, res) => {
  const file = await File.findById(req.params.fileId);

  if (!file) {
    throw createError(404, "File not found");
  }

  if (req.user.role !== "admin") {
    throw createError(403, "Access denied");
  }

  // Extract publicId from Cloudinary URL
  const parts = file.url.split("/");
  const filename = parts[parts.length - 1]; // e.g., abc123.pdf
  const publicId = `agedcare/residents/${filename.split(".")[0]}`;

  await deleteFromCloudinary(publicId);
  await file.deleteOne();

  res.json({ message: "File deleted successfully" });
};
