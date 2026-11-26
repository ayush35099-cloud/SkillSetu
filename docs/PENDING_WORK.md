# SkillSetu – Pending Work & Implementation Tracking (PENDING_WORK.md)

> **Track 4 – UnlockED: Unlocking Educational Potential, Empowering Futures**  
> *Audit of incomplete functionality, prototype placeholders, implementation plans, and verification requirements.*

---

## 📋 Comprehensive Feature Audit & Status Matrix

| Feature | Current Status | Implemented Functionality | Architecture & Endpoints | Verification & Test Results |
|:---|:---:|:---|:---|:---|
| **Digital Skill Passport QR System** | 🟢 Implemented & Tested | Dynamic QR code generated with `qrcode.react`, public verification URL `https://ayush35099-cloud.github.io/SkillSetu/verify/<token>`, public verification page `/verify/:token` handling Valid, Revoked, and Invalid states without leaking private worker data. Worker Passport page offers PNG download, print card, link copy, and honest unapproved vs approved states. | • Model: `SkillCredential` (`backend/app/models.py`)<br>• Endpoints: `GET /api/credentials/verify/<token>`, `GET /api/worker/credentials`, `POST /api/admin/credentials/issue`, `PATCH /api/admin/credentials/<id>/revoke`<br>• Frontend: `PublicVerify.jsx`, `SkillPassport.jsx` | • 14/14 automated backend unit tests passed.<br>• Verified zero PII leakage (phone/email/passwords excluded).<br>• QR code scans cleanly to public verification URL. |
| **Header Navigation & Action De-duplication** | 🟢 Implemented & Tested | Removed redundant "Worker Portal" button from header and mobile drawer. "Get Started" opens worker portal. Added `whitespace-nowrap shrink-0` and adjusted responsive breakpoints to eliminate awkward line wrapping on laptop/tablet viewports. Role-based access maintained for Assessors and Admins. | • Component: `frontend/src/components/Navbar.jsx`<br>• Responsive styling: Tailwind CSS | • Zero button wrapping across responsive breakpoints.<br>• "Get Started" directly routes to `/worker`.<br>• Clean mobile menu drawer without duplicate items. |
| **All-India Location & Inter-State Mobility** | 🟢 Implemented & Tested | Changed default region from Karnataka (`KA`) to `IN-ALL` (All India National). Worker profile separates Native Home State, Current City/State, and Preferred Work Locations, enabling interstate worker mobility without language/regional coupling. | • Data: `frontend/src/data/regions.js`<br>• Service: `frontend/src/services/demoWorkerService.js`<br>• Component: `frontend/src/pages/worker/WorkerProfile.jsx` | • Default platform selection is "All India".<br>• Workers can register from any state (e.g. Bihar) and work in another (e.g. Karnataka) with All-India preferences.<br>• Independent of language selection. |
| **Admin Credential Issuance & Revocation Hub** | 🟢 Implemented & Tested | Extended admin panel with dual tabs: "Digital Skill Passports" and "Assessor Accreditation". Admins can view approved worker submissions, issue tamper-proof passports with 1 click, inspect public QR links, and revoke credentials with a required formal audit reason. | • Page: `frontend/src/pages/assessor/AdminAssessors.jsx`<br>• Endpoints: `GET /api/admin/credentials`, `POST /api/admin/credentials/issue`, `PATCH /api/admin/credentials/<id>/revoke` | • Tested issuance requires assessor review & approval.<br>• Tested non-admins blocked from issuing (401/403).<br>• Revocation immediately invalidates credential on `/verify/:token`. |
| **Contractor Hub & Direct Hiring** | ⏳ Phase 4 (Planned) | Contractor role currently displays informational modal notice in `LoginModal.jsx`. | Build contractor onboarding, GSTIN verification, direct job postings with wage transparency, and verified candidate discovery. | Milestone escrow, direct worker chat, and skill-filtered candidate matching. |
| **Bidirectional Voice AI (Gemini Live)** | ⏳ Phase 5 (Planned) | Floating microphone pill is a client-side visual assistant without bidirectional WebSocket voice streaming. | Integrate Google GenAI Live API with WebSocket audio streaming, VAD, and 7-language dialect support. | Speech-to-speech roundtrip latency < 800ms, multi-turn voice qualification. |
| **Computer Vision Video Assessment (Gemini)** | ⏳ Phase 6 (Planned) | Worker submits video URL/file; grading is performed by human assessors without automated AI CV safety checks. | Connect Gemini 1.5 Pro / Flash video understanding to auto-detect PPE compliance, tool posture, and preliminary rubric scoring. | Multi-frame tool detection accuracy > 90%, safe de-energized wiring verification. |

---

## 🎯 High-Priority Sprint Focus: UI Cleanup & Working QR System

1. **Part 2 – UI Polish**: Clean navbar redundancy, refine button heights, optimize padding and card grids, fix mobile menu alignment.
2. **Part 3 – All-India Engine**: Change default region to `IN-ALL`, support home state vs. current location vs. preferred work locations.
3. **Part 4 – Real Verifiable QR Passport**:
   - PostgreSQL `SkillCredential` table with indexed `verification_token`.
   - Admin approval workflow (`POST /api/admin/credentials/issue`).
   - Public verification endpoint (`GET /api/credentials/verify/<token>`).
   - Dynamic QR generation linking to `https://ayush35099-cloud.github.io/SkillSetu/verify/<token>`.
   - Public verification page (`/verify/:token`) with zero private information leakage.
   - Real-time revocation handling (`PATCH /api/admin/credentials/<id>/revoke`).
