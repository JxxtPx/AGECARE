const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const { coordinatorOnly } = require("../../middleware/authMiddleware");
const { getShiftNotesByResident,flagNoteWithComment  } = require("../../controllers/coordinator/shiftNoteController");
const asyncHandler = require("../../middleware/asyncHandler");


router.get("/:residentId", protect,coordinatorOnly, asyncHandler(getShiftNotesByResident));
router.put("/flag/:id", protect, coordinatorOnly, asyncHandler(flagNoteWithComment));


module.exports = router;
