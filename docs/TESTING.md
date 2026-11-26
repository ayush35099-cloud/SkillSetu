# SkillSetu – Comprehensive QA & Testing Guide (TESTING.md)

> **Track 4 – UnlockED: Unlocking Educational Potential, Empowering Futures**  
> *End-to-end quality assurance manual test procedures, automated build verification, and cross-platform matrices.*

---

## 🧪 Test Suite Overview

SkillSetu employs a multi-layered verification strategy combining:
1. **Automated Build & Bundling Verification**: Ensuring zero build errors, zero missing imports, and accurate asset generation.
2. **API & Cloud Service Health Testing**: Probing the REST API and live PostgreSQL database connection pool.
3. **Cross-Browser & Responsive Layout QA**: Testing across mobile, tablet, and desktop viewports.
4. **Localization & Theming Validation**: Verifying all 7 languages and 36 regional configurations across Light, Dark, and System modes.

---

## 📋 1. Automated Build & Build-Output Verification

### Frontend Build Test
Run the following from the `frontend/` directory:

```bash
cd frontend
npm run build
```

#### Expected Outcome:
- Build completes with return code `0`.
- Output directory `frontend/dist/` is generated.
- Bundle reports clean Rollup chunks with no missing dependencies or syntax errors.
- Both `dist/index.html` and `dist/404.html` exist with identical byte sizes (verifying SPA deep-link plugin execution).

### Backend Initialization & Health Probe Test
Run the following from the `backend/` directory:

```bash
cd backend
python -c "from app import create_app; app = create_app(); print('Flask app factory initialized successfully.')"
```

#### Expected Outcome:
- Returns `Flask app factory initialized successfully.` with return code `0`.

### Backend Phase 3 Automated Test Suite
Run the Phase 3 practical evaluation and assessor portal test suite:

```bash
cd backend
python -m unittest tests/test_phase3.py -v
```

#### Expected Outcome:
- Executes 8 unit tests in < 4 seconds:
  1. `test_01_health_endpoints`: Verifies `/api/health` and `/api/health/db`.
  2. `test_02_task_and_rubric_seeding`: Verifies 16 tasks across all 8 trades and 64 rubrics stored in DB.
  3. `test_03_assessor_registration_and_login`: Verifies token auth and default pending status.
  4. `test_04_unapproved_assessor_restriction`: Enforces 403 HTTP error on review attempts before admin approval.
  5. `test_05_admin_assessor_approval`: Confirms admin can approve assessors.
  6. `test_06_assessor_review_and_scoring`: Tests score computation, rubric criteria results, and atomic commit.
  7. `test_07_invalid_score_rejection`: Enforces strict validation rejecting scores exceeding max_score.
  8. `test_08_worker_submission_and_resubmission`: Verifies worker submit and resubmit loops.
- Reports `Ran 8 tests in ~3.3s ... OK`.

---

## 🌐 2. Cloud Health Endpoint Testing

Execute automated HTTP probes against the production Render web service:

```bash
# Probe Backend Service Health
curl -s -i https://skillsetu-backend-47ww.onrender.com/api/health

# Probe Database Connection Health
curl -s -i https://skillsetu-backend-47ww.onrender.com/api/health/db
```

#### Expected Responses:
```json
// GET /api/health
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "healthy",
  "service": "SkillSetu Backend API",
  "version": "1.0.0",
  "timestamp": "2026-11-24T12:00:00.000000+00:00"
}

// GET /api/health/db
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "connected",
  "database": "postgresql",
  "timestamp": "2026-11-24T12:00:00.000000+00:00"
}
```

---

## 📱 3. Manual Functional QA Checklist

### A. Theming Engine (Light, Dark, System)
- [x] **Switch to Dark Mode**: Click theme icon in Navbar -> select "Dark".
  - *Verify*: Canvas turns to Charcoal (`#0E1D20`), cards adopt deep cyan surfaces, text changes to warm ivory (`#F6F3EB`), terracotta accents remain vibrant.
- [x] **Switch to Light Mode**: Select "Light".
  - *Verify*: Background changes to warm ivory (`#F6F3EB`), cards change to white/soft sand, text changes to deep slate.
- [x] **Switch to System Mode**: Select "System".
  - *Verify*: App immediately mirrors OS/browser color scheme (`prefers-color-scheme`).
- [x] **Anti-FOUC Hard Reload**: In Dark Mode, perform a hard reload (`Ctrl+F5` or `Cmd+Shift+R`).
  - *Verify*: No white flash appears before dark styling applies.

### B. Regional Personalisation (36 States & UTs)
- [x] **Open Region Modal**: Click the regional badge in the Navbar.
  - *Verify*: Modal opens with live search bar, category filter pills ("All", "States", "Union Territories"), and current state selected.
- [x] **Search by State Name**: Type `Karna` in the search box.
  - *Verify*: List instantly filters to "Karnataka (ಕರ್ನಾಟಕ)".
- [x] **Select State**: Click "Karnataka".
  - *Verify*: Modal closes, Navbar badge updates to "Karnataka", Hero background photo dynamically updates to Bengaluru infrastructure documentary photograph.
- [x] **Select Union Territory**: Reopen modal, filter by "Union Territories", select "Delhi (दिल्ली)".
  - *Verify*: Hero photo updates to authentic Delhi workshop photograph.
