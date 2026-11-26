import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { apiService } from '../../services/api';
import {
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  AlertTriangle,
  ClipboardList,
  Sparkles,
  Zap,
  Wrench,
  Building,
  Hammer,
  Flame,
  Paintbrush,
  Cog,
  Layers,
  RefreshCw,
  FileCheck2,
  ExternalLink
} from 'lucide-react';

export default function AssessorDashboard() {
  const { user, isApproved, isAdmin } = useOutletContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    pending_count: 0,
    under_review_count: 0,
    approved_count: 0,
    rejected_count: 0,
    resubmission_count: 0,
    total_completed: 0,
    my_reviews_count: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getAssessorDashboard();
      if (res.stats) setStats(res.stats);
      if (res.recent_submissions) setRecentSubmissions(res.recent_submissions);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(err.message || 'Unable to connect to the assessor API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-700">
            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>Pending Review</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 text-xs font-bold border border-blue-300 dark:border-blue-700">
            <Eye className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>Under Review</span>
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Approved</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 text-xs font-bold border border-red-300 dark:border-red-700">
            <XCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
            <span>Rejected</span>
          </span>
        );
      case 'resubmission_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-800 dark:text-orange-300 text-xs font-bold border border-orange-300 dark:border-orange-700">
            <RefreshCw className="w-3 h-3 text-orange-600 dark:text-orange-400" />
            <span>Resubmission</span>
          </span>
        );
      default:
        return <span className="text-xs text-greygreen">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Unapproved Assessor Warning Notice */}
      {!isApproved && (
        <div className="p-5 rounded-3xl bg-amber-500/15 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-700 text-teal-950 dark:text-amber-100 text-sm flex items-start gap-4 shadow-sm">
          <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block text-base font-bold text-amber-950 dark:text-amber-200 font-heading">
              Assessor Verification Pending Administrative Approval
            </strong>
            <p className="text-xs sm:text-sm leading-relaxed text-amber-900/90 dark:text-amber-200/80">
              Your assessor account is currently pending verification by the SkillSetu administration team. While your account is in view mode, you can inspect tasks, rubrics, and worker demonstration submissions. To submit final evaluation reviews and assign verified scores, an administrator must approve your account.
            </p>
            {isAdmin && (
              <div className="pt-2">
                <Link
                  to="/assessor/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-teal-950 font-bold text-xs transition-colors shadow-xs"
                >
                  <span>Open Admin Approval Dashboard →</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Key Performance Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Pending Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-greygreen dark:text-ivory/60">
              Pending
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-teal dark:text-ivory font-heading">
              {loading ? '...' : stats.pending_count}
            </span>
            <p className="text-[11px] text-greygreen dark:text-ivory/50 mt-0.5">
              Workers awaiting review
            </p>
          </div>
        </div>

        {/* Under Review Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-greygreen dark:text-ivory/60">
              In Progress
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-teal dark:text-ivory font-heading">
              {loading ? '...' : stats.under_review_count}
            </span>
            <p className="text-[11px] text-greygreen dark:text-ivory/50 mt-0.5">
              Active evaluations
            </p>
          </div>
        </div>

        {/* Approved Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-greygreen dark:text-ivory/60">
              Approved
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-heading">
              {loading ? '...' : stats.approved_count}
            </span>
            <p className="text-[11px] text-greygreen dark:text-ivory/50 mt-0.5">
              Passed benchmarks
            </p>
          </div>
        </div>

        {/* Rejected / Resubmit Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-greygreen dark:text-ivory/60">
              Resubmit / Reject
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-orange-600 dark:text-orange-400 font-heading">
              {loading ? '...' : (stats.resubmission_count + stats.rejected_count)}
            </span>
            <p className="text-[11px] text-greygreen dark:text-ivory/50 mt-0.5">
              Feedback issued
            </p>
          </div>
        </div>

        {/* Total Completed Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-sm flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-greygreen dark:text-ivory/60">
              Total Reviewed
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-teal dark:text-ivory font-heading">
              {loading ? '...' : stats.total_completed}
            </span>
            <p className="text-[11px] text-greygreen dark:text-ivory/50 mt-0.5">
              Completed assessments
            </p>
          </div>
        </div>

      </div>

      {/* 3. Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <Link
          to="/assessor/submissions?status=pending"
          className="p-6 rounded-3xl bg-gradient-to-br from-terracotta to-terracotta-700 text-white shadow-md shadow-terracotta/20 hover:shadow-lg transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold font-heading">
              Pending Submissions Queue
            </h3>
            <p className="text-xs text-white/80 mt-1 leading-relaxed">
              Open the priority review queue to inspect worker evidence against standardized rubrics.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
            <span>Open Queue ({stats.pending_count} pending)</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          to="/assessor/history"
          className="p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-sm hover:border-teal/40 dark:hover:border-teal transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-sand-100 dark:bg-charcoal-700 text-teal dark:text-ivory flex items-center justify-center mb-4">
              <Award className="w-5 h-5 text-terracotta" />
            </div>
            <h3 className="text-lg font-bold font-heading text-teal dark:text-ivory">
              Evaluation Audit Trail
            </h3>
            <p className="text-xs text-greygreen dark:text-ivory/70 mt-1 leading-relaxed">
              View your past decisions, feedback logs, and criterion score breakdowns stored in PostgreSQL.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-teal dark:text-amber-300 group-hover:translate-x-1 transition-transform">
            <span>View History ({stats.my_reviews_count} completed)</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          to="/worker/skills"
          className="p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-sm hover:border-teal/40 dark:hover:border-teal transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-sand-100 dark:bg-charcoal-700 text-teal dark:text-ivory flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold font-heading text-teal dark:text-ivory">
              Submit Demonstration as Worker
            </h3>
            <p className="text-xs text-greygreen dark:text-ivory/70 mt-1 leading-relaxed">
              Switch to the Worker Portal to submit a new practical task demonstration and test the real end-to-end loop.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-teal dark:text-amber-300 group-hover:translate-x-1 transition-transform">
            <span>Worker Portal →</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

      </div>

      {/* 4. Recent Practical Submissions Section */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-beige dark:border-charcoal-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-teal dark:text-ivory font-heading">
              Recent Demonstration Submissions
            </h2>
            <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/60 mt-0.5">
              Live evidence submissions from registered craftspeople across 8 vocational trades
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sand-100 dark:bg-charcoal-700 text-teal dark:text-ivory text-xs font-bold hover:bg-sand-200 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link
              to="/assessor/submissions"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal dark:bg-charcoal-600 text-white text-xs font-bold hover:bg-teal-800 transition-colors"
            >
              <span>View All Submissions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Submissions List / Table */}
        {loading ? (
          <div className="py-12 text-center text-greygreen dark:text-ivory/60 text-sm flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-terracotta" />
            <span>Loading submissions from PostgreSQL database...</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs border border-red-200 dark:border-red-800">
            {error}
          </div>
        ) : recentSubmissions.length === 0 ? (
          <div className="py-12 text-center text-greygreen dark:text-ivory/60 text-sm space-y-2">
            <FileCheck2 className="w-8 h-8 text-greygreen mx-auto opacity-50" />
            <p className="font-bold">No submissions waiting in the queue.</p>
            <p className="text-xs">Submit a task demonstration from the Worker Portal to test the review workflow.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentSubmissions.map((sub) => {
              const Icon = getTradeIcon(sub.trade || sub.worker_trade);
              return (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl bg-sand-50/50 dark:bg-charcoal-700/40 border border-beige dark:border-charcoal-600 flex flex-col justify-between hover:border-terracotta/40 transition-all space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-teal dark:bg-charcoal-800 text-white flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-terracotta-200" />
                        </div>
                        <div>
                          <h4 className="font-bold text-teal dark:text-ivory text-sm leading-tight">
                            {sub.worker_name}
                          </h4>
                          <span className="text-[11px] text-greygreen dark:text-ivory/60 font-medium">
                            {sub.worker_experience ? `${sub.worker_experience} yrs exp • ` : ''}
                            {sub.worker_location || 'India'}
                          </span>
                        </div>
                      </div>

                      {getStatusBadge(sub.status)}
                    </div>

                    <div>
                      <p className="text-xs font-bold text-teal-950 dark:text-ivory line-clamp-2">
                        {sub.task_title || 'Vocational Demonstration Task'}
                      </p>
                      {sub.submission_notes && (
                        <p className="text-[11px] text-greygreen dark:text-ivory/70 mt-1 line-clamp-2 italic">
                          "{sub.submission_notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-beige/60 dark:border-charcoal-600 flex items-center justify-between">
                    <span className="text-[10px] text-greygreen dark:text-ivory/50">
                      {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : 'Recent'}
                    </span>

                    <Link
                      to={`/assessor/review/${sub.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-terracotta hover:text-terracotta-700 dark:text-amber-400 dark:hover:text-amber-300"
                    >
                      <span>{sub.status === 'approved' || sub.status === 'rejected' ? 'View Evaluation' : 'Evaluate Work'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
