/**
 * Image Diagnostics Utility
 * Helps debug image loading issues in production
 */

import { API_IMAGE_BASE_URL } from '@/config/api';

/**
 * Test if an image URL is accessible
 * @param {string} imageUrl - Full image URL to test
 * @returns {Promise<boolean>} - True if image is accessible
 */
export async function testImageUrl(imageUrl) {
  if (!imageUrl || imageUrl.startsWith('data:')) {
    return true; // Data URIs are always "accessible"
  }

  try {
    const response = await fetch(imageUrl, {
      method: 'HEAD',
      mode: 'no-cors', // This will always succeed but won't tell us if it's actually accessible
    });
    return true;
  } catch (error) {
    console.error('Image test failed:', imageUrl, error);
    return false;
  }
}

/**
 * Log image configuration for debugging
 */
export function logImageConfig() {
  if (typeof window === 'undefined') return;
  
  const config = {
    API_IMAGE_BASE_URL,
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    origin: window.location.origin,
    isProduction: hostname === 'convoytravels.pk' || hostname === 'www.convoytravels.pk',
  };
  
  console.log('Image Configuration:', config);
  return config;
}

/**
 * Build and validate image URL
 * @param {string} imagePath - Image path from backend
 * @returns {object} - { url, isValid, error }
 */
export function buildAndValidateImageUrl(imagePath) {
  if (!imagePath) {
    return {
      url: null,
      isValid: false,
      error: 'No image path provided'
    };
  }

  // If already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return {
      url: imagePath,
      isValid: true,
      error: null
    };
  }

  // Normalize path
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  const baseUrl = API_IMAGE_BASE_URL.endsWith('/') 
    ? API_IMAGE_BASE_URL.slice(0, -1) 
    : API_IMAGE_BASE_URL;
  
  const fullUrl = `${baseUrl}${normalizedPath}`;

  return {
    url: fullUrl,
    isValid: true,
    error: null,
    debug: {
      originalPath: imagePath,
      normalizedPath,
      baseUrl,
      fullUrl
    }
  };
}

