const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const { coordinatorOnly } = require("../../middleware/authMiddleware");
const { createTask , getTasks } = require("../../controllers/coordinator/taskController");
const asyncHandler = require("../../middleware/asyncHandler");


router.post("/", protect, coordinatorOnly, asyncHandler(createTask));
router.get("/", protect, coordinatorOnly, asyncHandler(getTasks));


module.exports = router;
