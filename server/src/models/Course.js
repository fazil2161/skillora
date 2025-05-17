const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  url: {
    type: String,
    required: true
  },
  duration: Number, // in seconds
  thumbnail: String,
  order: {
    type: Number,
    required: true
  }
});

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  order: {
    type: Number,
    required: true
  },
  videos: [videoSchema]
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  sections: [sectionSchema],
  totalDuration: Number, // in seconds
  totalVideos: Number,
  rating: {
    type: Number,
    default: 0
  },
  enrollments: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculate total duration and videos before saving
courseSchema.pre('save', function(next) {
  let totalDuration = 0;
  let totalVideos = 0;

  this.sections.forEach(section => {
    section.videos.forEach(video => {
      totalDuration += video.duration || 0;
      totalVideos += 1;
    });
  });

  this.totalDuration = totalDuration;
  this.totalVideos = totalVideos;
  next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course; 