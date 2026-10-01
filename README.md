# FitAI — Commercial AI-Powered Fitness & Wellness Platform

FitAI is an enterprise-grade fitness and wellness platform combining modern health & exercise tracking with dedicated Machine Learning and Computer Vision microservices.

---

## 🚀 Live Services & Architecture

| Service | Port / URL | Description |
|---|---|---|
| **Next.js Web Frontend & API** | `http://localhost:3000` | Full-stack Next.js App Router with TypeScript, Tailwind CSS, and Lucide icons |
| **Python AI/ML Microservice** | `http://127.0.0.1:8000` | FastAPI microservice for pose/form analysis, food vision, and predictive progress |
| **Interactive API Docs** | `http://127.0.0.1:8000/docs` | Swagger UI for all ML inference and recommendation endpoints |
| **SQLite Database (Prisma ORM)** | `prisma/dev.db` | High-fidelity relational schema seeded with exercises, plans, and demo profiles |

---

## 🔑 Demo Access Accounts

All demo accounts come pre-configured with realistic histories, streaks, workouts, and metrics. You can also use the **1-Click Demo Login** buttons on the login screen.

| Role | Email | Password | Included Features |
|---|---|---|---|
| **Athlete / User** | `alex@fitai.com` | `password123` | Dashboard, Active Workouts, Computer Vision Form Analysis, Macro Tracker, AI Coach |
| **Trainer** | `marcus@fitai.com` | `password123` | Trainer Portal, Client Management, Program Builder, Real-time Roster Tracking |
| **Platform Admin** | `admin@fitai.com` | `password123` | Admin Portal, User Management, Exercise Movement Library CRUD, Revenue Analytics |

---

## 🧭 Key Platform Routes

- **Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard) — Daily calorie/macro rings, active streaks, scheduled workouts, and AI recommendations.
- **Workouts**: [http://localhost:3000/workouts](http://localhost:3000/workouts) — Exercise library, workout routines, and interactive set logger with rest timers.
- **Exercise Library**: [http://localhost:3000/exercises](http://localhost:3000/exercises) — 100+ movements filtered by muscle group, equipment, and pose-tracking support.
- **AI Form Analysis**: [http://localhost:3000/form-analysis](http://localhost:3000/form-analysis) — Computer vision camera interface for real-time rep counting and biomechanical posture feedback.
- **AI Coach**: [http://localhost:3000/ai-coach](http://localhost:3000/ai-coach) — Conversational AI fitness and nutrition coach.
- **Nutrition**: [http://localhost:3000/nutrition](http://localhost:3000/nutrition) — Meal log, macro breakdown, and AI smart meal suggestions.
- **Habits & Recovery**: [http://localhost:3000/habits](http://localhost:3000/habits) — Water intake, sleep cycle logging, and daily discipline tracker.
- **Challenges & Social**: [http://localhost:3000/challenges](http://localhost:3000/challenges) — Community leaderboards, peer competitions, and badge achievements.
- **Trainer Studio**: [http://localhost:3000/trainer](http://localhost:3000/trainer) — Client compliance monitoring, workout assignment, and messaging.
- **Admin Control**: [http://localhost:3000/admin](http://localhost:3000/admin) — System statistics, database counts, and user management.
- **Pricing & Plans**: [http://localhost:3000/pricing](http://localhost:3000/pricing) — Free, Pro, and Elite tier feature matrix.

---

## 🛠️ How to Start the Platform

### 1. Start the Next.js Frontend
```bash
npm run dev
```
*(Runs on `http://localhost:3000`)*

### 2. Start the FastAPI ML Service
```bash
cd ml-service
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*(Runs on `http://127.0.0.1:8000`)*

### 3. Database Commands
```bash
# Push schema changes
npx prisma db push

# Re-seed test database
npx prisma db seed
```
