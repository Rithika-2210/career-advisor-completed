
# 🎓 One-Stop Personalized Career & Education Advisor

A full-stack MERN web application providing personalized academic and career guidance through aptitude assessments, intelligent recommendations, and college discovery.

---

## 📁 Project Structure

```
career-advisor/
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, login, password reset
│   │   ├── userController.js   # Profile, notifications, admin stats
│   │   ├── assessmentController.js  # MCQ test, submit, results
│   │   ├── recommendationController.js  # Generate & fetch recs
│   │   └── collegeController.js     # College CRUD & filters
│   ├── middleware/
│   │   ├── auth.js             # JWT protect + role authorize
│   │   └── errorHandler.js     # Global error handler
│   ├── models/
│   │   ├── User.js             # User schema (student + admin)
│   │   ├── Assessment.js       # Questions + responses + scores
│   │   ├── Recommendation.js   # Generated recommendations
│   │   └── College.js          # College data schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── assessmentRoutes.js
│   │   ├── recommendationRoutes.js
│   │   └── collegeRoutes.js
│   ├── utils/
│   │   ├── jwt.js              # Token generation helpers
│   │   └── recommendationEngine.js  # Rule-based recommendation logic
│   ├── data/
│   │   ├── questionBank.js     # 30 MCQ questions
│   │   └── seed.js             # Database seeder
│   ├── server.js               # Entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # React.js SPA
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js        # Configured Axios instance
│   │   │   └── services.js     # All API service functions
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── Navbar.js   # Responsive navigation
│   │   │       └── Spinner.js  # Spinner, Skeleton, StatCard, etc.
│   │   ├── context/
│   │   │   └── AuthContext.js  # Global auth state
│   │   ├── pages/
│   │   │   ├── LandingPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── ProfilePage.js
│   │   │   ├── AssessmentPage.js
│   │   │   ├── RecommendationsPage.js
│   │   │   ├── CollegesPage.js
│   │   │   ├── CollegeDetailPage.js
│   │   │   ├── AdminPage.js
│   │   │   └── NotFoundPage.js
│   │   ├── App.js              # Router + route guards
│   │   ├── index.js            # React entry
│   │   └── index.css           # Global design system styles
│   └── package.json
│
└── README.md                   # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Setup

```bash
git clone <your-repo>
cd career-advisor
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

**.env configuration:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/career_advisor
JWT_SECRET=your_super_secret_key_minimum_32_chars
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### 3. Seed the Database

```bash
# Make sure MongoDB is running, then:
cd backend
npm run seed
```

This creates:
- 8 sample colleges (IITs, NITs, Arts & Science, Medical, Law)
- 1 admin account: `admin@careeradvisor.com` / `Admin@123`

### 4. Start Backend

```bash
cd backend
npm run dev    # Development (with nodemon)
# or
npm start      # Production
```

Server runs at: `http://localhost:5000`
Health check: `http://localhost:5000/health`

### 5. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# .env: REACT_APP_API_URL=http://localhost:5000/api
```

### 6. Start Frontend

```bash
cd frontend
npm start
```

App runs at: `http://localhost:3000`

---

## 📡 API Documentation

### Base URL: `http://localhost:5000/api`

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/me` | Get current user | Private |
| POST | `/auth/forgot-password` | Request password OTP | Public |
| POST | `/auth/reset-password` | Reset with OTP | Public |
| PUT | `/auth/change-password` | Change password | Private |

**Register Request:**
```json
{
  "name": "Arjun Kumar",
  "email": "arjun@example.com",
  "password": "secret123",
  "confirmPassword": "secret123"
}
```

**Login Response:**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": {
    "_id": "...",
    "name": "Arjun Kumar",
    "email": "arjun@example.com",
    "role": "student",
    "profileCompleted": false
  }
}
```

---

### User Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/profile` | Get profile | Private |
| PUT | `/users/profile` | Update profile | Private |
| GET | `/users/notifications` | Get notifications | Private |
| PUT | `/users/notifications/read-all` | Mark all read | Private |
| GET | `/users/all` | All students | Admin |
| GET | `/users/stats` | Platform stats | Admin |

**Update Profile Request:**
```json
{
  "name": "Arjun Kumar",
  "interests": ["Technology", "Mathematics", "Engineering"],
  "skills": ["Python", "Problem Solving"],
  "academicDetails": {
    "tenthMarks": 88,
    "twelfthMarks": 82,
    "twelfthStream": "Science",
    "currentEducation": "12th Completed"
  },
  "location": {
    "state": "Tamil Nadu",
    "city": "Coimbatore"
  }
}
```

---

### Assessment Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/assessments/start` | Get questions (new test) | Private |
| POST | `/assessments/:id/submit` | Submit answers | Private |
| GET | `/assessments/my-results` | Past results | Private |
| GET | `/assessments/:id/result` | Detailed result | Private |

**Submit Answers Request:**
```json
{
  "answers": [
    { "questionId": "64abc123...", "selectedOption": "B" },
    { "questionId": "64abc456...", "selectedOption": "A" }
  ]
}
```

