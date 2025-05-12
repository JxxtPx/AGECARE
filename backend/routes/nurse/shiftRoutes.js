const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const {
  getAssignedShifts,
  startShift,
  completeShift,
  getCompletedShifts
} = require("../../controllers/nurse/shiftController");
const asyncHandler = require("../../middleware/asyncHandler");


// GET upcoming shifts for a carer/nurse
router.get("/assigned/:userId", protect, asyncHandler(getAssignedShifts));
router.put("/:id/start", protect, asyncHandler(startShift));
router.put("/:id/complete", protect, asyncHandler(completeShift));
router.get("/completed/:userId", protect, asyncHandler(getCompletedShifts));


module.exports = router;
