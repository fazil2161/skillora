import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import './Courses.css';

// Import course images with meaningful names
import webDevThumbnail from '../assets/webdev.png';
import dataScience from '../assets/data science.jpg';
import businessStrategy from '../assets/business.jpg';
import uiuxDesign from '../assets/ui design.avif';
import digitalMarketing from '../assets/marketing.webp';
import mobileAppDev from '../assets/mobile dev.jpg';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const PRICE_FILTERS = [
  { label: 'All Prices', value: '' },
  { label: 'Free', value: '0-0' },
  { label: 'Under $50', value: '0-5000' },
  { label: '$50 - $100', value: '5000-10000' },
  { label: '$100+', value: '10000-' },
];

const SORT_OPTIONS = [
  { label: 'Latest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    level: searchParams.get('level') || '',
    price: searchParams.get('price') || '',
    sort: searchParams.get('sort') || 'newest',
    search: searchParams.get('search') || '',
  });

  // Demo courses data - will be replaced with API data
  const courseCatalog = [
    {
      _id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Learn full-stack web development from scratch with HTML, CSS, JavaScript, React, Node.js, and MongoDB.',
      thumbnailUrl: webDevThumbnail,
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
      thumbnailUrl: dataScience,
      instructorId: { firstName: 'Sarah', lastName: 'Smith' },
      price: 8900,
      level: 'Beginner',
      category: '1',
      rating: 4.7,
      studentsEnrolled: 1200
    },
    {
      _id: '3',
      title: 'Business Strategy & Management',
      description: 'Learn essential business strategies, management techniques, and leadership skills for the modern workplace.',
      thumbnailUrl: businessStrategy,
      instructorId: { firstName: 'Michael', lastName: 'Johnson' },
      price: 7900,
      level: 'Advanced',
      category: '2',
      rating: 4.9,
      studentsEnrolled: 980
    },
    {
      _id: '4',
      title: 'UI/UX Design Masterclass',
      description: 'Master the art of user interface and user experience design with modern tools and methodologies.',
      thumbnailUrl: uiuxDesign,
      instructorId: { firstName: 'Emma', lastName: 'Wilson' },
      price: 8500,
      level: 'Intermediate',
      category: '3',
      rating: 4.6,
      studentsEnrolled: 750
    },
    {
      _id: '5',
      title: 'Digital Marketing Essentials',
      description: 'Learn comprehensive digital marketing strategies including SEO, social media, and content marketing.',
      thumbnailUrl: digitalMarketing,
      instructorId: { firstName: 'David', lastName: 'Brown' },
      price: 6900,
      level: 'Beginner',
      category: '4',
      rating: 4.5,
      studentsEnrolled: 1100
    },
    {
      _id: '6',
      title: 'Mobile App Development',
      description: 'Build iOS and Android applications using React Native and modern mobile development practices.',
      thumbnailUrl: mobileAppDev,
      instructorId: { firstName: 'Lisa', lastName: 'Anderson' },
      price: 9500,
      level: 'Advanced',
      category: '1',
      rating: 4.7,
      studentsEnrolled: 850
    }
  ];

  const filterCourses = () => {
    return courseCatalog.filter(course => {
      const matchesCategory = !filters.category || course.category === filters.category;
      const matchesLevel = !filters.level || course.level === filters.level;
      const matchesSearch = !filters.search || 
        course.title.toLowerCase().includes(filters.search.toLowerCase());
      
      if (!matchesCategory || !matchesLevel || !matchesSearch) return false;

      if (filters.price) {
        const [min, max] = filters.price.split('-').map(Number);
        if (max === 0 && course.price !== 0) return false;
        if (min > 0 && course.price < min) return false;
        if (max > 0 && course.price > max) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        default: return b._id.localeCompare(a._id);
      }
    });
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredCourses = filterCourses();

  return (
    <div className="courses-page">
      <header className="page-header">
        <h1>Explore Courses</h1>
        <p>Discover your next learning adventure</p>
      </header>

      <section className="filters-section">
        <input
          type="text"
          placeholder="Search for courses..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="search-input"
        />

        <div className="filter-controls">
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="1">Programming</option>
            <option value="2">Business</option>
            <option value="3">Design</option>
            <option value="4">Marketing</option>
          </select>

          <select
            value={filters.level}
            onChange={(e) => updateFilter('level', e.target.value)}
          >
            <option value="">All Levels</option>
            {LEVELS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          <select
            value={filters.price}
            onChange={(e) => updateFilter('price', e.target.value)}
          >
            {PRICE_FILTERS.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="courses-grid">
        {filteredCourses.map(course => (
          <CourseCard key={course._id} course={course} />
        ))}
        
        {filteredCourses.length === 0 && (
          <div className="no-results">
            <h3>No courses found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Courses; 