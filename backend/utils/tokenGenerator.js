/**
 * Generates token in the required form:
 * - 5 characters max
 * - Mix of uppercase letters + numbers
 * - Examples: A9X2B, P4K8Z
 */
function generateToken() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < 5; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

module.exports = { generateToken };
