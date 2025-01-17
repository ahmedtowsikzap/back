const mongoose = require('mongoose');

const sheetSchema = new mongoose.Schema({
  sheetName: { type: String, required: true },
  sheetUrl: { type: String, required: true },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Sheet = mongoose.model('Sheet', sheetSchema);

module.exports = Sheet;
