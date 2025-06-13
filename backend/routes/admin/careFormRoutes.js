// routes/admin/careFormRoutes.js

const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../../middleware/authMiddleware");
const {
  upsertFormTemplate,
  getAllFormTemplates,
  getFormsForResident,
  deleteFormTemplate
} = require("../../controllers/admin/careFormController");
const asyncHandler = require("../../middleware/asyncHandler");

router.post("/template", protect, adminOnly, asyncHandler(upsertFormTemplate));
router.get("/templates", protect, adminOnly, asyncHandler(getAllFormTemplates));
router.get("/templates/:residentId", protect, asyncHandler(getFormsForResident));
router.delete("/template/:id", protect, adminOnly, asyncHandler(deleteFormTemplate));


module.exports = router;
