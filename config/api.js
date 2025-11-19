// API Configuration
// Production API URL (default)
const PRODUCTION_API_URL = 'https://backend-rent-car-convoy-travel.up.railway.app/api/v1';
const PRODUCTION_IMAGE_URL = 'https://backend-rent-car-convoy-travel.up.railway.app';

// Development API URL (fallback)
const DEVELOPMENT_API_URL = 'http://localhost:5000/api/v1';
const DEVELOPMENT_IMAGE_URL = 'http://localhost:5000';

// Use environment variable if set, otherwise use production URL
const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' ? PRODUCTION_API_URL : DEVELOPMENT_API_URL);

const API_IMAGE_BASE_URL = 
  process.env.NEXT_PUBLIC_API_IMAGE_URL || 
  (process.env.NODE_ENV === 'production' ? PRODUCTION_IMAGE_URL : DEVELOPMENT_IMAGE_URL);

export { API_BASE_URL, API_IMAGE_BASE_URL };

