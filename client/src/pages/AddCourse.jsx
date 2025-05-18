import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';

const AddCourse = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
    level: 'Beginner',
    categoryId: '',
    thumbnail: null,
    sections: [{ title: '', description: '', videos: [] }]
  });
  const [currentSection, setCurrentSection] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories for dropdown
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('/categories');
      return response.data;
    },
  });

  // Handle course creation
  const createCourseMutation = useMutation({
    mutationFn: async (courseData) => {
      const formData = new FormData();
      Object.keys(courseData).forEach(key => {
        if (key !== 'sections') {
          formData.append(key, courseData[key]);
        }
      });
      formData.append('sections', JSON.stringify(courseData.sections));
      
      const response = await axios.post('/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    onSuccess: () => {
      navigate('/admin');
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Error creating course');
    }
  });

  // Handle thumbnail upload
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseData(prev => ({ ...prev, thumbnail: file }));
    }
  };

  // Handle video upload
  const handleVideoUpload = async (e, sectionIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('video', file);
      
      const response = await axios.post('/courses/upload-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newSections = [...courseData.sections];
      newSections[sectionIndex].videos.push({
        title: file.name,
        url: response.data.url,
        duration: response.data.duration
      });
      
      setCourseData(prev => ({ ...prev, sections: newSections }));
    } catch (error) {
      setError('Error uploading video');
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseData.thumbnail) {
      setError('Please upload a course thumbnail');
      return;
    }
    createCourseMutation.mutate(courseData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Course</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Course Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Course Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title
              </label>
              <input
                type="text"
                required
                value={courseData.title}
                onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                required
                value={courseData.categoryId}
                onChange={(e) => setCourseData(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Category</option>
                {categories?.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (in USD)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={courseData.price}
                onChange={(e) => setCourseData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                required
                value={courseData.level}
                onChange={(e) => setCourseData(prev => ({ ...prev, level: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                value={courseData.description}
                onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                rows="4"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Course Content</h2>
          
          {courseData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-8 p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">Section {sectionIndex + 1}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => {
                      const newSections = [...courseData.sections];
                      newSections[sectionIndex].title = e.target.value;
                      setCourseData(prev => ({ ...prev, sections: newSections }));
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Description
                  </label>
                  <textarea
                    value={section.description}
                    onChange={(e) => {
                      const newSections = [...courseData.sections];
                      newSections[sectionIndex].description = e.target.value;
                      setCourseData(prev => ({ ...prev, sections: newSections }));
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Videos
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideoUpload(e, sectionIndex)}
                    className="w-full"
                    disabled={uploading}
                  />
                </div>

                {section.videos.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Videos</h4>
                    <ul className="space-y-2">
                      {section.videos.map((video, videoIndex) => (
                        <li key={videoIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span>{video.title}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newSections = [...courseData.sections];
                              newSections[sectionIndex].videos.splice(videoIndex, 1);
                              setCourseData(prev => ({ ...prev, sections: newSections }));
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              setCourseData(prev => ({
                ...prev,
                sections: [...prev.sections, { title: '', description: '', videos: [] }]
              }));
            }}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Add New Section
          </button>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading || createCourseMutation.isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {createCourseMutation.isLoading ? 'Creating Course...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse; 