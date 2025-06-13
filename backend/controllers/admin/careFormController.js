const CareFormTemplate = require("../../models/CareFormTemplate");

// Create or update a form template
exports.upsertFormTemplate = async (req, res) => {
  const { _id, title, description, rolesAllowed, questions, assignedResidents } = req.body;

  if (_id) {
    const updated = await CareFormTemplate.findByIdAndUpdate(_id, {
      title, description, rolesAllowed, questions, assignedResidents
    }, { new: true });
    return res.json(updated);
  } else {
    const created = await CareFormTemplate.create({
      title, description, rolesAllowed, questions, assignedResidents,
      createdBy: req.user._id
    });
    return res.status(201).json(created);
  }
};

// Get all templates (admin view)
exports.getAllFormTemplates = async (req, res) => {
  const forms = await CareFormTemplate.find().sort({ createdAt: -1 });
  res.json(forms);
};

// Get forms for a specific resident (for shift view)
exports.getFormsForResident = async (req, res) => {
  const { residentId } = req.params;
  const forms = await CareFormTemplate.find({ assignedResidents: residentId });
  res.json(forms);
};

// ➤ DELETE a care form template
exports.deleteFormTemplate = async (req, res) => {
    const { id } = req.params;
  
    const form = await CareFormTemplate.findById(id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
  
    await form.deleteOne();
    res.json({ message: "Form deleted successfully" });
  };
  