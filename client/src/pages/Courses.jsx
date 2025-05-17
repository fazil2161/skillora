import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import CourseCard from '../components/CourseCard';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    level: searchParams.get('level') || '',
    price: searchParams.get('price') || '',
    sort: searchParams.get('sort') || 'newest',
    search: searchParams.get('search') || '',
  });

  // Sample courses data
  const sampleCourses = [
    {
      _id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Learn full-stack web development from scratch with HTML, CSS, JavaScript, React, Node.js, and MongoDB.',
      thumbnailUrl: 'https://placehold.co/600x400/2563eb/FFFFFF/png?text=Web+Development',
      instructorId: { firstName: 'John', lastName: 'Doe' },
      price: 9900,
      level: 'Intermediate',
      category: '1',
      rating: 4.8,
      studentsEnrolled: 1500
    },
    {
      _id: '2',
      title: 'Data Science Fundamentals',
      description: 'Master the basics of data science, including Python, statistics, machine learning, and data visualization.',
      thumbnailUrl: 'https://placehold.co/600x400/2563eb/FFFFFF/png?text=Data+Science',
      instructorId: { firstName: 'Sarah', lastName: 'Smith' },
      price: 8900,
      level: 'Beginner',
      category: '1',
      rating: 4.7,
      studentsEnrolled: 1200
    },
    {
      _id: '3',
      title: 'Business Strategy Masterclass',
      description: 'Learn how to develop and implement effective business strategies for growth and success.',
      thumbnailUrl: 'https://placehold.co/600x400/2563eb/FFFFFF/png?text=Business',
      instructorId: { firstName: 'Michael', lastName: 'Johnson' },
      price: 7900,
      level: 'Advanced',
      category: '2',
      rating: 4.9,
      studentsEnrolled: 800
    },
    {
      _id: '4',
      title: 'UI/UX Design Essentials',
      description: 'Master modern UI/UX design principles and tools like Figma, Adobe XD, and design thinking.',
      thumbnailUrl: 'https://placehold.co/600x400/2563eb/FFFFFF/png?text=UI+Design',
      instructorId: { firstName: 'Emma', lastName: 'Wilson' },
      price: 8500,
      level: 'Intermediate',
      category: '3',
      rating: 4.6,
      studentsEnrolled: 950
    },
    {
      _id: '5',
      title: 'Digital Marketing Strategy',
      description: 'Learn comprehensive digital marketing strategies including SEO, social media, and content marketing.',
      thumbnailUrl: 'https://placehold.co/600x400/2563eb/FFFFFF/png?text=Marketing',
      instructorId: { firstName: 'David', lastName: 'Brown' },
      price: 7500,
      level: 'Beginner',
      category: '4',
      rating: 4.7,
      studentsEnrolled: 1100
    },
    {
      _id: '6',
      title: 'Mobile App Development with React Native',
      description: 'Build cross-platform mobile apps using React Native and modern JavaScript.',
      thumbnailUrl: 'https://placehold.co/600x400/2563eb/FFFFFF/png?text=Mobile+Dev',
      instructorId: { firstName: 'Alex', lastName: 'Chen' },
      price: 9500,
      level: 'Intermediate',
      category: '1',
      rating: 4.8,
      studentsEnrolled: 750
    }
  ];

  // Filter and sort the sample courses based on filters
  const filteredCourses = sampleCourses.filter(course => {
    if (filters.category && course.category !== filters.category) return false;
    if (filters.level && course.level !== filters.level) return false;
    if (filters.search && !course.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.price) {
      const [min, max] = filters.price.split('-').map(Number);
      if (max === 0 && course.price !== 0) return false;
      if (min > 0 && course.price < min) return false;
      if (max > 0 && course.price > max) return false;
    }
    return true;
  }).sort((a, b) => {
    switch (filters.sort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'newest':
      default:
        return b._id.localeCompare(a._id);
    }
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const priceRanges = [
    { label: 'All', value: '' },
    { label: 'Free', value: '0-0' },
    { label: 'Under $50', value: '0-5000' },
    { label: '$50 - $100', value: '5000-10000' },
    { label: 'Over $100', value: '10000-' },
  ];
  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search courses..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="border rounded-lg px-4 py-2"
          />

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Categories</option>
            <option value="1">Programming</option>
            <option value="2">Business</option>
            <option value="3">Design</option>
            <option value="4">Marketing</option>
          </select>

          {/* Level Filter */}
          <select
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Levels</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>

          {/* Price Filter */}
          <select
            value={filters.price}
            onChange={(e) => handleFilterChange('price', e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          {/* Sort Filter */}
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700">No courses found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};

export default Courses; 