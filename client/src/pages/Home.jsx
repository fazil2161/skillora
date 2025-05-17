import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaLaptopCode, FaBusinessTime, FaPalette, FaChartLine, FaBook, FaSearch, FaCreditCard, FaCertificate, FaWhatsapp, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Home = () => {
  // Add check for existing admin
  const { data: adminExists } = useQuery({
    queryKey: ['adminExists'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/users/admin/exists');
        return response.data.exists;
      } catch (error) {
        return false;
      }
    }
  });

  // Sample courses data while API is not available
  const sampleCourses = [
    {
      _id: '1',
      title: 'Complete Web Development Bootcamp',
      thumbnailUrl: 'https://placehold.co/600x400/2563eb/FFFFFF/png?text=Web+Development',
      instructorId: { firstName: 'John', lastName: 'Doe' },
      price: 9900,
      level: 'Intermediate'
    },
    {
      _id: '2',
      title: 'Data Science Fundamentals',
      thumbnailUrl: 'https://placehold.co/600x400/2563eb/FFFFFF/png?text=Data+Science',
      instructorId: { firstName: 'Sarah', lastName: 'Smith' },
      price: 8900,
      level: 'Beginner'
    },
    {
      _id: '3',
      title: 'UI/UX Design Masterclass',
      thumbnailUrl: 'https://placehold.co/600x400/2563eb/FFFFFF/png?text=UI+Design',
      instructorId: { firstName: 'Mike', lastName: 'Johnson' },
      price: 7900,
      level: 'Advanced'
    }
  ];

  // Update sample categories with new color scheme
  const sampleCategories = [
    { _id: '1', name: 'Programming', icon: <FaLaptopCode className="text-4xl mb-3" />, colorClass: 'bg-gradient-to-br from-blue-400 to-blue-500 text-white' },
    { _id: '2', name: 'Business', icon: <FaBusinessTime className="text-4xl mb-3" />, colorClass: 'bg-gradient-to-br from-green-400 to-green-500 text-white' },
    { _id: '3', name: 'Design', icon: <FaPalette className="text-4xl mb-3" />, colorClass: 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' },
    { _id: '4', name: 'Marketing', icon: <FaChartLine className="text-4xl mb-3" />, colorClass: 'bg-gradient-to-br from-red-400 to-red-500 text-white' }
  ];

  return (
    <div className="space-y-16">
      {/* Show admin creation button if no admin exists */}
      {adminExists === false && (
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <p className="text-gray-700">No admin account found</p>
              <Link
                to="/create-first-admin"
                className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Create Admin Account
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section - Updated with new gradient */}
      <section className="text-center py-24 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Learn New Skills Online
        </h1>
        <p className="text-xl mb-8 text-gray-300">
          Access thousands of courses from expert instructors
        </p>
        <Link
          to="/courses"
          className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 hover:shadow-xl"
        >
          Browse Courses
        </Link>
      </section>

      {/* Featured Courses */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Featured Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sampleCourses.map((course) => (
            <Link
              key={course._id}
              to={`/courses/${course._id}`}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{course.title}</h3>
                <p className="text-gray-600 mb-4">
                  By {course.instructorId.firstName} {course.instructorId.lastName}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-bold text-lg">
                    ${(course.price / 100).toFixed(2)}
                  </span>
                  <span className="text-gray-600 text-sm px-3 py-1 bg-gray-100 rounded-full">
                    {course.level}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaSearch className="text-3xl text-gray-100" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Find Your Course</h3>
              <p className="text-gray-400">
                Browse through our extensive collection of courses
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCreditCard className="text-3xl text-gray-100" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Enroll & Learn</h3>
              <p className="text-gray-400">
                Purchase and get instant access to your courses
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCertificate className="text-3xl text-gray-100" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Get Certified</h3>
              <p className="text-gray-400">
                Complete courses and earn certificates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {sampleCategories.map((category) => (
            <Link
              key={category._id}
              to={`/courses?category=${category._id}`}
              className={`${category.colorClass} rounded-xl p-8 text-center hover:opacity-90 transition duration-300 transform hover:-translate-y-1 hover:shadow-xl`}
            >
              {category.icon}
              <h3 className="font-semibold text-lg">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4 text-gray-100">Skillora</h4>
              <p className="text-gray-400">
                Empowering learners worldwide with quality education
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4 text-gray-100">Contact Us</h4>
              <p className="text-gray-400">
                123 Tech Park<br />
                Bangalore - 560029<br />
                Karnataka, India<br />
                <span className="mt-2 block">Email: info@skillora.com</span>
                <span className="block">Phone: +91 1234567890</span>
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4 text-gray-100">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4 text-gray-100">Connect With Us</h4>
              <div className="flex space-x-6">
                <a 
                  href="https://wa.me/1234567890" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-3xl text-gray-400 hover:text-green-400 transition-colors"
                  aria-label="Connect on WhatsApp"
                >
                  <FaWhatsapp />
                </a>
                <a 
                  href="https://linkedin.com/company/skillora" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-3xl text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label="Follow on LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a 
                  href="https://twitter.com/skillora" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-3xl text-gray-400 hover:text-blue-300 transition-colors"
                  aria-label="Follow on Twitter"
                >
                  <FaTwitter />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Skillora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 