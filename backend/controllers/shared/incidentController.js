const Incident = require("../../models/Incident");
const createError = require("http-errors");

// ✅ POST - Report new incident
exports.reportIncident = async (req, res) => {
  const { title, description, resident, shift } = req.body;

  if (!title || !description) {
    throw createError(400, "Title and description are required");
  }

  const incident = new Incident({
    title,
    description,
    reportedBy: req.user._id,
    role: req.user.role,
    resident,
    shift,
  });

  const saved = await incident.save();
  res.status(201).json({ message: "Incident reported", incident: saved });
};

// ✅ GET - View my incidents (for nurse/carer/resident)
exports.getMyIncidents = async (req, res) => {
  const incidents = await Incident.find({ reportedBy: req.user._id })
    .populate("resident", "fullName roomNumber")
    .populate("shift", "date startTime endTime")
    .sort({ createdAt: -1 });

  res.json(incidents);
};

// ✅ GET - Admin view all incidents
exports.getAllIncidents = async (req, res) => {
  const incidents = await Incident.find()
    .populate("reportedBy", "name role")
    .populate("resident", "fullName")
    .populate("shift", "date startTime endTime")
    .sort({ createdAt: -1 });

  res.json(incidents);
};

// ✅ PUT - Admin close an incident
exports.closeIncident = async (req, res) => {
  const { id } = req.params;

  const incident = await Incident.findById(id);
  if (!incident) {
    throw createError(404, "Incident not found");
  }

  incident.status = "closed";
  await incident.save();

  res.json({ message: "Incident marked as closed", incident });
};
