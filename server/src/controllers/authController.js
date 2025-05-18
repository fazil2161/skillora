const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authController = {
  // Register a new user
  async register(req, res) {
    try {
      const { username, email, password, firstName, lastName, adminSecretKey } = req.body;

      console.log('Registration attempt:', { email, firstName, lastName, isAdminAttempt: !!adminSecretKey });

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        console.log('Registration failed: User already exists');
        return res.status(400).json({ message: 'User already exists' });
      }

      // Check if this is an admin registration
      let isAdmin = false;
      if (adminSecretKey) {
        console.log('Admin registration attempt');
        if (!process.env.ADMIN_SECRET_KEY) {
          console.error('ADMIN_SECRET_KEY not found in environment variables');
          return res.status(500).json({ message: 'Server configuration error' });
        }
        
        if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
          console.log('Admin registration failed: Invalid secret key');
          return res.status(403).json({ message: 'Invalid admin secret key' });
        }
        console.log('Admin secret key verified');
        isAdmin = true;
      }

      // Create new user
      const user = new User({
        username: username || email.split('@')[0], // Use email as username if not provided
        email,
        password,
        firstName,
        lastName,
        isAdmin
      });

      await user.save();
      console.log('User created successfully:', { userId: user._id, isAdmin });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
          isInstructor: user.isInstructor,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        message: 'Error registering user', 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Validate password
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
          isInstructor: user.isInstructor,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  },

  // Get current user
  async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
  },

  // Logout user
  async logout(req, res) {
    try {
      req.session.destroy();
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error logging out', error: error.message });
    }
  },

  // Promote user to admin
  async promoteToAdmin(req, res) {
    try {
      const { userId, adminSecretKey } = req.body;

      // Verify admin secret key
      if (!adminSecretKey || adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({ message: 'Invalid admin secret key' });
      }

      // Find and update user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.isAdmin = true;
      await user.save();

      res.json({
        message: 'User promoted to admin successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
          isInstructor: user.isInstructor,
        },
      });
    } catch (error) {
      console.error('Error promoting user to admin:', error);
      res.status(500).json({ 
        message: 'Error promoting user to admin',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
};

module.exports = authController; 