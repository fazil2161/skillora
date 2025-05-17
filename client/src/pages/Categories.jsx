import React from 'react';
import { Link } from 'react-router-dom';
import { FaLaptopCode, FaBusinessTime, FaPalette, FaChartLine, FaLanguage, FaMusic, FaCamera, FaHeartbeat, FaCode, FaDatabase, FaMobile, FaCloud } from 'react-icons/fa';

const Categories = () => {
  const categories = [
    {
      id: '1',
      name: 'Software Development',
      icon: <FaLaptopCode className="text-5xl mb-4" />,
      description: 'Web development, programming languages, and software engineering',
      subcategories: ['Web Development', 'Mobile Development', 'Cloud Computing'],
      courses: 150,
      colorClass: 'from-blue-400 to-blue-500'
    },
    {
      id: '2',
      name: 'Business',
      icon: <FaBusinessTime className="text-5xl mb-4" />,
      description: 'Business strategy, entrepreneurship, and management',
      subcategories: ['Entrepreneurship', 'Management', 'Finance'],
      courses: 120,
      colorClass: 'from-green-400 to-green-500'
    },
    {
      id: '3',
      name: 'Design',
      icon: <FaPalette className="text-5xl mb-4" />,
      description: 'UI/UX design, graphic design, and digital art',
      subcategories: ['UI/UX Design', 'Graphic Design', 'Motion Graphics'],
      courses: 85,
      colorClass: 'from-yellow-400 to-yellow-500'
    },
    {
      id: '4',
      name: 'Marketing',
      icon: <FaChartLine className="text-5xl mb-4" />,
      description: 'Digital marketing, SEO, and social media strategies',
      subcategories: ['Digital Marketing', 'Social Media', 'Content Marketing'],
      courses: 95,
      colorClass: 'from-red-400 to-red-500'
    },
    {
      id: '5',
      name: 'Programming Languages',
      icon: <FaCode className="text-5xl mb-4" />,
      description: 'Python, JavaScript, Java, and other programming languages',
      subcategories: ['Python', 'JavaScript', 'Java'],
      courses: 75,
      colorClass: 'from-purple-400 to-purple-500'
    },
    {
      id: '6',
      name: 'Data Science',
      icon: <FaDatabase className="text-5xl mb-4" />,
      description: 'Data analysis, machine learning, and artificial intelligence',
      subcategories: ['Machine Learning', 'Data Analysis', 'AI'],
      courses: 60,
      colorClass: 'from-pink-400 to-pink-500'
    },
    {
      id: '7',
      name: 'Mobile Development',
      icon: <FaMobile className="text-5xl mb-4" />,
      description: 'iOS, Android, and cross-platform mobile development',
      subcategories: ['iOS', 'Android', 'React Native'],
      courses: 45,
      colorClass: 'from-indigo-400 to-indigo-500'
    },
    {
      id: '8',
      name: 'Cloud Computing',
      icon: <FaCloud className="text-5xl mb-4" />,
      description: 'AWS, Azure, and cloud infrastructure',
      subcategories: ['AWS', 'Azure', 'DevOps'],
      courses: 80,
      colorClass: 'from-teal-400 to-teal-500'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Categories</h1>
      <p className="text-gray-600 mb-8">Discover top courses in your favorite categories</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/courses?category=${category.id}`}
            className={`bg-gradient-to-br ${category.colorClass} text-white rounded-xl p-6 hover:shadow-xl transition duration-300 transform hover:-translate-y-1`}
          >
            <div className="text-center">
              {category.icon}
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-100 text-sm mb-4">{category.description}</p>
              <div className="text-sm space-y-1">
                {category.subcategories.map((sub, index) => (
                  <div key={index} className="text-gray-100">
                    {sub}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm font-medium border-t border-white/20 pt-4">
                {category.courses}+ courses
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories; 