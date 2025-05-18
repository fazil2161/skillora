import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    title: '',
    description: '',
    price: '',
    level: 'Beginner',
    category: '',
    thumbnailUrl: ''
  });

  const handleImageUpload = (imageUrl) => {
    setCourse(prev => ({
      ...prev,
      thumbnailUrl: imageUrl
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convert price to cents for storage
      const priceInCents = Math.round(parseFloat(course.price) * 100);
      
      const response = await axios.post('/api/courses', {
        ...course,
        price: priceInCents
      });

      if (response.data) {
        navigate(`/courses/${response.data._id}`);
      }
    } catch (error) {
      console.error('Failed to create course:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Course</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Thumbnail
          </label>
          <ImageUpload onImageUpload={handleImageUpload} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={course.title}
            onChange={(e) => setCourse(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={course.description}
            onChange={(e) => setCourse(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-2 border rounded-md h-32"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={course.price}
              onChange={(e) => setCourse(prev => ({ ...prev, price: e.target.value }))}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              value={course.level}
              onChange={(e) => setCourse(prev => ({ ...prev, level: e.target.value }))}
              className="w-full px-4 py-2 border rounded-md"
              required
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={course.category}
              onChange={(e) => setCourse(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 border rounded-md"
              required
            >
              <option value="">Select Category</option>
              <option value="1">Programming</option>
              <option value="2">Business</option>
              <option value="3">Design</option>
              <option value="4">Marketing</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/courses')}
            className="px-6 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse; 