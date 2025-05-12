const HealthRecord = require("../../models/HealthRecord");
const Resident = require("../../models/Resident");
const createError = require("http-errors");

// ✅ Create a new health record
exports.createHealthRecord = async (req, res) => {
  const { resident, type, title, description, date, tags } = req.body;

  if (!resident || !type || !title || !description || !date) {
    throw createError(400, "All fields are required to create a health record");
  }

  const newRecord = new HealthRecord({
    resident,
    recordedBy: req.user._id,
    type,
    title,
    description,
    date,
    tags,
  });

  const saved = await newRecord.save();
  res.status(201).json({ message: "Record created", record: saved });
};

// ✅ Get all records for one resident
exports.getRecordsForResident = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw createError(400, "Resident ID is required");
  }

  const records = await HealthRecord.find({ resident: id })
    .populate("recordedBy", "name role")
    .sort({ date: -1 });

  res.json(records);
};

// ✅ Admin/Coordinator: Get all records in the system
exports.getAllHealthRecords = async (req, res) => {
  const records = await HealthRecord.find()
    .populate("resident", "fullName roomNumber")
    .populate("recordedBy", "name role")
    .sort({ createdAt: -1 });

  res.json(records);
};

// ✅ Delete health record
exports.deleteHealthRecord = async (req, res) => {
  const record = await HealthRecord.findById(req.params.id);

  if (!record) {
    throw createError(404, "Health record not found");
  }

  await record.deleteOne();
  res.json({ message: "Record deleted" });
};
