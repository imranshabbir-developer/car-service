// API Configuration
const PRODUCTION_API_URL = 'https://api.convoytravels.pk/api/v1';
const PRODUCTION_IMAGE_URL = 'https://api.convoytravels.pk';

const LOCAL_API_URL = 'http://localhost:5000/api/v1';
const LOCAL_IMAGE_URL = 'http://localhost:5000';

const isDev = process.env.NODE_ENV !== 'production';
const upstreamApiUrl =
  process.env.NEXT_PUBLIC_API_TARGET ||
  (isDev ? LOCAL_API_URL : PRODUCTION_API_URL);

const upstreamImageUrl =
  process.env.NEXT_PUBLIC_API_IMAGE_TARGET ||
  (isDev ? LOCAL_IMAGE_URL : PRODUCTION_IMAGE_URL);

const isServer = typeof window === 'undefined';

const API_BASE_URL = isServer ? upstreamApiUrl : '/api/upstream';
const API_IMAGE_BASE_URL = upstreamImageUrl;

export { API_BASE_URL, API_IMAGE_BASE_URL, upstreamApiUrl };