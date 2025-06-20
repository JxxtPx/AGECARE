const Family = require("../../models/Family");
const Resident = require("../../models/Resident");
const User=require("../../models/User")

exports.getPendingFamilyRequests = async (req, res) => {
  const pending = await Family.find({ status: "pending" }).populate(
    "user",
    "name email"
  );

  res.json(pending);
};

exports.approveFamily = async (req, res) => {
  const { familyId } = req.params;
  const { residentId } = req.body; 

  if (!residentId) {
    throw createError(400, "residentId is required");
  }

  const family = await Family.findById(familyId);
  if (!family) {
    throw createError(404, "Family record not found");
  }
  family.status = "approved";
  family.resident = residentId;

  await family.save();

  res.json({ message: "Family request approved", family });
};

exports.rejectFamily = async (req, res) => {
  const { familyId } = req.params;

  const family = await Family.findById(familyId);
  if (!family) {
    throw createError(404, "Family record not found");
  }

  await User.findByIdAndDelete(family.user);
  await Family.findByIdAndDelete(familyId);

  res.json({ message: "Family request permanently rejected and removed" });
};


