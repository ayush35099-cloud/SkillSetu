# SkillSetu – Comprehensive 10-Phase Roadmap (ROADMAP.md)

> **Track 4 – UnlockED: Unlocking Educational Potential, Empowering Futures**  
> *A systematic, milestone-driven technical roadmap for building India's decentralized vocational verification and direct employment platform.*

---

## 🗺️ Roadmap Executive Summary

| Phase | Phase Name | Primary Stakeholder | Core Technical Milestone | Status |
|:---:|:---|:---|:---|:---:|
| **Phase 1** | **Project Foundation & Cloud Infrastructure** | DevOps & System Architecture | Flask REST backend, PostgreSQL connectivity, Render Free Web Service, GitHub Actions CI/CD to GitHub Pages, live health monitoring. | ✅ **COMPLETED** |
| **Phase 2** | **UI/UX Foundation & Worker Experience** | Blue-Collar Artisans | Accessible mobile-first UI, 3-way theme engine, 7 Indian languages, 36 States/UTs regional personalisation, authentic Indian photo registry, Worker Portal demo, dynamic completion score. | ✅ **COMPLETED** |
| **Phase 3** | **Practical Assessor Portal & Rubrics** | Vocational Assessors & Master Craftsmen | Assessor onboarding, standardized practical rubrics for 8 trades, photographic/video evidence review, multi-tier grading engine. | ⏳ **NEXT UP** |
| **Phase 4** | **Contractor Hub & Direct Marketplace** | Building Contractors & Site Engineers | Vetted contractor profiles, skill-targeted job postings, direct messaging, wage escrow protection, zero-middleman hiring. | ⏳ Planned |
| **Phase 5** | **Voice-First AI Assistant (Gemini Live)** | Pre-literate & Vernacular Workers | Bidirectional speech-to-speech interaction across 7 Indian languages, audio task guidance, conversational profile builder. | ⏳ Planned |
| **Phase 6** | **Automated Video Skill Verification (Gemini)** | AI Quality Assurance | Multimodal computer vision analysis of practical demonstration videos, PPE detection, tool technique analysis, anomaly scoring. | ⏳ Planned |
| **Phase 7** | **Tamper-Proof Digital Skill Passport** | Industry & Regulatory Bodies | W3C Verifiable Credentials (VCs), Decentralized Identifiers (DIDs), cryptographic signing, tamper-evident verifiable QR codes. | ⏳ Planned |
| **Phase 8** | **Offline-First Progressive Web App (PWA)** | Remote Site Workers | Service Worker caching, background sync for intermittent 2G/3G connectivity, offline audio playback, local task draft queue. | ⏳ Planned |
| **Phase 9** | **Enterprise Contractor & ERP Integrations** | Construction Enterprises & EPCs | Enterprise REST APIs, bulk crew onboarding, biometric attendance hooks, safety compliance reporting, ERP connectors. | ⏳ Planned |
| **Phase 10** | **National Skill Ecosystem Alignment** | NSDC & Skill India | Integration with NSDC (National Skill Development Corporation), Skill India Digital, PMKVY, and National Apprenticeship frameworks. | ⏳ Planned |

---

## 📋 Detailed Phase Breakdown

---

### Phase 1: Project Foundation & Cloud Infrastructure (Completed)
- **Objective**: Establish a production-grade full-stack architecture, automate continuous integration and deployment, and verify cloud database connectivity.
- **Key Deliverables**:
  - Flask 3.0 REST backend with Application Factory pattern and blueprint routing.
  - Render deployment blueprint (`render.yaml`) configuring Python 3.11 web service on Render's free tier.
  - PostgreSQL connectivity probe (`/api/health/db`) with SQLAlchemy 2.0 connection pooling and Psycopg 3 (`psycopg[binary]`) driver.
  - Automated GitHub Actions deployment pipeline (`.github/workflows/deploy.yml`) building the Vite SPA to GitHub Pages.
  - Single-Page Application (SPA) 404 fallback mechanism allowing direct browser deep-linking on GitHub Pages.
- **Verification**:
  - Backend API: `https://skillsetu-backend-47ww.onrender.com/api/health` (HTTP 200)
  - Database Probe: `https://skillsetu-backend-47ww.onrender.com/api/health/db` (HTTP 200, status: connected)
  - Frontend SPA: `https://ayush35099-cloud.github.io/SkillSetu/` (HTTP 200)

---

