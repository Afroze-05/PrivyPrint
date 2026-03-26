import axios from "axios";

// Must call backend using http://localhost:5000/api (CRITICAL requirement).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// For serving uploaded files (e.g. http://localhost:5000/uploads/...).
// Backend mounts uploads at /uploads (no /api prefix).
export const apiBaseUrl = API_BASE_URL.replace(/\/api\/?$/, "");

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export function authHeader(token) {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

