/**
 * Seed Script
 * Populates the database with sample colleges and an admin user
 * Run: node data/seed.js
 */
require('dotenv').config({ path: __dirname + '/../.env' });
console.log("MONGO_URI:", process.env.MONGO_URI);
const mongoose = require('mongoose');
const College = require('../models/College');
const User = require('../models/User');

const COLLEGES = [
  {
    name: "Indian Institute of Technology Madras",
    shortName: "IIT Madras",
    type: "Central",
    category: "Engineering",
    location: { address: "IIT P.O.", city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600036" },
    contact: { phone: "044-22574000", email: "webmaster@iitm.ac.in", website: "https://www.iitm.ac.in" },
    established: 1959,
    affiliation: "Autonomous (Deemed University)",
    accreditation: ["NAAC A++", "NIRF Rank 1"],
    ranking: "NIRF #1 Engineering",
    courses: [
      { name: "B.Tech Computer Science", degree: "B.Tech", duration: "4 years", seats: 100, eligibility: "JEE Advanced", fees: "₹2.2L/year" },
      { name: "B.Tech Mechanical Engineering", degree: "B.Tech", duration: "4 years", seats: 80, eligibility: "JEE Advanced", fees: "₹2.2L/year" },
      { name: "B.Tech Electrical Engineering", degree: "B.Tech", duration: "4 years", seats: 80, eligibility: "JEE Advanced", fees: "₹2.2L/year" },
      { name: "M.Tech", degree: "M.Tech", duration: "2 years", seats: 200, eligibility: "GATE", fees: "₹15,000/year" }
    ],
    facilities: ["Central Library", "Sports Complex", "Research Labs", "Hostels", "Medical Center", "WiFi Campus"],
    admission: {
      process: "Apply through JEE Advanced counseling (JoSAA). Admission based on JEE Advanced rank.",
      entranceExams: ["JEE Main", "JEE Advanced"],
      applicationStart: "April",
      applicationEnd: "May",
      website: "https://josaa.nic.in"
    },
    description: "India's premier engineering institute, ranked #1 by NIRF for multiple consecutive years."
  },
  {
    name: "National Institute of Technology Tiruchirappalli",
    shortName: "NIT Trichy",
    type: "Central",
    category: "Engineering",
    location: { address: "Tanjore Main Road", city: "Tiruchirappalli", district: "Tiruchirappalli", state: "Tamil Nadu", pincode: "620015" },
    contact: { phone: "0431-2503000", email: "info@nitt.edu", website: "https://www.nitt.edu" },
    established: 1964,
    affiliation: "Autonomous (NIT)",
    accreditation: ["NAAC A+", "NIRF Top 10"],
    ranking: "NIRF #8 Engineering",
    courses: [
      { name: "B.Tech Computer Science & Engineering", degree: "B.Tech", duration: "4 years", seats: 60, eligibility: "JEE Main", fees: "₹1.7L/year" },
      { name: "B.Tech Electronics & Communication", degree: "B.Tech", duration: "4 years", seats: 60, eligibility: "JEE Main", fees: "₹1.7L/year" },
      { name: "B.Tech Civil Engineering", degree: "B.Tech", duration: "4 years", seats: 60, eligibility: "JEE Main", fees: "₹1.7L/year" }
    ],
    facilities: ["Library", "Hostel", "Sports Ground", "Research Center", "Placement Cell"],
    admission: {
      process: "Admission through JEE Main via JoSAA / CSAB counseling.",
      entranceExams: ["JEE Main"],
      applicationStart: "March",
      applicationEnd: "April",
      website: "https://josaa.nic.in"
    },
    description: "Top NIT in India, known for excellent placement record and research output."
  },
  {
    name: "Anna University",
    shortName: "AU",
    type: "Government",
    category: "Engineering",
    location: { address: "Sardar Patel Road, Guindy", city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600025" },
    contact: { phone: "044-22359189", email: "registrar@annauniv.edu", website: "https://www.annauniv.edu" },
    established: 1978,
    affiliation: "State University",
    accreditation: ["NAAC A+"],
    ranking: "NIRF Top 50",
    courses: [
      { name: "B.E. Computer Science", degree: "B.E.", duration: "4 years", seats: 120, eligibility: "TNEA", fees: "₹90,000/year" },
      { name: "B.E. Information Technology", degree: "B.E.", duration: "4 years", seats: 120, eligibility: "TNEA", fees: "₹90,000/year" },
      { name: "M.E. Computer Science", degree: "M.E.", duration: "2 years", seats: 40, eligibility: "TANCET/GATE", fees: "₹60,000/year" }
    ],
    facilities: ["Central Library", "Sports Complex", "Hostel", "Labs", "Canteen"],
    admission: {
      process: "Admission through TNEA (Tamil Nadu Engineering Admissions) based on 12th marks.",
      entranceExams: ["TNEA"],
      applicationStart: "May",
      applicationEnd: "June",
      website: "https://www.annauniv.edu/TNEA"
    },
    description: "Prestigious state technical university, parent university for 500+ engineering colleges in Tamil Nadu."
  },
  {
    name: "Loyola College",
    shortName: "Loyola",
    type: "Government-Aided",
    category: "Arts & Science",
    location: { address: "Nungambakkam", city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600034" },
    contact: { phone: "044-28178200", email: "principal@loyolacollege.edu", website: "https://www.loyolacollege.edu" },
    established: 1925,
    affiliation: "University of Madras",
    accreditation: ["NAAC A++", "Autonomous"],
    ranking: "Best Arts & Science College TN",
    courses: [
      { name: "B.Sc Computer Science", degree: "B.Sc", duration: "3 years", seats: 80, eligibility: "12th + Merit", fees: "₹35,000/year" },
      { name: "B.Com", degree: "B.Com", duration: "3 years", seats: 120, eligibility: "12th + Merit", fees: "₹30,000/year" },
      { name: "BA Economics", degree: "BA", duration: "3 years", seats: 80, eligibility: "12th + Merit", fees: "₹28,000/year" },
      { name: "B.Sc Mathematics", degree: "B.Sc", duration: "3 years", seats: 60, eligibility: "12th PCM", fees: "₹28,000/year" }
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Chapel", "Research Center"],
    admission: {
      process: "Merit-based admission through online application. Cutoff varies by course.",
      entranceExams: ["None (Merit-based)"],
      applicationStart: "April",
      applicationEnd: "May",
      website: "https://www.loyolacollege.edu/admissions"
    },
    description: "One of India's most prestigious liberal arts colleges with a rich 100-year history."
  },
  {
    name: "PSG College of Technology",
    shortName: "PSG Tech",
    type: "Government-Aided",
    category: "Engineering",
    location: { address: "Peelamedu", city: "Coimbatore", district: "Coimbatore", state: "Tamil Nadu", pincode: "641004" },
    contact: { phone: "0422-2572177", email: "principal@psgtech.edu", website: "https://www.psgtech.edu" },
    established: 1951,
    affiliation: "Anna University",
    accreditation: ["NAAC A++", "NBA Accredited"],
    ranking: "Top 10 Private Engineering Colleges India",
    courses: [
      { name: "B.E. Computer Science & Engineering", degree: "B.E.", duration: "4 years", seats: 120, eligibility: "TNEA/Management Quota", fees: "₹75,000/year" },
      { name: "B.E. Electronics & Communication", degree: "B.E.", duration: "4 years", seats: 120, eligibility: "TNEA/Management Quota", fees: "₹75,000/year" },
      { name: "B.Tech Information Technology", degree: "B.Tech", duration: "4 years", seats: 60, eligibility: "TNEA/Management Quota", fees: "₹75,000/year" },
      { name: "M.E. Computer Science", degree: "M.E.", duration: "2 years", seats: 18, eligibility: "TANCET/GATE", fees: "₹50,000/year" }
    ],
    facilities: ["Central Library", "Sports Complex", "Hostel", "Innovation Center", "Placement Cell", "Medical Center"],
    admission: {
      process: "Admission through TNEA for government quota, direct admission for management quota.",
      entranceExams: ["TNEA", "TANCET"],
      applicationStart: "May",
      applicationEnd: "June",
      website: "https://www.psgtech.edu/admissions"
    },
    description: "Premier engineering institution in Coimbatore, known for industry connections and excellent placements."
  },
  {
    name: "Madras Medical College",
    shortName: "MMC",
    type: "Government",
    category: "Medical",
    location: { address: "Park Town", city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600003" },
    contact: { phone: "044-25305100", email: "principal.mmc@tn.gov.in", website: "https://www.mmc.ac.in" },
    established: 1835,
    affiliation: "The Tamil Nadu Dr. MGR Medical University",
    accreditation: ["MCI Recognized"],
    ranking: "Top Government Medical College India",
    courses: [
      { name: "MBBS", degree: "MBBS", duration: "5.5 years", seats: 250, eligibility: "NEET UG", fees: "₹15,000/year" },
      { name: "MD General Medicine", degree: "MD", duration: "3 years", seats: 40, eligibility: "NEET PG", fees: "₹25,000/year" },
      { name: "MS Surgery", degree: "MS", duration: "3 years", seats: 30, eligibility: "NEET PG", fees: "₹25,000/year" }
    ],
    facilities: ["1800-bed Hospital", "Library", "Hostel", "Simulation Lab", "Research Center"],
    admission: {
      process: "NEET UG scores + state merit list for MBBS. NEET PG for postgraduate programs.",
      entranceExams: ["NEET UG", "NEET PG"],
      applicationStart: "June",
      applicationEnd: "August",
      website: "https://tnmedicalselection.net"
    },
    description: "One of Asia's oldest and largest medical colleges, established in 1835 by the British."
  },
  {
    name: "Government Law College Chennai",
    shortName: "GLC Chennai",
    type: "Government",
    category: "Law",
    location: { address: "Periyamet", city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600003" },
    contact: { phone: "044-25340956", email: "principalglc@yahoo.co.in", website: "" },
    established: 1891,
    affiliation: "Tamil Nadu Dr. Ambedkar Law University",
    accreditation: ["BCI Recognized"],
    ranking: "Top Government Law College TN",
    courses: [
      { name: "B.L. (LLB)", degree: "LLB", duration: "3 years", seats: 200, eligibility: "Any Degree + TNAET", fees: "₹7,000/year" },
      { name: "B.Com LLB", degree: "BA LLB", duration: "5 years", seats: 60, eligibility: "12th + TNAET", fees: "₹10,000/year" }
    ],
    facilities: ["Library", "Moot Court Hall", "Seminar Rooms"],
    admission: {
      process: "TNAET (Tamil Nadu Admission Entrance Test) conducted by TNDALU.",
      entranceExams: ["TNAET"],
      applicationStart: "May",
      applicationEnd: "June",
      website: "https://tndalu.ac.in"
    },
    description: "Premier government law college in Tamil Nadu with over 130 years of legal education."
  },
  {
    name: "Coimbatore Institute of Technology",
    shortName: "CIT",
    type: "Government",
    category: "Engineering",
    location: { address: "Civil Aerodrome Post", city: "Coimbatore", district: "Coimbatore", state: "Tamil Nadu", pincode: "641014" },
    contact: { phone: "0422-2574071", email: "principal@cit.edu.in", website: "https://www.cit.edu.in" },
    established: 1956,
    affiliation: "Anna University",
    accreditation: ["NAAC A", "NBA"],
    ranking: "Top Government Colleges TN",
    courses: [
      { name: "B.E. Computer Science", degree: "B.E.", duration: "4 years", seats: 60, eligibility: "TNEA", fees: "₹45,000/year" },
      { name: "B.E. Mechanical Engineering", degree: "B.E.", duration: "4 years", seats: 60, eligibility: "TNEA", fees: "₹45,000/year" },
      { name: "B.E. Civil Engineering", degree: "B.E.", duration: "4 years", seats: 60, eligibility: "TNEA", fees: "₹45,000/year" }
    ],
    facilities: ["Library", "Hostel", "Sports Ground", "Labs", "Canteen"],
    admission: {
      process: "TNEA counseling based on 12th board marks.",
      entranceExams: ["TNEA"],
      applicationStart: "May",
      applicationEnd: "June",
      website: "https://www.annauniv.edu/TNEA"
    },
    description: "One of the oldest and most reputed government engineering colleges in Coimbatore."
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await College.deleteMany({});
    console.log('🗑️  Cleared existing colleges');

    // Insert colleges
    await College.insertMany(COLLEGES);
    console.log(`✅ Inserted ${COLLEGES.length} colleges`);

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@careeradvisor.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@careeradvisor.com',
        password: 'Admin@123',
        role: 'admin',
        isVerified: true
      });
      console.log('✅ Admin user created: admin@careeradvisor.com / Admin@123');
    }

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedDB();