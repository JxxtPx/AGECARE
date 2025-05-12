const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const { getAccessibleResidentFiles } = require("../../controllers/shared/fileController");
const asyncHandler = require("../../middleware/asyncHandler");


// Nurse/Carer/Coordinator get files for a resident
router.get("/:id", protect, asyncHandler(getAccessibleResidentFiles));

module.exports = router;
