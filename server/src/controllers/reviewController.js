const Review = require('../models/Review');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const reviewController = {
  // Get course reviews
  async getCourseReviews(req, res) {
    try {
      const reviews = await Review.find({ courseId: req.params.courseId })
        .populate('userId', 'username firstName lastName avatarUrl')
        .sort('-createdAt');

      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
  },

  // Create review
  async createReview(req, res) {
    try {
      const { courseId } = req.params;
      const { rating, comment } = req.body;

      // Check if user is enrolled in the course
      const enrollment = await Enrollment.findOne({
        userId: req.user.userId,
        courseId,
      });

      if (!enrollment) {
        return res.status(403).json({ message: 'Must be enrolled to review' });
      }

      // Check if user already reviewed
      const existingReview = await Review.findOne({
        userId: req.user.userId,
        courseId,
      });

      if (existingReview) {
        return res.status(400).json({ message: 'Already reviewed this course' });
      }

      const review = new Review({
        userId: req.user.userId,
        courseId,
        rating,
        comment,
      });

      await review.save();

      // Populate user data before sending response
      await review.populate('userId', 'username firstName lastName avatarUrl');
      
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ message: 'Error creating review', error: error.message });
    }
  },

  // Update review
  async updateReview(req, res) {
    try {
      const { rating, comment } = req.body;

      const review = await Review.findOne({
        _id: req.params.reviewId,
        userId: req.user.userId,
      });

      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      review.rating = rating;
      review.comment = comment;
      await review.save();

      await review.populate('userId', 'username firstName lastName avatarUrl');

      res.json(review);
    } catch (error) {
      res.status(500).json({ message: 'Error updating review', error: error.message });
    }
  },

  // Delete review
  async deleteReview(req, res) {
    try {
      const review = await Review.findOne({
        _id: req.params.reviewId,
        userId: req.user.userId,
      });

      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      await review.remove();
      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
  },
};

module.exports = reviewController; 