### Phase 2: UI/UX Foundation & Worker Experience (Completed)
- **Objective**: Design and implement an accessible, mobile-first interface optimized for India's blue-collar craftspeople, featuring comprehensive localization and authentic representation.
- **Key Deliverables**:
  - **3-Way Theme Engine**:
    - Light Mode: Warm Ivory (`#F6F3EB`), Deep Teal (`#183E43`), Terracotta (`#B45D43`).
    - Dark Mode: High-contrast Charcoal (`#0E1D20`), Deep Cyan-Charcoal (`#14292D`), Light Sand text (`#F6F3EB`).
    - System Mode: Dynamic synchronization with operating system preferences (`prefers-color-scheme`).
    - Inline anti-FOUC script in `index.html` preventing theme flashing on page load.
  - **Regional Personalisation for India**:
    - Coverage of all 28 Indian States + 8 Union Territories (36 total) + 1 National overview (`IN-ALL`).
    - Modal with live search, State/UT filter chips, and 1-click selection.
    - Decoupled architecture: Region and Language are stored independently in `localStorage` without assuming one from the other.
  - **Multilingual Support (7 Indian Languages)**:
    - English, Hindi (हिन्दी), Kannada (ಕನ್ನಡ), Bengali (বাংলা), Marathi (मराठी), Telugu (తెలుగు), Tamil (தமிழ்).
  - **Authentic Indian Photography Registry**:
    - 100% verified Indian documentary photography depicting real Indian artisans and sites. Zero AI-generated synthetic faces.
    - Curated photobank covering Electrician, Plumber, Mason, Carpenter, Welder, Painter, Mechanic, and Women in Trades.
    - Full provenance documented in `PHOTO_SOURCES.md`.
  - **Worker Experience Portal (`/worker/*`)**:
    - Responsive layout with desktop sidebar and mobile sticky navigation.
    - Dynamic profile completion calculation based on completed profile fields (replacing hardcoded stats).
    - Interactive Worker Profile with trade competencies, experience, and local storage persistence.
    - Digital Skill Passport prototype with explicit demo disclaimers and non-functional QR code labels.
    - Practical Assessment submission simulator and Job discovery board.
  - **Role-Based Gating**:
    - Transparent modal informing users that Contractor and Assessor portals are scheduled for Phases 3 and 4.

---

### Phase 3: Practical Assessor Portal & Rubrics (Next Up)
- **Objective**: Build the dedicated portal and evaluation rubric engine for certified master craftspeople and vocational instructors to review practical assessments.
- **Key Deliverables**:
  - **Assessor Identity & Onboarding**:
    - Role-based authentication (JWT or OAuth) for verified trade assessors.
    - Accreditation profile (ITI instructor, master artisan, contractor supervisor).
  - **Standardized Practical Rubrics for 8 Trades**:
    - Electrician: Conduit pulling, distribution board wiring, grounding/earthing check, continuity testing.
    - Plumber: CPVC/UPVC line pressure testing, trap installation, leak inspection, slope alignment.
    - Mason: Plumb line accuracy, mortar mix consistency, brick bonding, surface leveling.
    - Carpenter: Joinery precision (mortise and tenon), wood moisture treatment, squareness alignment.
    - Welder: Seam uniformity, penetration depth, slag removal, weld bead integrity.
    - Painter: Surface preparation (putty sanding), primer application, uniform coat coverage, edge cutting.
    - Mechanic: Diagnostic troubleshooting, torque specification compliance, fluid replacement safety.
    - Other Trades: Customizable vocational assessment criteria.
  - **Evidence Review Workspace**:
    - Multi-media viewer (high-resolution photo inspection with zoom, video timestamp scrubbing).
    - Rubric-based point scoring (Safety, Technique, Tool Handling, Finished Quality).
  - **Grading & Accreditation Engine**:
    - Tier computation: *Master Craftsman* (90%+), *Skilled* (75–89%), *Semi-Skilled* (60–74%), *Apprentice* (< 60%).
    - Automated feedback generation in the worker's selected language.

---

### Phase 4: Contractor Hub & Direct Marketplace
- **Objective**: Connect verified artisans directly with construction companies, contractors, and individual site engineers, eliminating wage-depressing intermediaries.
- **Key Deliverables**:
  - **Contractor Portal**:
    - Contractor registration with GSTIN/CIN verification and company profile.
    - Project management dashboard (active job sites, crew requirements).
  - **Skill-Targeted Job Postings**:
    - Job listing creation with verified skill criteria (e.g. "Requires Skilled Plumber with CPVC certification").
    - Transparent wage disclosure (daily rate or task-based milestones).
  - **Direct Candidate Discovery**:
    - Filter artisans by trade, certified skill tier, state/district, and language preference.
    - 1-click candidate engagement without intermediary middleman fees.
  - **Wage Protection & Milestone Escrow**:
    - Milestone-based fund reservation ensuring guaranteed compensation upon task completion.

