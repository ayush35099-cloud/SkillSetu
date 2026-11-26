import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import {
  History,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Award,
  ArrowRight,
  Calendar,
  User,
  Zap,
  Wrench,
  Building,
  Hammer,
  Flame,
  Paintbrush,
  Cog,
  Layers
} from 'lucide-react';

export default function AssessorHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getAssessorHistory();
      if (res.history) setHistory(res.history);
    } catch (err) {
      console.error('Failed to load history:', err);
      setError(err.message || 'Unable to connect to evaluation history API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getDecisionBadge = (decision) => {
    switch (decision) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Approved Benchmark</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-xs font-bold border border-red-300 dark:border-red-700">
            <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>Rejected</span>
          </span>
        );
      case 'resubmission_requested':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 text-xs font-bold border border-orange-300 dark:border-orange-700">
            <RefreshCw className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span>Resubmission Requested</span>
          </span>
        );
      default:
        return <span className="text-xs text-greygreen capitalize">{decision}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-teal dark:text-ivory font-heading">
            Completed Evaluation History
          </h2>
          <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/60 mt-0.5">
            Immutable assessment logs and criterion-wise scores stored in PostgreSQL
          </p>
        </div>

        <button
          type="button"
          onClick={fetchHistory}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 text-teal dark:text-ivory text-xs font-bold hover:bg-sand-50 transition-colors shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh History</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-greygreen dark:text-ivory/60 text-sm flex flex-col items-center justify-center gap-3 bg-white dark:bg-charcoal-800 rounded-3xl border border-beige dark:border-charcoal-700">
          <RefreshCw className="w-6 h-6 animate-spin text-terracotta" />
          <span>Fetching completed evaluation reviews from PostgreSQL...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs border border-red-200 dark:border-red-800">
          {error}
        </div>
      ) : history.length === 0 ? (
        <div className="py-16 text-center text-greygreen dark:text-ivory/60 text-sm space-y-3 bg-white dark:bg-charcoal-800 rounded-3xl border border-beige dark:border-charcoal-700">
          <Award className="w-10 h-10 text-greygreen mx-auto opacity-50" />
          <p className="font-bold text-base text-teal dark:text-ivory">No completed reviews on record</p>
          <p className="text-xs max-w-md mx-auto">
            Reviews you submit from the Submissions Queue will be permanently archived and displayed here.
          </p>
          <div className="pt-2">
            <Link
              to="/assessor/submissions"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-sm transition-colors"
            >
              <span>Go to Submissions Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-bold text-greygreen dark:text-ivory/60">
            Total Completed Evaluations: {history.length}
          </div>

          <div className="space-y-4">
            {history.map((rev) => (
              <div
                key={rev.id}
                className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-beige dark:border-charcoal-700 shadow-sm space-y-4 hover:border-teal/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-beige dark:border-charcoal-700">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-teal dark:text-ivory font-heading">
                        {rev.worker_name || 'Candidate Worker'}
                      </h3>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sand-100 dark:bg-charcoal-700 text-terracotta dark:text-amber-400 capitalize">
                        {rev.worker_trade || 'Vocational Craft'}
                      </span>
                    </div>

                    <p className="text-xs text-greygreen dark:text-ivory/70 font-medium">
                      Task: <strong className="text-teal dark:text-ivory">{rev.task_title || 'Practical Demonstration'}</strong>
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-greygreen dark:text-ivory/50 pt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Reviewed on {rev.reviewed_at ? new Date(rev.reviewed_at).toLocaleString() : 'N/A'}</span>
                      <span>•</span>
                      <span>Evaluator: <strong>{rev.assessor_name}</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    {getDecisionBadge(rev.decision)}
                    <div className="text-sm font-bold text-teal dark:text-ivory">
                      Score: <strong className="text-base text-terracotta dark:text-amber-400 font-heading">{rev.total_score}</strong> / {rev.maximum_score}
                      <span className="text-xs font-normal text-greygreen dark:text-ivory/60 ml-1.5">
                        ({rev.score_percentage}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Overall Feedback Quote */}
                <div className="p-4 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige/60 dark:border-charcoal-700">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-greygreen dark:text-ivory/60 mb-1">
                    Assessor's Professional Evaluation Feedback:
                  </span>
                  <p className="text-xs text-teal-950 dark:text-ivory leading-relaxed italic">
                    "{rev.overall_feedback}"
                  </p>
                </div>

                {/* Criterion Results Chips */}
                {rev.criterion_results && rev.criterion_results.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-greygreen dark:text-ivory/60">
                      Criterion-Wise Breakdown:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      {rev.criterion_results.map((c) => (
                        <div
                          key={c.id}
                          className="p-2.5 rounded-xl bg-sand-100/60 dark:bg-charcoal-700/50 border border-beige/80 dark:border-charcoal-600 text-xs flex flex-col justify-between gap-1"
                        >
                          <span className="font-bold text-teal dark:text-ivory text-[11px] line-clamp-1">
                            {c.criterion_name}
                          </span>
                          <div className="flex items-center justify-between text-[11px] text-greygreen dark:text-ivory/70">
                            <span>Score:</span>
                            <span className="font-bold text-terracotta dark:text-amber-400">
                              {c.score} / {c.max_score}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <Link
                    to={`/assessor/review/${rev.submission_id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal dark:text-amber-300 hover:text-terracotta"
                  >
                    <span>Re-inspect Submission & Evidence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
