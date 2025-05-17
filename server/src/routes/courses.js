const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', courseController.getCourses);
router.get('/featured', courseController.getFeaturedCourses);
router.get('/:id', courseController.getCourse);

// Protected routes
router.post('/', auth, courseController.createCourse);
router.put('/:id', auth, courseController.updateCourse);
router.delete('/:id', auth, courseController.deleteCourse);

module.exports = router; 