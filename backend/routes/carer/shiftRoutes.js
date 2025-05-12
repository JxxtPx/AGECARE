const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const {
    getAssignedShiftsForCarer,
    startShift,
    completeShift,
    getCompletedShifts
  } = require("../../controllers/carer/shiftController");
  
  const asyncHandler = require("../../middleware/asyncHandler");
// GET assigned shifts for carer
router.get("/assigned/:userId", protect, asyncHandler(getAssignedShiftsForCarer));
router.put("/:id/start", protect, asyncHandler(startShift));
router.put("/:id/complete", protect, asyncHandler(completeShift));
router.get("/completed/:userId", protect, asyncHandler(getCompletedShifts));


module.exports = router;
