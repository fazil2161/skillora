const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.AWS_S3_BUCKET;

// Generate a presigned URL for video upload
const getVideoUploadUrl = async (fileType) => {
  const videoKey = `videos/${uuidv4()}`;
  const params = {
    Bucket: BUCKET_NAME,
    Key: videoKey,
    ContentType: fileType,
    Expires: 600 // URL expires in 10 minutes
  };

  try {
    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    return {
      uploadUrl,
      videoKey
    };
  } catch (error) {
    throw new Error('Error generating upload URL');
  }
};

// Generate a presigned URL for video playback
const getVideoPlaybackUrl = async (videoKey) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: videoKey,
    Expires: 3600 // URL expires in 1 hour
  };

  try {
    return await s3.getSignedUrlPromise('getObject', params);
  } catch (error) {
    throw new Error('Error generating playback URL');
  }
};

// Delete a video from S3
const deleteVideo = async (videoKey) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: videoKey
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    throw new Error('Error deleting video');
  }
};

module.exports = {
  getVideoUploadUrl,
  getVideoPlaybackUrl,
  deleteVideo
}; 