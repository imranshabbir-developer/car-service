// API Configuration
// Automatically detect environment and use appropriate URLs
// Check both server-side (NODE_ENV) and client-side (window.location)

/**
 * Determine if we're running in production
 * - Client-side: Checks window.location.hostname for specific production domains
 * - Server-side: Checks NODE_ENV or NEXT_PUBLIC_ENV
 * 
 * IMPORTANT: Only specific production domains are considered production.
 * Staging/test environments should use NEXT_PUBLIC_ENV=production or NODE_ENV=production
 */
const getIsProduction = () => {
  // Server-side check (for SSR, API routes, and build time)
  // Check environment variables FIRST - most reliable for build time
  if (process.env.NEXT_PUBLIC_ENV === 'production') {
    return true;
  }
  if (process.env.NODE_ENV === 'production') {
    return true;
  }
  
  // Client-side check (only when window is available - runtime check)
  // Only check specific production domains, not any non-localhost domain
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    // Only return true for known production domains
    return hostname === 'convoytravels.pk' || 
           hostname === 'www.convoytravels.pk';
  }
  
  // Default to development (safer than assuming production)
  return false;
};

const isProduction = getIsProduction();

const API_BASE_URL = isProduction 
  ? 'https://api.convoytravels.pk/api/v1'
  : 'http://localhost:5000/api/v1';

const API_IMAGE_BASE_URL = isProduction
  ? 'https://api.convoytravels.pk'
  : 'http://localhost:5000';

// Log configuration (helps debug environment detection)
if (typeof window !== 'undefined') {
  const logConfig = {
    isProduction,
    hostname: window.location.hostname,
    API_BASE_URL,
    API_IMAGE_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    detectedBy: typeof window !== 'undefined' ? 'client-side (hostname)' : 'server-side (env vars)'
  };
  
  // Always log in development, log once in production for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 API Configuration:', logConfig);
  } else if (!sessionStorage.getItem('apiConfigLogged')) {
    // Log once per session in production for debugging
    console.log('🔧 API Configuration (Production):', logConfig);
    sessionStorage.setItem('apiConfigLogged', 'true');
  }
}

export { API_BASE_URL, API_IMAGE_BASE_URL };
