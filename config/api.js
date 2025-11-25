// API Configuration
// Production API URL (default)
const PRODUCTION_API_URL = 'https://api.convoytravels.pk/api/v1';
const PRODUCTION_IMAGE_URL = 'https://api.convoytravels.pk';

// Use strict production endpoints (can override via env vars if needed)
const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  PRODUCTION_API_URL;

const API_IMAGE_BASE_URL = 
  process.env.NEXT_PUBLIC_API_IMAGE_URL || 
  PRODUCTION_IMAGE_URL;

export { API_BASE_URL, API_IMAGE_BASE_URL };

