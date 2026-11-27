import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import {
  Briefcase,
  Users,
  FileText,
  UserCheck,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Building2,
  MapPin,
  QrCode,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export default function ContractorDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getContractorDashboard();
      if (res && res.stats) {
        setDashboardData(res);
      }
    } catch (err) {
      console.error('Error loading contractor dashboard:', err);
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-sand-200 dark:bg-charcoal-800 rounded-3xl" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-sand-200 dark:bg-charcoal-800 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-sand-200 dark:bg-charcoal-800 rounded-3xl" />
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    total_jobs: 0,
    active_jobs: 0,
    closed_jobs: 0,
    total_applications: 0,
    shortlisted_workers: 0,
    hired_workers: 0,
    verification_status: 'pending',
    company_name: 'Company'
  };

  const recentApplications = dashboardData?.recent_applications || [];
  const recentJobs = dashboardData?.recent_jobs || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Welcome & Status Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-teal-900 to-teal-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-700/80 text-teal-200 border border-teal-600">
                Phase 4: Contractor Hub
              </span>
              {stats.verification_status === 'verified' ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Contractor</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Verification Pending</span>
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading">
              Welcome, {stats.company_name}
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/80 mt-1 max-w-xl">
              Publish job openings, review candidate skill passports with tamper-proof QR codes, and hire verified Indian vocational talent.
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/contractor/jobs"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-terracotta/25 transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Job</span>
            </Link>

            <Link
              to="/contractor/workers"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm transition-all"
            >
              <Users className="w-4 h-4 text-amber-300" />
              <span>Discover Workers</span>
            </Link>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-teal-700/20 pointer-events-none" />
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Total Jobs */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs">
          <div className="flex items-center justify-between text-greygreen dark:text-ivory/60 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Jobs</span>
            <Briefcase className="w-4 h-4 text-teal" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal dark:text-ivory font-heading">
            {stats.total_jobs}
          </div>
          <span className="text-[11px] text-greygreen dark:text-ivory/50 mt-1 block">
            {stats.active_jobs} currently active
          </span>
        </div>

        {/* Active Jobs */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs">
          <div className="flex items-center justify-between text-greygreen dark:text-ivory/60 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Jobs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-heading">
            {stats.active_jobs}
          </div>
          <span className="text-[11px] text-greygreen dark:text-ivory/50 mt-1 block">
            Accepting applications
          </span>
        </div>

        {/* Total Applications */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs">
          <div className="flex items-center justify-between text-greygreen dark:text-ivory/60 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Applications</span>
            <FileText className="w-4 h-4 text-terracotta" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-terracotta dark:text-terracotta-400 font-heading">
            {stats.total_applications}
          </div>
          <span className="text-[11px] text-greygreen dark:text-ivory/50 mt-1 block">
            From verified workers
          </span>
        </div>

        {/* Shortlisted */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs">
          <div className="flex items-center justify-between text-greygreen dark:text-ivory/60 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Shortlisted</span>
            <UserCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-heading">
            {stats.shortlisted_workers}
          </div>
          <span className="text-[11px] text-greygreen dark:text-ivory/50 mt-1 block">
            Under active review
          </span>
        </div>

        {/* Hired Workers */}
        <div className="col-span-2 lg:col-span-1 p-4 sm:p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs">
          <div className="flex items-center justify-between text-greygreen dark:text-ivory/60 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Hired</span>
            <ShieldCheck className="w-4 h-4 text-teal" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal dark:text-ivory font-heading">
            {stats.hired_workers}
          </div>
          <span className="text-[11px] text-greygreen dark:text-ivory/50 mt-1 block">
            Placed on site
          </span>
        </div>

      </div>

      {/* 3. Quick Actions Hub */}
      <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs">
        <h3 className="text-sm font-bold text-teal dark:text-ivory uppercase tracking-wider mb-4">
          Quick Actions & Operations
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
          <Link
            to="/contractor/jobs"
            className="p-3.5 rounded-2xl border border-beige dark:border-charcoal-700 hover:border-terracotta/40 dark:hover:border-terracotta/40 bg-sand-50/40 dark:bg-charcoal-900 flex flex-col items-center text-center group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-terracotta-50 dark:bg-terracotta/20 text-terracotta flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-teal dark:text-ivory">Post a Job</span>
            <span className="text-[10px] text-greygreen dark:text-ivory/60 mt-0.5">Publish opening</span>
          </Link>

          <Link
            to="/contractor/jobs"
            className="p-3.5 rounded-2xl border border-beige dark:border-charcoal-700 hover:border-teal/40 dark:hover:border-teal/40 bg-sand-50/40 dark:bg-charcoal-900 flex flex-col items-center text-center group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal/20 text-teal dark:text-ivory flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-teal dark:text-ivory">Manage Jobs</span>
            <span className="text-[10px] text-greygreen dark:text-ivory/60 mt-0.5">Edit or pause</span>
          </Link>

          <Link
            to="/contractor/workers"
            className="p-3.5 rounded-2xl border border-beige dark:border-charcoal-700 hover:border-amber-400/40 dark:hover:border-amber-400/40 bg-sand-50/40 dark:bg-charcoal-900 flex flex-col items-center text-center group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-teal dark:text-ivory">Find Workers</span>
            <span className="text-[10px] text-greygreen dark:text-ivory/60 mt-0.5">Search marketplace</span>
          </Link>

          <Link
            to="/contractor/applications"
            className="p-3.5 rounded-2xl border border-beige dark:border-charcoal-700 hover:border-teal/40 dark:hover:border-teal/40 bg-sand-50/40 dark:bg-charcoal-900 flex flex-col items-center text-center group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal/20 text-teal dark:text-ivory flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-teal dark:text-ivory">Applications</span>
            <span className="text-[10px] text-greygreen dark:text-ivory/60 mt-0.5">Shortlist & hire</span>
          </Link>

          <Link
            to="/contractor/profile"
            className="p-3.5 rounded-2xl border border-beige dark:border-charcoal-700 hover:border-greygreen/40 dark:hover:border-charcoal-500 bg-sand-50/40 dark:bg-charcoal-900 flex flex-col items-center text-center group transition-all col-span-2 sm:col-span-1"
          >
            <div className="w-10 h-10 rounded-xl bg-sand-100 dark:bg-charcoal-700 text-greygreen dark:text-ivory flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-teal dark:text-ivory">Company Profile</span>
            <span className="text-[10px] text-greygreen dark:text-ivory/60 mt-0.5">GSTIN & address</span>
          </Link>

        </div>
      </div>

      {/* 4. Split Grid: Recent Applications & Recent Job Postings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Recent Applications */}
        <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-teal dark:text-ivory font-heading">
                Recent Applications
              </h3>
              <p className="text-xs text-greygreen dark:text-ivory/60">
                Latest artisan applications received for your projects
              </p>
            </div>
            <Link
              to="/contractor/applications"
              className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="p-8 text-center text-xs text-greygreen dark:text-ivory/60 my-auto">
              No applications received yet. As verified workers apply to your active jobs, they will appear here.
            </div>
          ) : (
            <div className="space-y-3 flex-1">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-2xl border border-beige dark:border-charcoal-700 bg-sand-50/30 dark:bg-charcoal-900 flex items-center justify-between gap-3 hover:bg-sand-50 dark:hover:bg-charcoal-800 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-teal dark:text-ivory truncate">
                        {app.worker_name}
                      </span>
                      {app.has_verified_passport && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>QR Verified</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-greygreen dark:text-ivory/60 truncate">
                      Applied for: <strong className="text-teal dark:text-ivory">{app.job_title}</strong>
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-greygreen dark:text-ivory/50 mt-1">
                      <span>Trade: {app.worker_trade || 'Skilled'}</span>
                      <span>•</span>
                      <span>{app.worker_location || 'India'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      app.status === 'hired'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : app.status === 'shortlisted'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-teal-50 text-teal-800 dark:bg-charcoal-700 dark:text-ivory'
                    }`}>
                      {app.status}
                    </span>
                    {app.verification_url && (
                      <a
                        href={app.verification_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-terracotta hover:underline"
                        title="Open worker's live Digital Skill Passport"
                      >
                        <QrCode className="w-3 h-3" />
                        <span>Passport</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Active Jobs Showcase */}
        <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-teal dark:text-ivory font-heading">
                Recent Job Postings
              </h3>
              <p className="text-xs text-greygreen dark:text-ivory/60">
                Active listings published across India
              </p>
            </div>
            <Link
              to="/contractor/jobs"
              className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <div className="p-8 text-center text-xs text-greygreen dark:text-ivory/60 my-auto">
              No jobs posted yet. Click <strong>Post New Job</strong> to create your first vacancy.
            </div>
          ) : (
            <div className="space-y-3 flex-1">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3.5 rounded-2xl border border-beige dark:border-charcoal-700 bg-sand-50/30 dark:bg-charcoal-900 flex items-center justify-between gap-3 hover:bg-sand-50 dark:hover:bg-charcoal-800 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-teal dark:text-ivory truncate">
                        {job.title}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-sand-200 dark:bg-charcoal-700 text-teal dark:text-ivory">
                        {job.trade}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-greygreen dark:text-ivory/60 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-terracotta" />
                        <span className="truncate">{job.city}, {job.state}</span>
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-teal dark:text-ivory">
                        ₹{job.wage_min.toLocaleString()} - ₹{job.wage_max.toLocaleString()}/{job.payment_type === 'Daily' ? 'day' : 'mo'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs font-bold text-teal dark:text-ivory">
                      {job.applications_count} {job.applications_count === 1 ? 'applicant' : 'applicants'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      job.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-sand-200 text-greygreen dark:bg-charcoal-700 dark:text-ivory/60'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
