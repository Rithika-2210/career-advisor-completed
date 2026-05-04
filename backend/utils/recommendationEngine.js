/**
 * Recommendation Engine (Rule-Based v1)
 * Maps user profile + assessment scores to career recommendations
 * Structured for easy AI/ML upgrade in future
 */

// ============================================================
// KNOWLEDGE BASE - Career Maps
// ============================================================

const STREAM_RULES = {
  Science: {
    description: 'Best suited for analytical thinkers who enjoy mathematics, physics, and problem-solving.',
    triggers: {
      interests: ['Technology', 'Engineering', 'Medicine', 'Research', 'Physics', 'Mathematics', 'Biology', 'Chemistry'],
      aptitudeCategories: ['quantitative', 'analytical', 'logical'],
      minTwelfthMarks: 60
    },
    degrees: [
      { name: 'B.Tech / B.E.', duration: '4 years', eligibility: '12th Science (PCM) with 60%+', description: 'Engineering degree for tech and core industries', topColleges: ['IIT Madras', 'NIT Trichy', 'Anna University'] },
      { name: 'MBBS', duration: '5.5 years', eligibility: '12th Science (PCB) with 70%+ and NEET', description: 'Medical degree for becoming a doctor', topColleges: ['AIIMS', 'JIPMER', 'Madras Medical College'] },
      { name: 'B.Sc (Physics/Chemistry/Maths/Bio)', duration: '3 years', eligibility: '12th Science with 50%+', description: 'Pure science degree for research and academia', topColleges: ['Presidency College', 'Loyola College', 'PSG College'] },
      { name: 'B.Arch', duration: '5 years', eligibility: '12th Science with 50%+ and NATA', description: 'Architecture for those combining science with creativity', topColleges: ['SPA Delhi', 'CEPT', 'TVS Engineering College'] }
    ]
  },
  Commerce: {
    description: 'Ideal for those interested in business, finance, economics, and management.',
    triggers: {
      interests: ['Business', 'Finance', 'Economics', 'Accounting', 'Entrepreneurship', 'Management', 'Banking'],
      aptitudeCategories: ['quantitative', 'analytical'],
      minTwelfthMarks: 50
    },
    degrees: [
      { name: 'B.Com', duration: '3 years', eligibility: '12th Commerce/Any stream with 50%+', description: 'Foundation for accounting, finance and business careers', topColleges: ['Shri Ram College', 'Loyola College Chennai', 'SRCC Delhi'] },
      { name: 'BBA / BBM', duration: '3 years', eligibility: '12th with 50%+', description: 'Business administration and management', topColleges: ['Christ University', 'Symbiosis', 'Narsee Monjee'] },
      { name: 'CA (Chartered Accountancy)', duration: '3-5 years', eligibility: '12th with 50%+ and CPT/Foundation', description: 'Premier finance qualification for accounting professionals', topColleges: ['ICAI Chapters nationwide'] },
      { name: 'BMS (Bachelor of Management Studies)', duration: '3 years', eligibility: '12th with 50%+', description: 'Management and business strategy', topColleges: ['Mumbai University colleges', 'Symbiosis'] }
    ]
  },
  Arts: {
    description: 'Perfect for creative minds interested in humanities, social sciences, and communication.',
    triggers: {
      interests: ['Arts', 'Literature', 'Design', 'Psychology', 'Social Work', 'Journalism', 'Politics', 'History', 'Philosophy', 'Music'],
      aptitudeCategories: ['verbal', 'analytical'],
      minTwelfthMarks: 40
    },
    degrees: [
      { name: 'BA (Hons) in Various Subjects', duration: '3 years', eligibility: '12th with 45%+', description: 'Humanities and social science degrees', topColleges: ['St. Stephens Delhi', 'Miranda House', 'Presidency College'] },
      { name: 'B.Des (Design)', duration: '4 years', eligibility: '12th with portfolio and NID/NIFT entrance', description: 'Design degree for UI/UX, fashion, product design', topColleges: ['NID Ahmedabad', 'NIFT', 'Srishti Manipal'] },
      { name: 'B.Journalism & Mass Communication', duration: '3 years', eligibility: '12th with 50%+', description: 'Media, journalism and communication careers', topColleges: ['IIMC Delhi', 'Symbiosis Institute', 'ACJ Chennai'] },
      { name: 'LLB / BA LLB', duration: '3 or 5 years', eligibility: 'Any degree or 12th + CLAT', description: 'Law degree for legal and justice careers', topColleges: ['NLU Delhi', 'NLU Bangalore', 'NLSIU'] }
    ]
  }
};

