const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);

// Admin routes
router.post('/', [auth, admin], categoryController.createCategory);
router.put('/:id', [auth, admin], categoryController.updateCategory);
router.delete('/:id', [auth, admin], categoryController.deleteCategory);

module.exports = router; 