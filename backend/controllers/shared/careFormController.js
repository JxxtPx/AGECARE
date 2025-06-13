const CareFormTemplate = require('../../models/CareFormTemplate')

// ➤ GET /api/shared/careforms/resident/:residentId
// Returns all care forms assigned to the resident, filtered by role
exports.getFormsForResident = async (req, res) => {
  const { residentId } = req.params
  const userRole = req.user.role

  const forms = await CareFormTemplate.find({
    assignedResidents: residentId,
    rolesAllowed: userRole
  }).sort({ title: 1 }) // Alphabetical order

  res.json(forms)
}
