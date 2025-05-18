import React from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.css'; // We'll create this next

const CourseCard = ({ course }) => {
  const formatStudentCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count;
  };

  return (
    <Link to={`/courses/${course._id}`} className="course-card">
      <div className="image-wrapper">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b/png?text=Course+Image';
          }}
        />
        <span className="level-badge">{course.level}</span>
      </div>
      
      <div className="content">
        <h3>{course.title}</h3>
        <p className="description">{course.description}</p>
        
        <div className="meta">
          <p className="instructor">
            By {course.instructorId.firstName} {course.instructorId.lastName}
          </p>
          
          <div className="stats">
            <span className="price">${(course.price / 100).toFixed(2)}</span>
            <span className="students">
              {formatStudentCount(course.studentsEnrolled)} students
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard; 