const express = require('express');
const router = express.Router();
const {
  getProfile, updateProfile,
  getNotifications, markNotificationRead, markAllNotificationsRead,
  getAllUsers, getStats
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read-all', protect, markAllNotificationsRead);
router.put('/notifications/:id/read', protect, markNotificationRead);

// Admin routes
router.get('/all', protect, authorize('admin'), getAllUsers);
router.get('/stats', protect, authorize('admin'), getStats);

module.exports = router;
