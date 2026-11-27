import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import {
  FileText,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  QrCode,
  MapPin,
  ExternalLink,
  Filter,
  Search,
  AlertCircle,
  ChevronRight,
  Briefcase
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Applications' },
  { value: 'applied', label: 'Applied' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

export default function ContractorApplications() {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('job_id') || '';

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  const loadApplications = async () => {
    setLoading(true);
    try {
      let res;
      if (initialJobId) {
        res = await apiService.getContractorJobApplications(initialJobId);
      } else {
        res = await apiService.getAllContractorApplications(statusFilter === 'all' ? '' : statusFilter);
      }
      if (res && res.applications) {
        setApplications(res.applications);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [statusFilter, initialJobId]);

  const handleUpdateStatus = async (appId, newStatus) => {
    setActionLoading(appId);
    try {
      await apiService.updateApplicationStatus(appId, newStatus);
      setSuccessToast(`Application marked as '${newStatus}'.`);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      alert(`Could not update status: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const target = `${app.worker_name} ${app.worker_trade || ''} ${app.job_title || ''} ${app.worker_location || ''} ${app.cover_note || ''}`.toLowerCase();
      if (!target.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-bold">{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-teal dark:text-ivory font-heading">
            Review Candidate Applications
          </h2>
          <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/60">
            {initialJobId
              ? `Filtering applications for Job #${initialJobId}`
              : 'Review verified worker applications, check Digital Skill Passports, and update hiring statuses'}
          </p>
        </div>

        {initialJobId && (
          <Link
            to="/contractor/applications"
            className="text-xs font-bold text-terracotta hover:underline self-start sm:self-auto"
          >
            Clear Job Filter (View All)
          </Link>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs flex flex-wrap items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-greygreen absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by candidate name, trade, skills..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-xs sm:text-sm text-teal dark:text-ivory focus:outline-none focus:ring-2 focus:ring-teal"
          />
        </div>

        {/* Status Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === opt.value
                  ? 'bg-teal text-white shadow-xs'
                  : 'bg-sand-100 dark:bg-charcoal-700 text-teal dark:text-ivory/70 hover:bg-beige/40'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-3xl bg-sand-200 dark:bg-charcoal-800 animate-pulse" />
          ))}
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700">
          <FileText className="w-10 h-10 text-greygreen dark:text-ivory/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-teal dark:text-ivory">No Applications Found</h3>
          <p className="text-xs text-greygreen dark:text-ivory/60 mt-1 max-w-sm mx-auto">
            {applications.length === 0
              ? 'No candidates have applied to your active job listings yet.'
              : 'No applications match your search or status filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-teal/30 dark:hover:border-charcoal-600 transition-all"
            >
              
              {/* Left Column: Candidate Info */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-teal dark:text-ivory font-heading">
                    {app.worker_name}
                  </h3>
                  
                  {/* Verified Digital Skill Passport Badge */}
                  {app.has_verified_passport ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{app.skill_level || 'Digital Skill Passport Verified'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-sand-200 dark:bg-charcoal-700 text-greygreen dark:text-ivory/70">
                      Candidate
                    </span>
                  )}
                </div>

                {/* Job & Location meta */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-greygreen dark:text-ivory/70">
                  <span className="flex items-center gap-1 text-teal dark:text-ivory font-semibold">
                    <Briefcase className="w-3.5 h-3.5 text-terracotta" />
                    <span>Applied for: {app.job_title}</span>
                  </span>
                  <span>•</span>
                  <span>Trade: <strong className="capitalize">{app.worker_trade || 'Vocational'}</strong></span>
                  <span>•</span>
                  <span>Experience: {app.worker_experience ?? 0} Years</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-terracotta" />
                    <span>{app.worker_location || 'India'}</span>
                  </span>
                </div>

                {/* Cover Note */}
                {app.cover_note && (
                  <p className="text-xs text-greygreen dark:text-ivory/70 bg-sand-50/60 dark:bg-charcoal-900 p-3 rounded-2xl border border-beige/60 dark:border-charcoal-700 leading-relaxed italic">
                    "{app.cover_note}"
                  </p>
                )}

                {/* Verification Token Link */}
                {app.verification_url && (
                  <div className="pt-1">
                    <a
                      href={app.verification_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta hover:underline"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Verify Digital Skill Passport QR ({app.credential_id || 'View Proof'})</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Right Column: Status & Stage Actions */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-beige dark:border-charcoal-700">
                
                {/* Current Status Pill */}
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  app.status === 'hired'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : app.status === 'shortlisted'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : app.status === 'rejected'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    : app.status === 'withdrawn'
                    ? 'bg-sand-200 text-greygreen dark:bg-charcoal-700 dark:text-ivory/60'
                    : 'bg-teal-50 text-teal-800 dark:bg-charcoal-700 dark:text-ivory'
                }`}>
                  {app.status}
                </span>

                {/* Status Action Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {app.status !== 'shortlisted' && app.status !== 'hired' && app.status !== 'withdrawn' && (
                    <button
                      type="button"
                      disabled={actionLoading === app.id}
                      onClick={() => handleUpdateStatus(app.id, 'shortlisted')}
                      className="px-2.5 py-1.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors"
                      title="Shortlist this worker"
                    >
                      Shortlist
                    </button>
                  )}

                  {app.status !== 'hired' && app.status !== 'withdrawn' && (
                    <button
                      type="button"
                      disabled={actionLoading === app.id}
                      onClick={() => handleUpdateStatus(app.id, 'hired')}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                      title="Mark candidate as hired"
                    >
                      Hire Worker
                    </button>
                  )}

                  {app.status !== 'rejected' && app.status !== 'withdrawn' && app.status !== 'hired' && (
                    <button
                      type="button"
                      disabled={actionLoading === app.id}
                      onClick={() => handleUpdateStatus(app.id, 'rejected')}
                      className="px-2.5 py-1.5 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 hover:bg-rose-50 text-xs font-bold transition-colors"
                      title="Reject application"
                    >
                      Reject
                    </button>
                  )}
                </div>

                <span className="text-[10px] text-greygreen dark:text-ivory/50">
                  Applied on {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : 'Recent'}
                </span>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
