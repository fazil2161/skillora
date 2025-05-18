import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalEnrollments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [coursesRes, usersRes, categoriesRes, enrollmentsRes] = await Promise.all([
          axios.get('/courses/count'),
          axios.get('/users/count'),
          axios.get('/categories/count'),
          axios.get('/enrollments/count')
        ]);

        setStats({
          totalCourses: coursesRes.data.count,
          totalUsers: usersRes.data.count,
          totalCategories: categoriesRes.data.count,
          totalEnrollments: enrollmentsRes.data.count
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user?.firstName} {user?.lastName}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Courses</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {loading ? '...' : stats.totalCourses}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {loading ? '...' : stats.totalUsers}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Categories</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {loading ? '...' : stats.totalCategories}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Enrollments</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {loading ? '...' : stats.totalEnrollments}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/admin/courses/new"
              className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">Add New Course</h3>
              <p className="mt-2 text-sm text-gray-500">Create and publish a new course</p>
            </Link>
            <Link
              to="/admin/categories/new"
              className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">Add New Category</h3>
              <p className="mt-2 text-sm text-gray-500">Create a new course category</p>
            </Link>
            <Link
              to="/admin/users"
              className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">Manage Users</h3>
              <p className="mt-2 text-sm text-gray-500">View and manage user accounts</p>
            </Link>
            <Link
              to="/admin/users/new-admin"
              className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">Add New Admin</h3>
              <p className="mt-2 text-sm text-gray-500">Grant admin privileges to users</p>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white shadow rounded-lg">
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="p-6">
                  <p className="text-sm text-gray-500">Loading activity...</p>
                </div>
              ) : (
                <div className="p-6">
                  <p className="text-sm text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 