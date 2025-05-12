const express = require("express");
const router = express.Router();

const { protect } = require("../../middleware/authMiddleware");
// const { residentOnly } = require("../../middleware/roleMiddleware");
const { getResidentProfile } = require("../../controllers/resident/residentControllers");
const { getMyCarePlan } = require("../../controllers/resident/residentControllers");
const { getResidentShifts } = require("../../controllers/resident/residentControllers");
const { getResidentNotes } = require("../../controllers/resident/residentControllers");
const { getResidentFiles } = require("../../controllers/resident/residentControllers");
const {residentOnly}=require("../../middleware/authMiddleware")
const asyncHandler = require("../../middleware/asyncHandler");





router.get("/profile", protect, residentOnly, asyncHandler(getResidentProfile));
router.get("/careplan", protect,residentOnly, asyncHandler(getMyCarePlan));
router.get("/shifts", protect,residentOnly,  asyncHandler(getResidentShifts));
router.get("/notes", protect,residentOnly,  asyncHandler(getResidentNotes));
router.get("/files", protect,residentOnly, asyncHandler(getResidentFiles));






module.exports = router;
