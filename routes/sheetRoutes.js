const express = require('express');
const Sheet = require('../models/Sheet');
const User = require('../models/User');
const router = express.Router();

// Assign a sheet to a user with validation and role-based access
// src/routes/sheetsRouter.js

router.post('/assign', async (req, res) => {
  const { username, sheetUrl, role: requestorRole } = req.body;

  try {
    // Check if required fields are provided
    if (!username || !sheetUrl) {
      return res.status(400).json({ message: 'Username and sheetUrl are required.' });
    }

    console.log('Received data:', req.body);

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log('User object:', user);

    // Log role before authorization check
    console.log('Requestor role:', requestorRole);

    // Authorization check
    if (!['CEO', 'Manager'].includes(requestorRole)) {
      return res.status(403).json({ message: 'Permission denied: Only CEO or Manager can assign sheets.' });
    }

    // Ensure the target user has the role `User`
    if (user.role !== 'User') {
      return res.status(400).json({ message: 'Can only assign sheets to users with the role "User".' });
    }

    // Find the sheet by URL
    const sheet = await Sheet.findOne({ sheetUrl });
    if (!sheet) {
      return res.status(404).json({ message: 'Sheet not found.' });
    }

    // Assign the sheet to the user
    if (!sheet.assignedTo.includes(user._id)) {
      sheet.assignedTo.push(user._id);
      await sheet.save();
    }

    // Update the user's `assignedSheets`
    if (!user.assignedSheets.includes(sheet._id)) {
      user.assignedSheets.push(sheet._id);
      await user.save();
    }

    return res.status(200).json({ message: 'Sheet assigned successfully.' });
  } catch (error) {
    console.error('Error assigning sheet:', error);
    return res.status(500).json({ message: 'Failed to assign sheet.', error: error.message });
  }
});




// Get all sheets assigned to a user
router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate('assignedSheets');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.assignedSheets);
  } catch (error) {
    console.error('Error fetching user sheets:', error);
    res.status(500).json({ message: 'Server error while fetching sheets' });
  }
});

// Create a new sheet
router.post('/create', async (req, res) => {
  const { sheetUrl } = req.body;

  // Validate input
  if (!sheetUrl) {
    return res.status(400).json({ message: 'Sheet URL is required' });
  }

  try {
    // Save sheet to database
    const sheet = new Sheet({ sheetUrl });
    await sheet.save();

    res.status(200).json({ message: 'Sheet created successfully', sheet });
  } catch (error) {
    console.error('Error creating sheet:', error);
    res.status(500).json({ message: 'Server error while creating sheet' });
  }
});

// Get all sheets
router.get('/', async (req, res) => {
  try {
    const sheets = await Sheet.find(); // Fetch all sheets
    res.status(200).json(sheets);
  } catch (error) {
    console.error('Error fetching sheets:', error);
    res.status(500).json({ message: 'Server error while fetching sheets' });
  }
});

module.exports = router;
