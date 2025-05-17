import { Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Courses from './pages/Courses.jsx';
import Categories from './pages/Categories.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Admin from './pages/Admin.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import CreateFirstAdmin from './pages/CreateFirstAdmin.jsx';
import { useAuth } from './contexts/AuthContext.jsx';

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

// Routes configuration
const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/create-first-admin',
    element: <CreateFirstAdmin />,
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
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/courses/new',
    element: (
      <ProtectedRoute requireAdmin>
        <Admin />
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
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
];

export default routes; 