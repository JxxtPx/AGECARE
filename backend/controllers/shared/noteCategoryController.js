const NoteCategory = require('../../models/NoteCategory');

// ➤ GET /api/shared/resident-note-categories/:residentId
exports.getResidentNoteCategories = async (req, res) => {
  const { residentId } = req.params;
  const role = req.user.role;

  const categories = await NoteCategory.find({
    resident: residentId,
    rolesAllowed: { $in: [role] }
  });

  res.json(categories);
};

// ➤ GET /api/shared/resident-note-categories (Optional Global if Needed)
exports.getAllowedNoteCategories = async (req, res) => {
  const role = req.user.role;

  const categories = await NoteCategory.find({
    rolesAllowed: { $in: [role] }
  });

  res.json(categories);
};
