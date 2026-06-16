# CareerForge: AI-Driven Resume Builder & ATS Optimizer

## Architecture

```
React Frontend (3000)  →  Node.js/Express Backend (5000)  →  MongoDB
                              ↓
                         FastAPI AI Service (8000)
                              ↓
                    OpenAI API (optional) + Rule-based ATS
```

## Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB running at `mongodb://127.0.0.1:27017`

## Quick Start

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
cd ../ai-service && pip install -r requirements.txt
```

### 2. Environment files

Copy examples (already included in repo):

- `backend/.env` — MongoDB URI, JWT secret, AI service URL
- `frontend/.env.local` — `NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api`
- `ai-service/.env` — optional `OPENAI_API_KEY` for enhanced AI analysis

### 3. Seed demo data

```bash
cd backend && npm run seed
```

### 4. Start all services

**Windows:** `.\start.ps1`

**Manual (3 terminals):**

```bash
# Terminal 1 - AI Service
cd ai-service && python -m uvicorn main:app --reload --port 8000

# Terminal 2 - Backend
cd backend && npm run dev

# Terminal 3 - Frontend
cd frontend && npm run dev
```

Open http://localhost:3000

## Demo Accounts

| Role       | Email                     | Password      |
|------------|---------------------------|---------------|
| Job Seeker | seeker@careerforge.com    | seeker123     |
| Recruiter  | recruiter@careerforge.com | recruiter123  |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Sign up |
| POST | `/api/auth/login` | Login |
| GET | `/api/resumes/primary` | Get primary resume |
| PUT | `/api/resumes/:id` | Save resume |
| POST | `/api/resumes/:id/export/pdf` | Download PDF |
| POST | `/api/ats/analyze` | ATS analysis vs job description |
| GET | `/api/jobs/matches` | Job matches with scores |
| POST | `/api/jobs/:id/apply` | Apply to job |
| GET | `/api/recruiter/candidates` | Recruiter candidate pipeline |
| GET | `/api/recruiter/candidates/:id/insights` | AI candidate insights |

## Features

- **Job Seeker:** Resume builder, ATS optimizer with live score, PDF export, job applications
- **Recruiter:** Smart pipeline with match %, AI side-panel insights, filter by min score
- **AI Layer:** Keyword/skill matching, suggestions, PDF generation (ReportLab)
- **Optional OpenAI:** Set `OPENAI_API_KEY` in `ai-service/.env` for LLM-powered analysis
