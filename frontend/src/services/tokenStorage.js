/**
 * Shared Token Storage Service
 * Single source of truth for all tokens in the application
 */

// Get all tokens from shared storage
export function getAllTokens() {
  try {
    const tokens = localStorage.getItem("allTokens");
    return tokens ? JSON.parse(tokens) : [];
  } catch (error) {
    console.error("Error reading tokens from storage:", error);
    return [];
  }
}

// Save all tokens to shared storage
export function saveAllTokens(tokens) {
  try {
    localStorage.setItem("allTokens", JSON.stringify(tokens));
  } catch (error) {
    console.error("Error saving tokens to storage:", error);
  }
}

// Add new token to shared storage
export function addToken(tokenData) {
  const allTokens = getAllTokens();
  allTokens.push(tokenData);
  saveAllTokens(allTokens);
}

// Find token by value (case-insensitive)
export function findToken(tokenValue) {
  const allTokens = getAllTokens();
  const searchToken = tokenValue ? tokenValue.toUpperCase() : tokenValue;
  
  return allTokens.find(token => 
    token.token && token.token.toUpperCase() === searchToken
  );
}

// Update token status
export function updateTokenStatus(tokenValue, newStatus) {
  const allTokens = getAllTokens();
  const searchToken = tokenValue ? tokenValue.toUpperCase() : tokenValue;
  
  const tokenIndex = allTokens.findIndex(token => 
    token.token && token.token.toUpperCase() === searchToken
  );
  
  if (tokenIndex !== -1) {
    allTokens[tokenIndex].status = newStatus;
    saveAllTokens(allTokens);
    return true;
  }
  
  return false;
}

// Get tokens by status
export function getTokensByStatus(status) {
  const allTokens = getAllTokens();
  return allTokens.filter(token => token.status === status);
}

// Clear all tokens (for testing/debugging)
export function clearAllTokens() {
  localStorage.removeItem("allTokens");
}
