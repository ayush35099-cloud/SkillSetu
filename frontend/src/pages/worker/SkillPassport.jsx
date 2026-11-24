import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  QrCode, 
  ShieldCheck, 
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
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

export default function SkillPassport() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const [profile] = useState(() => {
    try {
      const saved = localStorage.getItem('skillsetu_worker_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      fullName: 'Ramesh Kumar',
      primaryTrade: 'Electrician',
      location: 'Bengaluru, Karnataka',
      experience: 8
    };
  });

  const verifiedCompetencies = [
    { title: 'Conduit Bending & Installation', standard: 'IS 9537 Standard', grade: 'Grade A - 98%' },
    { title: 'Distribution Board MCB Termination', standard: 'IS 13032 Standard', grade: 'Grade A - 95%' },
    { title: 'Megger Insulation & Continuity Testing', standard: 'IEEE 43 Testing', grade: 'Passed (No Fault)' },
    { title: 'Earthing Resistance Verification (<5Ω)', standard: 'IS 3043 Standard', grade: 'Grade A - 100%' }
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
    // Generate a clean text / json passport card summary for download
    const cardData = `
==============================================
SKILLSETU DIGITAL VOCATIONAL SKILL PASSPORT
==============================================
Worker Name: ${profile.fullName}
Trade ID: SKL-IND-2026-8842
Trade: ${profile.primaryTrade}
Status: Level 2 Practically Verified
Location: ${profile.location}
Issuing Council: SkillSetu Vocational Assessment Council
Verification URL: ${window.location.href}
==============================================
VERIFIED COMPETENCIES:
1. Conduit Bending & Installation (IS 9537)
2. Distribution Board MCB Termination (IS 13032)
3. Megger Insulation & Continuity Testing (IEEE 43)
4. Earthing Resistance Verification (IS 3043)
==============================================
`;
    const blob = new Blob([cardData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillPassport_SKL-IND-2026-8842.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-teal font-heading">
            {t('worker.passport.title', 'Digital Skill Passport')}
          </h2>
          <p className="text-xs sm:text-sm text-greygreen mt-1">
            {t('worker.passport.subtitle', 'Official, portable trade credential recognized by contractors and vocational councils across India.')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-sand-100 text-teal border border-beige text-xs font-bold transition-all shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-terracotta" />}
            <span>{copied ? 'Link Copied!' : t('worker.passport.shareCard', 'Share with Contractor')}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-sand-100 text-teal border border-beige text-xs font-bold transition-all shadow-xs"
          >
            <Printer className="w-4 h-4 text-teal" />
            <span>{t('worker.passport.printCard', 'Print Card')}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{t('worker.passport.downloadCard', 'Download')}</span>
          </button>
        </div>
      </div>

      {/* Laminated Physical-Style Passport Card Container */}
      <div className="relative bg-gradient-to-br from-teal-950 via-teal to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border-2 border-amber-400/40 overflow-hidden">
        
        {/* Decorative background watermark */}
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none select-none text-white">
          <ShieldCheck className="w-96 h-96" />
        </div>

        {/* Card Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-teal-700/80">
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
                  National Skill Card
                </span>
              </div>
              <p className="text-[11px] text-teal-200">
                {t('worker.passport.issuedBy', 'Issued by SkillSetu Vocational Assessment Council')}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 block">
              {t('worker.passport.tradeId', 'Trade ID')}
            </span>
            <span className="font-mono text-base font-bold text-amber-300">
              SKL-IND-2026-8842
            </span>
          </div>
        </div>

        {/* Card Body: Worker Identity & QR Code */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-teal-700/80 items-center">
          
          {/* Worker Profile Snapshot */}
          <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-amber-500/20 border-2 border-amber-300 text-amber-200 flex items-center justify-center font-heading text-3xl font-black shadow-inner">
                RK
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-teal-950 shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold font-heading text-white">
                {profile.fullName}
              </h3>
              <p className="text-sm font-semibold text-amber-300 flex items-center gap-1.5">
                <span>Master Electrician</span>
                <span className="text-teal-400">•</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                  Level 2 Verified
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-teal-200 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-300" />
                  <span>{profile.location}</span>
                </span>
                <span className="text-teal-400">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-300" />
                  <span>8 Years Practical Exp</span>
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Placeholder with Real Visual Representation */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
            {/* SVG Simulated QR Pattern */}
            <div className="w-28 h-28 bg-white p-2 rounded-xl shadow-inner flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-teal-950">
                {/* QR Finder patterns */}
                <rect x="0" y="0" width="30" height="30" fill="currentColor" rx="2" />
                <rect x="5" y="5" width="20" height="20" fill="white" rx="1" />
                <rect x="9" y="9" width="12" height="12" fill="currentColor" />

                <rect x="70" y="0" width="30" height="30" fill="currentColor" rx="2" />
                <rect x="75" y="5" width="20" height="20" fill="white" rx="1" />
                <rect x="79" y="9" width="12" height="12" fill="currentColor" />

                <rect x="0" y="70" width="30" height="30" fill="currentColor" rx="2" />
                <rect x="5" y="75" width="20" height="20" fill="white" rx="1" />
                <rect x="9" y="79" width="12" height="12" fill="currentColor" />

                {/* Random QR data matrix modules */}
                <rect x="36" y="8" width="6" height="6" fill="currentColor" />
                <rect x="46" y="8" width="6" height="6" fill="currentColor" />
                <rect x="56" y="8" width="6" height="6" fill="currentColor" />
                <rect x="36" y="20" width="8" height="6" fill="currentColor" />
                <rect x="50" y="22" width="6" height="6" fill="currentColor" />

                <rect x="8" y="36" width="6" height="8" fill="currentColor" />
                <rect x="22" y="36" width="6" height="6" fill="currentColor" />
                <rect x="8" y="50" width="8" height="6" fill="currentColor" />
                <rect x="20" y="52" width="6" height="6" fill="currentColor" />

                <rect x="36" y="36" width="8" height="8" fill="currentColor" />
                <rect x="50" y="36" width="8" height="8" fill="currentColor" />
                <rect x="64" y="36" width="8" height="8" fill="currentColor" />
                <rect x="36" y="50" width="8" height="8" fill="currentColor" />
                <rect x="50" y="50" width="8" height="8" fill="currentColor" />
                <rect x="64" y="50" width="8" height="8" fill="currentColor" />

                <rect x="36" y="68" width="6" height="8" fill="currentColor" />
                <rect x="48" y="72" width="8" height="6" fill="currentColor" />
                <rect x="60" y="68" width="6" height="8" fill="currentColor" />

                <rect x="74" y="36" width="8" height="6" fill="currentColor" />
                <rect x="86" y="44" width="6" height="8" fill="currentColor" />
                <rect x="74" y="58" width="8" height="6" fill="currentColor" />
                <rect x="86" y="72" width="6" height="8" fill="currentColor" />
              </svg>
            </div>
            <span className="text-[10px] text-teal-200 mt-2 font-mono">
              SKL-IND-2026-8842
            </span>
          </div>

        </div>

        {/* Card Footer: Verified Competencies List */}
        <div className="relative z-10 pt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>{t('worker.passport.verifiedSkillsTitle', 'Verified Trade Competencies')}</span>
            </h4>
            <span className="text-[11px] text-teal-300">
              {t('worker.passport.validThrough', 'Valid Through: 2028 • Lifetime Competency Record')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {verifiedCompetencies.map((comp, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-teal-900/60 border border-teal-700/60 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-medium text-white truncate">{comp.title}</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded shrink-0">
                  {comp.grade}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-teal-800 text-[11px] text-teal-300 flex items-center justify-between">
            <p>
              {t('worker.passport.qrNote', 'Scan QR code to verify authenticity and inspect practical assessment records.')}
            </p>
            <span className="font-bold text-amber-300">UnlockED Verified</span>
          </div>
        </div>

      </div>

      {/* Contractor Verification View Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-beige shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sand-200 text-teal flex items-center justify-center">
            <Building2 className="w-5 h-5 text-terracotta" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-teal font-heading">
              {t('worker.passport.contractorView', 'Contractor Verification View')}
            </h3>
            <p className="text-xs text-greygreen">
              {t('worker.passport.contractorViewDesc', 'Contractors can verify your practical competencies instantly without paperwork.')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-sand-50 border border-beige">
            <span className="text-xs font-bold text-teal block mb-1">Instant QR Scanning</span>
            <p className="text-xs text-greygreen leading-relaxed">
              Site engineers scan your laminated badge with any smartphone camera to inspect passed practical benchmarks.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-sand-50 border border-beige">
            <span className="text-xs font-bold text-teal block mb-1">Tamper-Proof Audit</span>
            <p className="text-xs text-greygreen leading-relaxed">
              Every badge is cryptographically linked to the SkillSetu verification registry with timestamped assessor reviews.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-sand-50 border border-beige">
            <span className="text-xs font-bold text-teal block mb-1">Direct Hiring Link</span>
            <p className="text-xs text-greygreen leading-relaxed">
              Contractors can initiate contact via WhatsApp without intermediary agent deductions.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
