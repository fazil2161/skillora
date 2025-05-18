const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authController = {
  // Register a new user
  async register(req, res) {
    try {
      const { username, email, password, firstName, lastName, adminSecretKey } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Check if this is an admin registration
      let isAdmin = false;
      if (adminSecretKey) {
        if (!process.env.ADMIN_SECRET_KEY) {
          console.error('ADMIN_SECRET_KEY not found in environment variables');
          return res.status(500).json({ message: 'Server configuration error' });
        }
        
        if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
          return res.status(403).json({ message: 'Invalid admin secret key' });
        }
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

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Return user data without sensitive information
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
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Error registering user', error: error.message });
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

      // Log the user object from database
      console.log('User found in database:', {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        firstName: user.firstName,
        lastName: user.lastName
      });

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

      // Create response object
      const responseObj = {
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: Boolean(user.isAdmin), // Ensure proper boolean conversion
        },
      };

      // Log the response being sent
      console.log('Sending login response:', responseObj);

      res.json(responseObj);
    } catch (error) {
      console.error('Login error:', error);
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
      console.log('Sending user data:', user); // Debug log
      res.json({
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: Boolean(user.isAdmin), // Ensure boolean conversion
      });
    } catch (error) {
      console.error('Error fetching current user:', error);
      res.status(500).json({ message: 'Error fetching user data' });
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
      const { userId } = req.body;

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
        },
      });
    } catch (error) {
      console.error('Error promoting user to admin:', error);
      res.status(500).json({ message: 'Error promoting user to admin' });
    }
  },
};

module.exports = authController; 