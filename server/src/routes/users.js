const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const bcrypt = require('bcryptjs');

// Check if any admin exists
router.get('/check-admin', async (req, res) => {
  try {
    const adminExists = await User.exists({ isAdmin: true });
    if (adminExists) {
      res.status(200).json({ exists: true });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error checking admin existence' });
  }
});

// Create first admin (requires admin secret key)
router.post('/create-first-admin', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, adminSecretKey } = req.body;

    // Check if admin secret key matches
    if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Invalid admin secret key' });
    }

    // Check if any admin already exists
    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      return res.status(400).json({ message: 'An admin user already exists' });
    }

    // Create the admin user
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      isAdmin: true,
      isInstructor: true
    });

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Error creating admin user', error: error.message });
  }
});

// Create additional admin (admin only)
router.post('/create-admin', [auth, admin], async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      isAdmin: true,
      isInstructor: true
    });

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Error creating admin user' });
  }
});

// Get user profile (protected)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user profile (protected)
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, username, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { firstName, lastName, username, email },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile' });
  }
});

// Admin Routes

// Get all users (admin only)
router.get('/admin', [auth, admin], async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Toggle user status (admin only)
router.patch('/:userId/status', [auth, admin], async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
});

// Toggle admin status (admin only)
router.patch('/:userId/admin', [auth, admin], async (req, res) => {
  try {
    const { isAdmin } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isAdmin },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating admin status' });
  }
});

module.exports = router; 