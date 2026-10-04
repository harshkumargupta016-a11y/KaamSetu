# 🌉 KaamSetu – Employer Discovery & Hiring Intelligence

**KaamSetu** is an AI-powered employer discovery, hiring intelligence, and social security verification platform designed for blue-collar, trade, and informal sector workers and verified employers across India.

It connects workers with verified local job vacancies using a transparent **Gemini AI Fit Score**, checks employer credentials, provides consent-based **EPFO/ESIC Employment Signals**, and operates seamlessly even with low or intermittent internet connections through a **PWA Service Worker** and **Offline Sync Queue**.

---

## ✨ Key Features

### 1. 🔎 Vacancies & EPFO / ESIC Employment Verification
- Consent-driven employment history signals without storing sensitive private identifiers (UAN, Aadhaar, ESIC IP masked).
- Evaluates employer subscription continuity, active contribution markers, and candidate trade readiness.
- Composite **Trust Score Index (0-100)** calculated from verified government signals.
- Job seekers can see only their own EPFO/ESIC match signals and trust score; the searchable candidate directory remains limited to employers and admins.

### 2. ⚡ 1-Click Direct Job Application & Walk-in Slot Booking
- 1-Click application with pre-filled candidate profile details.
- Integrated interview slot selection (Walk-in & Online slots).
- Application progress tracking on Job Seeker dashboard.

### 3. 🤖 Gemini AI Trust Verification & Scam Scanner
- Automated Gemini AI trust score calculation for new job postings and employer registrations.
- Dual-option scam reporting (File attachment & Live Camera Photo Capture) with Gemini AI Fraud Likelihood Confidence Analysis.
- Direct reporting integration with Cyber Crime Helpline **1930** and Labour Helpline **14434**.

### 4. 🗺️ OpenStreetMap & Proximity Fit Score
- Interactive Leaflet.js map with live user location detection.
- Proximity-aware **Gemini Fit Score**: 40% distance, 30% experience/skills match, 30% employer trust rating.

### 5. 📱 Offline Caching & Automatic Sync Engine
- **Service Worker (`sw.js`)**: Static asset offline caching for instant loading without internet.
- **Offline Action Queue (`kaamsetu_offline_queue`)**: When network is weak or disconnected, actions (job applications, complaints, job posts, profile updates) are cached locally and automatically flushed to the backend when connection is restored.
- Live header network indicator (`🟢 Online (Synced)` / `🟡 Offline (Cached)`).

### 6. 🏛️ Government Welfare Schemes Portal
- Directory of central worker schemes (PM-SYM Pension, Ayushman Bharat PM-JAY, eShram Insurance, ARHC Housing, PMKVY Skill Development, NCS Portal).
- Category tabs, eligibility details, document requirements, and step-by-step application guidance with voice readout.

### 7. 🎙️ Multi-lingual Voice Navigation & Speech Sahayak
- Full Web Speech API voice readout for all pages, job postings, and scheme details.
- Voice navigation commands ("jobs", "vacancies", "schemes", "complain", "AI scanner").
- Hands-free voice dictation for complaint descriptions in Hindi & English.

### 8. 🔒 Admin Control Panel & Universal Synchronization
- Real-time management of companies, job seekers, and scam complaints.
- Admin actions for company verification (`☑️ Admin Verified`), scam flagging (`⚠️ Flagged`), and complaint resolution.
- Data export in standard CSV format (`kaamsetu_companies_data.csv`, etc.).

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Leaflet.js (OpenStreetMap), Web Speech API, Service Worker (PWA).
- **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic.
- **Database**: File-backed JSON Database (`kaamsetu_db.json`) with auto-seeding.
- **AI Model**: Google Gemini 1.5 Flash API.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+ installed on your system.
- Node.js (optional, for running test scripts).

### 1. Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the FastAPI Backend Server
```bash
python main.py
```
*Or using uvicorn directly:*
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
The application and API will run together at `http://localhost:8000`.

### 3. Open the Application
Visit `http://localhost:8000` in any modern web browser. The frontend uses the same origin for API requests.

---

## 📡 API Endpoints Summary

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET` | KaamSetu web application |
| `GET /api/data` | `GET` | Get full global state (companies, jobseekers, complaints, jobs, applications) |
| `POST /api/login` | `POST` | User authentication & registration |
| `POST /api/sync` | `POST` | User profile & dashboard data synchronization |
| `GET /api/user/{id}` | `GET` | Fetch specific user profile data |
| `POST /api/companies` | `POST` | Register a new employer |
| `PUT /api/companies/{idx}` | `PUT` | Update employer status (Admin Verify / Flag / Reject) |
| `POST /api/complaints` | `POST` | File a new scam complaint |
| `PUT /api/complaints/{idx}` | `PUT` | Update complaint status (e.g. Resolve) |
| `GET /api/jobs` | `GET` | List all active job vacancies |
| `POST /api/jobs` | `POST` | Post a new job with Gemini AI auto-verification |
| `POST /api/applications` | `POST` | Submit 1-click job application with interview slot |
| `POST /api/offline-sync` | `POST` | Bulk process queued offline actions upon reconnection |

---

## 🔑 Default Admin Credentials

For testing the Admin Control Panel:
- **Admin ID**: `admin@kaamsetu.gov.in`
- **Password**: `admin123`

---

## 🧪 Testing

Run backend API and frontend verification tests:
```bash
# 1. Run frontend DOM & JavaScript verification
node test_all_features.js

# 2. Run backend FastAPI integration suite
python test_api.py
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Government links, welfare scheme portals, and references are provided for public welfare and informational purposes under Government of India open data guidelines.



