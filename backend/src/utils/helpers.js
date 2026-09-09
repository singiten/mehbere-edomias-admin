/**
 * Slugify a string (for URLs)
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w-]+/g, '')     // Remove non-word chars
    .replace(/--+/g, '-')        // Replace multiple - with single -
    .replace(/^-+/, '')          // Remove leading -
    .replace(/-+$/, '');         // Remove trailing -
};

/**
 * Generate a random slug with timestamp
 */
const generateSlug = (title) => {
  const baseSlug = slugify(title);
  const timestamp = Date.now().toString().slice(-6);
  return `${baseSlug}-${timestamp}`;
};

/**
 * Format currency in Ethiopian Birr
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Calculate reading time (minutes) for text
 */
const calculateReadTime = (text) => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};

/**
 * Paginate results
 */
const paginate = (page = 1, limit = 10) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Generate pagination response
 */
const paginationResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

/**
 * Get Ethiopian date format
 */
const formatEthiopianDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Mask email for privacy
 */
const maskEmail = (email) => {
  if (!email) return '';
  const [name, domain] = email.split('@');
  const maskedName = name.slice(0, 2) + '****' + name.slice(-2);
  return `${maskedName}@${domain}`;
};

/**
 * Mask phone number for privacy
 */
const maskPhone = (phone) => {
  if (!phone) return '';
  return phone.slice(0, 3) + '****' + phone.slice(-3);
};

module.exports = {
  slugify,
  generateSlug,
  formatCurrency,
  calculateReadTime,
  paginate,
  paginationResponse,
  formatEthiopianDate,
  maskEmail,
  maskPhone,
};