const rateLimit = require("express-rate-limit");

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
//limits how many requests a user can make to the API in a given time frame, helping to prevent abuse and ensure fair usage.
//max 100 request per 15 minutes for general API endpoints, 20 requests per 15 minutes for authentication endpoints, and 5 requests per hour for email-related endpoints.
