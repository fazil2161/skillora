const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

const enrollmentController = {
  // Get user's enrollments
  async getUserEnrollments(req, res) {
    try {
      const enrollments = await Enrollment.find({ userId: req.user.userId })
        .populate('courseId', 'title thumbnailUrl')
        .sort('-createdAt');

      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching enrollments', error: error.message });
    }
  },

  // Enroll in a course
  async enrollCourse(req, res) {
    try {
      const { courseId } = req.body;

      // Check if already enrolled
      const existingEnrollment = await Enrollment.findOne({
        userId: req.user.userId,
        courseId,
      });

      if (existingEnrollment) {
        return res.status(400).json({ message: 'Already enrolled in this course' });
      }

      // Check if course exists
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      const enrollment = new Enrollment({
        userId: req.user.userId,
        courseId,
        completedLessons: [],
        progressPercent: 0,
      });

      await enrollment.save();
      res.status(201).json(enrollment);
    } catch (error) {
      res.status(500).json({ message: 'Error enrolling in course', error: error.message });
    }
  },

  // Update progress
  async updateProgress(req, res) {
    try {
      const { completedLessons, progressPercent } = req.body;

      const enrollment = await Enrollment.findOne({
        userId: req.user.userId,
        courseId: req.params.courseId,
      });

      if (!enrollment) {
        return res.status(404).json({ message: 'Enrollment not found' });
      }

      enrollment.completedLessons = completedLessons;
      enrollment.progressPercent = progressPercent;
      await enrollment.save();

      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ message: 'Error updating progress', error: error.message });
    }
  },

  // Get course progress
  async getCourseProgress(req, res) {
    try {
      const enrollment = await Enrollment.findOne({
        userId: req.user.userId,
        courseId: req.params.courseId,
      });

      if (!enrollment) {
        return res.status(404).json({ message: 'Enrollment not found' });
      }

      res.json({
        completedLessons: enrollment.completedLessons,
        progressPercent: enrollment.progressPercent,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching progress', error: error.message });
    }
  },
};

module.exports = enrollmentController; 