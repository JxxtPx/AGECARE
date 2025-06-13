const CarePlan = require('../../models/CarePlan');

// ➤ GET /api/shared/careplans/resident/:residentId
exports.getCarePlansByResident = async (req, res) => {
  const { residentId } = req.params;

  const plans = await CarePlan.find({ resident: residentId }).sort({ createdAt: -1 });

  res.json(plans);
};
