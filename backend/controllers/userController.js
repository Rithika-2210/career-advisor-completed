/**
 * User Controller
 * Profile management, notifications
 */

const Joi = require('joi');
const User = require('../models/User');

// Validation schema for profile update
const profileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  mobile: Joi.string().pattern(/^[6-9]\d{9}$/).allow(''),
  dateOfBirth: Joi.date().max('now'),
  gender: Joi.string().valid('Male', 'Female', 'Other', ''),
  location: Joi.object({
    state: Joi.string().allow(''),
    city: Joi.string().allow(''),
    pincode: Joi.string().allow('')
  }),
  academicDetails: Joi.object({
    tenthMarks: Joi.number().min(0).max(100),
    tenthBoard: Joi.string().allow(''),
    twelfthMarks: Joi.number().min(0).max(100),
    twelfthBoard: Joi.string().allow(''),
    twelfthStream: Joi.string().valid('Science', 'Commerce', 'Arts', 'Not Applicable', ''),
    twelfthSubjects: Joi.array().items(Joi.string()),
    currentEducation: Joi.string().allow(''),
    institution: Joi.string().allow('')
  }),
  interests: Joi.array().items(Joi.string()).max(10),
  skills: Joi.array().items(Joi.string()).max(20),
  careerGoals: Joi.string().max(500).allow('')
});

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
exports.getProfile = async (req, res) => {
  res.json({ success: true, user: req.user });
};

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { error } = profileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // Check and update profile completion
    user.profileCompleted = user.checkProfileCompletion();
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: 'Profile updated successfully', user });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/notifications
 * @desc    Get user notifications
 * @access  Private
 */
exports.getNotifications = async (req, res) => {
  const notifications = req.user.notifications
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 20);

  res.json({ success: true, notifications });
};

/**
 * @route   PUT /api/users/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
exports.markNotificationRead = async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user._id, 'notifications._id': req.params.id },
      { $set: { 'notifications.$.read': true } }
    );
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/users/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
exports.markAllNotificationsRead = async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user._id },
      { $set: { 'notifications.$[].read': true } }
    );
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/all (Admin only)
 * @desc    Get all users with stats
 * @access  Private (Admin)
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find({ role: 'student' })
      .select('-password -resetPasswordOTP -notifications')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ role: 'student' });

    res.json({
      success: true,
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/stats (Admin only)
 * @desc    Get platform analytics
 * @access  Private (Admin)
 */
exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const activeUsers = await User.countDocuments({ role: 'student', isActive: true });
    const profileCompleted = await User.countDocuments({ role: 'student', profileCompleted: true });

    // New users in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsers = await User.countDocuments({ role: 'student', createdAt: { $gte: thirtyDaysAgo } });

    // Users by state
    const byState = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$location.state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      stats: { totalUsers, activeUsers, profileCompleted, newUsers, byState }
    });

  } catch (error) {
    next(error);
  }
};
