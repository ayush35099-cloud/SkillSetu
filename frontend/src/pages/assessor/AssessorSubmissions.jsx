import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useOutletContext } from 'react-router-dom';
import { apiService } from '../../services/api';
import {
  Search,
  Filter,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowRight,
  Zap,
  Wrench,
  Building,
  Hammer,
  Flame,
  Paintbrush,
  Cog,
  Layers,
  FileCheck2,
  Phone,
  MapPin
} from 'lucide-react';

const TRADES = [
  { id: 'all', name: 'All Trades' },
  { id: 'electrician', name: 'Electrician' },
  { id: 'plumber', name: 'Plumber' },
  { id: 'mason', name: 'Mason' },
  { id: 'carpenter', name: 'Carpenter' },
  { id: 'welder', name: 'Welder' },
  { id: 'painter', name: 'Painter' },
  { id: 'mechanic', name: 'Mechanic' },
  { id: 'technician', name: 'Technician' },
];

const STATUSES = [
  { id: 'all', name: 'All Statuses' },
  { id: 'pending', name: 'Pending Review' },
  { id: 'under_review', name: 'Under Review' },
  { id: 'approved', name: 'Approved' },
  { id: 'rejected', name: 'Rejected' },
  { id: 'resubmission_requested', name: 'Resubmission' },
];

