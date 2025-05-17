const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate a signature for direct upload
const generateUploadSignature = () => {
  const timestamp = Math.round((new Date).getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request({
    timestamp: timestamp,
    folder: 'skillora_videos',
  }, process.env.CLOUDINARY_API_SECRET);

  return {
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY
  };
};

// Get video details
const getVideoDetails = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: 'video',
      max_results: 1
    });
    return {
      url: result.secure_url,
      duration: Math.round(result.duration),
      thumbnail: result.thumbnail_url
    };
  } catch (error) {
    console.error('Error getting video details:', error);
    throw new Error('Failed to get video details');
  }
};

// Delete video
const deleteVideo = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
  } catch (error) {
    console.error('Error deleting video:', error);
    throw new Error('Failed to delete video');
  }
};

module.exports = {
  generateUploadSignature,
  getVideoDetails,
  deleteVideo
}; 