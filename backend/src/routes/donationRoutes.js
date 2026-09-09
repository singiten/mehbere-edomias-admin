const router = require('express').Router();
const donationController = require('../controllers/donationController');
const authenticate = require('../middleware/auth');
const { isAdmin, isMember } = require('../middleware/roleCheck');

// ============ PROTECTED ROUTES ============

// Member only routes
router.post('/', authenticate, isMember, donationController.submitDonation);
router.get('/my-donations', authenticate, isMember, donationController.getMyDonations);

// Admin only routes
router.get('/stats', authenticate, isAdmin, donationController.getDonationStats);
router.get('/', authenticate, isAdmin, donationController.getAllDonations);
router.get('/pending', authenticate, isAdmin, donationController.getPendingDonations);
router.get('/:donationId', authenticate, isAdmin, donationController.getDonationById);
router.put('/:donationId/verify', authenticate, isAdmin, donationController.verifyDonation);
router.put('/:donationId/reject', authenticate, isAdmin, donationController.rejectDonation);

module.exports = router;