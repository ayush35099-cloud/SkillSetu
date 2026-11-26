import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRegion } from '../../context/RegionContext';
import { 
  getWorkerProfile, 
  calculateProfileCompletion, 
  getAssessmentStats 
} from '../../services/demoWorkerService';
import { apiService } from '../../services/api';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  QrCode, 
  ShieldCheck, 
  Zap, 
  Wrench, 
  Hammer, 
  Building, 
  Flame, 
  Paintbrush, 
  Cog, 
  Layers, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function WorkerDashboard() {
  const { t } = useLanguage();
  const { currentRegionMeta, setShowRegionModal } = useRegion();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(() => getWorkerProfile());
  const [completion, setCompletion] = useState(() => calculateProfileCompletion(profile));
  const [stats, setStats] = useState(() => getAssessmentStats(profile));
  const [liveAssessments, setLiveAssessments] = useState([]);
  const [loadingAssessments, setLoadingAssessments] = useState(true);

  useEffect(() => {
    let isMounted = true;
    apiService.getWorkerAssessments(101)
      .then(data => {
        if (isMounted && data && Array.isArray(data.submissions)) {
          setLiveAssessments(data.submissions);
        }
      })
      .catch(err => {
        console.warn('Backend live assessments unreachable, falling back:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingAssessments(false);
      });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      const p = getWorkerProfile();
      setProfile(p);
      setCompletion(calculateProfileCompletion(p));
      setStats(getAssessmentStats(p));
    };

    window.addEventListener('profile-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('profile-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const trades = [
    {
      id: 'electrician',
      icon: Zap,
      name: t('professions.electrician.name', 'Electrician'),
      nativeName: t('professions.electrician.nativeName', 'Electrician / विद्युत कर्मी'),
      status: profile.tradeAssessments?.electrician?.status || 'under_review',
      level: 'Sample: Under Review',
    },
    {
      id: 'plumber',
      icon: Wrench,
      name: t('professions.plumber.name', 'Plumber'),
      nativeName: t('professions.plumber.nativeName', 'Plumber / प्लंबर'),
      status: profile.tradeAssessments?.plumber?.status || 'not_submitted',
      level: 'Ready for Test',
    },
    {
      id: 'mason',
      icon: Building,
      name: t('professions.mason.name', 'Mason'),
      nativeName: t('professions.mason.nativeName', 'Mason / राजमिस्त्री'),
      status: profile.tradeAssessments?.mason?.status || 'not_submitted',
      level: 'Ready for Test',
    },
    {
      id: 'carpenter',
      icon: Hammer,
      name: t('professions.carpenter.name', 'Carpenter'),
      nativeName: t('professions.carpenter.nativeName', 'Carpenter / बढ़ई'),
      status: profile.tradeAssessments?.carpenter?.status || 'not_submitted',
      level: 'Ready for Test',
    },
    {
      id: 'welder',
      icon: Flame,
      name: t('professions.welder.name', 'Welder'),
      nativeName: t('professions.welder.nativeName', 'Welder / वेल्डर'),
      status: profile.tradeAssessments?.welder?.status || 'not_submitted',
      level: 'Ready for Test',
    },
    {
      id: 'painter',
      icon: Paintbrush,
      name: t('professions.painter.name', 'Painter'),
      nativeName: t('professions.painter.nativeName', 'Painter / पेंटर'),
      status: profile.tradeAssessments?.painter?.status || 'not_submitted',
      level: 'Ready for Test',
    },
    {
      id: 'mechanic',
      icon: Cog,
      name: t('professions.mechanic.name', 'Mechanic'),
      nativeName: t('professions.mechanic.nativeName', 'Mechanic / मैकेनिक'),
      status: profile.tradeAssessments?.mechanic?.status || 'not_submitted',
      level: 'Ready for Test',
    },
    {
      id: 'other',
      icon: Layers,
      name: t('professions.other.name', 'Other Trades'),
      nativeName: t('professions.other.nativeName', 'Other Trades / अन्य हुनर'),
      status: profile.tradeAssessments?.other?.status || 'not_submitted',
      level: 'Ready for Test',
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Welcome & Dynamic Profile Completion Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome Section */}
        <div className="lg:col-span-2 bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-100 dark:bg-charcoal-700 text-teal dark:text-ivory text-xs font-bold border border-beige dark:border-charcoal-600">
                <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                <span>Track 4 – Localized Vocational Skill Verification</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-700">
                <span>Demo Evaluation Mode</span>
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-teal dark:text-ivory font-heading">
              {t('worker.dashboard.welcome', 'Welcome back, {name}').replace('{name}', profile.fullName || 'Ramesh Kumar')}
            </h2>
            
            <p className="text-sm text-greygreen dark:text-ivory/70 mt-2 leading-relaxed max-w-2xl">
              {t('worker.dashboard.subWelcome', 'Manage your practical trade credentials, track assessment milestones, and connect directly with local contractors.')}
            </p>
          </div>

          {/* Honest Dynamic Status Counters */}
          <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-beige/60 dark:border-charcoal-700">
            <div className="bg-amber-50/80 dark:bg-amber-950/30 rounded-2xl p-3 border border-amber-200/80 dark:border-amber-800/40">
              <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 text-xs font-bold">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{stats.underReviewCount}</span>
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium mt-1">
                Under Review
              </p>
            </div>

            <div className="bg-sand-50 dark:bg-charcoal-700/60 rounded-2xl p-3 border border-beige dark:border-charcoal-600">
              <div className="flex items-center gap-1.5 text-teal dark:text-ivory text-xs font-bold">
                <FileCheck2 className="w-4 h-4 text-teal dark:text-teal-300" />
                <span>{stats.notSubmittedCount}</span>
              </div>
              <p className="text-[11px] text-greygreen dark:text-ivory/60 font-medium mt-1">
                Not Submitted
              </p>
            </div>

            <div className="bg-teal-50/80 dark:bg-charcoal-700 rounded-2xl p-3 border border-teal-200/80 dark:border-charcoal-600">
              <div className="flex items-center gap-1.5 text-teal dark:text-ivory text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{stats.demoVerifiedCount}</span>
              </div>
              <p className="text-[11px] text-teal-700 dark:text-ivory/60 font-medium mt-1">
                Verified (Official)
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Profile Completion Indicator */}
        <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-teal dark:text-ivory font-heading">
                {t('worker.dashboard.completionTitle', 'Profile Completion')}
              </h3>
              <span className="text-lg font-black text-terracotta dark:text-amber-300 font-heading">
                {completion.percentage}%
              </span>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="w-full bg-sand-200 dark:bg-charcoal-700 rounded-full h-3 overflow-hidden mb-4">
              <div 
                className="bg-gradient-to-r from-amber-500 to-terracotta h-3 rounded-full transition-all duration-700 ease-out" 
                style={{ width: `${completion.percentage}%` }} 
              />
            </div>

            <p className="text-xs text-greygreen dark:text-ivory/60 leading-relaxed">
              Calculated dynamically from populated profile sections.
            </p>

            {/* Dynamic Checklist */}
            <ul className="space-y-2 mt-4 text-xs font-medium text-teal-800 dark:text-ivory/80">
              {completion.checklist.map((item) => (
                <li key={item.key} className="flex items-center gap-2">
                  {item.isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-dashed border-greygreen/50 dark:border-ivory/30 shrink-0" />
                  )}
                  <span className={item.isDone ? '' : 'text-greygreen dark:text-ivory/50'}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            to="/worker/profile"
            className="mt-5 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-sand-100 dark:bg-charcoal-700 hover:bg-sand-200 dark:hover:bg-charcoal-600 text-teal dark:text-ivory font-bold text-xs transition-colors"
          >
            <span>Update Profile Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* 2. Digital Skill Passport Prototype Preview Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-900 via-teal to-teal-800 dark:from-charcoal-950 dark:via-charcoal-900 dark:to-charcoal-950 rounded-3xl p-6 sm:p-8 text-white shadow-md border border-teal-700 dark:border-charcoal-700">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-4 rounded-2xl bg-white/10 dark:bg-charcoal-800 backdrop-blur-md border border-white/20 dark:border-charcoal-600 shrink-0">
              <QrCode className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  {t('worker.dashboard.passportPreview', 'Digital Skill Passport Preview')}
                </span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/40">
                  Demo Preview Only
                </span>
              </div>
              <h3 className="text-xl font-bold font-heading text-white mt-0.5">
                Sample ID: DEMO-IND-2026-8842
              </h3>
              <p className="text-xs text-teal-200 dark:text-ivory/70 mt-1 max-w-xl">
                Prototype preview of a localized physical card format. Not an official government license.
              </p>
            </div>
          </div>

          <Link
            to="/worker/passport"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-teal-950 font-bold text-xs sm:text-sm shadow-md transition-all whitespace-nowrap active:scale-95"
          >
            <span>View Full Passport Preview</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 2.5 Live Practical Skill Evaluations (PostgreSQL Verified Records) */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-beige dark:border-charcoal-700">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal dark:text-emerald-400" />
              <h3 className="text-xl font-bold text-teal dark:text-ivory font-heading">
                Practical Skill Evaluations
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700">
                PostgreSQL Live Engine
              </span>
            </div>
            <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/60 mt-1">
              Field evaluations reviewed against standardized rubrics by accredited vocational assessors.
            </p>
          </div>

          <Link
            to="/worker/skills"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal dark:bg-charcoal-700 text-white hover:bg-teal-800 text-xs font-bold transition-all shadow-xs shrink-0"
          >
            <span>Submit New Demonstration</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingAssessments ? (
          <div className="py-8 text-center text-xs text-greygreen dark:text-ivory/60 animate-pulse">
            Connecting to PostgreSQL evaluation engine...
          </div>
        ) : liveAssessments.length > 0 ? (
          <div className="space-y-4">
            {liveAssessments.map((sub) => {
              const review = sub.review;
              const isApproved = sub.status === 'approved';
              const isRejected = sub.status === 'rejected';
              const isResubmit = sub.status === 'resubmission_requested';

              return (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl border border-beige dark:border-charcoal-700 bg-sand-50/50 dark:bg-charcoal-750/50 hover:bg-white dark:hover:bg-charcoal-700/70 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-terracotta dark:text-amber-400">
                        {sub.task?.trade || 'Skill Demonstration'}
                      </span>
                      <span className="text-xs text-greygreen dark:text-ivory/40">•</span>
                      <span className="text-xs text-greygreen dark:text-ivory/70">
                        Task #{sub.task_id}
                      </span>
                      
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Approved & Verified</span>
                        </span>
                      )}
                      {isResubmit && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                          <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>Resubmission Requested</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-300 dark:border-rose-700">
                          <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                          <span>Needs Revision</span>
                        </span>
                      )}
                      {!isApproved && !isResubmit && !isRejected && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-300 dark:border-blue-700">
                          <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          <span>Under Assessor Review</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-teal dark:text-ivory font-heading">
                      {sub.task?.title || 'Demonstration Submission'}
                    </h4>

                    {review && (
                      <div className="mt-2 p-3 rounded-xl bg-white dark:bg-charcoal-800 border border-beige/80 dark:border-charcoal-600 space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-teal dark:text-ivory">
                          <span>Assessor Score:</span>
                          <span className={review.total_score >= 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                            {review.total_score} / {review.max_score} ({Math.round((review.total_score / (review.max_score || 100)) * 100)}%)
                          </span>
                        </div>
                        {review.overall_feedback && (
                          <p className="text-xs text-greygreen dark:text-ivory/80 italic">
                            "{review.overall_feedback}"
                          </p>
                        )}
                        <p className="text-[10px] text-greygreen dark:text-ivory/50">
                          Evaluated by {review.assessor_name || 'Accredited Assessor'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col items-center justify-end gap-2 shrink-0">
                    {isResubmit ? (
                      <Link
                        to="/worker/skills"
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-teal-950 font-bold text-xs transition-colors text-center"
                      >
                        Resubmit Proof
                      </Link>
                    ) : (
                      <Link
                        to="/worker/skills"
                        className="px-4 py-2 rounded-xl bg-sand-200 dark:bg-charcoal-700 hover:bg-sand-300 text-teal dark:text-ivory font-bold text-xs transition-colors text-center"
                      >
                        View Rubric Details
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 px-4 rounded-2xl bg-sand-50/60 dark:bg-charcoal-750/40 border border-beige dark:border-charcoal-700">
            <Info className="w-8 h-8 text-greygreen dark:text-ivory/40 mx-auto mb-2" />
            <p className="text-sm font-semibold text-teal dark:text-ivory">
              No live submissions recorded yet in PostgreSQL
            </p>
            <p className="text-xs text-greygreen dark:text-ivory/60 mt-1 max-w-md mx-auto">
              Select one of the 8 vocational trades to submit your practical video or image demonstration for accredited assessor review.
            </p>
            <Link
              to="/worker/skills"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs transition-colors shadow-xs"
            >
              <span>Explore Assessment Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* 3. Vocational Skill Categories (8 Trades Grid) */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-xl font-bold text-teal dark:text-ivory font-heading">
              {t('worker.dashboard.allCategories', 'Vocational Skill Categories')}
            </h3>
            <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/60 mt-1">
              {t('worker.dashboard.allCategoriesSub', 'Explore certified competencies, tool proficiencies, and practical assessment tasks across 8 core trades.')}
            </p>
          </div>
          
          <Link
            to="/worker/skills"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta dark:text-amber-300 hover:underline shrink-0"
          >
            <span>All 8 Trade Benchmarks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trades.map((trade) => {
            const Icon = trade.icon;
            return (
              <div
                key={trade.id}
                onClick={() => navigate('/worker/skills')}
                className="cursor-pointer group p-4 rounded-2xl border border-beige dark:border-charcoal-700 hover:border-terracotta/40 dark:hover:border-amber-400/40 bg-sand-50/50 dark:bg-charcoal-800/80 hover:bg-white dark:hover:bg-charcoal-700/80 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-teal dark:bg-charcoal-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform border border-teal-700 dark:border-charcoal-600">
                      <Icon className="w-5 h-5 text-terracotta-200" />
                    </div>
                    {trade.status === 'under_review' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                        <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>Under Review</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-sand-200/60 dark:bg-charcoal-700 text-greygreen dark:text-ivory/60 px-2 py-0.5 rounded-full">
                        <span>Not Submitted</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-teal dark:text-ivory font-heading group-hover:text-terracotta dark:group-hover:text-amber-300 transition-colors">
                    {trade.name}
                  </h4>
                  <p className="text-[11px] text-greygreen dark:text-ivory/60 mt-0.5">
                    {trade.nativeName}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-beige/60 dark:border-charcoal-700 flex items-center justify-between text-[11px] text-teal-700 dark:text-ivory/70 font-semibold">
                  <span>{trade.level}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-greygreen dark:text-ivory/50 group-hover:text-terracotta group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Simulated Audit Activity & Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Simulated Activity Feed */}
        <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-terracotta dark:text-amber-300" />
              <h3 className="text-lg font-bold text-teal dark:text-ivory font-heading">
                {t('worker.dashboard.recentActivity', 'Simulated Activity Feed')}
              </h3>
            </div>
            <span className="text-[10px] text-greygreen dark:text-ivory/50 uppercase font-mono">Prototype Log</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-teal-900 dark:text-ivory leading-snug">
                  Practical Task Submission recorded for Conduit Wiring & MCB Sizing
                </p>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium mt-1 block">
                  Simulated Record • Under Review
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-sand-50 dark:bg-charcoal-700/50 border border-beige/80 dark:border-charcoal-700">
              <div className="p-2 rounded-xl bg-sand-200 dark:bg-charcoal-600 text-teal dark:text-ivory shrink-0 mt-0.5">
                <FileCheck2 className="w-4 h-4 text-terracotta dark:text-amber-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-teal-900 dark:text-ivory leading-snug">
                  Worker Profile details updated for {currentRegionMeta.name} hub
                </p>
                <span className="text-[10px] text-greygreen dark:text-ivory/60 font-medium mt-1 block">
                  Local Storage Synchronized
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Next Steps */}
        <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm transition-colors">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-teal dark:text-ivory font-heading">
              {t('worker.dashboard.recommendedSteps', 'Recommended Next Steps')}
            </h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-beige dark:border-charcoal-700 bg-sand-50/50 dark:bg-charcoal-700/50 hover:bg-white dark:hover:bg-charcoal-700 transition-all flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-teal dark:text-ivory font-heading">
                  1. Review 4-Step Practical Assessment Rubrics
                </h4>
                <p className="text-[11px] text-greygreen dark:text-ivory/60 mt-1">
                  Inspect task guidelines, tool lists, and safety criteria for your trade craft.
                </p>
              </div>
              <Link
                to="/worker/skills"
                className="shrink-0 px-3 py-1.5 rounded-lg bg-teal dark:bg-charcoal-600 text-white text-[11px] font-bold hover:bg-teal-800 transition-colors"
              >
                Inspect Tasks
              </Link>
            </div>

            <div className="p-4 rounded-2xl border border-beige dark:border-charcoal-700 bg-sand-50/50 dark:bg-charcoal-700/50 hover:bg-white dark:hover:bg-charcoal-700 transition-all flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-teal dark:text-ivory font-heading">
                  2. Preview Laminated Digital Skill Passport
                </h4>
                <p className="text-[11px] text-greygreen dark:text-ivory/60 mt-1">
                  Inspect the physical credential format designed for field inspection by contractors.
                </p>
              </div>
              <Link
                to="/worker/passport"
                className="shrink-0 px-3 py-1.5 rounded-lg bg-terracotta text-white text-[11px] font-bold hover:bg-terracotta-600 transition-colors"
              >
                Preview Passport
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
