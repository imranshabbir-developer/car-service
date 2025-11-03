// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-rent-car-convoy-travel.up.railway.app/api/v1';
const API_IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL || 'https://backend-rent-car-convoy-travel.up.railway.app';

// Log in development to verify it's being used
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('API_BASE_URL:', API_BASE_URL);
}

export { API_BASE_URL, API_IMAGE_BASE_URL };

