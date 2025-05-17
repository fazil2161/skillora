const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { generateUploadSignature, getVideoDetails, deleteVideo } = require('../utils/cloudinary');

// Get upload signature (admin only)
router.post('/upload-signature', [auth, admin], async (req, res) => {
  try {
    const uploadParams = generateUploadSignature();
    res.json(uploadParams);
  } catch (error) {
    console.error('Upload signature generation error:', error);
    res.status(500).json({ 
      message: 'Error generating upload signature',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Add video to course section (admin only)
router.post('/courses/:courseId/sections/:sectionId/videos', [auth, admin], async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { title, description, publicId } = req.body;

    // Validate required fields
    if (!title || !publicId) {
      return res.status(400).json({ 
        message: 'Title and publicId are required' 
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const section = course.sections.id(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Check if video already exists
    const videoExists = section.videos.some(video => video.url === publicId);
    if (videoExists) {
      return res.status(400).json({ 
        message: 'A video with this ID already exists in this section' 
      });
    }

    // Get video details from Cloudinary
    const videoDetails = await getVideoDetails(publicId);

    // Calculate new order
    const newOrder = section.videos.length + 1;

    section.videos.push({
      title,
      description: description || '',
      url: publicId,
      duration: videoDetails.duration,
      thumbnail: videoDetails.thumbnail,
      order: newOrder
    });

    // Reorder videos if necessary
    section.videos.sort((a, b) => a.order - b.order);
    await course.save();

    res.json(course);
  } catch (error) {
    console.error('Video addition error:', error);
    res.status(500).json({ 
      message: 'Error adding video to course',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get video details (for enrolled users)
router.get('/details/:publicId', auth, async (req, res) => {
  try {
    const { publicId } = req.params;
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
      status: 'active'
    });

    if (!enrollment) {
      return res.status(403).json({ 
        message: 'Access denied. You must be enrolled in this course to view its videos.' 
      });
    }

    // Verify video belongs to the course
    const videoExists = course.sections.some(section => 
      section.videos.some(video => video.url === publicId)
    );

    if (!videoExists) {
      return res.status(404).json({ 
        message: 'Video not found in this course' 
      });
    }

    const videoDetails = await getVideoDetails(publicId);
    res.json(videoDetails);
  } catch (error) {
    console.error('Video details error:', error);
    res.status(500).json({ 
      message: 'Error getting video details',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete video (admin only)
router.delete('/:publicId', [auth, admin], async (req, res) => {
  try {
    const { publicId } = req.params;
    const { courseId, sectionId } = req.query;

    if (!courseId || !sectionId) {
      return res.status(400).json({ 
        message: 'Course ID and Section ID are required' 
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const section = course.sections.id(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const videoIndex = section.videos.findIndex(video => video.url === publicId);
    if (videoIndex === -1) {
      return res.status(404).json({ 
        message: 'Video not found in this section' 
      });
    }

    // Remove video from section
    section.videos.splice(videoIndex, 1);

    // Reorder remaining videos
    section.videos.forEach((video, index) => {
      video.order = index + 1;
    });

    await course.save();

    // Delete from Cloudinary
    try {
      await deleteVideo(publicId);
    } catch (cloudinaryError) {
      console.error('Cloudinary deletion error:', cloudinaryError);
      // Continue even if Cloudinary deletion fails
    }

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Video deletion error:', error);
    res.status(500).json({ 
      message: 'Error deleting video',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 