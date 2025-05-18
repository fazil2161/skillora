require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.RENDER_EXTERNAL_URL
    : 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// MongoDB Connection URI
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Session configuration with MongoStore
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60,
    autoRemove: 'native',
    crypto: {
      secret: process.env.SESSION_SECRET
    },
    touchAfter: 24 * 3600
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
}));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files
  app.use(express.static(path.join(__dirname, '../../client/dist')));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    environment: process.env.NODE_ENV,
    port: PORT
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/users', require('./routes/users'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/reviews', require('./routes/reviews'));

// Handle all other routes by serving the index.html in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Initialize database and start server
async function startServer() {
  try {
    await connectDB();
    
    // Check/Create admin user
    const adminExists = await User.findOne({ email: 'fazilmohammed377@gmail.com' });
    
    if (!adminExists) {
      console.log('Creating default admin user...');
      const adminUser = new User({
        username: 'fazil',
        email: 'fazilmohammed377@gmail.com',
        password: 'admin123',
        firstName: 'Fazil',
        lastName: 'Mohammed',
        isAdmin: true
      });
      await adminUser.save();
      console.log('Default admin created successfully');
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Environment:', process.env.NODE_ENV);
    });
  } catch (error) {
    console.error('Server initialization error:', error);
    process.exit(1);
  }
}

startServer(); 