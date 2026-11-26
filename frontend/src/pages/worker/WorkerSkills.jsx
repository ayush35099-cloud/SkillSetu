import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { apiService } from '../../services/api';
import { 
  CheckCircle2, 
  Clock, 
  Award, 
  ShieldCheck, 
  Zap, 
  Wrench, 
  Hammer, 
  Building, 
  Flame, 
  Paintbrush, 
  Cog, 
  Layers, 
  AlertCircle, 
  Play, 
  Info, 
  X, 
  ArrowRight,
  HardHat,
  Sparkles,
  FileText,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Send,
  UploadCloud,
  Check,
  User,
  Lock,
  LogIn,
  LogOut,
  UserCheck,
  ChevronRight,
  XCircle,
  HelpCircle,
  Video,
  Image as ImageIcon
} from 'lucide-react';

export default function WorkerSkills() {
  const { t } = useLanguage();

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Auth Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regTrade, setRegTrade] = useState('electrician');
  const [regExperience, setRegExperience] = useState(5);
  const [regLocation, setRegLocation] = useState('Bengaluru, Karnataka');

  // Selected Trade & Practical Tasks
  const [selectedTrade, setSelectedTrade] = useState('electrician');
  const [tasks, setTasks] = useState([]);
  const [myAssessments, setMyAssessments] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState(null);

  // Submission Modal State
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [targetTask, setTargetTask] = useState(null);
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceType, setEvidenceType] = useState('video');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Resubmission Modal State
  const [resubmitModalOpen, setResubmitModalOpen] = useState(false);
  const [activeSubForResubmit, setActiveSubForResubmit] = useState(null);

  // Detail View Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Trade catalog metadata & competencies
  const tradesData = {
    electrician: {
      name: t('professions.electrician.name', 'Electrician'),
      nativeName: t('professions.electrician.nativeName', 'Electrician / विद्युत कर्मी'),
      icon: Zap,
      desc: t('professions.electrician.desc', 'Conduit laying, DB panel termination, circuit load calculations, and earthing diagnostics.'),
      tools: ['Insulated Screwdrivers (1000V)', 'Digital Multimeter', 'Conduit Pipe Bender', 'Wire Strippers', 'Megger Insulation Tester'],
      safety: ['Rubber Insulated Safety Shoes', 'Voltage Proximity Tester Check', 'Arc-Flash Eye Protection', 'Lockout / Tagout (LOTO)'],
      competencies: [
        'Single-phase and three-phase distribution board wiring',
        'Residual Current Circuit Breaker (RCCB) sensitivity testing',
        'Earthing resistance pit verification (< 5 Ohms)',
        'Conduit routing through brickwork and RCC slabs'
      ]
    },
    plumber: {
      name: t('professions.plumber.name', 'Plumber'),
      nativeName: t('professions.plumber.nativeName', 'Plumber / प्लंबर'),
      icon: Wrench,
      desc: t('professions.plumber.desc', 'CPVC/UPVC pipe network routing, hydrostatic leak checks, sanitary fittings, and pump setup.'),
      tools: ['Pipe Wrench (14" & 18")', 'CPVC Solvent Applicator', 'Hydrostatic Test Pump', 'Teflon Sealing Tape', 'Pipe Threader'],
      safety: ['Cut-resistant Gloves', 'Anti-slip Boots', 'Eye Safety Goggles', 'Confined Space Ventilation'],
      competencies: [
        'Hydrostatic pressure testing up to 10 bar',
        'Concealed CPVC hot & cold water piping alignment',
        'Wall-hung WC flush tank & diverter installation',
        'Drainage slope leveling (1:50) and anti-siphon trapping'
      ]
    },
    mason: {
      name: t('professions.mason.name', 'Mason'),
      nativeName: t('professions.mason.nativeName', 'Mason / राजमिस्त्री'),
      icon: Building,
      desc: t('professions.mason.desc', 'Right-angle brick alignment, mortar mixing hydration, level plastering, and RCC shuttering.'),
      tools: ['Plumb Bob & String Line', 'Masonry Trowel', 'Spirit Level (3-vial)', 'Right Angle Square', 'Mortar Mixing Pan'],
      safety: ['Heavy-duty Steel Toe Boots', 'Dust Respirator Mask', 'Reinforced Palm Gloves', 'Hard Hat'],
      competencies: [
        'True vertical plumb check within ±2mm tolerance',
        'Mortar mix ratio (1:4 cement-sand) hydration and consistency',
        'Raking joints uniformly for bonding plaster',
        'Level screeding for vitrified tile bedding'
      ]
    },
    carpenter: {
      name: t('professions.carpenter.name', 'Carpenter'),
      nativeName: t('professions.carpenter.nativeName', 'Carpenter / बढ़ई'),
      icon: Hammer,
      desc: t('professions.carpenter.desc', 'Mortise & tenon joinery, modular carcass assembly, hardware fitting, and laminate finishing.'),
      tools: ['Crosscut Hand Saw', 'Wood Chisel Set', 'Combination Square', 'Plunge Router', 'Bevel Gauge'],
      safety: ['Eye Safety Shields', 'Hearing Protection Muffs', 'N95 Wood Dust Mask', 'Thumb Guard Gloves'],
      competencies: [
        'Precise mortise & tenon joint fabrication with zero gap',
        'Modular cabinet carcass squareness measurement',
        'Concealed hinge boring and alignment',
        'Laminate edge trimming and smooth beveling'
      ]
    },
    welder: {
      name: t('professions.welder.name', 'Welder'),
      nativeName: t('professions.welder.nativeName', 'Welder / वेल्डर'),
      icon: Flame,
      desc: t('professions.welder.desc', 'MIG/TIG/SMAW welding, structural edge beveling, penetration checking, and weld seam finishing.'),
      tools: ['Welding Inverter Set', 'Auto-Darkening Helmet', 'Angle Grinder', 'Chipping Hammer & Wire Brush', 'Bevel Gauge'],
      safety: ['Welding Leather Apron & Gauntlets', 'Shade 11 Face Shield', 'Fume Extractor Mask', 'Fire Retardant Boots'],
      competencies: [
        'Multi-pass horizontal and vertical fillet welding (2F & 3F)',
        'Bevel edge preparation with uniform root gap spacing',
        'Slag detachment and clean interpass brushing',
        'Visual inspection for cold lap, undercut and pinholes'
      ]
    },
    painter: {
      name: t('professions.painter.name', 'Painter'),
      nativeName: t('professions.painter.nativeName', 'Painter / पेंटर'),
      icon: Paintbrush,
      desc: t('professions.painter.desc', 'Wall putty smoothing, primer application, roller technique, and spray gun coating.'),
      tools: ['Putty Blade (8" & 10")', 'Paint Roller & Extension Pole', 'Angled Sash Brush', 'Sanding Block (180/220 grit)', 'Drop Cloths'],
      safety: ['N95 Particulate Respirator', 'Chemical Eye Goggles', 'Step Ladder Safety Lock', 'Protective Coverall'],
      competencies: [
        'Surface defect sanding and dust-free primer prep',
        'Two-coat putty application with zero blade marks',
        'Straight edge hand cutting without bleed',
        'Consistent roller wet-edge application without lap lines'
      ]
    },
    mechanic: {
      name: t('professions.mechanic.name', 'Mechanic'),
      nativeName: t('professions.mechanic.nativeName', 'Mechanic / मैकेनिक'),
      icon: Cog,
      desc: t('professions.mechanic.desc', 'Engine diagnostics, brake overhaul, transmission alignment, and electrical harness repair.'),
      tools: ['Torque Wrench', 'Compression Gauge', 'Brake Caliper Reset Tool', 'Digital Multimeter', 'Feeler Gauge Set'],
      safety: ['Mechanic Nitrile Gloves', 'Safety Eyewear', 'Jack Stand Vehicle Lock', 'Non-Slip Work Boots'],
      competencies: [
        'Hydraulic brake caliper overhaul and line bleeding',
        'Spark plug electrode gap diagnostic and compression test',
        'Torque specification tightening on critical chassis bolts',
        'OBD electrical continuity troubleshooting'
      ]
    },
    technician: {
      name: 'Technician',
      nativeName: 'Technician / तकनीशियन',
      icon: Layers,
      desc: 'Inverter UPS setup, split air-conditioner flare joints, deep vacuum holding, and motor controls.',
      tools: ['Eccentric Flaring Tool', 'Torque Wrench Set', 'Vacuum Pump', 'Micron Gauge', 'Digital Multimeter'],
      safety: ['DC Terminal Shock Prevention', 'High Pressure Eye Safety', 'Terminal Torque Calibration'],
      competencies: [
        'DC terminal series polarization and fuse rating',
        'Flare nut torquing without copper mouth cracking',
        'Deep vacuum evacuation below 500 microns',
        '15-minute standing vacuum decay test verification'
      ]
    }
  };

  // --------------------------------------------------------------------------
  // Check Authenticated Worker Session
  // --------------------------------------------------------------------------
  const checkAuth = async () => {
    setAuthChecking(true);
    setAuthError(null);
    try {
      const token = apiService.getToken();
      if (!token) {
        setCurrentUser(null);
        return;
      }
      const res = await apiService.getMe();
      if (res.user) {
        setCurrentUser(res.user);
        if (res.user.specialisation && tradesData[res.user.specialisation]) {
          setSelectedTrade(res.user.specialisation);
        }
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.warn('Worker session check failed:', err);
      // Expired or invalid token
      apiService.logout();
      setCurrentUser(null);
      setAuthError('Your session has expired. Please sign in again.');
    } finally {
      setAuthChecking(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // --------------------------------------------------------------------------
  // Fetch Tasks and Worker's Own Assessments
  // --------------------------------------------------------------------------
  const loadBackendData = async () => {
    if (!currentUser) return;
    setLoadingData(true);
    setDataError(null);
    try {
      // 1. Fetch practical tasks for selected trade
      const taskRes = await apiService.getTasks(selectedTrade);
      if (taskRes.tasks) {
        setTasks(taskRes.tasks);
      }

      // 2. Fetch authenticated worker's assessments (strictly isolated)
      const assessRes = await apiService.getWorkerAssessments();
      if (assessRes.assessments) {
        setMyAssessments(assessRes.assessments);
      }
    } catch (err) {
      console.warn('Failed to load tasks/assessments:', err);
      setDataError(err.message || 'Unable to connect to database. Please check your connection.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadBackendData();
    }
  }, [currentUser, selectedTrade]);

  // --------------------------------------------------------------------------
  // Auth Handlers (Login / Register / Quick Demo)
  // --------------------------------------------------------------------------
  const handleWorkerLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await apiService.workerLogin(loginEmail.trim(), loginPassword);
      setCurrentUser(res.user);
      if (res.user.specialisation && tradesData[res.user.specialisation]) {
        setSelectedTrade(res.user.specialisation);
      }
    } catch (err) {
      setAuthError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleWorkerRegister = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const payload = {
        full_name: regFullName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        phone: regPhone.trim(),
        trade: regTrade,
        years_of_experience: Number(regExperience) || 0,
        location: regLocation.trim()
      };
      const res = await apiService.workerRegister(payload);
      setCurrentUser(res.user);
      setSelectedTrade(regTrade);
    } catch (err) {
      setAuthError(err.message || 'Failed to register. Please check the form fields.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setCurrentUser(null);
    setMyAssessments([]);
  };

  // --------------------------------------------------------------------------
  // Demonstration Evidence Submission
  // --------------------------------------------------------------------------
  const handleOpenSubmitModal = (task) => {
    setTargetTask(task || tasks[0]);
    setEvidenceUrl('');
    setSubmissionNotes('');
    setSubmitSuccess(null);
    setSubmitError(null);
    setSubmitModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!targetTask) return;

    const trimmedUrl = evidenceUrl.trim();
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      setSubmitError('Please enter a valid HTTP or HTTPS evidence link.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const payload = {
        task_id: targetTask.id,
        evidence_url: trimmedUrl,
        evidence_type: evidenceType,
        submission_notes: submissionNotes.trim()
      };

      const res = await apiService.submitWorkerDemonstration(payload);
      setSubmitSuccess(res.message || 'Demonstration submitted successfully!');
      loadBackendData();
      setTimeout(() => {
        setSubmitModalOpen(false);
      }, 1500);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit demonstration.');
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------------------------------
  // Demonstration Evidence Resubmission
  // --------------------------------------------------------------------------
  const handleOpenResubmitModal = (sub) => {
    setActiveSubForResubmit(sub);
    setEvidenceUrl('');
    setSubmissionNotes('');
    setSubmitError(null);
    setSubmitSuccess(null);
    setResubmitModalOpen(true);
  };

  const handleResubmitForm = async (e) => {
    e.preventDefault();
    if (!activeSubForResubmit) return;

    const trimmedUrl = evidenceUrl.trim();
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      setSubmitError('Please enter a valid HTTP or HTTPS evidence link.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const payload = {
        evidence_url: trimmedUrl,
        submission_notes: submissionNotes.trim()
      };

      const res = await apiService.resubmitWorkerDemonstration(activeSubForResubmit.id, payload);
      setSubmitSuccess(res.message || 'Evidence resubmitted successfully!');
      loadBackendData();
      setTimeout(() => {
        setResubmitModalOpen(false);
      }, 1500);
    } catch (err) {
      setSubmitError(err.message || 'Failed to resubmit evidence.');
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------------------------------
  // Detail View Helper
  // --------------------------------------------------------------------------
  const handleOpenDetailModal = (sub) => {
    setSelectedSubmission(sub);
    setDetailModalOpen(true);
  };

  const currentTrade = tradesData[selectedTrade] || tradesData.electrician;
  const CurrentIcon = currentTrade.icon;

  // Status counters
  const totalCount = myAssessments.length;
  const pendingCount = myAssessments.filter(a => a.status === 'pending' || a.status === 'under_review').length;
  const approvedCount = myAssessments.filter(a => a.status === 'approved').length;
  const resubmitCount = myAssessments.filter(a => a.status === 'resubmission_requested' || a.status === 'rejected').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-700">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Pending Review</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-xs font-bold border border-blue-300 dark:border-blue-700">
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin" />
            <span>Under Evaluation</span>
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Verified & Approved</span>
          </span>
        );
      case 'resubmission_requested':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 text-xs font-bold border border-orange-300 dark:border-orange-700">
            <RefreshCw className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span>Resubmission Requested</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-xs font-bold border border-red-300 dark:border-red-700">
            <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>Needs Improvement</span>
          </span>
        );
      default:
        return <span className="text-xs text-greygreen uppercase font-bold">{status}</span>;
    }
  };

  // --------------------------------------------------------------------------
  // Render Auth Gate if Worker Not Authenticated
  // --------------------------------------------------------------------------
  if (authChecking) {
    return (
      <div className="py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-terracotta mx-auto" />
        <p className="text-sm font-bold text-teal dark:text-ivory">Verifying worker session...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn py-6">
        
        {/* Banner */}
        <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-terracotta/10 text-terracotta dark:text-amber-400 flex items-center justify-center mx-auto">
            <HardHat className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-black text-teal dark:text-ivory font-heading">
            Worker Authentication Required
          </h2>

          <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/70 leading-relaxed max-w-lg mx-auto">
            To submit practical skill demonstrations, view evaluation feedback, and maintain your persistent digital skill passport, please sign in or register your artisan profile.
          </p>

          {authError && (
            <div className="p-3.5 rounded-2xl bg-red-500 text-white text-xs font-bold flex items-center gap-2 text-left animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Tab Selector */}
          <div className="flex border-b border-beige dark:border-charcoal-700 gap-4 pt-2 justify-center">
            <button
              type="button"
              onClick={() => { setAuthTab('login'); setAuthError(null); }}
              className={`pb-2 px-3 font-bold text-xs sm:text-sm border-b-2 transition-colors ${
                authTab === 'login'
                  ? 'border-terracotta text-terracotta'
                  : 'border-transparent text-greygreen hover:text-teal dark:text-ivory/60'
              }`}
            >
              Sign In Existing Worker
            </button>
            <button
              type="button"
              onClick={() => { setAuthTab('register'); setAuthError(null); }}
              className={`pb-2 px-3 font-bold text-xs sm:text-sm border-b-2 transition-colors ${
                authTab === 'register'
                  ? 'border-terracotta text-terracotta'
                  : 'border-transparent text-greygreen hover:text-teal dark:text-ivory/60'
              }`}
            >
              Register New Worker
            </button>
          </div>

          {/* Form: Sign In */}
          {authTab === 'login' && (
            <form onSubmit={handleWorkerLogin} className="space-y-4 text-left max-w-md mx-auto pt-2">
              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                  Worker Email Address *
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. artisan@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50 dark:bg-charcoal-900 text-xs text-teal dark:text-ivory"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50 dark:bg-charcoal-900 text-xs text-teal dark:text-ivory"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-2xl bg-teal dark:bg-charcoal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In to Worker Skills</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Form: Register */}
          {authTab === 'register' && (
            <form onSubmit={handleWorkerRegister} className="space-y-3 text-left max-w-md mx-auto pt-2">
              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="e.g. Manoj Sharma"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50 dark:bg-charcoal-900 text-xs text-teal dark:text-ivory"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                    Primary Trade *
                  </label>
                  <select
                    value={regTrade}
                    onChange={(e) => setRegTrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50 dark:bg-charcoal-900 text-xs text-teal dark:text-ivory capitalize"
                  >
                    {Object.keys(tradesData).map((t) => (
                      <option key={t} value={t}>{tradesData[t].name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={regExperience}
                    onChange={(e) => setRegExperience(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50 dark:bg-charcoal-900 text-xs text-teal dark:text-ivory"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50 dark:bg-charcoal-900 text-xs text-teal dark:text-ivory"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                  Current City & State
                </label>
                <input
                  type="text"
                  value={regLocation}
                  onChange={(e) => setRegLocation(e.target.value)}
                  placeholder="e.g. Jaipur, Rajasthan"
                  className="w-full px-3.5 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50 dark:bg-charcoal-900 text-xs text-teal dark:text-ivory"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. manoj.sharma@example.com"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50 dark:bg-charcoal-900 text-xs text-teal dark:text-ivory"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                  Password (min 6 characters) *
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength="6"
                  className="w-full px-3.5 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50 dark:bg-charcoal-900 text-xs text-teal dark:text-ivory"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-2xl bg-terracotta hover:bg-terracotta-dark text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 pt-2"
              >
                {authLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Creating Worker Profile...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Create Worker Account & Continue</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Main Authenticated Worker Experience
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Header Information Banner with Authenticated Worker Profile */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-sand-100 dark:bg-charcoal-700 text-terracotta dark:text-amber-400 text-xs font-bold uppercase tracking-wider border border-beige dark:border-charcoal-600">
                Practical Skill Verification
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Signed in: {currentUser.full_name}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-teal dark:text-ivory font-heading">
              My Skills & Practical Assessments
            </h2>
            <p className="text-sm text-greygreen dark:text-ivory/70 mt-1 max-w-3xl leading-relaxed">
              Submit genuine work demonstrations of your craftsmanship. Certified assessors evaluate your technique against standardized rubrics stored in PostgreSQL.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={loadBackendData}
              disabled={loadingData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sand-100 dark:bg-charcoal-700 text-teal dark:text-ivory text-xs font-bold hover:bg-sand-200 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign out of worker profile"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 text-greygreen hover:text-red-600 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-sand-50/70 dark:bg-charcoal-900 border border-beige dark:border-charcoal-700 text-center">
            <span className="block text-xl font-black text-teal dark:text-ivory font-heading">{totalCount}</span>
            <span className="text-[11px] font-bold text-greygreen dark:text-ivory/60">Total Submissions</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-sand-50/70 dark:bg-charcoal-900 border border-beige dark:border-charcoal-700 text-center">
            <span className="block text-xl font-black text-amber-600 dark:text-amber-400 font-heading">{pendingCount}</span>
            <span className="text-[11px] font-bold text-greygreen dark:text-ivory/60">In Evaluation</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-sand-50/70 dark:bg-charcoal-900 border border-beige dark:border-charcoal-700 text-center">
            <span className="block text-xl font-black text-emerald-600 dark:text-emerald-400 font-heading">{approvedCount}</span>
            <span className="text-[11px] font-bold text-greygreen dark:text-ivory/60">Approved & Verified</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-sand-50/70 dark:bg-charcoal-900 border border-beige dark:border-charcoal-700 text-center">
            <span className="block text-xl font-black text-orange-600 dark:text-orange-400 font-heading">{resubmitCount}</span>
            <span className="text-[11px] font-bold text-greygreen dark:text-ivory/60">Action Needed</span>
          </div>
        </div>
      </div>

      {dataError && (
        <div className="p-4 rounded-2xl bg-amber-500 text-teal-950 text-xs font-bold flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{dataError}</span>
          </div>
          <button
            type="button"
            onClick={loadBackendData}
            className="px-3 py-1 rounded-xl bg-teal-950 text-white text-[11px] font-bold"
          >
            Retry
          </button>
        </div>
      )}

      {/* 2. Trade Selector Tabs (8 Trades) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-teal dark:text-ivory font-heading">
            Choose a Vocational Trade to Demonstrate
          </h3>
          <span className="text-xs font-medium text-greygreen dark:text-ivory/60">8 Standardized Trades</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {Object.entries(tradesData).map(([key, item]) => {
            const Icon = item.icon;
            const isSelected = selectedTrade === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedTrade(key)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                  isSelected
                    ? 'border-terracotta bg-terracotta text-white shadow-sm ring-2 ring-terracotta/20'
                    : 'border-beige dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-teal dark:text-ivory hover:border-teal/30 hover:bg-sand-50 dark:hover:bg-charcoal-700'
                }`}
              >
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-sand-100 dark:bg-charcoal-700 text-teal dark:text-ivory'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{item.name}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Practical Assessment Tasks from PostgreSQL */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm space-y-6 transition-colors">
        
        {/* Trade Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-beige dark:border-charcoal-700">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal dark:bg-charcoal-700 text-white flex items-center justify-center shadow-md shadow-teal/15 border border-teal-700 dark:border-charcoal-600">
              <CurrentIcon className="w-7 h-7 text-terracotta-200" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-teal dark:text-ivory">
                {currentTrade.name} Practical Tasks
              </h3>
              <p className="text-xs text-greygreen dark:text-ivory/60 mt-0.5">
                {currentTrade.nativeName} • {tasks.length} Available Standardized Assessment Tasks
              </p>
            </div>
          </div>
        </div>

        {/* Task Cards Grid */}
        {loadingData ? (
          <div className="py-12 text-center text-xs text-greygreen flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-terracotta" />
            <span>Loading practical assessment tasks from database...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-8 text-center text-xs text-greygreen bg-sand-50 dark:bg-charcoal-900 rounded-2xl border border-beige dark:border-charcoal-700">
            No active practical tasks found for {currentTrade.name} in the system.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-5 rounded-2xl bg-sand-50/70 dark:bg-charcoal-900 border border-beige dark:border-charcoal-700 flex flex-col justify-between gap-4 transition-all hover:border-teal/30"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-teal dark:text-ivory font-heading">
                      {task.task_title}
                    </h4>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sand-100 dark:bg-charcoal-700 text-greygreen dark:text-ivory/80">
                      {task.difficulty_level}
                    </span>
                  </div>

                  <p className="text-xs text-greygreen dark:text-ivory/70 leading-relaxed">
                    {task.task_description}
                  </p>

                  {task.required_tools && (
                    <div className="pt-2 text-[11px] text-teal-900 dark:text-ivory/80 flex items-start gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Tools:</strong> {task.required_tools}</span>
                    </div>
                  )}

                  {task.safety_instructions && (
                    <div className="text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Safety:</strong> {task.safety_instructions}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-beige/60 dark:border-charcoal-700 flex items-center justify-between">
                  <span className="text-[11px] text-greygreen dark:text-ivory/50">
                    Task #{task.id} • {task.rubrics?.length || 4} Rubrics
                  </span>

                  <button
                    type="button"
                    onClick={() => handleOpenSubmitModal(task)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Demonstrate Task</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Competencies, Tools, Safety Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-beige dark:border-charcoal-700">
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory font-heading flex items-center gap-2">
              <Award className="w-4 h-4 text-terracotta" />
              <span>Core Competencies</span>
            </h4>
            <ul className="space-y-1.5">
              {currentTrade.competencies.map((comp, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-teal-900 dark:text-ivory/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{comp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory font-heading flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-600" />
              <span>Standard Tools</span>
            </h4>
            <ul className="space-y-1.5">
              {currentTrade.tools.map((tool, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-teal-900 dark:text-ivory/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>{tool}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory font-heading flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safety Standards</span>
            </h4>
            <ul className="space-y-1.5">
              {currentTrade.safety.map((safe, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-teal-900 dark:text-ivory/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{safe}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* 4. Authenticated Worker's Real Submissions History */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-beige dark:border-charcoal-700">
          <div>
            <h3 className="text-xl font-black text-teal dark:text-ivory font-heading">
              Your Demonstration Submissions ({myAssessments.length})
            </h3>
            <p className="text-xs text-greygreen dark:text-ivory/60 mt-0.5">
              Persistent evaluations strictly for {currentUser.full_name} (ID #{currentUser.id})
            </p>
          </div>

          <button
            type="button"
            onClick={loadBackendData}
            disabled={loadingData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sand-100 dark:bg-charcoal-700 text-teal dark:text-ivory text-xs font-bold hover:bg-sand-200 transition-colors self-start sm:self-auto"
          >
            <RefreshCw className={`w-3 h-3 ${loadingData ? 'animate-spin' : ''}`} />
            <span>Refresh Submissions</span>
          </button>
        </div>

        {myAssessments.length === 0 ? (
          <div className="py-12 text-center text-greygreen dark:text-ivory/60 text-xs space-y-3 bg-sand-50/50 dark:bg-charcoal-900 rounded-2xl border border-beige dark:border-charcoal-700">
            <FileText className="w-8 h-8 mx-auto opacity-50 text-terracotta" />
            <p className="font-bold text-sm text-teal dark:text-ivory">No practical demonstrations submitted yet.</p>
            <p className="max-w-md mx-auto text-xs">
              Choose a task from the list above and click "Demonstrate Task" to submit your workshop video or photo for assessor evaluation.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {myAssessments.map((item) => {
              const needsResubmit = item.status === 'resubmission_requested' || item.status === 'rejected';
              const isApproved = item.status === 'approved';

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-700 space-y-4 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-beige dark:border-charcoal-700">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-sm font-bold text-teal dark:text-ivory">
                          {item.task_title || 'Vocational Demonstration'}
                        </strong>
                        <span className="text-[11px] font-bold text-terracotta dark:text-amber-400 capitalize">
                          ({item.trade || item.worker_trade})
                        </span>
                        {item.attempt_count > 1 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-sand-200 dark:bg-charcoal-700 font-bold text-teal dark:text-ivory">
                            Attempt #{item.attempt_count}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-greygreen dark:text-ivory/60 flex-wrap">
                        <span>Submitted: {item.submitted_at ? new Date(item.submitted_at).toLocaleDateString() : 'Recent'}</span>
                        <span>•</span>
                        <a
                          href={item.evidence_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-terracotta hover:underline font-medium"
                        >
                          <span>Inspect Evidence Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {getStatusBadge(item.status)}
                    </div>
                  </div>

                  {item.submission_notes && (
                    <p className="text-xs text-greygreen dark:text-ivory/70 italic bg-white/70 dark:bg-charcoal-800 p-2.5 rounded-xl border border-beige/60 dark:border-charcoal-700">
                      <strong>Worker Log:</strong> "{item.submission_notes}"
                    </p>
                  )}

                  {/* Assessor Feedback Banner */}
                  {item.latest_review ? (
                    <div className="p-4 rounded-xl bg-teal-50/80 dark:bg-charcoal-800 border border-teal-200 dark:border-charcoal-600 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-teal dark:text-ivory flex-wrap gap-2">
                        <span className="flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-terracotta" />
                          <span>Evaluated by {item.latest_review.assessor_name || 'Certified Assessor'}</span>
                        </span>
                        <span className="text-sm font-heading text-terracotta dark:text-amber-300">
                          Score: {item.latest_review.total_score} / {item.latest_review.maximum_score} ({item.latest_review.score_percentage}%)
                        </span>
                      </div>

                      <p className="text-xs text-teal-950 dark:text-ivory/90 leading-relaxed italic bg-white/60 dark:bg-charcoal-900 p-2.5 rounded-xl">
                        "{item.latest_review.overall_feedback}"
                      </p>

                      <div className="pt-2 flex items-center justify-between gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleOpenDetailModal(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-charcoal-700 border border-beige dark:border-charcoal-600 text-teal dark:text-ivory font-bold text-xs hover:bg-sand-50 transition-all"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>View Criterion Scores</span>
                        </button>

                        {needsResubmit && (
                          <button
                            type="button"
                            onClick={() => handleOpenResubmitModal(item)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Resubmit Demonstration</span>
                          </button>
                        )}

                        {isApproved && (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Eligible for Skill Passport Issuance
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>This demonstration is awaiting evaluation by an accredited vocational assessor. You will see scores and feedback once evaluated.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Live Demonstration Submission Modal (No hardcoded Pexels URLs) */}
      {submitModalOpen && targetTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/70 dark:bg-black/80 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-ivory dark:bg-charcoal-900 rounded-3xl shadow-2xl border border-beige dark:border-charcoal-700 overflow-hidden p-6 sm:p-8 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSubmitModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-greygreen hover:text-teal dark:text-ivory/60 dark:hover:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-terracotta text-white flex items-center justify-center shrink-0">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-teal dark:text-ivory font-heading">
                  Submit Practical Demonstration
                </h3>
                <p className="text-xs text-greygreen dark:text-ivory/60">
                  Worker: {currentUser.full_name} • {currentTrade.name}
                </p>
              </div>
            </div>

            {/* Target Task Summary */}
            <div className="p-3.5 rounded-2xl bg-sand-50 dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 space-y-1 mb-4 text-xs">
              <div className="flex items-center justify-between">
                <strong className="text-teal dark:text-ivory font-bold">{targetTask.task_title}</strong>
                <span className="text-[10px] uppercase font-bold text-terracotta">{targetTask.difficulty_level}</span>
              </div>
              <p className="text-greygreen dark:text-ivory/70 text-[11px] leading-relaxed">
                {targetTask.task_description}
              </p>
            </div>

            {submitSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 mb-4 animate-scaleUp">
                <Check className="w-4 h-4 shrink-0" />
                <span>{submitSuccess}</span>
              </div>
            )}

            {submitError && (
              <div className="p-3.5 rounded-xl bg-red-500 text-white text-xs font-bold flex items-center gap-2 mb-4 animate-shake">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Evidence Type Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory mb-1">
                  Evidence Format:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEvidenceType('video')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      evidenceType === 'video'
                        ? 'border-terracotta bg-terracotta-50 dark:bg-terracotta/20 text-terracotta'
                        : 'border-beige dark:border-charcoal-700 bg-sand-50 dark:bg-charcoal-800 text-greygreen'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Workshop Video</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEvidenceType('image')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      evidenceType === 'image'
                        ? 'border-terracotta bg-terracotta-50 dark:bg-terracotta/20 text-terracotta'
                        : 'border-beige dark:border-charcoal-700 bg-sand-50 dark:bg-charcoal-800 text-greygreen'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Finished Craft Photo</span>
                  </button>
                </div>
              </div>

              {/* Evidence URL Input - Starts empty */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                  Demonstration Video / Photo URL *
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=... or https://drive.google.com/..."
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-800 border border-beige dark:border-charcoal-600 text-xs text-teal dark:text-ivory font-medium focus:ring-2 focus:ring-terracotta focus:outline-none"
                />
                <p className="text-[11px] text-greygreen dark:text-ivory/60">
                  Accepted formats: unlisted YouTube video, Google Drive link, Loom, Vimeo, Cloudinary, or public image URL.
                </p>
              </div>

              {/* Submission Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                  Procedure & Safety Notes (Optional):
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe tools used, sequence followed, and PPE safety steps verified during demonstration..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-sand-50/60 dark:bg-charcoal-800 border border-beige dark:border-charcoal-600 text-xs text-teal dark:text-ivory leading-relaxed focus:ring-2 focus:ring-terracotta focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !evidenceUrl.trim()}
                className="w-full py-3.5 rounded-2xl bg-terracotta hover:bg-terracotta-dark text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 pt-3 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Submitting Demonstration to PostgreSQL...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit for Assessor Evaluation</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. Resubmission Modal with Feedback Context */}
      {resubmitModalOpen && activeSubForResubmit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/70 dark:bg-black/80 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-ivory dark:bg-charcoal-900 rounded-3xl shadow-2xl border border-beige dark:border-charcoal-700 overflow-hidden p-6 sm:p-8 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setResubmitModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-greygreen hover:text-teal dark:text-ivory/60 dark:hover:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-teal dark:text-ivory font-heading">
                  Resubmit Demonstration
                </h3>
                <p className="text-xs text-greygreen dark:text-ivory/60">
                  Submission #{activeSubForResubmit.id} • Attempt #{ (activeSubForResubmit.attempt_count || 1) + 1 }
                </p>
              </div>
            </div>

            {/* Assessor Feedback Display */}
            {activeSubForResubmit.latest_review && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-xs text-amber-950 dark:text-amber-200 space-y-1 mb-4">
                <strong className="block font-bold">Assessor's Feedback to Address:</strong>
                <p className="italic leading-relaxed">
                  "{activeSubForResubmit.latest_review.overall_feedback}"
                </p>
              </div>
            )}

            {submitSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 mb-4 animate-scaleUp">
                <Check className="w-4 h-4 shrink-0" />
                <span>{submitSuccess}</span>
              </div>
            )}

            {submitError && (
              <div className="p-3.5 rounded-xl bg-red-500 text-white text-xs font-bold flex items-center gap-2 mb-4 animate-shake">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleResubmitForm} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                  Updated Evidence Video / Photo URL *
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-800 border border-beige dark:border-charcoal-600 text-xs text-teal dark:text-ivory font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                  What Did You Correct / Improve? *
                </label>
                <textarea
                  rows="3"
                  placeholder="Explain the changes made based on the assessor's feedback (e.g. re-bent conduit with proper radius, re-terminated MCB)..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  required
                  className="w-full p-3 rounded-2xl bg-sand-50/60 dark:bg-charcoal-800 border border-beige dark:border-charcoal-600 text-xs text-teal dark:text-ivory leading-relaxed focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !evidenceUrl.trim()}
                className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 pt-3 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Resubmitting Revised Demonstration...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Submit Revised Evidence</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 7. Detailed Criterion Scores Modal */}
      {detailModalOpen && selectedSubmission && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/70 dark:bg-black/80 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-ivory dark:bg-charcoal-900 rounded-3xl shadow-2xl border border-beige dark:border-charcoal-700 overflow-hidden p-6 sm:p-8 animate-scaleUp max-h-[90vh] overflow-y-auto space-y-4">
            <button
              type="button"
              onClick={() => setDetailModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-greygreen hover:text-teal dark:text-ivory/60 dark:hover:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal text-white flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-teal dark:text-ivory font-heading">
                  Evaluation Scorecard Breakdown
                </h3>
                <p className="text-xs text-greygreen dark:text-ivory/60">
                  Submission #{selectedSubmission.id} • {selectedSubmission.task_title}
                </p>
              </div>
            </div>

            {selectedSubmission.latest_review && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-charcoal-800 border border-teal-200 dark:border-charcoal-700 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-greygreen dark:text-ivory/60 font-bold block">Assessor Decision:</span>
                    <strong className="text-sm font-bold text-teal dark:text-ivory uppercase">
                      {selectedSubmission.latest_review.decision}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-greygreen dark:text-ivory/60 font-bold block">Total Score:</span>
                    <strong className="text-base font-bold text-terracotta dark:text-amber-300 font-heading">
                      {selectedSubmission.latest_review.total_score} / {selectedSubmission.latest_review.maximum_score} ({selectedSubmission.latest_review.score_percentage}%)
                    </strong>
                  </div>
                </div>

                {/* Rubrics Criteria Breakdown */}
                {selectedSubmission.latest_review.criterion_results && selectedSubmission.latest_review.criterion_results.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-teal dark:text-ivory uppercase text-[11px] tracking-wider">
                      Rubric Criteria Scores:
                    </h4>
                    <div className="space-y-2">
                      {selectedSubmission.latest_review.criterion_results.map((cr) => (
                        <div
                          key={cr.id}
                          className="p-3 rounded-xl bg-sand-50 dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 flex flex-col gap-1"
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-teal dark:text-ivory">{cr.criterion_name}</strong>
                            <span className="font-bold font-mono text-terracotta dark:text-amber-400">
                              {cr.score} / {cr.max_score}
                            </span>
                          </div>
                          {cr.assessor_comment && (
                            <p className="text-[11px] text-greygreen dark:text-ivory/70 italic">
                              "{cr.assessor_comment}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Historical Attempts If Any */}
                {selectedSubmission.history && selectedSubmission.history.length > 0 && (
                  <div className="pt-2 border-t border-beige dark:border-charcoal-700">
                    <h4 className="font-bold text-teal dark:text-ivory uppercase text-[11px] tracking-wider mb-2">
                      Submission Attempts History ({selectedSubmission.history.length + 1} total):
                    </h4>
                    <div className="space-y-1.5 text-[11px]">
                      {selectedSubmission.history.map((hist, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-sand-100/60 dark:bg-charcoal-800 flex items-center justify-between">
                          <span>Attempt #{hist.attempt}</span>
                          <span className="text-greygreen">{hist.archived_at ? new Date(hist.archived_at).toLocaleDateString() : ''}</span>
                        </div>
                      ))}
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-between">
                        <span>Current Attempt #{selectedSubmission.attempt_count}</span>
                        <span>Active</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
