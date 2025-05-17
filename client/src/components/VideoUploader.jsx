import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUpload, FaSpinner } from 'react-icons/fa';

const VideoUploader = ({ onUploadComplete, courseId, sectionId }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadWidget, setUploadWidget] = useState(null);

  useEffect(() => {
    // Initialize Cloudinary Upload Widget
    if (window.cloudinary) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
          sources: ['local'],
          multiple: false,
          maxFileSize: 524288000, // 500MB
          resourceType: 'video',
          folder: 'skillora_videos',
        },
        async (error, result) => {
          if (error) {
            setError('Upload failed: ' + error.message);
            setUploading(false);
            return;
          }

          if (result.event === 'success') {
            try {
              // Add video to course
              const formData = {
                title: result.info.original_filename,
                description: '',
                publicId: result.info.public_id,
              };

              await axios.post(
                `/api/videos/courses/${courseId}/sections/${sectionId}/videos`,
                formData
              );

              setUploading(false);
              onUploadComplete(result.info.public_id);
            } catch (error) {
              setError(error.response?.data?.message || 'Error adding video to course');
              setUploading(false);
            }
          }
        }
      );
      setUploadWidget(widget);
    }
  }, [courseId, sectionId, onUploadComplete]);

  const handleUpload = () => {
    if (uploadWidget) {
      setError('');
      setUploading(true);
      uploadWidget.open();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Video
        </label>
        <div className="flex items-center justify-center w-full">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full flex flex-col items-center px-4 py-6 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <FaSpinner className="animate-spin text-3xl text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Uploading...</span>
              </>
            ) : (
              <>
                <FaUpload className="text-3xl text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Select a video file</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default VideoUploader; 