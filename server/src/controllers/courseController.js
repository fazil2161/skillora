const Course = require('../models/Course');
const Section = require('../models/Section');
const Lesson = require('../models/Lesson');

const courseController = {
  // Get all courses with filters
  async getCourses(req, res) {
    try {
      const { category, level, price, sort, page = 1, limit = 10 } = req.query;
      const query = {};

      // Apply filters
      if (category) query.categoryId = category;
      if (level) query.level = level;
      if (price) {
        const [min, max] = price.split('-');
        query.price = {};
        if (min) query.price.$gte = min;
        if (max) query.price.$lte = max;
      }

      // Apply sorting
      let sortOption = {};
      if (sort === 'newest') sortOption = { createdAt: -1 };
      else if (sort === 'price-asc') sortOption = { price: 1 };
      else if (sort === 'price-desc') sortOption = { price: -1 };
      else sortOption = { createdAt: -1 }; // Default sort by newest

      const courses = await Course.find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('instructorId', 'username firstName lastName')
        .populate('categoryId', 'name');

      const total = await Course.countDocuments(query);

      res.json({
        courses,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCourses: total,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
  },

  // Get single course with sections and lessons
  async getCourse(req, res) {
    try {
      const course = await Course.findById(req.params.id)
        .populate('instructorId', 'username firstName lastName bio avatarUrl')
        .populate('categoryId', 'name');

      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      const sections = await Section.find({ courseId: course._id })
        .sort('order')
        .populate({
          path: 'lessons',
          model: 'Lesson',
          options: { sort: { order: 1 } },
        });

      res.json({ course, sections });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching course', error: error.message });
    }
  },

  // Create new course
  async createCourse(req, res) {
    try {
      const {
        title,
        description,
        price,
        categoryId,
        level,
        durationHours,
        thumbnailUrl,
      } = req.body;

      const course = new Course({
        title,
        slug: title.toLowerCase().replace(/ /g, '-'),
        description,
        price,
        categoryId,
        instructorId: req.user.userId,
        level,
        durationHours,
        thumbnailUrl,
      });

      await course.save();
      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ message: 'Error creating course', error: error.message });
    }
  },

  // Update course
  async updateCourse(req, res) {
    try {
      const course = await Course.findById(req.params.id);
      
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      // Check if user is the instructor
      if (course.instructorId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        { ...req.body, slug: req.body.title?.toLowerCase().replace(/ /g, '-') },
        { new: true }
      );

      res.json(updatedCourse);
    } catch (error) {
      res.status(500).json({ message: 'Error updating course', error: error.message });
    }
  },

  // Delete course
  async deleteCourse(req, res) {
    try {
      const course = await Course.findById(req.params.id);
      
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      // Check if user is the instructor
      if (course.instructorId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      await Course.findByIdAndDelete(req.params.id);
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting course', error: error.message });
    }
  },

  // Get featured courses
  async getFeaturedCourses(req, res) {
    try {
      const courses = await Course.find({ isFeatured: true })
        .limit(6)
        .populate('instructorId', 'username firstName lastName')
        .populate('categoryId', 'name');

      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching featured courses', error: error.message });
    }
  },
};

module.exports = courseController; 