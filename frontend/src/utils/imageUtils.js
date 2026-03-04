/**
 * Utility functions for handling image URLs
 */

/**
 * Get the correct image URL for displaying pet images
 * Handles both Cloudinary URLs and local file paths
 * @param {string} imageUrl - The image URL or filename from the database
 * @param {string} fallbackImage - Fallback image path if no image is provided
 * @returns {string} - The correct URL to display the image
 */
export const getImageUrl = (imageUrl, fallbackImage = "/src/assets/husky.jpg") => {
  if (!imageUrl) {
    return fallbackImage;
  }
  
  // If it's already a full URL (Cloudinary), use it directly
  if (imageUrl.startsWith('http') || imageUrl.startsWith('https')) {
    return imageUrl;
  }
  
  // If it's a local filename, construct the full path
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${API_URL}/uploads/${imageUrl}`;
};

/**
 * Check if an image URL is a Cloudinary URL
 * @param {string} imageUrl - The image URL to check
 * @returns {boolean} - True if it's a Cloudinary URL
 */
export const isCloudinaryUrl = (imageUrl) => {
  return imageUrl && (
    imageUrl.includes('cloudinary.com') ||
    imageUrl.includes('res.cloudinary.com')
  );
};