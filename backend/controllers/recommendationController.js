/**
 * Recommendation Controller
 * Generate and retrieve personalized recommendations
 */

const Recommendation = require('../models/Recommendation');
const Assessment = require('../models/Assessment');
const { generateRecommendations } = require('../utils/recommendationEngine');

/**
 * @route   POST /api/recommendations/generate
 * @desc    Generate recommendations for logged-in user
 * @access  Private
 */
exports.generateForUser = async (req, res, next) => {
  try {
    const user = req.user;

    // Check if profile has enough data
    if (!user.interests || user.interests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your profile with interests before generating recommendations.'
      });
    }

    // Get latest assessment result if available
    const latestAssessment = await Assessment.findOne({
      userId: user._id,
      status: 'completed'
    })
    .select('categoryScores percentage')
    .sort({ completedAt: -1 });

    // Run recommendation engine
    const recommendationData = generateRecommendations(user, latestAssessment);

    // Save recommendation
    const recommendation = await Recommendation.findOneAndUpdate(
      { userId: user._id },
      {
        ...recommendationData,
        userId: user._id,
        assessmentId: latestAssessment?._id,
        generatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Recommendations generated successfully!',
      recommendation
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/recommendations/my
 * @desc    Get user's latest recommendations
 * @access  Private
 */
exports.getMyRecommendations = async (req, res, next) => {
  try {
    const recommendation = await Recommendation.findOne({ userId: req.user._id })
      .sort({ generatedAt: -1 });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'No recommendations found. Generate recommendations first.'
      });
    }

    res.json({ success: true, recommendation });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/recommendations/streams
 * @desc    Get stream info (public)
 * @access  Public
 */
exports.getStreamInfo = async (req, res) => {
  const { STREAM_RULES } = require('../utils/recommendationEngine');

  const streams = Object.entries(STREAM_RULES).map(([name, data]) => ({
    name,
    description: data.description,
    degrees: data.degrees
  }));

  res.json({ success: true, streams });
};