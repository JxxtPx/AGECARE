const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const { updateProfile, changePassword, uploadUserProfilePhoto  } = require("../../controllers/shared/profileController");
const asyncHandler = require("../../middleware/asyncHandler");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });


router.put("/", protect, asyncHandler(updateProfile));
router.put("/", protect, asyncHandler(updateProfile));

router.put("/password", protect, asyncHandler(changePassword));
router.post("/photo", protect, upload.single("image"), asyncHandler(uploadUserProfilePhoto));


module.exports = router;
