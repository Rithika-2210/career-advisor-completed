/**
 * User Model
 * Handles student and admin accounts with profile data
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const academicDetailsSchema = new mongoose.Schema({
  tenthMarks: { type: Number, min: 0, max: 100 },
  tenthBoard: { type: String }, // CBSE, ICSE, State Board
  twelfthMarks: { type: Number, min: 0, max: 100 },
  twelfthBoard: { type: String },
  twelfthStream: { type: String, enum: ['Science', 'Commerce', 'Arts', 'Not Applicable', ''] },
  twelfthSubjects: [{ type: String }],
  currentEducation: { type: String }, // e.g., "12th studying", "UG 2nd year"
  institution: { type: String },
}, { _id: false });

const userSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  mobile: {
    type: String,
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian mobile number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Never return password by default
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  avatar: { type: String, default: '' },

  // Student Profile
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other', ''] },
  location: {
    state: { type: String },
    city: { type: String },
    pincode: { type: String }
  },

  // Academic Details
  academicDetails: { type: academicDetailsSchema, default: {} },

  // Interests & Skills
  interests: [{ type: String }], // e.g., ["Technology", "Art", "Business"]
  skills: [{ type: String }],    // e.g., ["Programming", "Communication"]
  careerGoals: { type: String, maxlength: 500 },

  // Assessment tracking
  assessmentsTaken: [{
    assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
    takenAt: { type: Date }
  }],

  // Notifications
  notifications: [{
    message: { type: String },
    type: { type: String, enum: ['info', 'reminder', 'success', 'warning'] },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],

  // Password Reset
  resetPasswordOTP: { type: String, select: false },
  resetPasswordExpire: { type: Date, select: false },

  // Account Status
  isVerified: { type: Boolean, default: true }, // Set to false if email verification needed
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  profileCompleted: { type: Boolean, default: false },

}, { timestamps: true });

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ 'location.state': 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if profile is complete
userSchema.methods.checkProfileCompletion = function () {
  const { academicDetails, interests, location } = this;
  return !!(
    academicDetails?.currentEducation &&
    interests?.length > 0 &&
    location?.state
  );
};

// Remove sensitive fields when converting to JSON
userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordOTP;
  delete obj.resetPasswordExpire;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
