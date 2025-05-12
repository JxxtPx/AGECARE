const express = require("express");
const router = express.Router();
const { registerFamily } = require("../../controllers/family/authController");
const asyncHandler = require("../../middleware/asyncHandler");


router.post("/register", asyncHandler(registerFamily)); // Public

module.exports = router;
