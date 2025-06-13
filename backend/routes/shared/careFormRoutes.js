const express = require('express')
const router = express.Router()
const { protect } = require('../../middleware/authMiddleware')
const { getFormsForResident } = require('../../controllers/shared/careFormController')
const asyncHandler = require('../../middleware/asyncHandler')

// GET forms visible to user by resident ID
router.get('/resident/:residentId', protect, asyncHandler(getFormsForResident))

module.exports = router
