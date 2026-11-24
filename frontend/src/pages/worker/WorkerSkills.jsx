import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
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
  AlertTriangle
} from 'lucide-react';

export default function WorkerSkills() {
  const { t } = useLanguage();
  const [selectedTrade, setSelectedTrade] = useState('electrician');
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const tradesData = {
    electrician: {
      name: t('professions.electrician.name', 'Electrician'),
      nativeName: t('professions.electrician.nativeName', 'Electrician / विद्युत कर्मी'),
      icon: Zap,
      status: 'under_review',
      badge: 'Sample: Under Review',
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
      status: 'not_submitted',
      badge: 'Not Submitted • Ready for Test',
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
      status: 'not_submitted',
      badge: 'Not Submitted • Ready for Test',
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
      status: 'not_submitted',
      badge: 'Not Submitted • Ready for Test',
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
      status: 'not_submitted',
      badge: 'Not Submitted • Ready for Test',
      desc: t('professions.welder.desc', 'SMAW/MIG weld penetration, bevel preparation, slag cleanup, and thermal PPE safety.'),
      task: t('professions.welder.task', 'Multi-pass fillet and butt weld with bend test crack resistance.'),
      tools: ['Inverter Welding Machine', 'Auto-darkening Helmet', 'Chipping Hammer', 'Wire Brush', 'Angle Grinder'],
      safety: ['Leather Welding Apron & Sleeves', 'Shade 11 Helmet Lens', 'Heavy Leather Gauntlets', 'Fume Extraction Zone'],
      competencies: [
        'Single-V butt joint root pass penetration',
        'Fillet weld throat thickness compliance (AWS D1.1 standard)',
        'Zero undercut or porosity on structural steel',
        'Slag chipping and uniform ripple finish'
      ]
    },
    painter: {
      name: t('professions.painter.name', 'Painter'),
      nativeName: t('professions.painter.nativeName', 'Painter / पेंटर'),
      icon: Paintbrush,
      status: 'not_submitted',
      badge: 'Not Submitted • Ready for Test',
      desc: t('professions.painter.desc', 'Wall preparation, putty smoothening, primer leveling, uniform roller coating, and weatherproofing.'),
      task: t('professions.painter.task', 'Surface sanding, 2-coat putty smoothening and flawless topcoat finish.'),
      tools: ['Putty Blade / Scraper (4" & 6")', 'Sanding Block (180/220 Grit)', 'Microfiber Roller & Tray', 'Masking Tape', 'Airless Spray Gun'],
      safety: ['Organic Vapor Respirator', 'Protective Coveralls', 'Anti-splash Safety Goggles', 'Scaffolding Tie-off'],
      competencies: [
        'Efflorescence checking and acrylic wall primer priming',
        'Double-coat polymer putty leveling with zero surface lap marks',
        'Uniform wet film thickness application without roller lap marks',
        'Edge cutting and masking around door architraves'
      ]
    },
    mechanic: {
      name: t('professions.mechanic.name', 'Mechanic'),
      nativeName: t('professions.mechanic.nativeName', 'Mechanic / मैकेनिक'),
      icon: Cog,
      status: 'not_submitted',
      badge: 'Not Submitted • Ready for Test',
      desc: t('professions.mechanic.desc', 'Engine diagnostics, brake shoe replacement, transmission servicing, and electrical system troubleshooting.'),
      task: t('professions.mechanic.task', 'Four-stroke engine compression test, brake caliper overhaul and diagnostic scan.'),
      tools: ['Torque Wrench (Nm calibrated)', 'OBD2 Diagnostic Scanner', 'Feeler Gauges', 'Brake Bleeder Kit', 'Bearing Puller'],
      safety: ['Oil-resistant Nitrile Gloves', 'Eye Protection Goggles', 'Fire Extinguisher on Standby', 'Hydraulic Jack Stand Locking'],
      competencies: [
        'Four-stroke cylinder compression pressure check',
        'Hydraulic brake line bleeding and rotor runout measurement',
        'Starter motor and alternator charging circuit diagnostics',
        'Valve clearance valve lash adjustment with feeler gauge'
      ]
    },
    other: {
      name: t('professions.other.name', 'Other Trades'),
      nativeName: t('professions.other.nativeName', 'Other Trades / अन्य हुनर'),
      icon: Layers,
      status: 'not_submitted',
      badge: 'Not Submitted • Ready for Test',
      desc: t('professions.other.desc', 'Masonry tiling, scaffolding, bar bending, waterproofing, HVAC ducting, and specialized fabrication.'),
      task: t('professions.other.task', 'Standardized task demonstration tailored to your trade craftsmanship.'),
      tools: ['Trade-specific Hand Tools', 'Digital Measuring Tape', 'Laser Level', 'Surface Gauge'],
      safety: ['Full Body Harness (for height)', 'High-visibility Vest', 'Protective Boots', 'Safety Eyewear'],
      competencies: [
        'Demonstration of specialized vocational trade tool handling',
        'Compliance with national occupational safety protocols',
        'Dimensional accuracy and finishing quality',
        'Independent problem troubleshooting on job site'
      ]
    }
  };

  const currentTrade = tradesData[selectedTrade] || tradesData.electrician;
  const CurrentIcon = currentTrade.icon;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl sm:text-3xl font-black text-teal dark:text-ivory font-heading">
            {t('worker.skills.title', 'Skills & Practical Verification')}
          </h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
            Assessment Framework Prototype
          </span>
        </div>
        <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/60 mt-1">
          {t('worker.skills.subtitle', "Standardized, practical skill benchmarks for India's essential vocational crafts.")}
        </p>
      </div>

      {/* 4-Step Practical Verification Pathway */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm transition-colors">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta dark:text-amber-300">
            Vocational Assessment Framework
          </span>
          <h3 className="text-xl font-bold text-teal dark:text-ivory font-heading mt-0.5">
            {t('worker.skills.howItWorksTitle', 'How Practical Skill Verification Works')}
          </h3>
          <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/60 mt-1">
            {t('worker.skills.howItWorksSub', 'A transparent 4-step pathway designed for real craftspeople, bypassing paper resumes.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-sand-50/60 dark:bg-charcoal-700/50 border border-beige dark:border-charcoal-600 relative overflow-hidden">
            <span className="absolute top-2 right-3 font-heading text-4xl font-black text-sand-200 dark:text-charcoal-600 select-none">1</span>
            <div className="w-8 h-8 rounded-xl bg-teal dark:bg-charcoal-600 text-white flex items-center justify-center text-xs font-bold mb-3 shadow-xs">
              01
            </div>
            <h4 className="text-sm font-bold text-teal dark:text-ivory font-heading">
              {t('worker.skills.step1', '1. Select a Skill')}
            </h4>
            <p className="text-xs text-greygreen dark:text-ivory/60 mt-1.5 leading-relaxed">
              {t('worker.skills.step1Desc', 'Choose from 8 recognized trade categories and specific competencies.')}
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-sand-50/60 dark:bg-charcoal-700/50 border border-beige dark:border-charcoal-600 relative overflow-hidden">
            <span className="absolute top-2 right-3 font-heading text-4xl font-black text-sand-200 dark:text-charcoal-600 select-none">2</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xs font-bold mb-3 shadow-xs">
              02
            </div>
            <h4 className="text-sm font-bold text-teal dark:text-ivory font-heading">
              {t('worker.skills.step2', '2. Submit Practical Evidence')}
            </h4>
            <p className="text-xs text-greygreen dark:text-ivory/60 mt-1.5 leading-relaxed">
              {t('worker.skills.step2Desc', 'Demonstrate tool handling, safety compliance, and task execution.')}
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-sand-50/60 dark:bg-charcoal-700/50 border border-beige dark:border-charcoal-600 relative overflow-hidden">
            <span className="absolute top-2 right-3 font-heading text-4xl font-black text-sand-200 dark:text-charcoal-600 select-none">3</span>
            <div className="w-8 h-8 rounded-xl bg-terracotta text-white flex items-center justify-center text-xs font-bold mb-3 shadow-xs">
              03
            </div>
            <h4 className="text-sm font-bold text-teal dark:text-ivory font-heading">
              {t('worker.skills.step3', '3. Get Assessed')}
            </h4>
            <p className="text-xs text-greygreen dark:text-ivory/60 mt-1.5 leading-relaxed">
              {t('worker.skills.step3Desc', 'Vocational assessors evaluate work against industry standards.')}
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-sand-50/60 dark:bg-charcoal-700/50 border border-beige dark:border-charcoal-600 relative overflow-hidden">
            <span className="absolute top-2 right-3 font-heading text-4xl font-black text-sand-200 dark:text-charcoal-600 select-none">4</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-3 shadow-xs">
              04
            </div>
            <h4 className="text-sm font-bold text-teal dark:text-ivory font-heading">
              {t('worker.skills.step4', '4. Receive Verified Recognition')}
            </h4>
            <p className="text-xs text-greygreen dark:text-ivory/60 mt-1.5 leading-relaxed">
              {t('worker.skills.step4Desc', 'Earn a verifiable digital credential added to your Skill Passport.')}
            </p>
          </div>

        </div>
      </div>

      {/* Trade Selector Tabs (8 Trades) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-teal dark:text-ivory font-heading">
            {t('worker.skills.selectTrade', 'Select a Trade Category')}
          </h3>
          <span className="text-xs font-medium text-greygreen dark:text-ivory/60">8 Vocational Crafts</span>
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
                  {item.status === 'under_review' ? (
                    <span className={`text-[9px] font-bold block ${isSelected ? 'text-amber-200' : 'text-amber-600 dark:text-amber-400'}`}>
                      In Review
                    </span>
                  ) : (
                    <span className={`text-[9px] font-normal block ${isSelected ? 'text-white/80' : 'text-greygreen dark:text-ivory/50'}`}>
                      Ready
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Trade Benchmark Detail Card */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm space-y-6 transition-colors">
        
        {/* Trade Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-beige dark:border-charcoal-700">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal dark:bg-charcoal-700 text-white flex items-center justify-center shadow-md shadow-teal/15 border border-teal-700 dark:border-charcoal-600">
              <CurrentIcon className="w-7 h-7 text-terracotta-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-teal dark:text-ivory">
                  {currentTrade.name}
                </h3>
                {currentTrade.status === 'under_review' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                    <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Sample: Under Review</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-sand-200/70 dark:bg-charcoal-700 text-greygreen dark:text-ivory/60 px-2.5 py-0.5 rounded-full">
                    <span>Not Submitted • Ready for Test</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-greygreen dark:text-ivory/60 mt-0.5">
                {currentTrade.nativeName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDemoModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-terracotta/20 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{t('worker.skills.submitDemoBtn', 'Submit Work Demonstration')}</span>
          </button>
        </div>

        {/* Practical Assessment Task Banner */}
        <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-charcoal-700/60 border border-teal-200/80 dark:border-charcoal-600">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal dark:text-ivory/80">
            {t('worker.skills.assessmentTasks', 'Practical Assessment Task')}:
          </span>
          <p className="text-sm font-bold text-teal-950 dark:text-ivory mt-1 leading-relaxed">
            {currentTrade.task}
          </p>
          <p className="text-xs text-greygreen dark:text-ivory/60 mt-2">
            {currentTrade.desc}
          </p>
        </div>

        {/* 3 Column Grid: Competencies, Tools, Safety */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Key Competencies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory font-heading flex items-center gap-2">
              <Award className="w-4 h-4 text-terracotta dark:text-amber-300" />
              <span>{t('worker.skills.competenciesList', 'Key Verified Competencies')}</span>
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
              <span>{t('worker.skills.toolsUsed', 'Standard Tools Required')}</span>
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
              <span>{t('worker.skills.safetyProtocols', 'Safety Protocols Assessed')}</span>
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

      {/* Practical Demonstration Informational Modal (Honest Prototype Notice) */}
      {demoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/70 dark:bg-black/80 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-ivory dark:bg-charcoal-900 rounded-3xl shadow-2xl border border-beige dark:border-charcoal-700 overflow-hidden p-6 sm:p-8 animate-scaleUp">
            <button
              type="button"
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-greygreen hover:text-teal dark:text-ivory/60 dark:hover:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-terracotta text-white flex items-center justify-center">
                <Play className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-teal dark:text-ivory font-heading">
                  {t('worker.skills.demoModalTitle', 'Practical Demonstration Submission')}
                </h3>
                <p className="text-xs text-greygreen dark:text-ivory/60">
                  {currentTrade.name} Benchmark Test Guidelines
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs leading-relaxed space-y-2 mb-6">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Phase 2 Prototype Notice</span>
              </div>
              <p>
                Video demonstration uploading and AI/assessor rubric grading belong to Phase 3. In Phase 3, workers will record short video demonstrations of hands-on tasks using standard workshop tools.
              </p>
            </div>

            <div className="space-y-2 text-xs text-teal-900 dark:text-ivory/90 mb-6 bg-white dark:bg-charcoal-800 p-4 rounded-2xl border border-beige dark:border-charcoal-700">
              <p className="font-bold text-teal dark:text-ivory">Occupational Rubric Criteria (Preview):</p>
              <p>• Mandatory PPE Verification (Glasses, Gloves, Insulated Boots)</p>
              <p>• Task Execution: {currentTrade.task}</p>
              <p>• Dimensional Tolerance & Operational Continuity</p>
              <p>• Workshop Safety & Housekeeping Protocol</p>
            </div>

            <button
              type="button"
              onClick={() => setDemoModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-teal dark:bg-charcoal-700 text-white font-bold text-xs hover:bg-teal-800 dark:hover:bg-charcoal-600 transition-colors shadow-sm"
            >
              {t('worker.skills.demoModalClose', 'Understood (Prototype Acknowledged)')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