- [x] **Select Non-Hub State**: Select "Assam" or "Goa".
  - *Verify*: Gracefully falls back to national infrastructure documentary photo without breaking layout.

### C. Multilingual Support (7 Indian Languages)
- [x] **Open Language Modal**: Click the language globe button in the Navbar.
  - *Verify*: Modal displays all 7 languages in native scripts:
    - English, हिन्दी (Hindi), ಕನ್ನಡ (Kannada), বাংলা (Bengali), मराठी (Marathi), తెలుగు (Telugu), தமிழ் (Tamil).
- [x] **Switch Language to Hindi**: Click "हिन्दी".
  - *Verify*: Navbar, Hero headlines, CTAs, and feature cards translate instantly to Hindi.
- [x] **Verify Language & Region Decoupling**:
  - Set Region to **Tamil Nadu**, then set Language to **हिन्दी**.
  - *Verify*: Region badge remains "Tamil Nadu" and language remains "हिन्दी". Neither overrides the other.

### D. Worker Experience Portal (`/worker/*`)
- [x] **Access Worker Portal**: Click "Worker Demo" in Navbar or login as "Worker" in LoginModal.
  - *Verify*: Routes cleanly to `/SkillSetu/worker` displaying the Worker Dashboard.
- [x] **Inspect Prototype Banner**:
  - *Verify*: Prominent warning banner appears: *"PROTOTYPE DEMONSTRATION MODE: Worker data, skills, and passport credentials shown here are interactive sample previews..."*
- [x] **Dynamic Profile Completion**:
  - Navigate to `/worker/profile`.
  - Notice the completion percentage. Remove an optional field (e.g., secondary phone number) and save.
  - *Verify*: Completion percentage dynamically recalculates based on actual field population.
- [x] **Skill Passport Transparency**:
  - Navigate to `/worker/passport`.
  - *Verify*: Watermark reads *"DEMO PREVIEW – NOT A VALID CREDENTIAL"*, and the QR code is clearly labeled *"Visual Placeholder (Non-functional)"*.
- [x] **Role Gating in LoginModal**:
  - Click "Login" in Navbar -> select "Contractor".
  - *Verify*: Displays informational notice: *"Contractor Portal: Scheduled for Phase 4"*.
  - Select "Assessor".
  - *Verify*: Displays informational notice: *"Assessor Portal: Scheduled for Phase 3"*.
  - Select "Admin".
  - *Verify*: Displays informational notice: *"Admin Portal: Scheduled for Future Phase"*.
  - *Verify*: Clicking Continue for Contractor/Assessor/Admin does NOT route into the Worker Portal. Only "Worker" routes to `/worker`.

### E. High-Resolution Authentic Photography & Assets
- [x] **About Section Textile Artisan Photo**:
  - *Verify*: Displays crisp 2048 × 1365 photograph of skilled Indian female artisan operating an industrial sewing machine without pixelation or stretching.
  - *Verify*: Browser loads WebP source (`images/textile-worker.webp`) with JPG fallback (`images/textile-worker.jpg`).
  - *Verify*: Responsive `object-fit: cover` and `object-center` prevents distortion across mobile and desktop.
  - *Verify*: Attribution badge displays `EqualStock IN / Pexels (2048×1365)`.
- [x] **8 Core Vocational Trade Cards**:
  - *Verify*: All 8 cards (Electrician, Plumber, Mason, Carpenter, Welder, Painter, Mechanic, Other Trades) display authentic trade imagery with zero AI faces and zero stock clichés.

---

## 🖥️ 4. Viewport & Responsiveness Test Matrix

| Viewport Category | Screen Resolution | Target Device Types | Verified Status |
|:---|:---:|:---|:---:|
| **Small Mobile** | 360 x 640 px | Budget Android devices (JioPhone, Samsung Galaxy A-series) | ✅ Pass |
| **Standard Mobile** | 390 x 844 px | iPhone 12/13/14/15, Pixel 7 | ✅ Pass |
| **Large Mobile** | 412 x 915 px | Samsung Galaxy S23 Ultra, OnePlus | ✅ Pass |
| **Tablet Portrait** | 768 x 1024 px | iPad Mini, Samsung Galaxy Tab | ✅ Pass |
| **Tablet Landscape** | 1024 x 768 px | iPad Air, Surface Pro | ✅ Pass |
| **Desktop / Laptop** | 1366 x 768 px | Standard 14-inch laptops | ✅ Pass |
| **Full HD Desktop** | 1920 x 1080 px | Standard 24-inch desktop monitors | ✅ Pass |

---

## 🌐 5. Cross-Browser Compatibility Matrix

| Browser Engine | Browser Name | Minimum Supported Version | Tested Status |
|:---|:---|:---:|:---:|
| **Blink** | Google Chrome | 100+ | ✅ Pass |
| **Blink** | Microsoft Edge | 100+ | ✅ Pass |
| **Gecko** | Mozilla Firefox | 100+ | ✅ Pass |
| **WebKit** | Apple Safari (iOS / macOS) | 15+ | ✅ Pass |
| **Blink (Mobile)** | Samsung Internet | 20+ | ✅ Pass |

---

*SkillSetu QA & Testing Specifications – Track 4: UnlockED.*
