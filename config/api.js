// API Configuration
// Automatically detect environment and use appropriate URLs
// Check both server-side (NODE_ENV) and client-side (window.location)
// api adjusted 
/**
 * Determine if we're running in production
 * - Client-side: Checks window.location.hostname
 * - Server-side: Checks NODE_ENV or NEXT_PUBLIC_ENV
 */
const getIsProduction = () => {
  // Client-side check (prioritize this when available - most accurate)
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    // Production domain check
    return hostname === 'convoytravels.pk' || 
           hostname === 'www.convoytravels.pk' ||
           (hostname !== 'localhost' && 
            hostname !== '127.0.0.1' && 
            !hostname.includes('localhost') &&
            !hostname.includes('127.0.0.1'));
  }
  
  // Server-side check (for SSR, API routes, and build time)
  // Check environment variables in order of preference
  if (process.env.NEXT_PUBLIC_ENV === 'production') {
    return true;
  }
  if (process.env.NODE_ENV === 'production') {
    return true;
  }
  
  // Default to development
  return false;
};

const isProduction = getIsProduction();

// Allow override via environment variables (useful for different deployment scenarios)
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

// Debug logging (only in browser, not during SSR)
if (typeof window !== 'undefined') {
  console.log('API Configuration:', {
    isProduction,
    API_BASE_URL,
    API_IMAGE_BASE_URL,
    hostname: window.location.hostname,
    env: {
      NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
      NODE_ENV: process.env.NODE_ENV,
    }
  });
}

export { API_BASE_URL, API_IMAGE_BASE_URL };
