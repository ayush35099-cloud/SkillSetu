import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { useLanguage } from '../../context/LanguageContext';
import { useRegion } from '../../context/RegionContext';
import { getWorkerProfile } from '../../services/demoWorkerService';
import { apiService } from '../../services/api';
import { 
  QrCode, 
  ShieldCheck, 
  ShieldAlert, 
  Download, 
  Share2, 
  Printer, 
  CheckCircle2, 
  HardHat, 
  Calendar, 
  MapPin, 
  Award, 
  AlertTriangle, 
  Copy, 
  Check, 
  Clock, 
  ArrowRight,
  ExternalLink,
  UserCheck,
  Zap,
  Wrench,
  Hammer,
  Building,
  Flame,
  Paintbrush,
  Cog,
  Layers,
  Sparkles
} from 'lucide-react';

export default function SkillPassport() {
  const { t } = useLanguage();
  const { currentRegionMeta } = useRegion();
  const [profile] = useState(() => getWorkerProfile());

  // Active worker ID state: defaults to 101 (Ramesh Kumar), switchable to 104 (Kavita Devi - Verified Demo)
  const [selectedWorkerId, setSelectedWorkerId] = useState(101);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchCredentials = async (wId) => {
    setLoading(true);
    try {
      const res = await apiService.getWorkerCredentials(wId);
      if (res.credentials) {
        setCredentials(res.credentials);
      } else {
        setCredentials([]);
      }
    } catch (err) {
      console.warn('Failed to load credentials:', err);
      setCredentials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials(selectedWorkerId);
  }, [selectedWorkerId]);

  const activeCred = credentials.find(c => c.status === 'active') || (credentials.length > 0 ? credentials[0] : null);

  const verificationUrl = activeCred 
    ? activeCred.verification_url || `https://ayush35099-cloud.github.io/SkillSetu/verify/${activeCred.verification_token}`
    : '';

  const handleCopyLink = () => {
    if (!verificationUrl) return;
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById('passport-qr-canvas');
    if (canvas && activeCred) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `SkillSetu_QR_${activeCred.credential_id}.png`;
      a.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* 1. Worker Mode Switcher Banner (For Evaluator Convenience) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-terracotta" />
          <span className="text-xs font-bold text-teal dark:text-ivory">
            Digital Credential Verification View:
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedWorkerId(101)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedWorkerId === 101
                ? 'bg-teal dark:bg-charcoal-600 text-white shadow-xs'
                : 'bg-sand-100 dark:bg-charcoal-700 text-teal dark:text-ivory hover:bg-sand-200'
            }`}
          >
            Worker #101 (Ramesh Kumar)
          </button>

          <button
            type="button"
            onClick={() => setSelectedWorkerId(104)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedWorkerId === 104
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-sand-100 dark:bg-charcoal-700 text-teal dark:text-ivory hover:bg-sand-200'
            }`}
          >
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Worker #104 (Kavita Devi – Verified)</span>
            </span>
          </button>
        </div>
      </div>

      {/* 2. Top Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-teal dark:text-ivory font-heading">
              Digital Skill Passport
            </h2>
            {activeCred && (
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                activeCred.status === 'active'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700'
              }`}>
                {activeCred.status === 'active' ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Verified Active</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                    <span>Revoked</span>
                  </>
                )}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/60 mt-1">
            Standardized, verifiable digital credential format equipped with dynamic QR camera verification.
          </p>
        </div>

        {activeCred && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-charcoal-800 hover:bg-sand-100 dark:hover:bg-charcoal-700 text-teal dark:text-ivory border border-beige dark:border-charcoal-600 text-xs font-bold transition-all shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-terracotta" />}
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-charcoal-800 hover:bg-sand-100 dark:hover:bg-charcoal-700 text-teal dark:text-ivory border border-beige dark:border-charcoal-600 text-xs font-bold transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-teal dark:text-ivory" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadQR}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download QR</span>
            </button>

            <Link
              to={`/verify/${activeCred.verification_token}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal dark:bg-charcoal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              <span>Inspect Public Verification</span>
            </Link>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-greygreen dark:text-ivory/60">
            Fetching verified credentials from PostgreSQL...
          </p>
        </div>
      ) : activeCred ? (
        /* =================================================================== */
        /* A. VERIFIED ACTIVE CREDENTIAL CARD WITH WORKING QR                   */
        /* =================================================================== */
        <div className="relative bg-gradient-to-br from-teal-950 via-teal-900 to-teal dark:from-charcoal-950 dark:via-charcoal-900 dark:to-charcoal-800 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border-2 border-emerald-400/50 overflow-hidden">
          
          {/* Official Verification Watermark Badge */}
          <div className="absolute top-4 right-4 z-20">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500 text-white font-black text-[10px] tracking-wider uppercase border border-emerald-400 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>VERIFIED DIGITAL PASSPORT</span>
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
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded border border-white/30">
                    Track 4 – UnlockED
                  </span>
                </div>
                <p className="text-[11px] text-teal-200 dark:text-ivory/70">
                  {activeCred.issuing_authority}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right pt-4 sm:pt-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 dark:text-ivory/60 block">
                Credential Identifier
              </span>
              <span className="font-mono text-base font-black text-amber-300">
                {activeCred.credential_id}
              </span>
            </div>
          </div>

          {/* Card Body: Worker Identity + Real Dynamic QR Code */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-teal-700/80 dark:border-charcoal-700 items-center">
            
            {/* Worker Profile Snapshot */}
            <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-24 h-24 rounded-2xl bg-amber-400/20 border-2 border-amber-300 text-amber-200 flex items-center justify-center font-heading text-3xl font-black shadow-inner shrink-0">
                {activeCred.worker_name ? activeCred.worker_name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'W'}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-300 block">
                  Certified Craftsman
                </span>
                <h3 className="text-2xl font-black font-heading text-white">
                  {activeCred.worker_name}
                </h3>
                <p className="text-sm font-semibold text-emerald-300 flex items-center gap-1.5 capitalize">
                  <span>{activeCred.trade} Professional</span>
                  <span className="text-teal-400">•</span>
                  <span className="text-xs bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded border border-emerald-400/40">
                    {activeCred.skill_level}
                  </span>
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-teal-200 dark:text-ivory/70 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-300" />
                    <span>Issued: {activeCred.issue_date?.slice(0, 10)}</span>
                  </span>
                  <span className="text-teal-400">•</span>
                  <span>Issued by: {activeCred.issuer_name || 'SkillSetu Admin'}</span>
                </div>
              </div>
            </div>

            {/* REAL FUNCTIONAL QR CODE */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 dark:bg-charcoal-800/80 backdrop-blur-md border border-white/20 dark:border-charcoal-600 text-center">
              <div className="relative bg-white p-2.5 rounded-2xl shadow-md flex items-center justify-center">
                <QRCodeCanvas
                  id="passport-qr-canvas"
                  value={verificationUrl}
                  size={120}
                  level="M"
                  includeMargin={false}
                />
              </div>

              <div className="mt-2.5 space-y-0.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan to Verify Live</span>
                </span>
                <p className="text-[10px] text-ivory/60">
                  Works on iOS & Android cameras
                </p>
              </div>
            </div>

          </div>

          {/* Card Footer: Assessment Audit Proof */}
          <div className="relative z-10 pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>Verified Vocational Practical Benchmarks</span>
              </h4>
              {activeCred.assessment_summary && (
                <span className="text-xs font-bold text-emerald-300 font-mono">
                  Assessor Score: {activeCred.assessment_summary.score} / {activeCred.assessment_summary.maximum_score} ({activeCred.assessment_summary.score_percentage}%)
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-teal-900/60 dark:bg-charcoal-800/80 border border-teal-700/60 dark:border-charcoal-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-white block">Official Verification URL</span>
                <span className="text-[11px] text-teal-200 dark:text-ivory/70 font-mono break-all block">
                  {verificationUrl}
                </span>
              </div>

              <Link
                to={`/verify/${activeCred.verification_token}`}
                className="shrink-0 px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-teal-950 font-bold text-xs transition-colors flex items-center gap-1"
              >
                <span>Open Verification Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      ) : (
        /* =================================================================== */
        /* B. HONEST UNAPPROVED WORKER NOTICE (NO FAKE CREDENTIAL)             */
        /* =================================================================== */
        <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-8 sm:p-12 border-2 border-amber-300 dark:border-amber-700 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-700">
              Assessment & Approval Pending
            </span>
            <h3 className="text-2xl font-black font-heading text-teal dark:text-ivory">
              Your Skill Passport Will Be Issued After Assessment Approval
            </h3>
            <p className="text-sm text-greygreen dark:text-ivory/70 max-w-lg mx-auto leading-relaxed">
              SkillSetu does not generate unverified placeholder credentials. Your portable QR-verifiable Skill Passport is granted only after an accredited assessor evaluates your practical trade demonstration and the administration issues the official credential.
            </p>
          </div>

          {/* 3-Step Verification Pathway */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-sand-50 dark:bg-charcoal-700/50 border border-beige dark:border-charcoal-600">
              <span className="w-6 h-6 rounded-full bg-teal text-white flex items-center justify-center font-bold text-xs mb-2">1</span>
              <h4 className="text-xs font-bold text-teal dark:text-ivory">Submit Practical Evidence</h4>
              <p className="text-[11px] text-greygreen dark:text-ivory/60 mt-1">Upload video or photo demonstration for your trade.</p>
            </div>

            <div className="p-4 rounded-2xl bg-sand-50 dark:bg-charcoal-700/50 border border-beige dark:border-charcoal-600">
              <span className="w-6 h-6 rounded-full bg-teal text-white flex items-center justify-center font-bold text-xs mb-2">2</span>
              <h4 className="text-xs font-bold text-teal dark:text-ivory">Assessor Rubric Scoring</h4>
              <p className="text-[11px] text-greygreen dark:text-ivory/60 mt-1">Accredited master evaluator grades technique & safety.</p>
            </div>

            <div className="p-4 rounded-2xl bg-sand-50 dark:bg-charcoal-700/50 border border-beige dark:border-charcoal-600">
              <span className="w-6 h-6 rounded-full bg-teal text-white flex items-center justify-center font-bold text-xs mb-2">3</span>
              <h4 className="text-xs font-bold text-teal dark:text-ivory">Admin Approval & QR</h4>
              <p className="text-[11px] text-greygreen dark:text-ivory/60 mt-1">Platform administration issues cryptographic QR passport.</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/worker/skills"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-sm transition-all"
            >
              <span>Submit Practical Demonstration</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => setSelectedWorkerId(104)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sand-200 dark:bg-charcoal-700 hover:bg-sand-300 text-teal dark:text-ivory font-bold text-xs transition-colors"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Preview Approved Passport (Worker #104)</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Contractor Inspection Architecture Info Card */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm space-y-3 transition-colors">
        <h4 className="text-base font-bold text-teal dark:text-ivory font-heading flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>How Contractors Inspect Your Skill Passport</span>
        </h4>
        <p className="text-xs text-greygreen dark:text-ivory/70 leading-relaxed">
          On construction and maintenance sites, contractors, builders, and supervisors scan your QR code directly with any smartphone camera. This opens your live, tamper-proof verification page at <code>/verify/:token</code>, confirming your assessed skill tier, evaluated rubric score, and verified trade craftsmanship without exposing sensitive private contact information.
        </p>
      </div>

    </div>
  );
}
