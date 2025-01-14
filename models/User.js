const mongoose = require('mongoose');
const uuid = require('uuid'); // Import uuid package

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // unique username
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['CEO', 'Manager', 'User'] },
  assignedSheets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sheet' }],
  uid: { type: String, unique: true, default: () => uuid.v4() }, // Automatically generate a unique uid
});

const User = mongoose.model('User', userSchema);

module.exports = User;
