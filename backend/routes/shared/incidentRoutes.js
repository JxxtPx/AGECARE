const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../../middleware/authMiddleware");
const {
  reportIncident,
  getMyIncidents,
  getAllIncidents,
  closeIncident
} = require("../../controllers/shared/incidentController");
const asyncHandler = require("../../middleware/asyncHandler");


// Shared
router.post("/", protect, asyncHandler(reportIncident));
router.get("/mine", protect, asyncHandler(getMyIncidents));

// Admin only
router.get("/", protect, adminOnly, asyncHandler(getAllIncidents));
router.put("/:id", protect, adminOnly, asyncHandler(closeIncident));

module.exports = router;
