import { Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Courses from './pages/Courses.jsx';
import Categories from './pages/Categories.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Admin from './pages/Admin.jsx';
import AddNewAdmin from './pages/AddNewAdmin.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import CreateFirstAdmin from './pages/CreateFirstAdmin.jsx';
import AddCourse from './pages/AddCourse.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import { useState, useEffect } from 'react';
import axios from './utils/axios';

// Protected Route wrapper
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Check if any admin exists wrapper
const CreateFirstAdminRoute = ({ children }) => {
  const { user } = useAuth();
  const [adminExists, setAdminExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axios.get('/users/check-admin');
        setAdminExists(response.data.exists);
      } catch (error) {
        console.error('Error checking admin existence:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (user || adminExists) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Routes configuration
const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/create-first-admin',
    element: (
      <CreateFirstAdminRoute>
        <CreateFirstAdmin />
      </CreateFirstAdminRoute>
    ),
  },
  {
    path: '/categories',
    element: <Categories />,
  },
  {
    path: '/courses',
    element: <Courses />,
  },
  {
    path: '/courses/:courseId',
    element: <CourseDetails />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  // Admin Routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute requireAdmin>
        <Navigate to="/admin" replace />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/courses/new',
    element: (
      <ProtectedRoute requireAdmin>
        <AddCourse />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/courses/:courseId/edit',
    element: (
      <ProtectedRoute requireAdmin>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/categories/new',
    element: (
      <ProtectedRoute requireAdmin>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/categories/:categoryId/edit',
    element: (
      <ProtectedRoute requireAdmin>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <ProtectedRoute requireAdmin>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/users/new-admin',
    element: (
      <ProtectedRoute requireAdmin>
        <AddNewAdmin />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
];

export default routes; 