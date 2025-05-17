const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

router.get('/', enrollmentController.getUserEnrollments);
router.post('/', enrollmentController.enrollCourse);
router.get('/:courseId/progress', enrollmentController.getCourseProgress);
router.put('/:courseId/progress', enrollmentController.updateProgress);

module.exports = router; 