import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function CourseDetails() {
  const { courseId } = useParams();
  
  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{course?.title}</h1>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {course?.thumbnailUrl && (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-blue-600">
                ${(course?.price / 100).toFixed(2)}
              </span>
              <span className="text-gray-600">{course?.level}</span>
            </div>
            <p className="text-gray-700 mb-4">{course?.description}</p>
            <div className="border-t pt-4">
              <h2 className="text-xl font-semibold mb-2">Instructor</h2>
              <p className="text-gray-600">
                {course?.instructorId.firstName} {course?.instructorId.lastName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 