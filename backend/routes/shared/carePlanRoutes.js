const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/authMiddleware');
const { getCarePlansByResident } = require('../../controllers/shared/carePlanController');
const asyncHandler = require('../../middleware/asyncHandler');

// GET care plans for carer/nurse by resident
router.get('/resident/:residentId', protect, asyncHandler(getCarePlansByResident));

module.exports = router;
