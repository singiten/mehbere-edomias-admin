const multer = require('multer');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer (memory storage)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false);
  }
};

// Multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
});

// ============ UPLOAD FUNCTIONS ============

/**
 * Upload single file to Cloudinary
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<Object>} Cloudinary response
 */
const uploadToCloudinary = (fileBuffer, folder = 'mehbere-edomias') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes,
          });
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array} files - Array of file buffers
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<Array>} Array of Cloudinary responses
 */
const uploadMultipleToCloudinary = async (files, folder = 'mehbere-edomias') => {
  const uploadPromises = files.map(file => 
    uploadToCloudinary(file.buffer, folder)
  );
  return Promise.all(uploadPromises);
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Cloudinary response
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
};

/**
 * Get Cloudinary URL with transformations
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} Transformed URL
 */
const getCloudinaryUrl = (publicId, options = {}) => {
  const { width, height, crop = 'fit', quality = 'auto' } = options;
  
  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    fetch_format: 'auto',
  });
};

// ============ MULTER MIDDLEWARE ============

// Single file upload (field name: 'file')
const uploadSingle = upload.single('file');

// Multiple file upload (field name: 'files')
const uploadMultiple = upload.array('files', 5);

// Single image with specific field name
const uploadImage = upload.single('image');

// Single receipt upload
const uploadReceipt = upload.single('receipt');

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadImage,
  uploadReceipt,
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  getCloudinaryUrl,
};