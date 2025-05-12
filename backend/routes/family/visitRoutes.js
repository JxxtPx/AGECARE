const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const { submitVisitRequest } = require("../../controllers/family/visitController");
const asyncHandler = require("../../middleware/asyncHandler");


router.post("/", protect, asyncHandler(submitVisitRequest));

module.exports = router;
