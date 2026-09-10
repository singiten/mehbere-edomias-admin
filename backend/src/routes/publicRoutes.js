// backend/routes/publicRoutes.js
const router = require('express').Router();
const publicController = require('../controllers/publicController');

router.get('/history', publicController.getHistory);
router.get('/services', publicController.getServices);
router.get('/services/:serviceId', publicController.getServiceById);  // Add this
router.get('/what-we-do', publicController.getWhatWeDo);
router.get('/contact', publicController.getContactInfo);
router.post('/contact/submit', publicController.submitContact);
router.get('/testimonies', publicController.getTestimonies);
router.get('/homepage', publicController.getHomepageData);

module.exports = router;