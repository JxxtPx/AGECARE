const express = require("express");
const router = express.Router();
const {
  createHealthRecord,
  getRecordsForResident,
  getAllHealthRecords,
  deleteHealthRecord
} = require("../../controllers/shared/healthRecordController");

const { protect } = require("../../middleware/authMiddleware");
const asyncHandler = require("../../middleware/asyncHandler");


// Create new record
router.post("/", protect, asyncHandler(createHealthRecord));

// Get records for one resident
router.get("/resident/:id", protect, asyncHandler(getRecordsForResident));

// Admin/coordinator: Get all records
router.get("/", protect, asyncHandler(getAllHealthRecords));

// Delete record (optional)
router.delete("/:id", protect, asyncHandler(deleteHealthRecord));

module.exports = router;