**Result Response:**
```json
{
  "result": {
    "assessmentId": "...",
    "totalScore": 22,
    "maxScore": 30,
    "percentage": 73,
    "performanceLevel": "Good",
    "categoryScores": [
      { "category": "logical", "score": 5, "total": 6, "percentage": 83 },
      { "category": "quantitative", "score": 4, "total": 6, "percentage": 67 }
    ],
    "timeTakenMinutes": 18
  }
}
```

---

### Recommendation Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/recommendations/generate` | Generate for user | Private |
| GET | `/recommendations/my` | Get latest recs | Private |
| GET | `/recommendations/streams` | Stream info | Public |

---

### College Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/colleges` | List colleges (filterable) | Public |
| GET | `/colleges/:id` | College details | Public |
| GET | `/colleges/filters/options` | Filter dropdown values | Public |
| POST | `/colleges` | Add college | Admin |
| PUT | `/colleges/:id` | Update college | Admin |

**Query params for GET /colleges:**
```
?state=Tamil Nadu&category=Engineering&type=Government&search=IIT&page=1&limit=9
```

---

## 🗄️ MongoDB Schema Summary

### User
- Basic: name, email, mobile, password (bcrypt), role, avatar
- Profile: dateOfBirth, gender, location (state/city/pincode)
- Academic: 10th/12th marks, board, stream, currentEducation, institution
- Arrays: interests[], skills[], notifications[], assessmentsTaken[]
- Security: resetPasswordOTP, resetPasswordExpire (selected: false)

### Assessment
- Meta: title, type, totalQuestions, timeLimit, isActive
- Questions[]: questionText, options[], correctOption, category, difficulty, explanation
- Response[]: questionId, selectedOption, isCorrect
- Results: totalScore, maxScore, percentage, categoryScores[], timeTakenMinutes
- Status: template | in-progress | completed

### Recommendation
- Refs: userId, assessmentId
- recommendedStreams[]: { stream, confidence, justification, rank }
- recommendedDegrees[]: { name, duration, eligibility, description, topColleges }
- careerPaths[]: { title, entryRoles, growthRoles, averageSalary, relatedExams, skills }
- recommendationBasis: { academicScore, interestAlignment, aptitudeScore, topCategories }

### College
- Basic: name, shortName, type, category, established, affiliation, accreditation
- Location: address, city, district, state, pincode
- Courses[]: name, degree, duration, seats, eligibility, fees
- Facilities[], Admission: { process, entranceExams, applicationStart, website }

---

## 🧠 Recommendation Engine

The engine (`backend/utils/recommendationEngine.js`) uses rule-based logic:

**Stream Scoring (0–100):**
1. **Interest alignment** (40 pts) — Match user interests to stream's interest list
2. **Aptitude alignment** (30 pts) — Match top assessment categories to stream's aptitude triggers
3. **Academic marks** (30 pts) — Compare marks to stream's minimum requirement

**Career Mapping:**
- Interest → Career lookup table maps 24 interests to 8 career paths
- Top 4 matching careers returned with full details

**Future AI Integration:**
```
// In recommendationEngine.js, swap generateRecommendations() with:
const generateRecommendations = async (userProfile, assessmentResult) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a career advisor...' },
      { role: 'user', content: JSON.stringify({ userProfile, assessmentResult }) }
    ]
  });
  return JSON.parse(response.choices[0].message.content);
};
// The Recommendation model and API routes require zero changes.
```

---

## 🔐 Security Features

- JWT tokens (7-day expiry, stored in localStorage)
- bcrypt password hashing (salt rounds: 12)
- Rate limiting (100 requests / 15 min per IP)
- Helmet.js security headers
- CORS whitelisted to CLIENT_URL
- Joi input validation on all endpoints
- Role-based access (student / admin)
- Passwords never returned in API responses (select: false)
- OTP expires after 10 minutes

---

## 🚢 Deployment Guide

### Backend (Railway / Render / EC2)

1. Set environment variables in hosting dashboard
2. Set `NODE_ENV=production`
3. `MONGODB_URI` → MongoDB Atlas connection string
4. Start command: `npm start`

### Frontend (Vercel / Netlify)

1. Set `REACT_APP_API_URL=https://your-backend.railway.app/api`
2. Build command: `npm run build`
3. Publish directory: `build`
4. Add `_redirects` file: `/* /index.html 200`

---

## 🔮 Future AI Integration Roadmap

| Feature | Technology |
|---------|-----------|
| Natural language career Q&A | OpenAI GPT-4 / Claude |
| Semantic profile matching | Vector embeddings (Pinecone) |
| Personalized study plans | LangChain agents |
| Document analysis (marksheets) | OCR + LLM |
| Chatbot career counselor | WebSocket + streaming |
| College ranking ML model | scikit-learn / TensorFlow |

The backend is structured with `engineVersion` field in Recommendation model to track which engine generated each recommendation, making upgrades traceable.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Axios |
| Styling | Custom CSS (no framework dependency) |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Auth | JWT, bcryptjs |
| Validation | Joi |
| Security | Helmet, express-rate-limit, CORS |

---

## 🧪 Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@careeradvisor.com | Admin@123 |
| Student | Register any | Your choice |

---

*Built with ❤️ for Indian students navigating academic and career decisions.*
=======
# adl-career_advisor
