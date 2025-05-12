const express = require("express");
const router = express.Router();
const {
  sendNotification,
  getMyNotifications,
  markAsRead,
  deleteNotification
} = require("../../controllers/shared/notificationController");

const { protect } = require("../../middleware/authMiddleware");
const asyncHandler = require("../../middleware/asyncHandler");


// Create (manual or triggered)
router.post("/", protect, asyncHandler(sendNotification));

// Get my notifications
router.get("/", protect, asyncHandler(getMyNotifications));

// Mark one as read
router.put("/:id/read", protect, asyncHandler(markAsRead));

// Delete one
router.delete("/:id", protect, asyncHandler(deleteNotification));

module.exports = router;
