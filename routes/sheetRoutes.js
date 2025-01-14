const express = require('express');
const Sheet = require('../models/Sheet');
const User = require('../models/User');
const router = express.Router();

// Assign sheet to a user with error handling and validation
router.post('/assign', async (req, res) => {
  const { userId, sheetUrl } = req.body;

  // Validate request data
  if (!userId || !sheetUrl) {
    return res.status(400).json({ message: 'User ID and Sheet URL are required' });
  }

  try {
    // Create new sheet
    const sheet = new Sheet({ sheetUrl });
    await sheet.save();

    // Assign sheet to user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    user.assignedSheets.push(sheet._id);
    await user.save();

    res.status(200).json({ message: 'Sheet assigned successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while assigning sheet' });
  }
});

// Get all sheets assigned to a user with error handling
router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate('assignedSheets');

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    res.status(200).json(user.assignedSheets);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching sheets' });
  }
});

module.exports = router;
