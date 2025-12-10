/**
 * Image URL Utility
 * Handles building full image URLs from backend paths
 */

import { API_IMAGE_BASE_URL } from '@/config/api';

/**
 * Build a full image URL from a backend image path
 * @param {string|null|undefined} imagePath - Image path from backend (e.g., "/uploads/cars/image.jpg")
 * @param {string|null} fallback - Fallback image URL if imagePath is not provided
 * @returns {string} Full image URL or fallback
 */
export function buildImageUrl(imagePath, fallback = null) {
  // Return fallback if no path provided
  if (!imagePath) {
    return fallback || '';
  }

  // If already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Normalize path - ensure it starts with /
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // Remove trailing slash from base URL if present
  const baseUrl = API_IMAGE_BASE_URL.endsWith('/') 
    ? API_IMAGE_BASE_URL.slice(0, -1) 
    : API_IMAGE_BASE_URL;

  // Combine base URL with normalized path
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Build multiple image URLs from an array of paths
 * @param {string[]} imagePaths - Array of image paths
 * @returns {string[]} Array of full image URLs
 */
export function buildImageUrls(imagePaths) {
  if (!Array.isArray(imagePaths) || imagePaths.length === 0) {
    return [];
  }

  return imagePaths
    .map(path => buildImageUrl(path))
    .filter(url => url !== '');
}

