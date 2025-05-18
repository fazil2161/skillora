require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/users', require('./routes/users'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/reviews', require('./routes/reviews'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB and start server
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB at:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Database connection established successfully.');
    
    // Check if admin exists, if not create one
    try {
      const adminExists = await User.findOne({ email: 'fazilmohammed377@gmail.com' });
      console.log('Checking for admin:', adminExists);
      
      if (!adminExists) {
        console.log('No admin found, creating default admin...');
        const adminUser = new User({
          username: 'fazil',
          email: 'fazilmohammed377@gmail.com',
          password: 'admin123', // This will be hashed by the pre-save hook
          firstName: 'Fazil',
          lastName: 'Mohammed',
          isAdmin: true
        });
        
        await adminUser.save();
        console.log('Default admin created successfully');
      } else if (!adminExists.isAdmin) {
        // If user exists but is not admin, make them admin
        adminExists.isAdmin = true;
        await adminExists.save();
        console.log('Existing user promoted to admin');
      }
    } catch (error) {
      console.error('Error checking/creating admin:', error);
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  }); 