export default function AssessorSubmissions() {
  const { isApproved } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const tradeParam = searchParams.get('trade') || 'all';
  const statusParam = searchParams.get('status') || 'all';

  const [tradeFilter, setTradeFilter] = useState(tradeParam);
  const [statusFilter, setStatusFilter] = useState(statusParam);
  const [searchTerm, setSearchTerm] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getAssessorSubmissions({
        trade: tradeFilter,
        status: statusFilter,
        search: searchTerm
      });
      if (res.submissions) setSubmissions(res.submissions);
    } catch (err) {
      console.error('Failed to load submissions:', err);
      setError(err.message || 'Unable to connect to submissions API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [tradeFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSubmissions();
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
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-teal dark:text-ivory font-heading">
            Demonstration Submissions Queue
          </h2>
          <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/60 mt-0.5">
            Practical evidence submitted by blue-collar craftspeople for rubric evaluation
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSubmissions}
          disabled={loading}
          className="self-start md:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 text-teal dark:text-ivory text-xs font-bold hover:bg-sand-50 transition-colors shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-5 border border-beige dark:border-charcoal-700 shadow-sm space-y-4">
        
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-greygreen" />
            <input
              type="text"
              placeholder="Search by worker name, notes, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-600 text-xs sm:text-sm text-teal dark:text-ivory placeholder:text-greygreen/60 focus:outline-hidden focus:ring-2 focus:ring-terracotta/40"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-2xl bg-teal dark:bg-charcoal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs"
          >
            Search
          </button>
        </form>

        {/* Trade Selector Chips */}
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-greygreen dark:text-ivory/60 mb-2">
            Filter by Trade:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {TRADES.map((trade) => {
              const active = tradeFilter === trade.id;
              return (
                <button
                  key={trade.id}
                  type="button"
                  onClick={() => {
                    setTradeFilter(trade.id);
                    setSearchParams({ trade: trade.id, status: statusFilter });
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-terracotta text-white shadow-xs ring-2 ring-terracotta/20'
                      : 'bg-sand-100 dark:bg-charcoal-700 text-teal dark:text-ivory hover:bg-sand-200'
                  }`}
                >
                  {trade.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Selector Chips */}
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-greygreen dark:text-ivory/60 mb-2">
            Filter by Status:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {STATUSES.map((status) => {
              const active = statusFilter === status.id;
              return (
                <button
                  key={status.id}
                  type="button"
                  onClick={() => {
                    setStatusFilter(status.id);
                    setSearchParams({ trade: tradeFilter, status: status.id });
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-teal dark:bg-amber-400 text-white dark:text-teal-950 shadow-xs'
                      : 'bg-sand-100 dark:bg-charcoal-700 text-teal dark:text-ivory hover:bg-sand-200'
                  }`}
                >
                  {status.name}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="py-16 text-center text-greygreen dark:text-ivory/60 text-sm flex flex-col items-center justify-center gap-3 bg-white dark:bg-charcoal-800 rounded-3xl border border-beige dark:border-charcoal-700">
          <RefreshCw className="w-6 h-6 animate-spin text-terracotta" />
          <span>Fetching worker submissions from PostgreSQL...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs border border-red-200 dark:border-red-800">
          {error}
        </div>
      ) : submissions.length === 0 ? (
        <div className="py-16 text-center text-greygreen dark:text-ivory/60 text-sm space-y-3 bg-white dark:bg-charcoal-800 rounded-3xl border border-beige dark:border-charcoal-700">
          <FileCheck2 className="w-10 h-10 text-greygreen mx-auto opacity-50" />
          <p className="font-bold text-base text-teal dark:text-ivory">No submissions found matching your filters</p>
          <p className="text-xs max-w-md mx-auto">
            Try resetting your trade or status filters, or visit the Worker Portal to submit a new demonstration.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-bold text-greygreen dark:text-ivory/60">
            Showing {submissions.length} submission{submissions.length === 1 ? '' : 's'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submissions.map((sub) => {
              const Icon = getTradeIcon(sub.trade || sub.worker_trade);
              return (
                <div
                  key={sub.id}
                  className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-beige dark:border-charcoal-700 shadow-sm flex flex-col justify-between space-y-4 hover:border-terracotta/40 transition-all"
                >
                  <div className="space-y-3">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-beige dark:border-charcoal-700">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-teal dark:bg-charcoal-700 text-white flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-terracotta-200" />
                        </div>
                        <div>
                          <h3 className="font-bold text-teal dark:text-ivory text-base">
                            {sub.worker_name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-greygreen dark:text-ivory/60 mt-0.5">
                            <span className="font-bold text-terracotta dark:text-amber-400 capitalize">
                              {sub.trade || sub.worker_trade}
                            </span>
                            <span>•</span>
                            <span>{sub.worker_experience ? `${sub.worker_experience} yrs exp` : 'Artisan'}</span>
                          </div>
                        </div>
                      </div>

                      {getStatusBadge(sub.status)}
                    </div>

                    {/* Task Title & Notes */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-greygreen dark:text-ivory/50">
                        Demonstration Task:
                      </span>
                      <p className="text-sm font-bold text-teal-950 dark:text-ivory leading-snug">
                        {sub.task_title || 'Vocational Practical Benchmark'}
                      </p>
                      {sub.submission_notes && (
                        <p className="text-xs text-greygreen dark:text-ivory/70 bg-sand-50/60 dark:bg-charcoal-900 p-3 rounded-xl border border-beige/60 dark:border-charcoal-700 leading-relaxed italic">
                          "{sub.submission_notes}"
                        </p>
                      )}
                    </div>

                    {/* Location & Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-greygreen dark:text-ivory/60 pt-1">
                      {sub.worker_location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-terracotta" />
                          <span>{sub.worker_location}</span>
                        </span>
                      )}
                      {sub.worker_phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-teal" />
                          <span>{sub.worker_phone}</span>
                        </span>
                      )}
                    </div>

                    {/* Latest Review Summary if reviewed */}
                    {sub.latest_review && (
                      <div className="p-3 rounded-xl bg-teal-50/50 dark:bg-charcoal-700/50 border border-teal-200/60 dark:border-charcoal-600 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-teal dark:text-ivory">
                          <span>Evaluation Score:</span>
                          <span className="text-terracotta dark:text-amber-300">
                            {sub.latest_review.total_score} / {sub.latest_review.maximum_score}
                          </span>
                        </div>
                        <p className="text-greygreen dark:text-ivory/70 text-[11px] line-clamp-2">
                          Feedback: "{sub.latest_review.overall_feedback}"
                        </p>
                      </div>
                    )}

                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-beige dark:border-charcoal-700 flex items-center justify-between">
                    <span className="text-[11px] text-greygreen dark:text-ivory/50">
                      Submitted: {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : 'Recent'}
                    </span>

                    <Link
                      to={`/assessor/review/${sub.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                    >
                      <span>
                        {sub.status === 'approved' || sub.status === 'rejected'
                          ? 'View Evaluation'
                          : 'Evaluate Work'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
