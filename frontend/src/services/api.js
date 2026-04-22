import axios from "axios";
import { getAuthToken } from "./authStorage";

// Must call backend using http://localhost:5000/api (CRITICAL requirement).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// For serving uploaded files (e.g. http://localhost:5000/uploads/...).
// Backend mounts uploads at /uploads (no /api prefix).
export const apiBaseUrl = API_BASE_URL.replace(/\/api\/?$/, "");

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Add authorization header to all requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add better error logging and token handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error.response?.data || error.message);
    
    // If unauthorized, clear auth and redirect to appropriate login
    if (error.response?.status === 401) {
      localStorage.removeItem("secureprint_auth");
      // Check if current path is admin-related
      const isAdminPath = window.location.pathname.startsWith('/admin');
      window.location.href = isAdminPath ? "/admin/login" : "/login";
    }
    
    return Promise.reject(error);
  }
);

export function authHeader(token) {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

// Default export for compatibility
export default api;

