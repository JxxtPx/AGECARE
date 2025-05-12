const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../../middleware/authMiddleware");
const { getAdminAnalytics } = require("../../controllers/admin/analyticsController");
const asyncHandler = require("../../middleware/asyncHandler");


router.get("/", protect, adminOnly, asyncHandler(getAdminAnalytics));

module.exports = router;
