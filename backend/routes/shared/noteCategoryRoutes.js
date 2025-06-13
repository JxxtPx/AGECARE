const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/authMiddleware');
const {
  getAllowedNoteCategories,
  getResidentNoteCategories
} = require('../../controllers/shared/noteCategoryController');
const asyncHandler = require('../../middleware/asyncHandler');

// General (global) role-based categories — rarely needed now
router.get('/', protect, asyncHandler(getAllowedNoteCategories));

// ✅ Resident-specific allowed categories
router.get('/resident/:residentId', protect, asyncHandler(getResidentNoteCategories));

module.exports = router;
