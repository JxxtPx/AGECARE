const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const {
  sendMessage,
  getChatWithUser,
  markMessageAsRead,
  getUnreadCount,
  getConversations 
} = require("../../controllers/chat/chatController");
const asyncHandler = require("../../middleware/asyncHandler");

router.post("/send", protect, asyncHandler(sendMessage));
router.get("/thread/:userId", protect, asyncHandler(getChatWithUser));
router.put("/read/:id", protect, asyncHandler(markMessageAsRead));
router.get("/unread-count", protect, asyncHandler(getUnreadCount));
router.get("/conversations", protect, asyncHandler(getConversations));



module.exports = router;
