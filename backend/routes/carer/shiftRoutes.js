const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const {
    getAssignedShiftsForCarer,
    startShift,
    completeShift,
    getCompletedShifts,
    getShiftById
  } = require("../../controllers/carer/shiftController");
  
  const asyncHandler = require("../../middleware/asyncHandler");
// GET assigned shifts for carer
router.get("/assigned/:userId", protect, asyncHandler(getAssignedShiftsForCarer));
router.put("/:id/start", protect, asyncHandler(startShift));
router.put("/:id/complete", protect, asyncHandler(completeShift));
router.get("/completed/:userId", protect, asyncHandler(getCompletedShifts));
// ➤ GET single shift by ID with resident
router.get("/:id", protect, asyncHandler(getShiftById));




module.exports = router;
