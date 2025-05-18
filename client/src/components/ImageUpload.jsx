import React, { useState } from 'react';
import './ImageUpload.css';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'skillora_videos_preset';

const ImageUpload = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    await processFile(file);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    await processFile(file);
  };

  const processFile = async (file) => {
    // Reset states
    setError(null);
    setUploadProgress(0);

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, WEBP, or AVIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setLoading(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file);
      onImageUpload(imageUrl);
      
    } catch (err) {
      setError('Failed to upload image: ' + (err.message || 'Please try again'));
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadToCloudinary = async (file) => {
    if (!CLOUD_NAME) {
      throw new Error('Cloudinary cloud name is missing');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'skillora/courses'); // Organize uploads in a folder
    formData.append('resource_type', 'auto'); // Allow both images and videos

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Cloudinary error:', errorData);
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload to Cloudinary: ' + error.message);
    }
  };

  return (
    <div className="image-upload-container">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Uploading... {uploadProgress > 0 ? `${uploadProgress}%` : ''}</p>
          </div>
        ) : preview ? (
          <div className="preview">
            <img src={preview} alt="Preview" />
            <button 
              onClick={() => {
                setPreview(null);
                onImageUpload(null);
              }} 
              className="remove-btn"
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="file-input"
              id="fileInput"
            />
            <label htmlFor="fileInput">
              <div className="upload-prompt">
                <svg className="upload-icon" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                <p>Drag & drop an image or click to browse</p>
                <span className="file-specs">
                  Maximum file size: 5MB<br/>
                  Supported formats: PNG, JPG, WEBP
                </span>
              </div>
            </label>
          </>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ImageUpload; 