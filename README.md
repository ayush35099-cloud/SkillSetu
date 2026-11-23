# SkillSetu (कौशल सेतु)

> **Track 4 – UnlockED: Localized Vocational Skill Verification**  
> Bridging India's skilled blue-collar workers with verifiable practical credentials and direct contractor connections.

---

## 🌟 Overview

**SkillSetu** is a decentralized, practical skill-verification platform designed specifically for India's vocational craftspeople—including electricians, plumbers, masons, carpenters, and welders. By shifting the evaluation paradigm from theoretical exams to localized hands-on assessments and digital trade identities, SkillSetu eliminates informal intermediaries and empowers workers with verifiable credentials and fair compensation.

**Phase 1 Deliverable:** Foundational Architecture, RESTful Health Services, Localized UI Showcase, and Continuous Deployment Pipelines.

---

## 🚀 Live Deployments

| Component | Target Platform | Live URL / Endpoint |
|---|---|---|
| **Frontend UI** | GitHub Pages | [https://ayush35099-cloud.github.io/SkillSetu/](https://ayush35099-cloud.github.io/SkillSetu/) |
| **Backend REST API** | Render | [https://skillsetu-backend.onrender.com](https://skillsetu-backend.onrender.com) |
| **Backend Health Check** | Render | [https://skillsetu-backend.onrender.com/api/health](https://skillsetu-backend.onrender.com/api/health) |
| **Database Health Check**| Render | [https://skillsetu-backend.onrender.com/api/health/db](https://skillsetu-backend.onrender.com/api/health/db) |
| **GitHub Repository** | GitHub | [https://github.com/ayush35099-cloud/SkillSetu](https://github.com/ayush35099-cloud/SkillSetu) |

---

## 🏗️ Technology Stack

- **Frontend:**
  - React.js 18
  - Vite 5
  - Tailwind CSS 3
  - Lucide Icons & React Router DOM 6
  - Deployed via **GitHub Pages & GitHub Actions**
- **Backend:**
  - Python 3.10
  - Flask 3.0 & Flask-CORS
  - WSGI Gunicorn
  - Deployed via **Render Web Service**
- **Database Layer:**
  - PostgreSQL ready
  - SQLAlchemy 2.0 ORM connection pooling & resilient health probe
- **CI/CD & DevOps:**
  - Git & GitHub
  - GitHub Actions automated pages deployment with SPA 404 fallback routing

---

## 📁 Project Structure

```
SkillSetu/
│
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated GitHub Actions workflow for GitHub Pages
│
├── frontend/
│   ├── public/
│   │   └── vite.svg              # Brand icon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation & real-time connection status pill
│   │   │   ├── Hero.jsx          # Hero section with primary & secondary CTAs
│   │   │   ├── StatusIndicator.jsx# Live backend & PostgreSQL health monitor
│   │   │   ├── SkillVerification.jsx # 3-step practical verification methodology
│   │   │   ├── Professions.jsx   # 5 featured trades (Electrician, Plumber, Mason, Carpenter, Welder)
│   │   │   └── Footer.jsx        # Project & architecture footer
│   │   ├── pages/
│   │   │   └── Home.jsx          # Main landing page
│   │   ├── services/
│   │   │   └── api.js            # Reusable API service for health & backend probes
│   │   ├── App.jsx               # Application root & health polling state
│   │   ├── main.jsx              # Entry point with BrowserRouter
│   │   └── index.css             # Tailwind base & typography directives
│   ├── package.json              # Frontend dependencies and scripts
│   ├── vite.config.js            # Vite configuration with base path and 404 SPA fallback
│   ├── tailwind.config.js        # Custom saffron & navy color palette
│   ├── postcss.config.js         # PostCSS configuration
│   └── .env.example              # Frontend environment variables template
│
├── backend/
│   ├── app/
│   │   ├── __init__.py           # Flask app factory, CORS, and blueprint registration
│   │   ├── routes.py             # Root, /api/health, and /api/health/db endpoints
│   │   └── config.py             # Environment configuration and PostgreSQL URI adapter
│   ├── run.py                    # Production WSGI entry point
│   ├── requirements.txt          # Python dependencies
│   ├── render.yaml               # Render Infrastructure-as-Code Blueprint
│   └── .env.example              # Backend environment variables template
│
├── .gitignore                    # Comprehensive secrets & build artifact exclusion
└── README.md                     # Project documentation & runbook
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Git

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env from template
cp .env.example .env

# Run local development server
python run.py
```
Backend will start on: `http://localhost:5000`  
Endpoints:
- `http://localhost:5000/`
- `http://localhost:5000/api/health`
- `http://localhost:5000/api/health/db`

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env from template
cp .env.example .env
# Set: VITE_API_BASE_URL=http://localhost:5000

# Start Vite development server
npm run dev
```
Frontend will start on: `http://localhost:5173`

---

## 🔒 Security & Best Practices
- **No Committed Secrets:** All credentials, database URIs, and keys are strictly excluded via `.gitignore`.
- **Sanitized DB Health Checks:** `/api/health/db` safely executes a lightweight query (`SELECT 1`) and returns connection status without ever leaking credentials or stack traces.
- **Resilient Fallback:** When `DATABASE_URL` is omitted, the API responds with `unconfigured` rather than failing, enabling zero-downtime startup.
- **Production CORS Configuration:** CORS headers are restricted to authorized origins (GitHub Pages frontend & authorized local endpoints).
- **SPA Routing Fallback:** Vite builds generate `404.html` automatically for GitHub Pages deep linking and client-side route reloading.

---

## 📋 Phase 1 Scope & Verification Checklist

- [x] Project architecture and folder structure created
- [x] Flask REST backend with application factory and error handling
- [x] `GET /` welcome endpoint
- [x] `GET /api/health` service health check
- [x] `GET /api/health/db` PostgreSQL connectivity probe
- [x] Modern, accessible React Vite Tailwind frontend
- [x] All 5 required trades featured: Electrician, Plumber, Mason, Carpenter, Welder
- [x] Live backend connectivity status indicator (`Connected` / `Disconnected` / `Checking`)
- [x] `frontend/.env.example` & `backend/.env.example`
- [x] Production `render.yaml` specification
- [x] Automated GitHub Actions Pages deployment workflow
- [x] Zero mock success responses; verified live communication
