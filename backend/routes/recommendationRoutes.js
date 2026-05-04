// ===== recommendationRoutes.js =====
const express = require('express');
const router = express.Router();
const { generateForUser, getMyRecommendations, getStreamInfo } = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateForUser);
router.get('/my', protect, getMyRecommendations);
router.get('/streams', getStreamInfo);

module.exports = router;