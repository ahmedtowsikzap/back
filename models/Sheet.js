const mongoose = require('mongoose');

const sheetSchema = new mongoose.Schema({
  sheetUrl: { type: String, required: true },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Sheet = mongoose.model('Sheet', sheetSchema);

module.exports = Sheet;
