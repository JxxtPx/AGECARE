const express = require("express");
const router = express.Router();
const {
  getAllShifts,
  createShift,
  updateShift,
  deleteShift
} = require("../../controllers/admin/shiftController");

const { protect, adminOnly } = require("../../middleware/authMiddleware");
const asyncHandler = require("../../middleware/asyncHandler");

router.use(protect, adminOnly);

router.get("/", asyncHandler(getAllShifts));
router.post("/", asyncHandler(createShift));
router.put("/:id", asyncHandler(updateShift));
router.delete("/:id", asyncHandler(deleteShift));

module.exports = router;
