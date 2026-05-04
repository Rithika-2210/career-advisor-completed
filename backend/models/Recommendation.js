/**
 * Recommendation Model
 * Stores personalized career and education recommendations
 */

const mongoose = require('mongoose');

const careerPathSchema = new mongoose.Schema({
  title: { type: String },
  entryRoles: [{ type: String }],
  growthRoles: [{ type: String }],
  averageSalary: { type: String },
  relatedExams: [{ type: String }],
  skills: [{ type: String }],
  description: { type: String }
}, { _id: false });

const degreeSchema = new mongoose.Schema({
  name: { type: String },
  duration: { type: String },
  eligibility: { type: String },
  description: { type: String },
  topColleges: [{ type: String }]
}, { _id: false });

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment'
  },

  // Stream Recommendations
  recommendedStreams: [{
    stream: { type: String }, // Science, Commerce, Arts
    confidence: { type: Number }, // 0-100 percentage match
    justification: { type: String },
    rank: { type: Number }
  }],

  // Degree Recommendations
  recommendedDegrees: [degreeSchema],

  // Career Paths
  careerPaths: [careerPathSchema],

  // Logic used (for transparency)
  recommendationBasis: {
    academicScore: { type: Number },
    interestAlignment: { type: Number },
    aptitudeScore: { type: Number },
    topCategories: [{ type: String }],
    topInterests: [{ type: String }]
  },

  // Version for future AI upgrades
  engineVersion: { type: String, default: 'rule-based-v1' },

  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

recommendationSchema.index({ userId: 1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);