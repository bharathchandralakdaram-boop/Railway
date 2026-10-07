// API and Socket.IO configuration
// When deployed on Vercel, set VITE_BACKEND_URL in Vercel project environment variables
// (e.g., https://your-railway-backend.onrender.com).
// For local development, empty string uses Vite's local /api proxy.

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
export const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
