import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['userEnrollments'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:5000/api/enrollments', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return response.data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-40 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Learning Dashboard</h1>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Courses Enrolled</h3>
          <p className="text-3xl font-bold text-blue-600">
            {enrollments?.length || 0}
          </p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Completed Courses</h3>
          <p className="text-3xl font-bold text-green-600">
            {enrollments?.filter((e) => e.progressPercent === 100).length || 0}
          </p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Hours Learned</h3>
          <p className="text-3xl font-bold text-purple-600">
            {enrollments?.reduce((acc, curr) => acc + (curr.courseId.durationHours || 0), 0) || 0}
          </p>
        </div>
      </div>

      {/* Enrolled Courses */}
      <h2 className="text-2xl font-bold mb-6">My Courses</h2>
      {enrollments?.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">No courses enrolled yet</h3>
          <p className="text-gray-600 mb-6">Start learning by enrolling in a course</p>
          <Link
            to="/courses"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrollments?.map((enrollment) => (
            <Link
              key={enrollment._id}
              to={`/courses/${enrollment.courseId._id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative">
                <img
                  src={enrollment.courseId.thumbnailUrl}
                  alt={enrollment.courseId.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm">
                  {enrollment.progressPercent}% Complete
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">
                  {enrollment.courseId.title}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {enrollment.courseId.durationHours} hours
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${enrollment.progressPercent}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-500">
                    Last accessed: {new Date(enrollment.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Achievements Section */}
      <h2 className="text-2xl font-bold mt-12 mb-6">Achievements</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Course Completion Achievement */}
        <div className={`p-6 rounded-lg text-center ${
          enrollments?.some(e => e.progressPercent === 100)
            ? 'bg-yellow-100'
            : 'bg-gray-100'
        }`}>
          <i className="fas fa-graduation-cap text-3xl mb-3 text-yellow-600"></i>
          <h3 className="font-semibold">First Course Completed</h3>
        </div>
        
        {/* Fast Learner Achievement */}
        <div className={`p-6 rounded-lg text-center ${
          enrollments?.length >= 5 ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          <i className="fas fa-bolt text-3xl mb-3 text-blue-600"></i>
          <h3 className="font-semibold">Fast Learner</h3>
          <p className="text-sm text-gray-600">Enrolled in 5+ courses</p>
        </div>

        {/* Perfect Score Achievement */}
        <div className={`p-6 rounded-lg text-center ${
          enrollments?.some(e => e.progressPercent === 100)
            ? 'bg-green-100'
            : 'bg-gray-100'
        }`}>
          <i className="fas fa-star text-3xl mb-3 text-green-600"></i>
          <h3 className="font-semibold">Perfect Score</h3>
          <p className="text-sm text-gray-600">100% completion</p>
        </div>

        {/* Dedicated Learner Achievement */}
        <div className={`p-6 rounded-lg text-center ${
          enrollments?.reduce((acc, curr) => acc + curr.courseId.durationHours, 0) >= 50
            ? 'bg-purple-100'
            : 'bg-gray-100'
        }`}>
          <i className="fas fa-clock text-3xl mb-3 text-purple-600"></i>
          <h3 className="font-semibold">Dedicated Learner</h3>
          <p className="text-sm text-gray-600">50+ hours of learning</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 