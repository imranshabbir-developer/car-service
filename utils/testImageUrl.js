/**
 * Simple utility to test image URLs
 * Run this in browser console to diagnose image issues
 */

import { API_IMAGE_BASE_URL } from '@/config/api';

export function testImageUrl(imagePath) {
  if (!imagePath) {
    console.log('❌ No image path provided');
    return;
  }

  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  const baseUrl = API_IMAGE_BASE_URL.endsWith('/') ? API_IMAGE_BASE_URL.slice(0, -1) : API_IMAGE_BASE_URL;
  const fullUrl = `${baseUrl}${normalizedPath}`;

  console.log('Testing image URL:', {
    originalPath: imagePath,
    normalizedPath,
    baseUrl,
    fullUrl
  });

  // Test if image loads
  const img = new Image();
  img.onload = () => {
    console.log('✅ Image loads successfully:', fullUrl);
  };
  img.onerror = () => {
    console.error('❌ Image failed to load:', fullUrl);
    console.error('Check if file exists at:', normalizedPath);
    console.error('Backend should serve from: uploads' + normalizedPath.replace('/uploads', ''));
  };
  img.src = fullUrl;

  return fullUrl;
}

