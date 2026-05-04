// ===== assessmentRoutes.js =====
const express = require('express');
const router = express.Router();
const { startAssessment, submitAssessment, getMyResults, getAssessmentResult } = require('../controllers/assessmentController');
const { protect } = require('../middleware/auth');

router.get('/start', protect, startAssessment);
router.post('/:id/submit', protect, submitAssessment);
router.get('/my-results', protect, getMyResults);
router.get('/:id/result', protect, getAssessmentResult);

module.exports = router;