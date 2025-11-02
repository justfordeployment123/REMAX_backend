const express = require('express');

const {
  getUserProfile,
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  addPhoneNumber,
  updatePhoneNumber,
  deletePhoneNumber,
  updateNotifications
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

router.post('/addresses', addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);

router.post('/phones', addPhoneNumber);
router.put('/phones/:phoneId', updatePhoneNumber);
router.delete('/phones/:phoneId', deletePhoneNumber);

router.put('/notifications', updateNotifications);

module.exports = router;