/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - The text to convert to slug
 * @returns {string} - The slug
 */
export function generateSlug(text) {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Check if a string is a MongoDB ObjectId (24 hex characters)
 * @param {string} str - The string to check
 * @returns {boolean} - True if it looks like an ObjectId
 */
export function isObjectId(str) {
  if (!str) return false;
  return /^[0-9a-fA-F]{24}$/.test(str);
}

