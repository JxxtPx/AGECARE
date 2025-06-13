const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../../middleware/authMiddleware');
const {
  getCarePlansByResident,
  createCarePlan,
  updateCarePlan,
  deleteCarePlan
} = require('../../controllers/admin/carePlanController');
const asyncHandler = require('../../middleware/asyncHandler');

// GET all care plans for a resident
router.get('/:residentId', protect, adminOnly, asyncHandler(getCarePlansByResident));

// POST new care plan
router.post('/', protect, adminOnly, asyncHandler(createCarePlan));

// PUT update care plan
router.put('/:id', protect, adminOnly, asyncHandler(updateCarePlan));

// DELETE care plan
router.delete('/:id', protect, adminOnly, asyncHandler(deleteCarePlan));

module.exports = router;
