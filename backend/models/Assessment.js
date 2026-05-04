/**
 * Assessment Model
 * Stores MCQ tests and student results
 */

const mongoose = require('mongoose');

// Schema for individual questions
const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{
    label: { type: String, required: true }, // A, B, C, D
    text: { type: String, required: true }
  }],
  correctOption: { type: String, required: true }, // A, B, C, D
  category: {
    type: String,
    enum: ['logical', 'analytical', 'verbal', 'quantitative', 'interest'],
    required: true
  },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  explanation: { type: String } // Why this is the correct answer
}, { _id: true });

// Schema for student responses
const responseSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId },
  selectedOption: { type: String },
  isCorrect: { type: Boolean },
  timeTaken: { type: Number } // in seconds
}, { _id: false });

// Schema for category scores
const categoryScoreSchema = new mongoose.Schema({
  category: { type: String },
  score: { type: Number },
  total: { type: Number },
  percentage: { type: Number }
}, { _id: false });

const assessmentSchema = new mongoose.Schema({
  // Assessment metadata
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ['aptitude', 'interest', 'personality', 'combined'],
    default: 'combined'
  },
  totalQuestions: { type: Number },
  timeLimit: { type: Number, default: 30 }, // minutes
  isActive: { type: Boolean, default: true },

  // Questions bank
  questions: [questionSchema],

  // Student attempt (one document per attempt)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  responses: [responseSchema],

  // Results
  totalScore: { type: Number },
  maxScore: { type: Number },
  percentage: { type: Number },
  categoryScores: [categoryScoreSchema],

  // Status
  status: {
    type: String,
    enum: ['template', 'in-progress', 'completed'],
    default: 'template'
  },
  startedAt: { type: Date },
  completedAt: { type: Date },
  timeTakenMinutes: { type: Number },

}, { timestamps: true });

assessmentSchema.index({ userId: 1, status: 1 });
assessmentSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('Assessment', assessmentSchema);