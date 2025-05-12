const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const { getLinkedResident } = require("../../controllers/family/residentController");
const asyncHandler = require("../../middleware/asyncHandler");


router.get("/", protect, asyncHandler(getLinkedResident));

module.exports = router;
