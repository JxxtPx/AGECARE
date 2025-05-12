const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../../middleware/authMiddleware");
const {
  getPendingFamilyRequests,
  approveFamily
} = require("../../controllers/admin/familyApprovalController");
const asyncHandler = require("../../middleware/asyncHandler");


router.get("/pending", protect, adminOnly, asyncHandler(getPendingFamilyRequests));
router.put("/approve/:familyId", protect, adminOnly, asyncHandler(approveFamily));

module.exports = router;
