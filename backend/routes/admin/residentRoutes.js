const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  getAllResidents,
  createResident,
  updateResident,
  deleteResident,
  uploadResidentPhoto
} = require("../../controllers/admin/residentController");

const { protect, adminOnly } = require("../../middleware/authMiddleware");
const asyncHandler = require("../../middleware/asyncHandler");

router.use(protect, adminOnly);

router.get("/", asyncHandler(getAllResidents));
router.post("/", asyncHandler(createResident));
router.put("/:id", asyncHandler(updateResident));
router.delete("/:id", asyncHandler(deleteResident));
router.post("/:id/photo", protect, adminOnly, upload.single("image"), asyncHandler(uploadResidentPhoto));


module.exports = router;
