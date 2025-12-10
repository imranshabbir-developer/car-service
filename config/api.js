// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`
  : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://api.convoytravels.pk/api/v1'
    : 'http://localhost:5000/api/v1');

const API_IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL
  ? process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL
  : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://api.convoytravels.pk'
    : 'http://localhost:5000');

export { API_BASE_URL, API_IMAGE_BASE_URL };
