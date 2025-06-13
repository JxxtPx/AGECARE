const CarePlan = require('../../models/CarePlan');

// ➤ GET /api/admin/careplans/:residentId
exports.getCarePlansByResident = async (req, res) => {
  const { residentId } = req.params;
  const plans = await CarePlan.find({ resident: residentId }).sort({ createdAt: -1 });
  res.json(plans);
};

// ➤ POST /api/admin/careplans
exports.createCarePlan = async (req, res) => {
  const { resident, entries } = req.body;

  if (!resident || !Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({ message: 'Resident and entries are required.' });
  }

  const newPlan = await CarePlan.create({ resident, entries });
  res.status(201).json(newPlan);
};

// ➤ PUT /api/admin/careplans/:id
exports.updateCarePlan = async (req, res) => {
  const { entries } = req.body;

  if (!Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({ message: 'At least one entry is required.' });
  }

  const updated = await CarePlan.findByIdAndUpdate(
    req.params.id,
    { entries },
    { new: true }
  );

  if (!updated) return res.status(404).json({ message: "Care plan not found" });
  res.json(updated);
};

// ➤ DELETE /api/admin/careplans/:id
exports.deleteCarePlan = async (req, res) => {
  const deleted = await CarePlan.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Care plan not found" });
  res.json({ message: "Care plan deleted" });
};