const CAREER_PATHS = {
  'Software Engineering': {
    title: 'Software Engineering',
    entryRoles: ['Junior Software Developer', 'Frontend Developer', 'Backend Developer', 'QA Engineer', 'DevOps Trainee'],
    growthRoles: ['Senior Developer', 'Tech Lead', 'Software Architect', 'Engineering Manager', 'CTO'],
    averageSalary: '₹4L - ₹40L+ per annum',
    relatedExams: ['GATE (for PSUs)', 'AMCAT', 'TCS NQT', 'Infosys InfyTQ', 'UPSC Technical'],
    skills: ['Programming', 'Data Structures', 'System Design', 'Cloud Computing', 'Agile'],
    description: 'Build software products ranging from mobile apps to cloud infrastructure.'
  },
  'Medicine & Healthcare': {
    title: 'Medicine & Healthcare',
    entryRoles: ['MBBS Doctor', 'Dentist', 'Pharmacist', 'Nurse', 'Physiotherapist'],
    growthRoles: ['Specialist Surgeon', 'HOD', 'Medical Superintendent', 'Hospital Director'],
    averageSalary: '₹5L - ₹50L+ per annum',
    relatedExams: ['NEET UG', 'NEET PG', 'USMLE (USA)', 'FMGE'],
    skills: ['Clinical Knowledge', 'Patient Care', 'Diagnosis', 'Research', 'Communication'],
    description: 'Serve communities through healthcare ranging from primary care to super-specialty.'
  },
  'Business & Management': {
    title: 'Business & Management',
    entryRoles: ['Management Trainee', 'Business Analyst', 'Sales Executive', 'HR Executive', 'Marketing Executive'],
    growthRoles: ['Manager', 'Senior Manager', 'VP', 'Director', 'CEO'],
    averageSalary: '₹3L - ₹50L+ per annum',
    relatedExams: ['CAT', 'XAT', 'MAT', 'GMAT', 'SNAP'],
    skills: ['Leadership', 'Communication', 'Strategic Thinking', 'Financial Acumen', 'Networking'],
    description: 'Lead organizations and build businesses across all sectors.'
  },
  'Finance & Banking': {
    title: 'Finance & Banking',
    entryRoles: ['Junior Accountant', 'Financial Analyst Trainee', 'Bank PO', 'Tax Assistant'],
    growthRoles: ['Senior CA', 'CFO', 'Investment Banker', 'Fund Manager', 'Finance Director'],
    averageSalary: '₹3.5L - ₹60L+ per annum',
    relatedExams: ['CA CPT/Intermediate/Final', 'CMA', 'IBPS PO', 'SBI PO', 'RBI Grade B'],
    skills: ['Accounting', 'Financial Modeling', 'Risk Analysis', 'Excel/SAP', 'Compliance'],
    description: 'Manage money, investments and financial systems for individuals and organizations.'
  },
  'Law & Judiciary': {
    title: 'Law & Judiciary',
    entryRoles: ['Junior Advocate', 'Legal Associate', 'Law Clerk', 'Legal Researcher'],
    growthRoles: ['Senior Advocate', 'Partner (Law Firm)', 'District Judge', 'High Court Judge', 'Supreme Court Judge'],
    averageSalary: '₹3L - ₹40L+ per annum',
    relatedExams: ['CLAT', 'AIBE', 'Civil Judge Exam', 'Judicial Service Exam'],
    skills: ['Legal Research', 'Argumentation', 'Writing', 'Critical Thinking', 'Ethics'],
    description: 'Uphold justice through litigation, corporate law, or judicial service.'
  },
  'Design & Creative Arts': {
    title: 'Design & Creative Arts',
    entryRoles: ['Junior Designer', 'Graphic Designer', 'UI/UX Designer', 'Illustrator', 'Animator'],
    growthRoles: ['Senior Designer', 'Art Director', 'Creative Director', 'Design Head'],
    averageSalary: '₹2.5L - ₹30L+ per annum',
    relatedExams: ['NID DAT', 'NIFT Entrance', 'CEED', 'UCEED'],
    skills: ['Visual Design', 'Adobe Suite', 'Figma', 'Typography', 'User Research'],
    description: 'Shape visual experiences for brands, products and digital platforms.'
  },
  'Science & Research': {
    title: 'Science & Research',
    entryRoles: ['Research Assistant', 'Lab Technician', 'Junior Scientist', 'Teaching Assistant'],
    growthRoles: ['Scientist', 'Senior Researcher', 'Professor', 'Research Director'],
    averageSalary: '₹3L - ₹20L+ per annum',
    relatedExams: ['GATE', 'CSIR NET', 'UGC NET', 'JEST', 'IIT JAM'],
    skills: ['Research Methodology', 'Data Analysis', 'Lab Skills', 'Scientific Writing', 'Statistics'],
    description: 'Push the boundaries of knowledge through research in academia and industry.'
  },
  'Media & Communication': {
    title: 'Media & Communication',
    entryRoles: ['Junior Journalist', 'Content Writer', 'Social Media Executive', 'News Reporter'],
    growthRoles: ['Senior Journalist', 'Editor', 'News Anchor', 'Media Director'],
    averageSalary: '₹2.5L - ₹25L+ per annum',
    relatedExams: ['IIMC Entrance', 'ACJ Entrance', 'PII Entrance', 'Press Trust Tests'],
    skills: ['Writing', 'Communication', 'Research', 'Digital Media', 'Video Production'],
    description: 'Inform, entertain and shape public opinion through media channels.'
  }
};

