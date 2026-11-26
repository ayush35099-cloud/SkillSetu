import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import ThemeSwitcher from '../components/ThemeSwitcher';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Building2,
  HardHat,
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  QrCode,
  FileCheck2,
  Zap,
  Wrench,
  Hammer,
  Building,
  Flame,
  Paintbrush,
  Cog,
  Layers
} from 'lucide-react';

export default function PublicVerify() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchVerification = async () => {
      setLoading(true);
      try {
        const data = await apiService.verifyCredential(token || '');
        if (isMounted) {
          setResult(data);
        }
      } catch (err) {
        console.error('Public credential verification failed:', err);
        if (isMounted) {
          setResult({
            status: 'invalid',
            valid: false,
            message: 'Unable to reach verification registry service.'
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (token) {
      fetchVerification();
    } else {
      setResult({ status: 'invalid', valid: false, message: 'No verification token provided.' });
      setLoading(false);
    }

    return () => { isMounted = false; };
  }, [token]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getTradeIcon = (trade) => {
    switch (trade?.toLowerCase()) {
      case 'electrician': return Zap;
      case 'plumber': return Wrench;
      case 'mason': return Building;
      case 'carpenter': return Hammer;
      case 'welder': return Flame;
      case 'painter': return Paintbrush;
      case 'mechanic': return Cog;
      default: return Layers;
    }
  };

  const cred = result?.credential;
  const isValid = result?.valid && result?.status === 'valid';
  const isRevoked = result?.status === 'revoked';
  const isInvalid = !loading && (!result || result?.status === 'invalid' || !cred);

  const TradeIcon = getTradeIcon(cred?.trade);

  return (
    <div className="min-h-screen bg-ivory dark:bg-charcoal-900 text-teal dark:text-ivory font-body selection:bg-terracotta/20 selection:text-terracotta-800 transition-colors">
      
      {/* Top Simple Header */}
      <header className="border-b border-beige dark:border-charcoal-700 bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-teal dark:bg-charcoal-700 text-white flex items-center justify-center shadow-xs">
              <HardHat className="w-5 h-5 text-terracotta-200" />
            </div>
            <div>
              <span className="font-heading font-black text-lg text-teal dark:text-ivory">
                Skill<span className="text-terracotta">Setu</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-greygreen dark:text-ivory/60 ml-2">
                Verification Hub
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeSwitcher compact={true} />
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal dark:text-ivory hover:text-terracotta px-3 py-1.5 rounded-xl border border-beige dark:border-charcoal-700 bg-white dark:bg-charcoal-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Verification Card Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 animate-fadeIn">
        
        {loading ? (
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-10 border border-beige dark:border-charcoal-700 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-teal border-t-transparent animate-spin mx-auto" />
            <h2 className="text-xl font-bold font-heading text-teal dark:text-ivory">
              Querying SkillSetu Registry...
            </h2>
            <p className="text-xs text-greygreen dark:text-ivory/60">
              Validating cryptographic token against live PostgreSQL credential records.
            </p>
          </div>
        ) : isInvalid ? (
          /* ================================================================= */
          /* 1. INVALID CREDENTIAL STATE                                       */
          /* ================================================================= */
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-8 sm:p-12 border-2 border-rose-300 dark:border-rose-900 shadow-lg text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <XCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-bold border border-rose-300 dark:border-rose-800">
                Invalid / Unrecognized Token
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-teal dark:text-ivory font-heading">
                Credential Verification Failed
              </h1>
              <p className="text-sm text-greygreen dark:text-ivory/70 max-w-md mx-auto leading-relaxed">
                This verification URL does not match any active or historical credential issued by SkillSetu. The token may be invalid, tampered with, or expired.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sand-50 dark:bg-charcoal-700/50 border border-beige dark:border-charcoal-600 text-left font-mono text-xs text-greygreen dark:text-ivory/60 break-all">
              <strong>Query Token:</strong> {token}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal dark:bg-charcoal-700 hover:bg-teal-800 text-white font-bold text-xs transition-colors"
              >
                Go to SkillSetu Home
              </Link>
            </div>
          </div>
        ) : isRevoked ? (
          /* ================================================================= */
          /* 2. REVOKED CREDENTIAL STATE                                       */
          /* ================================================================= */
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-8 sm:p-12 border-2 border-amber-400 dark:border-amber-700 shadow-lg space-y-6">
            <div className="text-center space-y-3 pb-6 border-b border-beige dark:border-charcoal-700">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-black uppercase tracking-wider border border-rose-300 dark:border-rose-700">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>Credential Revoked</span>
              </span>

              <h1 className="text-2xl sm:text-3xl font-black text-teal dark:text-ivory font-heading">
                This Skill Passport is No Longer Active
              </h1>

              <p className="text-sm text-greygreen dark:text-ivory/70 max-w-md mx-auto">
                The platform administration has revoked this credential from the active verification registry.
              </p>
            </div>

            {/* Revocation Reason Card */}
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 text-xs space-y-1">
              <strong className="block text-sm font-bold">Administrative Revocation Notice:</strong>
              <p className="italic">"{cred.revocation_reason || 'Administrative policy review.'}"</p>
            </div>

            {/* Credential Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-sand-50 dark:bg-charcoal-700/50 border border-beige dark:border-charcoal-600 space-y-1">
                <span className="text-[10px] uppercase font-bold text-greygreen dark:text-ivory/50 block">Subject Craftsperson</span>
                <span className="text-sm font-bold text-teal dark:text-ivory block">{cred.worker_name}</span>
                <span className="text-greygreen dark:text-ivory/60 capitalize">{cred.trade} Professional</span>
              </div>

              <div className="p-4 rounded-2xl bg-sand-50 dark:bg-charcoal-700/50 border border-beige dark:border-charcoal-600 space-y-1">
                <span className="text-[10px] uppercase font-bold text-greygreen dark:text-ivory/50 block">Credential Identifier</span>
                <span className="text-sm font-mono font-bold text-teal dark:text-ivory block">{cred.credential_id}</span>
                <span className="text-greygreen dark:text-ivory/60">Issued: {cred.issue_date?.slice(0, 10)}</span>
              </div>
            </div>
          </div>
        ) : (
          /* ================================================================= */
          /* 3. VALID & ACTIVE VERIFIED CREDENTIAL                             */
          /* ================================================================= */
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl border-2 border-emerald-400 dark:border-emerald-600 shadow-xl overflow-hidden">
            
            {/* Top Verification Header Banner */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-teal-800 text-white p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white text-emerald-700 flex items-center justify-center font-black shadow-md shrink-0">
                    <ShieldCheck className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                        Official Verification Result
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                        <span>Active & Valid</span>
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight mt-0.5 !text-white text-white">
                      Verified Practical Competency
                    </h1>
                  </div>
                </div>

                <div className="text-left sm:text-right pt-2 sm:pt-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-200 block">
                    Credential ID
                  </span>
                  <span className="font-mono text-base sm:text-lg font-black text-amber-300">
                    {cred.credential_id}
                  </span>
                </div>
              </div>
            </div>

            {/* Credential Details Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Worker Profile Card */}
              <div className="p-5 rounded-2xl bg-sand-50 dark:bg-charcoal-750 border border-beige dark:border-charcoal-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal dark:bg-charcoal-700 text-white flex items-center justify-center font-heading font-black text-xl shadow-xs">
                    {cred.worker_name ? cred.worker_name[0].toUpperCase() : 'W'}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-greygreen dark:text-ivory/50 block">
                      Candidate Craftsperson
                    </span>
                    <h2 className="text-xl font-bold font-heading text-teal dark:text-ivory">
                      {cred.worker_name}
                    </h2>
                    <p className="text-xs font-bold text-terracotta dark:text-amber-400 capitalize flex items-center gap-1 mt-0.5">
                      <TradeIcon className="w-3.5 h-3.5" />
                      <span>{cred.trade} Professional</span>
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-charcoal-800 border border-beige/80 dark:border-charcoal-600 text-left sm:text-right shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-greygreen dark:text-ivory/50 block">
                    Assessed Skill Tier
                  </span>
                  <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 font-heading block mt-0.5">
                    {cred.skill_level}
                  </span>
                </div>
              </div>

              {/* Assessment Evaluation Breakdown */}
              {cred.assessment_summary && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory font-heading flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-terracotta" />
                    <span>Practical Assessment Audit Record</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">
                        Assessor Score
                      </span>
                      <span className="text-lg font-black text-emerald-900 dark:text-emerald-200 font-heading">
                        {cred.assessment_summary.score} / {cred.assessment_summary.maximum_score}
                      </span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block mt-0.5">
                        {cred.assessment_summary.score_percentage}% Composite
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-sand-50 dark:bg-charcoal-700/50 border border-beige dark:border-charcoal-600">
                      <span className="text-[10px] uppercase font-bold text-greygreen dark:text-ivory/50 block">
                        Evaluation Date
                      </span>
                      <span className="text-sm font-bold text-teal dark:text-ivory block mt-1">
                        {cred.assessment_summary.assessed_at?.slice(0, 10) || cred.issue_date?.slice(0, 10)}
                      </span>
                      <span className="text-[10px] text-greygreen dark:text-ivory/50 block mt-0.5">
                        Standard Rubrics
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-sand-50 dark:bg-charcoal-700/50 border border-beige dark:border-charcoal-600">
                      <span className="text-[10px] uppercase font-bold text-greygreen dark:text-ivory/50 block">
                        Issuing Authority
                      </span>
                      <span className="text-sm font-bold text-teal dark:text-ivory block mt-1">
                        {cred.issuing_authority}
                      </span>
                      <span className="text-[10px] text-greygreen dark:text-ivory/50 block mt-0.5">
                        UnlockED Track 4
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Security & Verification Metadata */}
              <div className="pt-4 border-t border-beige dark:border-charcoal-700 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-teal dark:text-ivory">
                      Cryptographic Verification Token
                    </span>
                    <p className="text-[11px] text-greygreen dark:text-ivory/60 font-mono break-all">
                      {cred.verification_token}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-white dark:bg-charcoal-700 hover:bg-sand-100 dark:hover:bg-charcoal-600 text-teal dark:text-ivory text-xs font-bold transition-all shrink-0 shadow-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-terracotta" />}
                    <span>{copied ? 'Link Copied!' : 'Copy Verification Link'}</span>
                  </button>
                </div>
              </div>

              {/* Legal Attribution Notice */}
              <div className="p-3.5 rounded-2xl bg-teal-50/80 dark:bg-charcoal-700/50 border border-teal-200/60 dark:border-charcoal-600 text-[11px] text-teal-900 dark:text-ivory/80 leading-relaxed">
                <strong>Platform Verification Notice:</strong> This credential confirms that {cred.worker_name} submitted hands-on practical trade demonstrations, graded against 4-step occupational rubrics by an accredited assessor, and approved by the SkillSetu verification authority.
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}
