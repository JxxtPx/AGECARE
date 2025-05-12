const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../../middleware/authMiddleware");
const { getAllVisitRequests, updateVisitStatus } = require("../../controllers/admin/visitController");
const asyncHandler = require("../../middleware/asyncHandler");

// GET all visit requests
router.get("/", protect, adminOnly, asyncHandler(getAllVisitRequests));

// PUT update status (approve/reject)
router.put("/:id", protect, adminOnly, asyncHandler(updateVisitStatus));

module.exports = router;
