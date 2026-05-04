/**
 * Assessment Controller
 * MCQ-based aptitude test management and evaluation
 */

const Assessment = require('../models/Assessment');
const User = require('../models/User');
const { QUESTION_BANK } = require('../data/questionBank');

/**
 * @route   GET /api/assessments/questions
 * @desc    Get assessment questions (starts a new assessment)
 * @access  Private
 */
exports.startAssessment = async (req, res, next) => {
  try {
    // Check if user already has a completed assessment
    const existing = await Assessment.findOne({
      userId: req.user._id,
      status: 'completed'
    }).sort({ completedAt: -1 });

    // Create new assessment from question bank
    const assessment = await Assessment.create({
      title: 'Career Aptitude & Interest Assessment',
      description: 'Evaluate your aptitude and interests to get personalized career recommendations',
      type: 'combined',
      userId: req.user._id,
      questions: QUESTION_BANK,
      totalQuestions: QUESTION_BANK.length,
      timeLimit: 30,
      status: 'in-progress',
      startedAt: new Date()
    });

    // Return questions WITHOUT correct answers (security)
    const safeQuestions = assessment.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      category: q.category,
      difficulty: q.difficulty
    }));

    res.json({
      success: true,
      assessmentId: assessment._id,
      questions: safeQuestions,
      timeLimit: assessment.timeLimit,
      previousAttempt: existing ? {
        score: existing.percentage,
        completedAt: existing.completedAt
      } : null
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/assessments/:id/submit
 * @desc    Submit assessment answers and get results
 * @access  Private
 */
exports.submitAssessment = async (req, res, next) => {
  try {
    const { answers } = req.body; // [{ questionId, selectedOption }]

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers array is required.' });
    }

    const assessment = await Assessment.findOne({
      _id: req.params.id,
      userId: req.user._id,
      status: 'in-progress'
    });

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found or already submitted.' });
    }

    // Evaluate answers
    const responses = [];
    const categoryTotals = {};
    const categoryCorrect = {};
    let totalCorrect = 0;

    assessment.questions.forEach(question => {
      const userAnswer = answers.find(a => a.questionId.toString() === question._id.toString());
      const selectedOption = userAnswer?.selectedOption || null;
      const isCorrect = selectedOption === question.correctOption;

      if (isCorrect) totalCorrect++;

      responses.push({
        questionId: question._id,
        selectedOption,
        isCorrect
      });

      // Track per-category scores
      const cat = question.category;
      categoryTotals[cat] = (categoryTotals[cat] || 0) + 1;
      if (isCorrect) categoryCorrect[cat] = (categoryCorrect[cat] || 0) + 1;
    });

    // Build category scores
    const categoryScores = Object.keys(categoryTotals).map(cat => ({
      category: cat,
      score: categoryCorrect[cat] || 0,
      total: categoryTotals[cat],
      percentage: Math.round(((categoryCorrect[cat] || 0) / categoryTotals[cat]) * 100)
    }));

    const totalQuestions = assessment.questions.length;
    const percentage = Math.round((totalCorrect / totalQuestions) * 100);
    const completedAt = new Date();
    const timeTakenMinutes = Math.round((completedAt - assessment.startedAt) / 60000);

    // Update assessment
    assessment.responses = responses;
    assessment.totalScore = totalCorrect;
    assessment.maxScore = totalQuestions;
    assessment.percentage = percentage;
    assessment.categoryScores = categoryScores;
    assessment.status = 'completed';
    assessment.completedAt = completedAt;
    assessment.timeTakenMinutes = timeTakenMinutes;
    await assessment.save();

    // Update user's assessment list
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        assessmentsTaken: { assessmentId: assessment._id, takenAt: completedAt }
      }
    });

    // Determine performance level
    const performanceLevel = percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Good' : percentage >= 40 ? 'Average' : 'Needs Improvement';

    res.json({
      success: true,
      message: 'Assessment submitted successfully!',
      result: {
        assessmentId: assessment._id,
        totalScore: totalCorrect,
        maxScore: totalQuestions,
        percentage,
        performanceLevel,
        categoryScores,
        timeTakenMinutes,
        completedAt
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/assessments/my-results
 * @desc    Get user's assessment history
 * @access  Private
 */
exports.getMyResults = async (req, res, next) => {
  try {
    const results = await Assessment.find({
      userId: req.user._id,
      status: 'completed'
    })
    .select('-questions -responses')
    .sort({ completedAt: -1 });

    res.json({ success: true, results });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/assessments/:id/result
 * @desc    Get specific assessment result with answers
 * @access  Private
 */
exports.getAssessmentResult = async (req, res, next) => {
  try {
    const assessment = await Assessment.findOne({
      _id: req.params.id,
      userId: req.user._id,
      status: 'completed'
    });

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment result not found.' });
    }

    // Merge responses with questions to show review
    const reviewData = assessment.questions.map(q => {
      const response = assessment.responses.find(r => r.questionId.toString() === q._id.toString());
      return {
        questionText: q.questionText,
        options: q.options,
        correctOption: q.correctOption,
        selectedOption: response?.selectedOption,
        isCorrect: response?.isCorrect,
        explanation: q.explanation,
        category: q.category
      };
    });

    res.json({
      success: true,
      assessment: {
        _id: assessment._id,
        title: assessment.title,
        totalScore: assessment.totalScore,
        maxScore: assessment.maxScore,
        percentage: assessment.percentage,
        categoryScores: assessment.categoryScores,
        completedAt: assessment.completedAt,
        timeTakenMinutes: assessment.timeTakenMinutes,
        reviewData
      }
    });

  } catch (error) {
    next(error);
  }
};