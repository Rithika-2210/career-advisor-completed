/**
 * College Controller
 * College discovery, search, filtering, and real-data enrichment
 */

const College = require('../models/College');
const { enrichCollegeData, enrichColleges, getCollegesForStream } = require('../utils/collegeEnrichment');

/**
 * @route   GET /api/colleges
 * @desc    Get colleges with filters and pagination
 * @access  Public
 */
exports.getColleges = async (req, res, next) => {
  try {
    const {
      state, city, category, type, course,
      search, page = 1, limit = 12
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (state) query['location.state'] = new RegExp(state, 'i');
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (category) query.category = category;
    if (type) query.type = type;
    if (course) query['courses.name'] = new RegExp(course, 'i');
    if (search) query.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [colleges, total] = await Promise.all([
      College.find(query).sort({ name: 1 }).skip(skip).limit(parseInt(limit)),
      College.countDocuments(query)
    ]);

    // Enrich with real data for list view (lightweight enrichment)
    const enriched = await enrichColleges(colleges);

    res.json({
      success: true,
      colleges: enriched,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/colleges/:id
 * @desc    Get single college with real enriched data
 * @access  Public
 */
exports.getCollege = async (req, res, next) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found.' });
    }
    // Enrich with real NIRF/placement/cutoff data
    const enriched = await enrichCollegeData(college);
    res.json({ success: true, college: enriched });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/colleges/stream/:stream
 * @desc    Get colleges recommended for a specific stream (Science/Commerce/Arts)
 * @access  Public
 */
exports.getCollegesByStream = async (req, res, next) => {
  try {
    const { stream } = req.params;
    const colleges = await getCollegesForStream(stream, College);
    res.json({ success: true, colleges, stream });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/colleges/filters/options
 * @desc    Get filter options (states, categories, types)
 * @access  Public
 */
exports.getFilterOptions = async (req, res, next) => {
  try {
    const [states, categories, types] = await Promise.all([
      College.distinct('location.state', { isActive: true }),
      College.distinct('category', { isActive: true }),
      College.distinct('type', { isActive: true })
    ]);

    res.json({
      success: true,
      filters: {
        states: states.sort(),
        categories: categories.sort(),
        types: types.sort()
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/colleges (Admin only)
 * @desc    Add new college
 * @access  Private (Admin)
 */
exports.addCollege = async (req, res, next) => {
  try {
    const college = await College.create(req.body);
    res.status(201).json({ success: true, message: 'College added successfully', college });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/colleges/:id (Admin only)
 * @desc    Update college
 * @access  Private (Admin)
 */
exports.updateCollege = async (req, res, next) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!college) return res.status(404).json({ success: false, message: 'College not found.' });
    res.json({ success: true, college });
  } catch (error) {
    next(error);
  }
};