// ============================================================
// INTEREST → CAREER MAPPING
// ============================================================

const INTEREST_TO_CAREER = {
  'Technology': ['Software Engineering', 'Science & Research'],
  'Engineering': ['Software Engineering', 'Science & Research'],
  'Medicine': ['Medicine & Healthcare'],
  'Biology': ['Medicine & Healthcare', 'Science & Research'],
  'Business': ['Business & Management', 'Finance & Banking'],
  'Finance': ['Finance & Banking', 'Business & Management'],
  'Economics': ['Finance & Banking', 'Business & Management'],
  'Entrepreneurship': ['Business & Management'],
  'Arts': ['Design & Creative Arts', 'Media & Communication'],
  'Design': ['Design & Creative Arts'],
  'Journalism': ['Media & Communication'],
  'Literature': ['Media & Communication'],
  'Psychology': ['Law & Judiciary', 'Media & Communication'],
  'Politics': ['Law & Judiciary'],
  'Social Work': ['Law & Judiciary'],
  'Mathematics': ['Software Engineering', 'Finance & Banking', 'Science & Research'],
  'Physics': ['Science & Research', 'Software Engineering'],
  'Chemistry': ['Science & Research', 'Medicine & Healthcare'],
  'Accounting': ['Finance & Banking'],
  'Management': ['Business & Management'],
  'Banking': ['Finance & Banking'],
  'Music': ['Design & Creative Arts'],
  'History': ['Law & Judiciary', 'Media & Communication'],
  'Philosophy': ['Law & Judiciary'],
};

// ============================================================
// SCORING FUNCTIONS
// ============================================================

/**
 * Score how well a stream matches the user profile
 */
