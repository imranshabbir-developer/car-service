// API Configuration
// Automatically detect environment and use appropriate URLs
// Check both server-side (NODE_ENV) and client-side (window.location)

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

const API_BASE_URL = isProduction 
  ? 'https://api.convoytravels.pk/api/v1'
  : 'http://localhost:5000/api/v1';

const API_IMAGE_BASE_URL = isProduction
  ? 'https://api.convoytravels.pk'
  : 'http://localhost:5000';

export { API_BASE_URL, API_IMAGE_BASE_URL };
