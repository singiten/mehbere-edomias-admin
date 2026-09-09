const rateLimit = require('express-rate-limit');

/**
 * General rate limiter - 100 requests per 15 minutes
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter - 5 requests per 15 minutes (for auth)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

/**
 * Registration rate limiter - 3 requests per hour
 */
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: {
    success: false,
    message: 'Too many registration attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Donation rate limiter - 10 requests per day
 */
const donationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // 10 donations per day
  message: {
    success: false,
    message: 'Too many donation submissions. Please try again tomorrow.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Content creation rate limiter - 20 requests per hour
 */
const contentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 content creations per hour
  message: {
    success: false,
    message: 'Too many content creations. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * API key rate limiter - 1000 requests per day
 */
const apiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 1000,
  message: {
    success: false,
    message: 'API limit exceeded. Please contact support.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  registerLimiter,
  donationLimiter,
  contentLimiter,
  apiLimiter,
};