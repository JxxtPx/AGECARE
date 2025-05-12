const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const { getAllFeedbacks, updateFeedback } = require("../../controllers/shared/feedbackController");

// Allow both admin and coordinator
const allowAdminOrCoordinator = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "coordinator") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admin or Coordinator only" });
  }
};
const asyncHandler = require("../../middleware/asyncHandler");


router.get("/", protect, allowAdminOrCoordinator, asyncHandler(getAllFeedbacks));
router.put("/:id", protect, allowAdminOrCoordinator, asyncHandler(updateFeedback));

module.exports = router;