const scoreStreamMatch = (stream, userProfile, assessmentResult) => {
  let score = 0;
  const rules = STREAM_RULES[stream].triggers;

  // Interest alignment (40 points max)
  const userInterests = userProfile.interests || [];
  const matchingInterests = userInterests.filter(i => rules.interests.includes(i));
  score += (matchingInterests.length / Math.max(rules.interests.length, 1)) * 40;

  // Aptitude category alignment (30 points max)
  if (assessmentResult && assessmentResult.categoryScores) {
    const topCategories = assessmentResult.categoryScores
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 2)
      .map(c => c.category);
    const aptitudeMatch = topCategories.filter(c => rules.aptitudeCategories.includes(c));
    score += (aptitudeMatch.length / rules.aptitudeCategories.length) * 30;
  }

  // Academic marks alignment (30 points max)
  const marks = userProfile.academicDetails?.twelfthMarks ||
                userProfile.academicDetails?.tenthMarks || 50;
  if (marks >= rules.minTwelfthMarks + 20) score += 30;
  else if (marks >= rules.minTwelfthMarks) score += 20;
  else if (marks >= rules.minTwelfthMarks - 10) score += 10;

  return Math.min(Math.round(score), 100);
};

/**
 * Get relevant career paths based on user interests
 */
const getRelevantCareers = (userInterests) => {
  const careerScores = {};

  userInterests.forEach(interest => {
    const careers = INTEREST_TO_CAREER[interest] || [];
    careers.forEach(career => {
      careerScores[career] = (careerScores[career] || 0) + 1;
    });
  });

  // Sort by match count and return top careers
  return Object.entries(careerScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([career]) => CAREER_PATHS[career])
    .filter(Boolean);
};

// ============================================================
// MAIN RECOMMENDATION FUNCTION
// ============================================================

/**
 * Generate complete personalized recommendations
 * @param {Object} userProfile - User document from DB
 * @param {Object} assessmentResult - Assessment result document
 * @returns {Object} Full recommendation set
 */
const generateRecommendations = (userProfile, assessmentResult = null) => {
  const { interests = [], academicDetails = {}, skills = [] } = userProfile;

  // Score all streams
  const streamScores = Object.keys(STREAM_RULES).map(stream => ({
    stream,
    confidence: scoreStreamMatch(stream, userProfile, assessmentResult),
    justification: generateJustification(stream, interests, academicDetails, assessmentResult),
    rank: 0
  })).sort((a, b) => b.confidence - a.confidence);

  // Assign ranks
  streamScores.forEach((s, i) => s.rank = i + 1);

  // Top stream degrees
  const topStream = streamScores[0].stream;
  const recommendedDegrees = STREAM_RULES[topStream]?.degrees || [];

  // Career paths based on interests
  const careerPaths = getRelevantCareers(interests);

  // Assessment analysis
  const topCategories = assessmentResult?.categoryScores
    ?.sort((a, b) => b.percentage - a.percentage)
    .slice(0, 2)
    .map(c => c.category) || [];

  return {
    recommendedStreams: streamScores,
    recommendedDegrees,
    careerPaths,
    recommendationBasis: {
      academicScore: academicDetails.twelfthMarks || academicDetails.tenthMarks || 0,
      interestAlignment: streamScores[0].confidence,
      aptitudeScore: assessmentResult?.percentage || 0,
      topCategories,
      topInterests: interests.slice(0, 3)
    },
    engineVersion: 'rule-based-v1'
  };
};

/**
 * Generate human-readable justification for a stream recommendation
 */
const generateJustification = (stream, interests, academicDetails, assessmentResult) => {
  const rules = STREAM_RULES[stream].triggers;
  const matchingInterests = interests.filter(i => rules.interests.includes(i));
  const marks = academicDetails?.twelfthMarks || academicDetails?.tenthMarks;

  const parts = [];

  if (matchingInterests.length > 0) {
    parts.push(`Your interests in ${matchingInterests.slice(0, 2).join(' and ')} align well with ${stream}`);
  }

  if (marks && marks >= rules.minTwelfthMarks) {
    parts.push(`your academic performance (${marks}%) meets the requirements`);
  }

  if (assessmentResult) {
    const topCat = assessmentResult.categoryScores
      ?.sort((a, b) => b.percentage - a.percentage)[0];
    if (topCat && rules.aptitudeCategories.includes(topCat.category)) {
      parts.push(`your strong ${topCat.category} aptitude is a great fit`);
    }
  }

  return parts.length > 0
    ? parts.join(', ') + '.'
    : `Based on your overall profile, ${stream} could be a suitable path for you.`;
};

module.exports = { generateRecommendations, STREAM_RULES, CAREER_PATHS };