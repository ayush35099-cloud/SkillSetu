import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useRegion } from '../../context/RegionContext';
import { getWorkerProfile } from '../../services/demoWorkerService';
import { 
  QrCode, 
  ShieldAlert, 
  Download, 
  Share2, 
  Printer, 
  CheckCircle2, 
  HardHat, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Award,
  Building2,
  AlertTriangle,
  Copy,
  Check,
  Info
} from 'lucide-react';

export default function SkillPassport() {
  const { t } = useLanguage();
  const { currentRegionMeta } = useRegion();
  const [copied, setCopied] = useState(false);
  const [profile] = useState(() => getWorkerProfile());

  const sampleCompetencies = [
    { title: 'Conduit Bending & Installation (Benchmark Demo)', standard: 'IS 9537 Benchmark', grade: 'Sample Evaluation: 98%' },
    { title: 'Distribution Board MCB Termination (Benchmark Demo)', standard: 'IS 13032 Benchmark', grade: 'Sample Evaluation: 95%' },
    { title: 'Megger Insulation & Continuity Testing (Benchmark Demo)', standard: 'IEEE 43 Testing', grade: 'Sample: Continuity Verified' },
    { title: 'Earthing Resistance Verification (<5Ω) (Benchmark Demo)', standard: 'IS 3043 Standard', grade: 'Sample Evaluation: Passed' }
  ];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const cardData = `
=====================================================
SKILLSETU DIGITAL VOCATIONAL SKILL PASSPORT (DEMO PREVIEW)
=====================================================
NOTICE: THIS IS A PROTOTYPE DEMONSTRATION PREVIEW.
IT IS NOT AN OFFICIAL GOVERNMENT LICENSE OR CERTIFICATION.
=====================================================
Worker Name: ${profile.fullName}
Sample ID: DEMO-IND-2026-8842
Trade: ${profile.primaryTrade || 'Electrician'}
Status: Prototype Demo Evaluation
Region: ${profile.location || currentRegionMeta.name}
Issuing Framework: SkillSetu Prototype Demonstration (Track 4 - UnlockED)
Evaluation Date: 2026-11-24
=====================================================
SAMPLE COMPETENCY BENCHMARKS (PROTOTYPE):
1. Conduit Bending & Installation (IS 9537 Benchmark)
2. Distribution Board MCB Termination (IS 13032 Benchmark)
3. Megger Insulation & Continuity Testing (IEEE 43 Benchmark)
4. Earthing Resistance Verification (IS 3043 Benchmark)
=====================================================
`;
    const blob = new Blob([cardData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DemoSkillPassport_DEMO-IND-2026-8842.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* 1. Explicit Truth-in-Advertising Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/15 dark:bg-amber-950/40 border border-amber-400 dark:border-amber-700 text-teal-950 dark:text-amber-200 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="block font-bold text-sm text-teal-950 dark:text-amber-100">
            DEMO PREVIEW – NOT A VALID CREDENTIAL
          </strong>
          <p className="mt-0.5">
            This card is an MVP interface prototype demonstrating the future portable credential layout for Indian craftspeople. It is not an official government certification, state trade license, or legal identity card.
          </p>
        </div>
      </div>

      {/* 2. Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-teal dark:text-ivory font-heading">
            {t('worker.passport.title', 'Digital Skill Passport Preview')}
          </h2>
          <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/60 mt-1">
            Portable trade identification format designed for field inspection by contractors and site engineers.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-charcoal-800 hover:bg-sand-100 dark:hover:bg-charcoal-700 text-teal dark:text-ivory border border-beige dark:border-charcoal-600 text-xs font-bold transition-all shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-4 h-4 text-terracotta" />}
            <span>{copied ? 'Link Copied!' : 'Share Demo Link'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-charcoal-800 hover:bg-sand-100 dark:hover:bg-charcoal-700 text-teal dark:text-ivory border border-beige dark:border-charcoal-600 text-xs font-bold transition-all shadow-xs"
          >
            <Printer className="w-4 h-4 text-teal dark:text-ivory" />
            <span>Print Card</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* 3. Physical-Style Laminated Card Prototype */}
      <div className="relative bg-gradient-to-br from-teal-950 via-teal-900 to-teal dark:from-charcoal-950 dark:via-charcoal-900 dark:to-charcoal-800 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border-2 border-amber-400/40 overflow-hidden">
        
        {/* Prominent Demo Watermark */}
        <div className="absolute top-4 right-4 z-20">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-teal-950 font-black text-[10px] tracking-wider uppercase border border-amber-500 shadow-md">
            DEMO PREVIEW • PROTOTYPE ONLY
          </span>
        </div>

        {/* Card Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-teal-700/80 dark:border-charcoal-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-teal-950 flex items-center justify-center font-black shadow-md">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-xl tracking-tight text-white">
                  Skill<span className="text-amber-300">Setu</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/40">
                  Vocational Card Prototype
                </span>
              </div>
              <p className="text-[11px] text-teal-200 dark:text-ivory/70">
                SkillSetu Demonstration Framework (Track 4 – UnlockED Project)
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right pt-6 sm:pt-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 dark:text-ivory/60 block">
              Sample Trade ID
            </span>
            <span className="font-mono text-base font-bold text-amber-300">
              DEMO-IND-2026-8842
            </span>
          </div>
        </div>

        {/* Card Body: Worker Identity & Non-Functional QR Placeholder */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-teal-700/80 dark:border-charcoal-700 items-center">
          
          {/* Worker Profile Snapshot */}
          <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-amber-500/20 border-2 border-amber-300 text-amber-200 flex items-center justify-center font-heading text-3xl font-black shadow-inner">
                {profile.fullName ? profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'RK'}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold font-heading text-white">
                {profile.fullName}
              </h3>
              <p className="text-sm font-semibold text-amber-300 flex items-center gap-1.5 capitalize">
                <span>{profile.primaryTrade || 'Electrician'}</span>
                <span className="text-teal-400">•</span>
                <span className="text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                  Demo Evaluation Record
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-teal-200 dark:text-ivory/70 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-300" />
                  <span>{profile.location || currentRegionMeta.name}</span>
                </span>
                <span className="text-teal-400">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-300" />
                  <span>{profile.experience || 8} Yrs Practical Exp</span>
                </span>
              </div>
            </div>
          </div>

          {/* Non-Functional QR Code Visual Placeholder */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 dark:bg-charcoal-800/80 backdrop-blur-md border border-white/20 dark:border-charcoal-600 text-center">
            <div className="relative w-28 h-28 bg-white p-2 rounded-xl shadow-inner flex items-center justify-center">
              {/* Clean non-functional decorative QR matrix */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-teal-950">
                <rect x="0" y="0" width="30" height="30" fill="currentColor" rx="2" />
                <rect x="5" y="5" width="20" height="20" fill="white" rx="1" />
                <rect x="9" y="9" width="12" height="12" fill="currentColor" />

                <rect x="70" y="0" width="30" height="30" fill="currentColor" rx="2" />
                <rect x="75" y="5" width="20" height="20" fill="white" rx="1" />
                <rect x="79" y="9" width="12" height="12" fill="currentColor" />

                <rect x="0" y="70" width="30" height="30" fill="currentColor" rx="2" />
                <rect x="5" y="75" width="20" height="20" fill="white" rx="1" />
                <rect x="9" y="79" width="12" height="12" fill="currentColor" />

                <rect x="36" y="8" width="6" height="6" fill="currentColor" />
                <rect x="46" y="8" width="6" height="6" fill="currentColor" />
                <rect x="36" y="36" width="8" height="8" fill="currentColor" />
                <rect x="50" y="36" width="8" height="8" fill="currentColor" />
                <rect x="64" y="36" width="8" height="8" fill="currentColor" />
                <rect x="36" y="50" width="8" height="8" fill="currentColor" />
                <rect x="50" y="50" width="8" height="8" fill="currentColor" />
                <rect x="64" y="50" width="8" height="8" fill="currentColor" />
              </svg>
            </div>
            <span className="text-[10px] text-amber-300 font-bold mt-2">
              Visual Placeholder (Non-functional)
            </span>
            <span className="text-[9px] text-teal-200 dark:text-ivory/60">
              Phase 3 Verifiable Target
            </span>
          </div>

        </div>

        {/* Card Footer: Verified Competencies List */}
        <div className="relative z-10 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>Sample Practical Competencies (Demonstration Benchmarks)</span>
            </h4>
            <span className="text-[11px] text-teal-300 dark:text-ivory/60">
              Prototype Evaluation Mode
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sampleCompetencies.map((comp, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-teal-900/60 dark:bg-charcoal-800/80 border border-teal-700/60 dark:border-charcoal-600 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-medium text-white truncate">{comp.title}</span>
                </div>
                <span className="text-[10px] font-mono bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded shrink-0">
                  {comp.grade}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-teal-800 dark:border-charcoal-700 text-[11px] text-teal-300 dark:text-ivory/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p>
              In future phases, contractors scan this badge to view video assessment audits approved by certified assessors.
            </p>
            <span className="font-bold text-amber-300">UnlockED Track 4 Prototype</span>
          </div>
        </div>

      </div>

      {/* 4. Contractor Inspection Architecture Section */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sand-200 dark:bg-charcoal-700 text-teal dark:text-ivory flex items-center justify-center">
            <Building2 className="w-5 h-5 text-terracotta" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-teal dark:text-ivory font-heading">
              Contractor Verification Architecture (Future Vision)
            </h3>
            <p className="text-xs text-greygreen dark:text-ivory/60">
              How the completed SkillSetu ecosystem will empower contractor validation without intermediaries.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-sand-50 dark:bg-charcoal-700/50 border border-beige dark:border-charcoal-600">
            <span className="text-xs font-bold text-teal dark:text-ivory block mb-1">Instant QR Scanning</span>
            <p className="text-xs text-greygreen dark:text-ivory/60 leading-relaxed">
              Site supervisors scan the physical card with any standard smartphone camera to view practical test tasks.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-sand-50 dark:bg-charcoal-700/50 border border-beige dark:border-charcoal-600">
            <span className="text-xs font-bold text-teal dark:text-ivory block mb-1">Assessor Review Audits</span>
            <p className="text-xs text-greygreen dark:text-ivory/60 leading-relaxed">
              Each badge will link to assessor rubric scoring sheets and safety compliance logs.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-sand-50 dark:bg-charcoal-700/50 border border-beige dark:border-charcoal-600">
            <span className="text-xs font-bold text-teal dark:text-ivory block mb-1">Direct Contractor Link</span>
            <p className="text-xs text-greygreen dark:text-ivory/60 leading-relaxed">
              Transparent, direct contact with builders without agency commissions or middleman deductions.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
