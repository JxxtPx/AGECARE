const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const { createCarePlan,getCarePlansByResident ,updateCarePlan } = require("../../controllers/coordinator/carePlanController");
const asyncHandler = require("../../middleware/asyncHandler");


router.post("/", protect, asyncHandler(createCarePlan));
router.get("/:residentId", protect, asyncHandler(getCarePlansByResident));
router.put("/:id", protect, asyncHandler(updateCarePlan));



module.exports = router;
