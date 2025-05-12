const Message = require("../../models/Message");
const createError = require("http-errors");

// ➤ Send a message
exports.sendMessage = async (req, res) => {
  const { receiver, content } = req.body;

  if (!receiver || !content) {
    throw createError(400, "Receiver and content are required");
  }

  const newMsg = new Message({
    sender: req.user._id,
    receiver,
    content,
  });

  const saved = await newMsg.save();
  res.status(201).json({ message: "Message sent", chat: saved });
};

// ➤ Get full conversation with a specific user
exports.getChatWithUser = async (req, res) => {
  const otherUserId = req.params.userId;
  const currentUserId = req.user._id;

  const messages = await Message.find({
    $or: [
      { sender: currentUserId, receiver: otherUserId },
      { sender: otherUserId, receiver: currentUserId },
    ],
  })
    .sort({ createdAt: 1 }) // oldest to newest
    .populate("sender", "name role")
    .populate("receiver", "name role");

  res.json(messages);
};

// ➤ Mark a message as read
exports.markMessageAsRead = async (req, res) => {
  const messageId = req.params.id;

  const message = await Message.findById(messageId);
  if (!message) {
    throw createError(404, "Message not found");
  }

  if (message.receiver.toString() !== req.user._id.toString()) {
    throw createError(403, "Only the receiver can mark the message as read");
  }

  message.isRead = true;
  await message.save();

  res.json({ message: "Message marked as read", messageData: message });
};

// ➤ Get unread message count per sender
exports.getUnreadCount = async (req, res) => {
  const currentUserId = req.user._id;

  const unreadCounts = await Message.aggregate([
    {
      $match: {
        receiver: currentUserId,
        isRead: false,
      },
    },
    {
      $group: {
        _id: "$sender",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "senderInfo",
      },
    },
    { $unwind: "$senderInfo" },
    {
      $project: {
        senderId: "$_id",
        name: "$senderInfo.name",
        role: "$senderInfo.role",
        count: 1,
      },
    },
  ]);

  res.json(unreadCounts);
};

// ➤ Get all conversations (latest message with each user)
exports.getConversations = async (req, res) => {
  const currentUserId = req.user._id;

  const messages = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: currentUserId }, { receiver: currentUserId }],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: [{ $eq: ["$sender", currentUserId] }, "$receiver", "$sender"],
        },
        lastMessage: { $first: "$$ROOT" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    {
      $project: {
        userId: "$_id",
        name: "$userInfo.name",
        role: "$userInfo.role",
        lastMessage: "$lastMessage.content",
        timestamp: "$lastMessage.createdAt",
        isRead: "$lastMessage.isRead",
      },
    },
    { $sort: { timestamp: -1 } },
  ]);

  res.json(messages);
};
