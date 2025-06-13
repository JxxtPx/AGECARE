const mongoose = require('mongoose');

const noteCategorySchema = new mongoose.Schema({
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resident',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rolesAllowed: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('NoteCategory', noteCategorySchema);
