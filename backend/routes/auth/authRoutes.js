const express = require("express");
const router = express.Router();
const { loginUser,setPassword  } = require("../../controllers/auth/authController");

const asyncHandler = require("../../middleware/asyncHandler");
router.put("/set-password", asyncHandler(setPassword));

router.post("/login", asyncHandler(loginUser));

module.exports = router;
