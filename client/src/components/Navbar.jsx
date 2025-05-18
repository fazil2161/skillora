import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white hover:text-gray-200 transition-colors">
              Skillora
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link
                to="/courses"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Courses
              </Link>
              <Link
                to="/categories"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Categories
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {!user.isAdmin && (
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                {user.isAdmin && (
                  <div className="relative">
                    <button
                      onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                      className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                    >
                      <span>Admin</span>
                      <svg
                        className={`h-4 w-4 transition-transform ${isAdminMenuOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isAdminMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1" role="menu">
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/admin/courses/new"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Add New Course
                          </Link>
                          <Link
                            to="/admin/categories/new"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Add New Category
                          </Link>
                          <Link
                            to="/admin/users"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Manage Users
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 