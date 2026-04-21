/**
 * Generates token in the required form:
 * - SPX- prefix
 * - 5 random characters
 * - Example: SPX-A9K2Z
 */
function generateToken() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "PPX-";
  for (let i = 0; i < 5; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

module.exports = { generateToken };
