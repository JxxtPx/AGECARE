const express = require('express');
const router = express.Router();
const {
  createNoteCategory,
  updateNoteCategory,
  deleteNoteCategory
} = require('../../controllers/admin/noteCategoryController');

const { protect, adminOnly } = require('../../middleware/authMiddleware');
const asyncHandler = require('../../middleware/asyncHandler');

// ➤ Create
router.post('/', protect, adminOnly, asyncHandler(createNoteCategory));

// ➤ Update
router.put('/:id', protect, adminOnly, asyncHandler(updateNoteCategory));

// ➤ Delete
router.delete('/:id', protect, adminOnly, asyncHandler(deleteNoteCategory));

module.exports = router;
