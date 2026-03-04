import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image buffer to Cloudinary
 * @param {Buffer} fileBuffer - The image buffer to upload
 * @param {string} folder - The folder in Cloudinary to store the image (optional)
 * @param {string} originalName - The original filename for better identification
 * @returns {Promise<Object>} - Returns Cloudinary upload result
 */
export const uploadToCloudinary = (fileBuffer, folder = 'paws_city', originalName = '') => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: 'auto',
      folder: folder,
      public_id: `${folder}_${Date.now()}_${originalName.split('.')[0]}`,
      overwrite: true,
    };

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(fileBuffer);
  });
};

/**
 * Delete an image from Cloudinary using public_id
 * @param {string} publicId - The public_id of the image to delete
 * @returns {Promise<Object>} - Returns Cloudinary deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      console.log("No public_id provided for deletion");
      return { result: 'not found' };
    }

    console.log(`Attempting to delete image with public_id: ${publicId}`);
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      console.log(`✅ Deleted image from Cloudinary: ${publicId}`);
    } else {
      console.log(`⚠️ Image not found in Cloudinary: ${publicId}`);
    }
    
    return result;
  } catch (error) {
    console.error(`❌ Failed to delete image from Cloudinary:`, error);
    throw error;
  }
};

/**
 * Extract public_id from Cloudinary URL
 * @param {string} cloudinaryUrl - Full Cloudinary URL
 * @returns {string} - Extracted public_id
 */
export const extractPublicIdFromUrl = (cloudinaryUrl) => {
  try {
    if (!cloudinaryUrl) return null;
    
    // Extract public_id from Cloudinary URL
    // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.jpg
    const urlParts = cloudinaryUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
      // Get everything after version number, remove file extension
      const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');
      return publicIdWithExtension.split('.')[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting public_id from URL:', error);
    return null;
  }
};

export default cloudinary;