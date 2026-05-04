/**
 * College Model
 * Government and private college data
 */

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  degree: { type: String }, // B.Tech, B.Sc, B.Com, BA, etc.
  duration: { type: String },
  seats: { type: Number },
  eligibility: { type: String },
  fees: { type: String }
}, { _id: true });

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  shortName: { type: String },
  type: {
    type: String,
    enum: ['Government', 'Government-Aided', 'Private', 'Deemed', 'Central'],
    required: true
  },
  category: {
    type: String,
    enum: ['Engineering', 'Medical', 'Arts & Science', 'Commerce', 'Law', 'Management', 'Polytechnic', 'General'],
    required: true
  },

  // Location
  location: {
    address: { type: String },
    city: { type: String, required: true },
    district: { type: String },
    state: { type: String, required: true },
    pincode: { type: String }
  },

  // Contact
  contact: {
    phone: { type: String },
    email: { type: String },
    website: { type: String }
  },

  // Details
  established: { type: Number },
  affiliation: { type: String }, // Anna University, etc.
  accreditation: [{ type: String }], // NAAC A+, NBA, etc.
  ranking: { type: String },

  // Courses
  courses: [courseSchema],

  // Facilities
  facilities: [{ type: String }], // Library, Hostel, Sports, Lab, etc.

  // Admission
  admission: {
    process: { type: String },
    entranceExams: [{ type: String }], // TNEA, JEE, NEET, etc.
    applicationStart: { type: String },
    applicationEnd: { type: String },
    website: { type: String }
  },

  // Metadata
  description: { type: String },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true },

}, { timestamps: true });

// Full-text search index
collegeSchema.index({ name: 'text', 'location.city': 'text', 'location.state': 'text' });
collegeSchema.index({ 'location.state': 1, 'location.city': 1 });
collegeSchema.index({ category: 1, type: 1 });

module.exports = mongoose.model('College', collegeSchema);