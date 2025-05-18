const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', auth, authController.getCurrentUser);

// Admin routes
router.post('/promote-to-admin', [auth, admin], authController.promoteToAdmin);

module.exports = router; 