const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { uploadResidentFile, getResidentFiles,deleteResidentFile  } = require("../../controllers/admin/fileController");
const { protect, adminOnly } = require("../../middleware/authMiddleware");
const asyncHandler = require("../../middleware/asyncHandler");


// Upload a new file to a resident
router.post("/:id", protect, adminOnly, upload.single("file"), asyncHandler(uploadResidentFile));

// Get all files of a resident
router.get("/:id", protect,  asyncHandler(getResidentFiles));

//delete file 
router.delete("/:fileId", protect, adminOnly, asyncHandler(deleteResidentFile));


module.exports = router;