---

### Phase 5: Voice-First AI Assistant (Gemini Live API)
- **Objective**: Remove digital literacy barriers by enabling natural speech-to-speech interaction across 7 Indian languages and colloquial dialects.
- **Key Deliverables**:
  - **Gemini Live API Integration**:
    - Low-latency WebSocket bidirectional audio streaming.
    - Real-time voice interaction with Voice Activity Detection (VAD).
  - **Vernacular Conversational Workflows**:
    - Spoken profile creation: Worker speaks their trade, experience, and tools; assistant parses and populates the profile.
    - Audio task instructions: Spoken walkthrough of practical assessment steps in the worker's regional tongue.
    - Conversational job inquiry: Worker asks questions like *"Are there electrician jobs near Whitefield paying over ₹800/day?"* and receives voice responses.
  - **Audio Accessibility Infrastructure**:
    - Ambient noise cancellation optimized for construction and workshop backgrounds.

---

### Phase 6: Automated Video Skill Verification (Gemini Multimodal)
- **Objective**: Automate preliminary assessment screening using multimodal computer vision to analyze worker demonstration videos.
- **Key Deliverables**:
  - **Multimodal Video Processing Pipeline**:
    - Frame extraction and chunking of user-submitted task videos.
    - Gemini Multimodal Vision analysis against trade-specific rubrics.
  - **Automated Checkpoints**:
    - Personal Protective Equipment (PPE) compliance: helmet, safety goggles, insulated gloves, work boots.
    - Tool handling posture and grip technique.
    - Execution steps validation: verifying that prerequisite safety procedures (e.g. main breaker cutoff) were executed.
    - Finished workpiece quality analysis (weld bead uniformity, pipe joint seal).
  - **Human-in-the-Loop Safeguards**:
    - AI provides an assistive score and flags timestamps; final accreditation is signed off by certified human assessors (Phase 3).

---

### Phase 7: Tamper-Proof Digital Skill Passport
- **Objective**: Provide cryptographically verifiable credentials that workers can present to any employer, bank, or government body without relying on a centralized database check.
- **Key Deliverables**:
  - **W3C Verifiable Credentials (VCs)**:
    - Standardized JSON-LD credential schema for vocational skills.
    - Decentralized Identifiers (DIDs) representing the worker and the certifying assessor.
  - **Cryptographic Signing**:
    - Ed25519 digital signatures issued upon assessment completion.
  - **Offline-Verifiable QR Code**:
    - Compressed verifiable payload encoded directly inside a high-density QR code.
    - Anyone (contractor, police, inspector) can scan the QR code with any standard camera to verify validity without requiring backend API connectivity.

---

### Phase 8: Offline-First Progressive Web App (PWA)
- **Objective**: Ensure seamless operation in remote construction sites, basement workshops, and rural areas with intermittent connectivity.
- **Key Deliverables**:
  - Progressive Web App manifest and Service Worker caching strategies (Cache-First for static assets, Network-First with background sync for API).
  - IndexedDB storage for offline assessment drafting and video staging.
  - Background Sync API: Automatically queues and uploads task videos once Wi-Fi or 4G connection is restored.
  - Compressed offline audio cache for voice instructions in selected regional languages.

---

### Phase 9: Enterprise Contractor & ERP Integrations
- **Objective**: Enable large-scale construction enterprises and engineering conglomerates to integrate SkillSetu directly into their site workforce management systems.
- **Key Deliverables**:
  - Secure Enterprise REST & GraphQL APIs.
  - Connectors for construction ERPs (SAP, Oracle Primavera, Procore).
  - Biometric on-site punch-in and geofenced attendance verification linked to verified Skill Passports.
  - Automated regulatory compliance reporting (Contract Labour Regulation and Abolition Act audit exports).

---

### Phase 10: National Skill Ecosystem Alignment
- **Objective**: Institutionalize SkillSetu credentials by aligning directly with Government of India vocational programs and global standards.
- **Key Deliverables**:
  - Compatibility with National Skills Qualification Framework (NSQF) levels 1 through 8.
  - Direct data exchange with Skill India Digital and National Skill Development Corporation (NSDC) portals.
  - Recognition of Prior Learning (RPL) under Pradhan Mantri Kaushal Vikas Yojana (PMKVY).
  - Integration with Academic Bank of Credits (ABC) and DigiLocker for direct credential push.

---

*SkillSetu Engineering Roadmap – Unlocking Educational Potential, Empowering Futures.*
