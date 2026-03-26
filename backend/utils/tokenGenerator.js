function randomBase36(len) {
  return Math.random().toString(36).slice(2, 2 + len).toUpperCase();
}

/**
 * Generates token in the required form:
 * - SPX-1234 (digits)
 * - SPX-A7K9P2 (alphanumeric)
 */
function generateToken() {
  const useDigits = Math.random() < 0.5;

  if (useDigits) {
    const digits = Math.floor(1000 + Math.random() * 9000); // 4 digits
    return `SPX-${digits}`;
  }

  const len = 5 + Math.floor(Math.random() * 3); // 5-7 chars
  return `SPX-${randomBase36(len)}`;
}

module.exports = { generateToken };

