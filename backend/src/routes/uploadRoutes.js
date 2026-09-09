// backend/routes/uploadRoutes.js
const router = require('express').Router();
const { uploadImage, upload } = require('../controllers/uploadController');
const authenticate = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

router.post('/', authenticate, isAdmin, upload.single('file'), uploadImage);

module.exports = router;