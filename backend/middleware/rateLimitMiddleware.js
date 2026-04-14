const rateLimit = require('express-rate-limit');

// Bypass rate limiting temporarily as requested
const skipLimiter = (req, res, next) => next();

// General API rate limiting
const generalLimiter = skipLimiter;

// Strict rate limiting for auth endpoints
const authLimiter = skipLimiter;

// Email-specific rate limiting
const emailLimiter = skipLimiter;

module.exports = {
  generalLimiter,
  authLimiter,
  emailLimiter,
};
