# 🎓 JobPlace — AI-Powered Student Job Placement Platform

A full-stack MERN application helping students find jobs and prepare for their careers using AI.

---

## ✨ Features

### For Students
- **Browse & Search Jobs** — filter by type, location, keywords
- **Apply to Jobs** — one-click applications with status tracking
- **Save Jobs** — bookmark jobs for later
- **Dashboard** — track all applications and their statuses
- **Profile** — build your professional profile with resume text

### AI-Powered Tools (Gemini Flash 2.5)
- **📄 Resume Analyzer** — get a score, strengths, improvements, and tips
- **✉️ Cover Letter Generator** — tailored cover letters for any job
- **🎯 Interview Prep** — role-specific questions and answers
- **📊 Job Match Analyzer** — see how well you match a job description

### For Employers
- **Post Jobs** — create detailed job listings
- **Manage Listings** — view, edit, delete your jobs
- **View Applicants** — see who applied to your jobs

---

## 🗂️ Project Structure

```
jobplace/
├── server/                 # Express + MongoDB backend
│   ├── models/
│   │   ├── User.js
│   │   └── Job.js
│   ├── routes/
│   │   ├── auth.js         # Register, Login, /me
│   │   ├── jobs.js         # CRUD, apply, save
│   │   ├── profile.js      # Get/update profile
│   │   └── ai.js           # AI endpoints (Claude)
│   ├── middleware/
│   │   └── auth.js         # JWT protect + employerOnly
│   ├── seed.js             # Sample data seeder
│   ├── index.js            # Entry point
│   └── package.json
│
└── client/                 # React frontend
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── components/
    │   │   └── Navbar.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Jobs.js
    │   │   ├── JobDetail.js
    │   │   ├── Dashboard.js
    │   │   ├── Profile.js
    │   │   ├── AITools.js
    │   │   └── PostJob.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Anthropic API key (for AI features)

---

### 1. Clone / copy the project files

### 2. Backend Setup

```bash
cd server
npm install

# Create .env file
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobplace
JWT_SECRET=your_super_secret_key_change_this
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

**Seed sample data (optional but recommended):**
```bash
node seed.js
```

**Start the backend:**
```bash
npm run dev     # development (with nodemon)
npm start       # production
```

---

### 3. Frontend Setup

```bash
cd client
npm install
npm start
```

The React app runs on **http://localhost:3000** and proxies API requests to **http://localhost:5000**.

---

## 🔐 Demo Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Student | student@demo.com | password123 |
| Employer | employer@demo.com | password123 |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/jobs | List jobs (search, filter, paginate) |
| GET | /api/jobs/:id | Get single job |
| POST | /api/jobs | Create job (employer) |
| PUT | /api/jobs/:id | Update job (employer) |
| DELETE | /api/jobs/:id | Delete job (employer) |
| POST | /api/jobs/:id/apply | Apply for job |
| POST | /api/jobs/:id/save | Save/unsave job |
| GET | /api/jobs/employer/mine | My posted jobs |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/profile | Get own profile |
| PUT | /api/profile | Update profile |

### AI (requires auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/analyze-resume | Resume analysis |
| POST | /api/ai/cover-letter | Cover letter generation |
| POST | /api/ai/interview-prep | Interview questions |
| POST | /api/ai/job-match | Job match scoring |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Styling | Custom CSS with CSS variables |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Auth | JWT (jsonwebtoken), bcryptjs |
| AI | Anthropic Claude API |

---

## 📝 Notes

- The `proxy` field in `client/package.json` forwards all `/api` requests to the backend during development.
- For production, build the React app (`npm run build`) and serve it from Express, or deploy to separate hosting.
- AI features require a valid `ANTHROPIC_API_KEY` in your `.env` file.
