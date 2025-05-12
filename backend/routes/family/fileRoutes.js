const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const { getResidentFilesForFamily } = require("../../controllers/family/fileController");
const asyncHandler = require("../../middleware/asyncHandler");


router.get("/", protect, asyncHandler(getResidentFilesForFamily));

module.exports = router;
