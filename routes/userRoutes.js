const express = require('express');
const User = require('../models/User');
const router = express.Router();

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
  
      // Return success with user role
      res.status(200).json({ message: 'Login successful', role: user.role });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

  router.post('/create', async (req, res) => {
    const { username, password, role } = req.body;
  
    // Validate input
    if (!username || !password || !role) {
      return res.status(400).json({ message: "Username, password, and role are required" });
    }
  
    const validRoles = ['CEO', 'Manager', 'User'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role provided. Allowed roles are: ${validRoles.join(', ')}` });
    }
  
    try {
      // Check for existing user
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
  
      // Create and save user
      const user = new User({ username, password, role });
      await user.save();
  
      res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error during user creation:', error);
      res.status(500).json({ message: "Server error while creating user" });
    }
  });

module.exports = router;
