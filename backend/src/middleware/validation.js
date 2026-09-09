const { body, query, param, validationResult } = require('express-validator');

/**
 * Check validation results and return errors if any
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => err.msg)
    });
  }
  next();
};

// ============ AUTH VALIDATIONS ============

const validateRegistration = [
  body('fullName')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters')
    .trim(),
  
  body('phoneNumber')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^09\d{8}$/).withMessage('Invalid Ethiopian phone number format (09xxxxxxxx)')
    .trim(),
  
  body('email')
    .optional()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  validate
];

const validateLogin = [
  body('phoneNumber')
    .optional()
    .matches(/^09\d{8}$/).withMessage('Invalid phone number format')
    .trim(),
  
  body('email')
    .optional()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  (req, res, next) => {
    // Ensure at least one identifier is provided
    if (!req.body.phoneNumber && !req.body.email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone number or email'
      });
    }
    validate(req, res, next);
  }
];

const validateCreateMember = [
  body('fullName')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters')
    .trim(),
  
  body('phoneNumber')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^09\d{8}$/).withMessage('Invalid Ethiopian phone number format')
    .trim(),
  
  body('email')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('region')
    .notEmpty().withMessage('Region is required')
    .trim(),
  
  body('spiritualRole')
    .optional()
    .isIn(['priest', 'deacon', 'choir', 'youth_leader', 'elder', 'regular_member'])
    .withMessage('Invalid spiritual role'),
  
  validate
];

// ============ DONATION VALIDATIONS ============

const validateDonation = [
  body('donationType')
    .isIn(['tithe', 'offering', 'building_fund', 'social_service', 'general', 'other'])
    .withMessage('Invalid donation type'),
  
  body('amount')
    .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0')
    .toFloat(),
  
  body('bankName')
    .notEmpty().withMessage('Bank name is required')
    .trim(),
  
  body('referenceNumber')
    .notEmpty().withMessage('Reference number is required')
    .isLength({ min: 5 }).withMessage('Reference number must be at least 5 characters')
    .trim(),
  
  body('receiptPhotoUrl')
    .notEmpty().withMessage('Receipt photo is required')
    .isURL().withMessage('Invalid receipt photo URL'),
  
  validate
];

// ============ EVENT VALIDATIONS ============

const validateEvent = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3-200 characters')
    .trim(),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
    .trim(),
  
  body('eventType')
    .isIn(['liturgy', 'fasting', 'feast', 'seminar', 'conference', 'community_service', 'other'])
    .withMessage('Invalid event type'),
  
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Invalid date format')
    .custom(value => {
      if (new Date(value) < new Date()) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),
  
  validate
];

// ============ BLOG VALIDATIONS ============

const validateBlogPost = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3-200 characters')
    .trim(),
  
  body('content')
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 20 }).withMessage('Content must be at least 20 characters')
    .trim(),
  
  body('category')
    .isIn(['spiritual_teaching', 'association_news', 'event_recap', 'announcement'])
    .withMessage('Invalid category'),
  
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid status'),
  
  validate
];

// ============ SERMON VALIDATIONS ============

const validateSermon = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .trim(),
  
  body('preacher')
    .notEmpty().withMessage('Preacher name is required')
    .trim(),
  
  body('sermonType')
    .isIn(['video', 'audio', 'text', 'pdf'])
    .withMessage('Invalid sermon type'),
  
  body('contentUrl')
    .optional()
    .isURL().withMessage('Invalid URL format'),
  
  validate
];

// ============ PAGINATION VALIDATIONS ============

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100')
    .toInt(),
  
  validate
];

module.exports = {
  validate,
  validateRegistration,
  validateLogin,
  validateCreateMember,
  validateDonation,
  validateEvent,
  validateBlogPost,
  validateSermon,
  validatePagination
};