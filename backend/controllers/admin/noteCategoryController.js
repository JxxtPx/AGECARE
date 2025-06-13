const NoteCategory = require('../../models/NoteCategory');
const createError = require('http-errors');

// ➤ POST /api/admin/notecategories
exports.createNoteCategory = async (req, res) => {
    const { name, rolesAllowed, residentId } = req.body;
const resident = residentId;


    if (req.user.role !== 'admin') {
        throw createError(403, 'Access denied: Admins only');
    }

    if (!name || !Array.isArray(rolesAllowed) || rolesAllowed.length === 0 || !resident) {
        throw createError(400, 'Missing required fields: name, rolesAllowed, resident');
    }

    // Prevent duplicates for same resident & category name
    const existing = await NoteCategory.findOne({ name, resident });
    if (existing) {
        throw createError(409, 'Note category already exists for this resident');
    }

    const newCategory = new NoteCategory({
        name,
        rolesAllowed,
        resident,
    });

    await newCategory.save();

    res.status(201).json(newCategory);
};


// ➤ PUT /api/admin/notecategories/:id
exports.updateNoteCategory = async (req, res) => {
    const { id } = req.params;
    const { name, rolesAllowed } = req.body;

    const category = await NoteCategory.findById(id);
    if (!category) throw createError(404, "Category not found");

    if (name) category.name = name;
    if (rolesAllowed) category.rolesAllowed = rolesAllowed;

    await category.save();
    res.status(200).json(category);
};

// ➤ DELETE /api/admin/notecategories/:id
exports.deleteNoteCategory = async (req, res) => {
    const { id } = req.params;
  
    const category = await NoteCategory.findById(id);
    if (!category) throw createError(404, "Category not found");
  
    await category.deleteOne(); // ✅ use this instead of remove()
    res.status(200).json({ message: "Note category deleted successfully" });
  };
  