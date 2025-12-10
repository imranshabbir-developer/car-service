// API Configuration
// Check environment variables first, then check if we're in production
const isProduction = process.env.NODE_ENV === 'production' || 
                    process.env.NEXT_PUBLIC_ENV === 'production' ||
                    (typeof window !== 'undefined' && 
                     window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1' &&
                     !window.location.hostname.includes('localhost'));

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`
  : (isProduction
    ? 'https://api.convoytravels.pk/api/v1'
    : 'http://localhost:5000/api/v1');

const API_IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL
  ? process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL
  : (isProduction
    ? 'https://api.convoytravels.pk'
    : 'http://localhost:5000');

export { API_BASE_URL, API_IMAGE_BASE_URL };
