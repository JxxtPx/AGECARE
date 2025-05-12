const CarePlan = require("../../models/CarePlan");
const createError = require("http-errors");

// ➤ Create care plan (coordinator only)
exports.createCarePlan = async (req, res) => {
  const { resident, goals, risks, notes, nextReviewDate } = req.body;

  if (req.user.role !== "coordinator") {
    throw createError(403, "Access denied: Not a coordinator");
  }

  const newPlan = new CarePlan({
    resident,
    createdBy: req.user._id,
    goals,
    risks,
    notes,
    nextReviewDate,
  });

  const saved = await newPlan.save();

  res.status(201).json({ message: "Care plan created", plan: saved });
};

// ➤ Get all care plans for a resident
exports.getCarePlansByResident = async (req, res) => {
  const residentId = req.params.residentId;

  const plans = await CarePlan.find({ resident: residentId })
    .populate("createdBy", "name role")
    .sort({ createdAt: -1 });

  res.json(plans);
};

// ➤ Update care plan (coordinator only)
exports.updateCarePlan = async (req, res) => {
  const planId = req.params.id;

  const carePlan = await CarePlan.findById(planId);
  if (!carePlan) throw createError(404, "Care plan not found");

  if (req.user.role !== "coordinator") {
    throw createError(403, "Access denied");
  }

  const { goals, risks, notes, nextReviewDate } = req.body;

  carePlan.goals = goals ?? carePlan.goals;
  carePlan.risks = risks ?? carePlan.risks;
  carePlan.notes = notes ?? carePlan.notes;
  carePlan.nextReviewDate = nextReviewDate ?? carePlan.nextReviewDate;

  const updated = await carePlan.save();

  res.json({ message: "Care plan updated", plan: updated });
};
