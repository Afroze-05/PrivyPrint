const TOKEN_KEY = "customerToken";
const ALL_TOKENS_KEY = "allTokens";

export function setCustomerToken({ token, expiresAt, status, fileName }) {
  const tokenData = {
    token: token,
    status: status || "waiting",
    fileName: fileName || "unknown",
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null
  };
  
  // Store individual token for current session
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
  
  // Also store in allTokens array for shared access
  let allTokens = JSON.parse(localStorage.getItem(ALL_TOKENS_KEY)) || [];
  // Remove existing token with same value (case-insensitive)
  allTokens = allTokens.filter(t => t.token.toUpperCase() !== token.toUpperCase());
  // Add new token
  allTokens.push(tokenData);
  localStorage.setItem(ALL_TOKENS_KEY, JSON.stringify(allTokens));
}

export function getCustomerToken() {
  const tokenData = localStorage.getItem(TOKEN_KEY);
  if (!tokenData) return null;
  
  try {
    return JSON.parse(tokenData);
  } catch {
    return null;
  }
}

export function getAllTokens() {
  const allTokens = localStorage.getItem(ALL_TOKENS_KEY);
  if (!allTokens) return [];
  
  try {
    return JSON.parse(allTokens);
  } catch {
    return [];
  }
}

export function updateTokenStatus(token, newStatus) {
  // Update in allTokens array
  let allTokens = getAllTokens();
  const tokenIndex = allTokens.findIndex(t => t.token.toUpperCase() === token.toUpperCase());
  
  if (tokenIndex !== -1) {
    allTokens[tokenIndex].status = newStatus;
    localStorage.setItem(ALL_TOKENS_KEY, JSON.stringify(allTokens));
  }
  
  // Update current token if it matches
  const currentToken = getCustomerToken();
  if (currentToken && currentToken.token.toUpperCase() === token.toUpperCase()) {
    currentToken.status = newStatus;
    localStorage.setItem(TOKEN_KEY, JSON.stringify(currentToken));
  }
}

export function clearCustomerToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ALL_TOKENS_KEY);
}

