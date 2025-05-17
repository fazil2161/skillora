import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <Link
      to={`/courses/${course._id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
    >
      <img
        src={course.thumbnailUrl}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {course.description}
        </p>
        <p className="text-gray-600">
          By {course.instructorId.firstName} {course.instructorId.lastName}
        </p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-blue-600 font-semibold">
            ${(course.price / 100).toFixed(2)}
          </span>
          <div className="flex items-center">
            <span className="text-gray-500 text-sm mr-2">{course.level}</span>
            <span className="text-gray-500 text-sm">
              {course.durationHours}h
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard; 