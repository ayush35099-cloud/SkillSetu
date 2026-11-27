import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import {
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Send,
  X,
  Search,
  Filter,
  ArrowRight,
  Phone,
  Mail,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

const TRADES = [
  'electrician',
  'plumber',
  'mason',
  'carpenter',
  'welder',
  'painter',
  'mechanic',
  'technician'
];

export default function WorkerJobs() {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'applications' | 'requests'

  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [tradeFilter, setTradeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Applications state
  const [myApplications, setMyApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Contact requests state
  const [contactRequests, setContactRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Apply Modal state
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Detail Modal
  const [detailJob, setDetailJob] = useState(null);

  const loadJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await apiService.getPublicJobs({
        trade: tradeFilter,
        q: searchQuery
      });
      if (res && res.jobs) {
        setJobs(res.jobs);
      }
    } catch (err) {
      console.warn('Failed to load public jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadMyApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await apiService.getMyJobApplications();
      if (res && res.applications) {
        setMyApplications(res.applications);
      }
    } catch (err) {
      console.warn('Failed to load my applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  const loadContactRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await apiService.getWorkerContactRequests();
      if (res && res.contact_requests) {
        setContactRequests(res.contact_requests);
      }
    } catch (err) {
      console.warn('Failed to load contact requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [tradeFilter]);

  useEffect(() => {
    if (activeTab === 'applications') {
      loadMyApplications();
    } else if (activeTab === 'requests') {
      loadContactRequests();
    }
  }, [activeTab]);

  const handleOpenApply = (job) => {
    setApplyModalJob(job);
    setCoverNote('I am interested in this position and have verified vocational experience on SkillSetu.');
    setApplyError('');
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!applyModalJob) return;

    setApplying(true);
    setApplyError('');
    try {
      await apiService.applyToJob(applyModalJob.id, coverNote);
      setToastMsg(`Application successfully submitted for '${applyModalJob.title}'.`);
      setApplyModalJob(null);
      loadMyApplications();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      setApplyError(err.message || 'Could not submit application.');
    } finally {
      setApplying(false);
    }
  };

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await apiService.withdrawJobApplication(appId);
      setToastMsg('Application withdrawn.');
      loadMyApplications();
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      alert(`Withdrawal failed: ${err.message}`);
    }
  };

  const handleRespondRequest = async (requestId, action) => {
    try {
      await apiService.respondToContactRequest(requestId, action, true);
      setToastMsg(`Interview invitation ${action === 'accept' ? 'accepted' : 'declined'}.`);
      loadContactRequests();
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      alert(`Response failed: ${err.message}`);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const target = `${j.title} ${j.company_name || ''} ${j.description} ${j.city} ${j.state} ${j.trade}`.toLowerCase();
      if (!target.includes(q)) return false;
    }
    return true;
  });

  const appliedJobIds = new Set(myApplications.map((a) => a.job_id));

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-teal dark:text-ivory font-heading">
            Direct Hiring & Job Marketplace
          </h2>
          <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/60">
            Browse verified contractor job vacancies across India, track your applications, and respond to direct interview invitations.
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('browse')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'browse'
                ? 'bg-teal text-white shadow-xs'
                : 'text-teal dark:text-ivory/80 hover:bg-sand-50 dark:hover:bg-charcoal-700'
            }`}
          >
            Browse Jobs ({jobs.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'applications'
                ? 'bg-teal text-white shadow-xs'
                : 'text-teal dark:text-ivory/80 hover:bg-sand-50 dark:hover:bg-charcoal-700'
            }`}
          >
            My Applications ({myApplications.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'requests'
                ? 'bg-teal text-white shadow-xs'
                : 'text-teal dark:text-ivory/80 hover:bg-sand-50 dark:hover:bg-charcoal-700'
            }`}
          >
            Interview Requests ({contactRequests.length})
          </button>
        </div>
      </div>

      {/* TAB 1: BROWSE JOBS */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs flex flex-wrap items-center justify-between gap-3">
            
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-greygreen absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by job title, company, skills..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-xs sm:text-sm text-teal dark:text-ivory focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-greygreen" />
              <span className="font-bold text-teal dark:text-ivory">Trade:</span>
              <select
                value={tradeFilter}
                onChange={(e) => setTradeFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-beige dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-teal dark:text-ivory font-bold capitalize focus:outline-none"
              >
                <option value="all">All Trades</option>
                {TRADES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Jobs Grid */}
          {loadingJobs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 rounded-3xl bg-sand-200 dark:bg-charcoal-800 animate-pulse" />
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700">
              <Briefcase className="w-10 h-10 text-greygreen dark:text-ivory/40 mx-auto mb-3" />
              <h3 className="text-base font-bold text-teal dark:text-ivory">No Active Jobs Found</h3>
              <p className="text-xs text-greygreen dark:text-ivory/60 mt-1 max-w-sm mx-auto">
                No active contractor job postings currently match your trade or search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredJobs.map((job) => {
                const hasApplied = appliedJobIds.has(job.id);

                return (
                  <div
                    key={job.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs flex flex-col justify-between hover:border-teal/30 dark:hover:border-charcoal-600 transition-all"
                  >
                    <div>
                      {/* Top: Trade badge & Contractor company */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sand-200 dark:bg-charcoal-700 text-teal dark:text-ivory">
                          {job.trade}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-semibold text-teal dark:text-ivory">
                          <Building2 className="w-3.5 h-3.5 text-terracotta" />
                          <span className="truncate max-w-[180px]">{job.company_name}</span>
                        </div>
                      </div>

                      {/* Job Title */}
                      <h3 className="text-base sm:text-lg font-bold text-teal dark:text-ivory font-heading leading-snug">
                        {job.title}
                      </h3>

                      {/* Wage & Location */}
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-greygreen dark:text-ivory/70">
                        <span className="font-bold text-teal dark:text-ivory">
                          ₹{job.wage_min.toLocaleString()} - ₹{job.wage_max.toLocaleString()}/{job.payment_type === 'Daily' ? 'day' : 'month'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                          <span>{job.city}, {job.state}</span>
                        </span>
                        <span>•</span>
                        <span>{job.employment_type}</span>
                      </div>

                      {/* Description */}
                      <p className="mt-2.5 text-xs text-greygreen dark:text-ivory/60 line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>

                      {/* Skills */}
                      {job.required_skills && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {job.required_skills.split(',').slice(0, 3).map((sk, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sand-100 dark:bg-charcoal-900 text-teal dark:text-ivory/70 border border-beige/60 dark:border-charcoal-700"
                            >
                              {sk.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom: Details & Apply */}
                    <div className="pt-4 mt-4 border-t border-beige dark:border-charcoal-700 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setDetailJob(job)}
                        className="text-xs font-bold text-teal dark:text-ivory hover:text-terracotta underline"
                      >
                        View Full Details
                      </button>

                      {hasApplied ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Applied</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenApply(job)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-xs transition-colors"
                        >
                          <span>Apply Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: MY APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {loadingApps ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 rounded-3xl bg-sand-200 dark:bg-charcoal-800 animate-pulse" />
              ))}
            </div>
          ) : myApplications.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700">
              <Briefcase className="w-10 h-10 text-greygreen dark:text-ivory/40 mx-auto mb-3" />
              <h3 className="text-base font-bold text-teal dark:text-ivory">No Applications Yet</h3>
              <p className="text-xs text-greygreen dark:text-ivory/60 mt-1 max-w-sm mx-auto">
                Explore active vacancies under the "Browse Jobs" tab and apply directly with your verified credentials.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-teal dark:text-ivory">
                        {app.job_title}
                      </span>
                      <span className="text-xs text-greygreen dark:text-ivory/60 font-semibold">
                        ({app.company_name})
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-greygreen dark:text-ivory/70">
                      <span>Trade: <strong className="capitalize">{app.trade}</strong></span>
                      <span>•</span>
                      <span>{app.city}, {app.state}</span>
                      <span>•</span>
                      <span>₹{app.wage_min.toLocaleString()} - ₹{app.wage_max.toLocaleString()} ({app.payment_type})</span>
                    </div>

                    {app.cover_note && (
                      <p className="text-xs text-greygreen dark:text-ivory/60 italic pt-1">
                        "{app.cover_note}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
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

                    {app.status !== 'withdrawn' && app.status !== 'hired' && (
                      <button
                        type="button"
                        onClick={() => handleWithdraw(app.id)}
                        className="px-2.5 py-1 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-50"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INTERVIEW & CONTACT REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {loadingRequests ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 rounded-3xl bg-sand-200 dark:bg-charcoal-800 animate-pulse" />
              ))}
            </div>
          ) : contactRequests.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700">
              <Phone className="w-10 h-10 text-greygreen dark:text-ivory/40 mx-auto mb-3" />
              <h3 className="text-base font-bold text-teal dark:text-ivory">No Interview Requests</h3>
              <p className="text-xs text-greygreen dark:text-ivory/60 mt-1 max-w-sm mx-auto">
                When verified contractors review your Skill Passport and send interview invitations, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {contactRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-teal dark:text-ivory font-heading">
                        {req.company_name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        req.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'declined'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-greygreen dark:text-ivory/80 bg-sand-50/50 dark:bg-charcoal-900 p-3 rounded-2xl border border-beige/60 dark:border-charcoal-700 leading-relaxed italic">
                      "{req.message}"
                    </p>

                    {req.status === 'accepted' && (
                      <div className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold pt-1">
                        Contractor details revealed: Phone {req.contractor_phone || 'Shared'} • Email {req.contractor_email}
                      </div>
                    )}
                  </div>

                  {req.status === 'pending' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleRespondRequest(req.id, 'accept')}
                        className="px-4 py-2 rounded-xl bg-teal hover:bg-teal-800 text-white font-bold text-xs shadow-xs"
                      >
                        Accept & Share Contact
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRespondRequest(req.id, 'decline')}
                        className="px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-bold text-xs"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {detailJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/70 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white dark:bg-charcoal-900 rounded-3xl shadow-2xl border border-beige dark:border-charcoal-700 p-6 sm:p-8 animate-scaleUp space-y-4">
            
            <button
              type="button"
              onClick={() => setDetailJob(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-greygreen hover:text-teal dark:text-ivory/60 hover:bg-sand-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
                {detailJob.company_name}
              </span>
              <h3 className="text-xl font-black text-teal dark:text-ivory font-heading mt-0.5">
                {detailJob.title}
              </h3>
              <p className="text-xs font-semibold text-teal dark:text-ivory mt-1">
                ₹{detailJob.wage_min.toLocaleString()} - ₹{detailJob.wage_max.toLocaleString()} ({detailJob.payment_type}) • {detailJob.employment_type}
              </p>
            </div>

            <div className="space-y-3 text-xs text-greygreen dark:text-ivory/80 pt-2 border-t border-beige dark:border-charcoal-700">
              <div>
                <strong className="block text-teal dark:text-ivory mb-0.5">Scope of Work:</strong>
                <p className="leading-relaxed">{detailJob.description}</p>
              </div>

              {detailJob.required_skills && (
                <div>
                  <strong className="block text-teal dark:text-ivory mb-0.5">Key Competencies:</strong>
                  <p>{detailJob.required_skills}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <strong className="block text-teal dark:text-ivory">Site Location:</strong>
                  <span>{detailJob.location}, {detailJob.city}, {detailJob.state}</span>
                </div>
                <div>
                  <strong className="block text-teal dark:text-ivory">Working Hours:</strong>
                  <span>{detailJob.working_hours || 'Standard Shift'}</span>
                </div>
              </div>

              {detailJob.safety_requirements && (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                  <strong className="block font-bold">Safety & PPE Requirements:</strong>
                  <span>{detailJob.safety_requirements}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-beige dark:border-charcoal-700 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDetailJob(null)}
                className="px-4 py-2 rounded-xl border border-beige dark:border-charcoal-700 text-teal dark:text-ivory font-bold text-xs"
              >
                Close
              </button>
              {!appliedJobIds.has(detailJob.id) && (
                <button
                  type="button"
                  onClick={() => {
                    const j = detailJob;
                    setDetailJob(null);
                    handleOpenApply(j);
                  }}
                  className="px-5 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-xs"
                >
                  Apply to this Job
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Apply Modal */}
      {applyModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/70 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-charcoal-900 rounded-3xl shadow-2xl border border-beige dark:border-charcoal-700 p-6 sm:p-8 animate-scaleUp">
            
            <button
              type="button"
              onClick={() => setApplyModalJob(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-greygreen hover:text-teal dark:text-ivory/60 hover:bg-sand-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
                Direct Application
              </span>
              <h3 className="text-lg font-black text-teal dark:text-ivory font-heading mt-0.5">
                Apply for {applyModalJob.title}
              </h3>
              <p className="text-xs text-greygreen dark:text-ivory/60 mt-0.5">
                Employer: <strong>{applyModalJob.company_name}</strong> • {applyModalJob.city}, {applyModalJob.state}
              </p>
            </div>

            {applyError && (
              <div className="mb-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{applyError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory uppercase mb-1">
                  Cover Note / Message for Contractor
                </label>
                <textarea
                  rows="3"
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Introduce yourself, your trade experience, and availability..."
                  className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal resize-none"
                />
              </div>

              <div className="p-3 rounded-2xl bg-teal-50 dark:bg-charcoal-800 border border-teal-200/60 dark:border-charcoal-700 text-xs text-teal-900 dark:text-ivory/80 leading-relaxed">
                Your verified Digital Skill Passport and practical assessment scores will automatically be shared with {applyModalJob.company_name}.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyModalJob(null)}
                  className="px-4 py-2 rounded-xl border border-beige dark:border-charcoal-700 text-teal dark:text-ivory font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs sm:text-sm shadow-sm disabled:opacity-50"
                >
                  {applying ? 'Submitting Application...' : 'Submit Job Application'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
