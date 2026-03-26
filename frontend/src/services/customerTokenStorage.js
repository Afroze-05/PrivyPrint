const TOKEN_KEY = "secureprint_token";
const EXPIRY_KEY = "secureprint_token_expiresAt";
const STATUS_KEY = "secureprint_token_status";

export function setCustomerToken({ token, expiresAt, status }) {
  localStorage.setItem(TOKEN_KEY, token);
  if (expiresAt) localStorage.setItem(EXPIRY_KEY, new Date(expiresAt).toISOString());
  if (status) localStorage.setItem(STATUS_KEY, status);
}

export function getCustomerToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  const expiresAtRaw = localStorage.getItem(EXPIRY_KEY);
  const status = localStorage.getItem(STATUS_KEY) || "waiting";
  return {
    token,
    expiresAt: expiresAtRaw ? new Date(expiresAtRaw) : null,
    status,
  };
}

export function clearCustomerToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
  localStorage.removeItem(STATUS_KEY);
}

