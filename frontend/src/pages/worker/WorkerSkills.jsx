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
  Check
} from 'lucide-react';

export default function WorkerSkills() {
  const { t } = useLanguage();
  const [selectedTrade, setSelectedTrade] = useState('electrician');
  
  // Modal states
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [resubmitModalOpen, setResubmitModalOpen] = useState(false);
  const [activeSubForResubmit, setActiveSubForResubmit] = useState(null);

  // Form states for submission
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Backend Data
  const [tasks, setTasks] = useState([]);
  const [myAssessments, setMyAssessments] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const tradesData = {
    electrician: {
      name: t('professions.electrician.name', 'Electrician'),
      nativeName: t('professions.electrician.nativeName', 'Electrician / विद्युत कर्मी'),
      icon: Zap,
      desc: t('professions.electrician.desc', 'Conduit laying, DB panel termination, circuit load calculations, and earthing diagnostics.'),
      task: t('professions.electrician.task', 'Conduit bending, MCB termination and complete circuit continuity testing.'),
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
      task: t('professions.plumber.task', 'Multi-joint line assembly and high-pressure leak testing without failure.'),
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
      task: t('professions.mason.task', 'Constructing a 90-degree plumb corner wall within structural tolerance.'),
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
      task: t('professions.carpenter.task', 'Fabricating a square joint frame with flush hardware and level alignment.'),
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
      task: t('professions.welder.task', 'Clean fillet and butt weld demonstrations with zero porosity and uniform bead height.'),
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
      task: t('professions.painter.task', 'Leveling plaster with two-coat putty and applying smooth uniform topcoats.'),
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
      task: t('professions.mechanic.task', 'Diagnostic engine inspection, compression checking, and caliper overhauling.'),
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
      task: 'Dual-battery inverter commissioning and vacuum holding test.',
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

  const loadBackendData = async () => {
    setLoadingData(true);
    try {
      const taskRes = await apiService.getTasks(selectedTrade);
      if (taskRes.tasks) {
        setTasks(taskRes.tasks);
        if (taskRes.tasks.length > 0) {
          setSelectedTaskId(taskRes.tasks[0].id);
        }
      }

      const assessRes = await apiService.getWorkerAssessments(101);
      if (assessRes.assessments) {
        setMyAssessments(assessRes.assessments);
      }
    } catch (err) {
      console.warn('Could not fetch backend tasks/assessments:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadBackendData();
  }, [selectedTrade]);

  const handleOpenSubmitModal = () => {
    setSubmitSuccess(null);
    setSubmitError(null);
    setEvidenceUrl('https://images.pexels.com/photos/31199578/pexels-photo-31199578.jpeg');
    setSubmissionNotes(`Demonstrated ${currentTrade.name} benchmark test following safety protocols and standard tools.`);
    if (tasks.length > 0) {
      setSelectedTaskId(tasks[0].id);
    }
    setSubmitModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const payload = {
        worker_id: 101,
        worker_name: 'Ramesh Kumar',
        worker_phone: '9876543210',
        worker_trade: selectedTrade,
        worker_experience: 8,
        worker_location: 'Bengaluru, Karnataka',
        task_id: selectedTaskId || tasks[0]?.id,
        evidence_url: evidenceUrl.trim(),
        evidence_type: evidenceUrl.includes('video') || evidenceUrl.includes('youtu') ? 'video' : 'image',
        submission_notes: submissionNotes.trim()
      };

      const res = await apiService.submitWorkerDemonstration(payload);
      setSubmitSuccess(res.message || 'Demonstration submitted successfully!');
      loadBackendData();
      setTimeout(() => {
        setSubmitModalOpen(false);
      }, 1600);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit demonstration.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenResubmitModal = (sub) => {
    setActiveSubForResubmit(sub);
    setEvidenceUrl(sub.evidence_url || '');
    setSubmissionNotes('Corrected technique and re-demonstrated according to assessor feedback.');
    setSubmitError(null);
    setSubmitSuccess(null);
    setResubmitModalOpen(true);
  };

  const handleResubmitForm = async (e) => {
    e.preventDefault();
    if (!activeSubForResubmit) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        evidence_url: evidenceUrl.trim(),
        submission_notes: submissionNotes.trim()
      };

      const res = await apiService.resubmitWorkerDemonstration(activeSubForResubmit.id, payload);
      setSubmitSuccess(res.message || 'Evidence resubmitted successfully!');
      loadBackendData();
      setTimeout(() => {
        setResubmitModalOpen(false);
      }, 1600);
    } catch (err) {
      setSubmitError(err.message || 'Failed to resubmit evidence.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentTrade = tradesData[selectedTrade] || tradesData.electrician;
  const CurrentIcon = currentTrade.icon;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-700">
            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>Pending Assessor Review</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 text-xs font-bold border border-blue-300 dark:border-blue-700">
            <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>Currently Under Evaluation</span>
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Approved by Assessor</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 text-xs font-bold border border-red-300 dark:border-red-700">
            <XCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
            <span>Requires Further Training</span>
          </span>
        );
      case 'resubmission_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-800 dark:text-orange-300 text-xs font-bold border border-orange-300 dark:border-orange-700">
            <RefreshCw className="w-3 h-3 text-orange-600 dark:text-orange-400" />
            <span>Resubmission Requested</span>
          </span>
        );
      default:
        return <span className="text-xs text-greygreen">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Header Information Banner */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-sand-100 dark:bg-charcoal-700 text-terracotta dark:text-amber-400 text-xs font-bold uppercase tracking-wider border border-beige dark:border-charcoal-600">
                Phase 3: Live Assessor Evaluation Engine
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-teal dark:text-ivory font-heading">
              {t('worker.skills.title', 'Practical Trade Skills & Demonstration Benchmarks')}
            </h2>
            <p className="text-sm text-greygreen dark:text-ivory/70 mt-1 max-w-3xl leading-relaxed">
              {t('worker.skills.subtitle', 'Submit hands-on evidence of your craftsmanship. Certified vocational assessors evaluate your technique against standardized rubrics stored in PostgreSQL.')}
            </p>
          </div>

          <button
            type="button"
            onClick={loadBackendData}
            disabled={loadingData}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sand-100 dark:bg-charcoal-700 text-teal dark:text-ivory text-xs font-bold hover:bg-sand-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
            <span>Sync with Database</span>
          </button>
        </div>
      </div>

      {/* 2. Trade Selector Tabs (8 Trades) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-teal dark:text-ivory font-heading">
            {t('worker.skills.selectTrade', 'Select a Trade Category')}
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

      {/* 3. Selected Trade Benchmark Detail Card */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm space-y-6 transition-colors">
        
        {/* Trade Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-beige dark:border-charcoal-700">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal dark:bg-charcoal-700 text-white flex items-center justify-center shadow-md shadow-teal/15 border border-teal-700 dark:border-charcoal-600">
              <CurrentIcon className="w-7 h-7 text-terracotta-200" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-teal dark:text-ivory">
                {currentTrade.name}
              </h3>
              <p className="text-xs text-greygreen dark:text-ivory/60 mt-0.5">
                {currentTrade.nativeName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenSubmitModal}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-terracotta/20 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Submit Work Demonstration (PostgreSQL)</span>
          </button>
        </div>

        {/* Practical Assessment Task Banner */}
        <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-charcoal-700/60 border border-teal-200/80 dark:border-charcoal-600 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal dark:text-ivory/80">
            Standard Demonstration Tasks from Database:
          </span>
          {tasks.length > 0 ? (
            <div className="space-y-3 pt-1">
              {tasks.map((tItem) => (
                <div key={tItem.id} className="p-3.5 rounded-xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-600 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm font-bold text-teal dark:text-ivory">
                      {tItem.task_title}
                    </strong>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sand-100 dark:bg-charcoal-700 text-greygreen dark:text-ivory/70">
                      {tItem.difficulty_level}
                    </span>
                  </div>
                  <p className="text-xs text-greygreen dark:text-ivory/70">
                    {tItem.task_description}
                  </p>
                  {tItem.safety_instructions && (
                    <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium pt-1">
                      ⚠️ Safety: {tItem.safety_instructions}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-bold text-teal-950 dark:text-ivory mt-1 leading-relaxed">
              {currentTrade.task}
            </p>
          )}
        </div>

        {/* 3 Column Grid: Competencies, Tools, Safety */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Key Competencies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory font-heading flex items-center gap-2">
              <Award className="w-4 h-4 text-terracotta dark:text-amber-300" />
              <span>Key Competencies</span>
            </h4>
            <ul className="space-y-2">
              {currentTrade.competencies.map((comp, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-teal-900 dark:text-ivory/80 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{comp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Standard Tools Required */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory font-heading flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Required Tools</span>
            </h4>
            <ul className="space-y-2">
              {currentTrade.tools.map((tool, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-teal-900 dark:text-ivory/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>{tool}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety Protocols Assessed */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory font-heading flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Safety Standards</span>
            </h4>
            <ul className="space-y-2">
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

      {/* 4. Real PostgreSQL Submissions & Review Feedback Section */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-beige dark:border-charcoal-700">
          <div>
            <h3 className="text-xl font-black text-teal dark:text-ivory font-heading">
              Your Practical Demonstration Assessments ({myAssessments.length})
            </h3>
            <p className="text-xs text-greygreen dark:text-ivory/60 mt-0.5">
              Live status and evaluator feedback recorded directly in PostgreSQL
            </p>
          </div>
        </div>

        {myAssessments.length === 0 ? (
          <div className="py-12 text-center text-greygreen dark:text-ivory/60 text-xs space-y-2">
            <FileText className="w-8 h-8 mx-auto opacity-50" />
            <p className="font-bold">No demonstration submissions on record for this profile yet.</p>
            <p>Click "Submit Work Demonstration" above to upload evidence for assessor evaluation.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myAssessments.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-700 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-beige dark:border-charcoal-700">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-bold text-teal dark:text-ivory">
                        {item.task_title || 'Vocational Demonstration'}
                      </strong>
                      <span className="text-[11px] font-bold text-terracotta dark:text-amber-400 capitalize">
                        ({item.trade || item.worker_trade})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-greygreen dark:text-ivory/60">
                      <span>Submitted: {item.submitted_at ? new Date(item.submitted_at).toLocaleDateString() : 'Recent'}</span>
                      <span>•</span>
                      <a
                        href={item.evidence_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-terracotta hover:underline"
                      >
                        <span>View Evidence</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div>{getStatusBadge(item.status)}</div>
                </div>

                {item.submission_notes && (
                  <p className="text-xs text-greygreen dark:text-ivory/70 italic">
                    Notes: "{item.submission_notes}"
                  </p>
                )}

                {/* If Assessor Reviewed, display feedback and scores */}
                {item.latest_review && (
                  <div className="p-4 rounded-xl bg-teal-50/80 dark:bg-charcoal-800 border border-teal-200 dark:border-charcoal-600 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-teal dark:text-ivory">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-terracotta" />
                        <span>Evaluator Feedback (Assessor: {item.latest_review.assessor_name || 'Certified Assessor'})</span>
                      </span>
                      <span className="text-sm font-heading text-terracotta dark:text-amber-300">
                        Score: {item.latest_review.total_score} / {item.latest_review.maximum_score} ({item.latest_review.score_percentage}%)
                      </span>
                    </div>

                    <p className="text-xs text-teal-950 dark:text-ivory/90 leading-relaxed italic">
                      "{item.latest_review.overall_feedback}"
                    </p>

                    {/* Resubmission button if status is resubmission_requested */}
                    {item.status === 'resubmission_requested' && (
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleOpenResubmitModal(item)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-all"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Resubmit Revised Evidence</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Live Demonstration Submission Modal */}
      {submitModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/70 dark:bg-black/80 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-ivory dark:bg-charcoal-900 rounded-3xl shadow-2xl border border-beige dark:border-charcoal-700 overflow-hidden p-6 sm:p-8 animate-scaleUp">
            <button
              type="button"
              onClick={() => setSubmitModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-greygreen hover:text-teal dark:text-ivory/60 dark:hover:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-terracotta text-white flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-teal dark:text-ivory font-heading">
                  Submit Work Demonstration
                </h3>
                <p className="text-xs text-greygreen dark:text-ivory/60">
                  {currentTrade.name} Practical Evidence (Saved to PostgreSQL)
                </p>
              </div>
            </div>

            {submitSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 mb-4">
                <Check className="w-4 h-4 shrink-0" />
                <span>{submitSuccess}</span>
              </div>
            )}

            {submitError && (
              <div className="p-3.5 rounded-xl bg-red-500 text-white text-xs font-bold flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Task Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                  Select Practical Assessment Task:
                </label>
                <select
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-800 border border-beige dark:border-charcoal-600 text-xs text-teal dark:text-ivory font-medium"
                >
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.task_title} ({t.difficulty_level})
                    </option>
                  ))}
                </select>
              </div>

              {/* Evidence URL */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                  Demonstration Video / Image URL:
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-800 border border-beige dark:border-charcoal-600 text-xs text-teal dark:text-ivory font-medium"
                />
                <p className="text-[11px] text-greygreen dark:text-ivory/60">
                  Paste a link to your demonstration video (YouTube, MP4) or high-resolution workshop photograph.
                </p>
              </div>

              {/* Submission Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                  Demonstration Notes & Procedure Log:
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe tools used, step sequence, and safety measures applied..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  required
                  className="w-full p-3 rounded-2xl bg-sand-50/60 dark:bg-charcoal-800 border border-beige dark:border-charcoal-600 text-xs text-teal dark:text-ivory leading-relaxed"
                />
              </div>

              {/* Quick Sample Presets */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-greygreen dark:text-ivory/50">Sample media:</span>
                <button
                  type="button"
                  onClick={() => setEvidenceUrl('https://images.pexels.com/photos/31199578/pexels-photo-31199578.jpeg')}
                  className="text-[10px] text-terracotta hover:underline font-bold"
                >
                  Textile/Artisan photo
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setEvidenceUrl('https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg')}
                  className="text-[10px] text-terracotta hover:underline font-bold"
                >
                  Plumber pipe test
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 pt-3"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Submission to PostgreSQL...</span>
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

      {/* 6. Resubmission Modal */}
      {resubmitModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/70 dark:bg-black/80 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-ivory dark:bg-charcoal-900 rounded-3xl shadow-2xl border border-beige dark:border-charcoal-700 overflow-hidden p-6 sm:p-8 animate-scaleUp">
            <button
              type="button"
              onClick={() => setResubmitModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-greygreen hover:text-teal dark:text-ivory/60 dark:hover:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-teal dark:text-ivory font-heading">
                  Resubmit Demonstration Evidence
                </h3>
                <p className="text-xs text-greygreen dark:text-ivory/60">
                  Update demonstration #{activeSubForResubmit?.id}
                </p>
              </div>
            </div>

            {submitSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 mb-4">
                <Check className="w-4 h-4 shrink-0" />
                <span>{submitSuccess}</span>
              </div>
            )}

            {submitError && (
              <div className="p-3.5 rounded-xl bg-red-500 text-white text-xs font-bold flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleResubmitForm} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                  New Evidence Video / Photo URL:
                </label>
                <input
                  type="url"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-800 border border-beige dark:border-charcoal-600 text-xs text-teal dark:text-ivory font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                  Correction Notes (Explaining Revisions):
                </label>
                <textarea
                  rows="3"
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  required
                  className="w-full p-3 rounded-2xl bg-sand-50/60 dark:bg-charcoal-800 border border-beige dark:border-charcoal-600 text-xs text-teal dark:text-ivory leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 pt-3"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Resubmitting to PostgreSQL...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Submit Revised Demonstration</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
