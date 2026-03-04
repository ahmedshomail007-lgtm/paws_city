import fs from "fs";
import path from "path";
import { deleteFromCloudinary, extractPublicIdFromUrl } from "../config/cloudinary.js";

/**
 * Delete a file from the uploads directory (legacy local storage)
 * @param {string} filename - The filename to delete
 * @returns {Promise<boolean>} - Returns true if deleted successfully, false otherwise
 */
export const deleteUploadedFile = async (filename) => {
  if (!filename) {
    console.log("No filename provided for deletion");
    return false;
  }

  try {
    // Resolve full path
    const filePath = path.join(process.cwd(), "uploads", filename);
    console.log(`Attempting to delete file at: ${filePath}`);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log(`✅ Deleted old file: ${filename}`);
      return true;
    } else {
      console.log(`⚠️ File not found: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Failed to delete file ${filename}:`, error);
    return false;
  }
};

/**
 * Delete an image from Cloudinary using URL or public_id
 * @param {string} imageUrl - The Cloudinary URL or public_id
 * @returns {Promise<boolean>} - Returns true if deleted successfully, false otherwise
 */
export const deleteCloudinaryImage = async (imageUrl) => {
  if (!imageUrl) {
    console.log("No image URL provided for Cloudinary deletion");
    return false;
  }

  try {
    let publicId;
    
    // Check if it's a full URL or just a public_id
    if (imageUrl.startsWith('http')) {
      publicId = extractPublicIdFromUrl(imageUrl);
    } else {
      publicId = imageUrl;
    }

    if (!publicId) {
      console.log("Could not extract public_id from URL");
      return false;
    }

    const result = await deleteFromCloudinary(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error(`❌ Failed to delete Cloudinary image:`, error);
    return false;
  }
};
