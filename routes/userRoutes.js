const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Admin login route with error handling
// Admin login route with error handling
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username });

    // User not found
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate password
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Return success with user role, username, and userId
    res.status(200).json({
      message: 'Login successful',
      role: user.role,
      userId: user._id, // Add userId to the response
      username: user.username, // Add username to the response
      designation: user.designation
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: "Server error" });
  }
});


  router.get('/api/me', async (req, res) => {
    const { username } = req.query; // Example: Pass username as a query parameter
  
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
  
    try {
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        username: user.username,
        role: user.role,
        designation: user.designation
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: "Server error while fetching user data" });
    }
  });

  // @route   GET /api/users/me
router.get('/me', async (req, res) => {
  const { username } = req.query; // Example: Pass username as a query parameter

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      username: user.username,
      role: user.role,
      designation: user.designation
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: "Server error while fetching user data" });
  }
});



  // Get all users route
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json(users); // Send the users as a response
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
});
  

router.post('/create', async (req, res) => {
  const { username, password, role, designation,  requestorRole } = req.body;

  console.log("Request body:", req.body); // Debugging request data

  // if (!username || !password || !role || !requestorRole) {
  //   return res.status(400).json({ message: "Username, password, role, and requestorRole are required" });
  // }

  // if (requestorRole !== 'CEO') {
  //   return res.status(403).json({ message: "Permission denied: Only a CEO can create new users" });
  // }

  // const validRoles = ['CEO', 'Manager', 'User'];
  // if (!validRoles.includes(role)) {
  //   return res.status(400).json({ message: `Invalid role provided. Allowed roles are: ${validRoles.join(', ')}` });
  // }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = new User({ username, password, role, designation  });
    await user.save();

    res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during user creation:', error);
    res.status(500).json({ message: "Server error while creating user" });
  }
});


module.exports = router;
