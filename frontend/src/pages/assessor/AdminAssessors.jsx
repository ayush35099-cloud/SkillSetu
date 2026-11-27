import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sliders,
  User,
  Briefcase,
  AlertTriangle,
  Lock,
  Award,
  QrCode,
  ExternalLink,
  Ban,
  Building2,
  Trash2
} from 'lucide-react';

export default function AdminAssessors() {
  const { user } = useOutletContext();
  const isAdmin = user?.role === 'admin';

  // Active Tab: 'assessors' or 'passports'
  const [activeTab, setActiveTab] = useState('passports');

  // Assessors state
  const [assessors, setAssessors] = useState([]);
  const [loadingAssessors, setLoadingAssessors] = useState(true);

  // Passports state
  const [credentials, setCredentials] = useState([]);
  const [approvedSubmissions, setApprovedSubmissions] = useState([]);
  const [loadingPassports, setLoadingPassports] = useState(true);

  // Contractors & Jobs state
  const [contractors, setContractors] = useState([]);
  const [loadingContractors, setLoadingContractors] = useState(true);
  const [adminJobs, setAdminJobs] = useState([]);
  const [loadingAdminJobs, setLoadingAdminJobs] = useState(true);

  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Revocation modal state
  const [revokingCredential, setRevokingCredential] = useState(null);
  const [revocationReason, setRevocationReason] = useState('');

  // Admin login state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoggingIn, setAdminLoggingIn] = useState(false);

  const fetchAssessors = async () => {
    setLoadingAssessors(true);
    try {
      const res = await apiService.getAdminAssessors();
      if (res.assessors) setAssessors(res.assessors);
    } catch (err) {
      console.warn('Could not fetch assessors:', err);
    } finally {
      setLoadingAssessors(false);
    }
  };

  const fetchPassportsData = async () => {
    setLoadingPassports(true);
    try {
      const [credRes, subsRes] = await Promise.allSettled([
        apiService.getAdminCredentials(),
        apiService.getSubmissions()
      ]);

      if (credRes.status === 'fulfilled' && credRes.value?.credentials) {
        setCredentials(credRes.value.credentials);
      }
      if (subsRes.status === 'fulfilled' && subsRes.value?.submissions) {
        // Only approved submissions are eligible for passports
        const approved = subsRes.value.submissions.filter(s => s.status === 'approved');
        setApprovedSubmissions(approved);
      }
    } catch (err) {
      console.warn('Could not fetch passports data:', err);
    } finally {
      setLoadingPassports(false);
    }
  };

  const fetchContractorsData = async () => {
    setLoadingContractors(true);
    setLoadingAdminJobs(true);
    try {
      const [cRes, jRes] = await Promise.allSettled([
        apiService.getAdminContractors(),
        apiService.getAdminJobs()
      ]);
      if (cRes.status === 'fulfilled' && cRes.value?.contractors) {
        setContractors(cRes.value.contractors);
      }
      if (jRes.status === 'fulfilled' && jRes.value?.jobs) {
        setAdminJobs(jRes.value.jobs);
      }
    } catch (err) {
      console.warn('Could not fetch contractors data:', err);
    } finally {
      setLoadingContractors(false);
      setLoadingAdminJobs(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAssessors();
      fetchPassportsData();
      fetchContractorsData();
    } else {
      setLoadingAssessors(false);
      setLoadingPassports(false);
      setLoadingContractors(false);
      setLoadingAdminJobs(false);
    }
  }, [isAdmin]);

  const handleVerifyContractor = async (id, status) => {
    setProcessingId(`contractor-${id}`);
    setActionMessage(null);
    setError(null);
    try {
      const res = await apiService.verifyAdminContractor(id, status);
      setActionMessage(res.message || `Contractor status set to ${status}.`);
      fetchContractorsData();
    } catch (err) {
      setError(err.message || 'Failed to update contractor verification.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to remove this job posting from the platform?')) return;
    setProcessingId(`job-${jobId}`);
    setActionMessage(null);
    setError(null);
    try {
      const res = await apiService.deleteAdminJob(jobId);
      setActionMessage(res.message || 'Job posting removed by administrator.');
      fetchContractorsData();
    } catch (err) {
      setError(err.message || 'Failed to delete job posting.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveAssessor = async (id) => {
    setProcessingId(id);
    setActionMessage(null);
    try {
      const res = await apiService.approveAssessor(id);
      setActionMessage(res.message || 'Assessor approved.');
      fetchAssessors();
    } catch (err) {
      setError(err.message || 'Failed to approve assessor.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectAssessor = async (id) => {
    setProcessingId(id);
    setActionMessage(null);
    try {
      const res = await apiService.rejectAssessor(id);
      setActionMessage(res.message || 'Assessor rejected.');
      fetchAssessors();
    } catch (err) {
      setError(err.message || 'Failed to reject assessor.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleIssueCredential = async (submissionId) => {
    setProcessingId(`sub-${submissionId}`);
    setActionMessage(null);
    setError(null);
    try {
      const res = await apiService.issueAdminCredential(submissionId);
      setActionMessage(res.message || 'Skill Passport issued successfully.');
      fetchPassportsData();
    } catch (err) {
      setError(err.message || 'Failed to issue Skill Passport.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRevokeCredential = async (e) => {
    e.preventDefault();
    if (!revokingCredential || !revocationReason.trim()) return;

    setProcessingId(`cred-${revokingCredential.id}`);
    setError(null);
    setActionMessage(null);
    try {
      const res = await apiService.revokeAdminCredential(revokingCredential.id, revocationReason.trim());
      setActionMessage(res.message || 'Skill Passport revoked.');
      setRevokingCredential(null);
      setRevocationReason('');
      fetchPassportsData();
    } catch (err) {
      setError(err.message || 'Failed to revoke credential.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleAdminQuickLogin = async (e) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword) {
      setError('Administrator email and password are required.');
      return;
    }
    setAdminLoggingIn(true);
    setError(null);
    try {
      await apiService.adminLogin(adminEmail.trim(), adminPassword);
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Administrator sign-in failed');
    } finally {
      setAdminLoggingIn(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-teal dark:text-ivory font-heading">
            Admin Governance & Credentials
          </h2>
          <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/60 mt-0.5">
            Accreditation management & tamper-proof Digital Skill Passport issuance
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                fetchAssessors();
                fetchPassportsData();
              }}
              disabled={loadingAssessors || loadingPassports}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 text-teal dark:text-ivory text-xs font-bold hover:bg-sand-50 transition-colors shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${(loadingAssessors || loadingPassports) ? 'animate-spin' : ''}`} />
              <span>Refresh Registry</span>
            </button>
          </div>
        )}
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm animate-scaleUp">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm animate-shake">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* If current session is not admin, provide admin login unlock */}
      {!isAdmin ? (
        <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-8 border border-beige dark:border-charcoal-700 shadow-sm text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold text-teal dark:text-ivory font-heading">
            Administrator Access Required
          </h3>

          <p className="text-xs text-greygreen dark:text-ivory/70 leading-relaxed">
            You are currently logged in with an Assessor session. To issue official Digital Skill Passports or approve pending assessors, switch to the platform Administrator session.
          </p>

          <form onSubmit={handleAdminQuickLogin} className="space-y-3 pt-2 text-left">
            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                Administrator Email *
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@organization.in"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50 dark:bg-charcoal-900 text-xs text-teal dark:text-ivory"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                Password *
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter administrator password"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50 dark:bg-charcoal-900 text-xs text-teal dark:text-ivory"
              />
            </div>

            <button
              type="submit"
              disabled={adminLoggingIn}
              className="w-full py-3 rounded-2xl bg-teal dark:bg-charcoal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition-all"
            >
              {adminLoggingIn ? 'Authenticating Administrator...' : 'Sign In as Administrator'}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tab Selector */}
          <div className="flex border-b border-beige dark:border-charcoal-700 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('passports')}
              className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'passports'
                  ? 'border-terracotta text-terracotta'
                  : 'border-transparent text-greygreen hover:text-teal dark:text-ivory/60 dark:hover:text-ivory'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Digital Skill Passports ({credentials.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('assessors')}
              className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'assessors'
                  ? 'border-terracotta text-terracotta'
                  : 'border-transparent text-greygreen hover:text-teal dark:text-ivory/60 dark:hover:text-ivory'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Assessor Accreditation ({assessors.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('contractors')}
              className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'contractors'
                  ? 'border-terracotta text-terracotta'
                  : 'border-transparent text-greygreen hover:text-teal dark:text-ivory/60 dark:hover:text-ivory'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Contractors & Jobs ({contractors.length})</span>
            </button>
          </div>

          {/* TAB 1: DIGITAL SKILL PASSPORTS */}
          {activeTab === 'passports' && (
            <div className="space-y-6">
              {/* Ready to Issue Section */}
              <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-teal dark:text-ivory font-heading flex items-center gap-2">
                      <Award className="w-5 h-5 text-terracotta" />
                      Approved Demonstrations Ready for Issuance
                    </h3>
                    <p className="text-xs text-greygreen dark:text-ivory/60 mt-0.5">
                      3-Step Trust Rule: Worker submits → Accredited Assessor reviews & approves → Admin seals & issues QR passport
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-sand-100 dark:bg-charcoal-700 text-teal dark:text-ivory font-bold">
                    {approvedSubmissions.length} Available
                  </span>
                </div>

                {loadingPassports ? (
                  <div className="py-8 text-center text-xs text-greygreen flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-terracotta" />
                    <span>Loading submissions...</span>
                  </div>
                ) : approvedSubmissions.length === 0 ? (
                  <div className="py-6 text-center text-xs text-greygreen dark:text-ivory/60 bg-sand-50/50 dark:bg-charcoal-900 rounded-2xl border border-beige dark:border-charcoal-700">
                    No newly approved worker demonstrations pending passport issuance.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {approvedSubmissions.map((sub) => {
                      const alreadyIssued = credentials.some(c => c.submission_id === sub.id && c.status === 'active');
                      const isProcessing = processingId === `sub-${sub.id}`;

                      return (
                        <div
                          key={sub.id}
                          className="p-4 rounded-2xl bg-sand-50/70 dark:bg-charcoal-900 border border-beige dark:border-charcoal-700 flex flex-col justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-teal dark:text-ivory capitalize">
                                {sub.worker_name}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                Approved ({sub.final_score || sub.reviews?.[0]?.total_score || 'Pass'})
                              </span>
                            </div>
                            <p className="text-xs text-greygreen dark:text-ivory/70 mt-1 capitalize">
                              Trade: <strong>{sub.worker_trade || sub.trade}</strong>
                            </p>
                            <p className="text-[11px] text-greygreen dark:text-ivory/50 truncate mt-0.5">
                              Task: {sub.task?.title || 'Practical Demonstration'}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-beige/60 dark:border-charcoal-700 flex items-center justify-between">
                            <span className="text-[10px] text-greygreen dark:text-ivory/50">
                              Submission #{sub.id}
                            </span>
                            {alreadyIssued ? (
                              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Passport Active
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleIssueCredential(sub.id)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                              >
                                <Award className="w-3.5 h-3.5" />
                                <span>{isProcessing ? 'Generating QR...' : 'Issue Passport'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Issued Passports Registry */}
              <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-beige dark:border-charcoal-700">
                  <h3 className="text-base font-bold text-teal dark:text-ivory font-heading flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-teal dark:text-ivory" />
                    Official Digital Skill Passports Registry ({credentials.length})
                  </h3>
                  <span className="text-xs text-greygreen dark:text-ivory/60">
                    PostgreSQL `skill_credentials`
                  </span>
                </div>

                {credentials.length === 0 ? (
                  <div className="py-12 text-center text-xs text-greygreen dark:text-ivory/60">
                    No Skill Passports have been issued yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {credentials.map((cred) => {
                      const isValid = cred.status === 'active' || cred.status === 'valid';
                      const isProcessing = processingId === `cred-${cred.id}`;

                      return (
                        <div
                          key={cred.id}
                          className="p-4 sm:p-5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-black text-terracotta">
                                {cred.credential_id}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isValid
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                              }`}>
                                {cred.status}
                              </span>
                              <span className="text-xs font-bold text-teal dark:text-ivory">
                                {cred.worker_name}
                              </span>
                            </div>

                            <p className="text-xs text-greygreen dark:text-ivory/70 capitalize">
                              Trade: <strong>{cred.trade}</strong> • Level: <strong>{cred.skill_level}</strong>
                            </p>

                            <div className="text-[11px] text-greygreen dark:text-ivory/50 flex items-center gap-2 pt-0.5 flex-wrap">
                              <span>Issued: {cred.issue_date ? new Date(cred.issue_date).toLocaleDateString() : 'Active'}</span>
                              <span>•</span>
                              <span>Authority: {cred.issuing_authority || 'SkillSetu National Vocational Board'}</span>
                              {cred.revocation_reason && (
                                <span className="text-red-500 font-semibold">• Revocation: {cred.revocation_reason}</span>
                              )}
                            </div>
                          </div>

                          {/* Verification Link & Revocation */}
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            <Link
                              to={`/verify/${cred.verification_token}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 text-teal dark:text-ivory text-xs font-bold hover:bg-sand-100 shadow-xs transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Verify QR</span>
                            </Link>

                            {isValid && (
                              <button
                                type="button"
                                onClick={() => {
                                  setRevokingCredential(cred);
                                  setRevocationReason('');
                                }}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 hover:bg-red-200 text-xs font-bold transition-all"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                <span>Revoke</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ASSESSOR ACCREDITATION */}
          {activeTab === 'assessors' && (
            <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-beige dark:border-charcoal-700">
                <h3 className="text-base font-bold text-teal dark:text-ivory font-heading">
                  Registered Assessor Applications ({assessors.length})
                </h3>
                <span className="text-xs text-greygreen dark:text-ivory/60">
                  PostgreSQL `users` Table
                </span>
              </div>

              {loadingAssessors ? (
                <div className="py-12 text-center text-greygreen dark:text-ivory/60 text-xs flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-terracotta" />
                  <span>Loading assessor registry...</span>
                </div>
              ) : assessors.length === 0 ? (
                <div className="py-12 text-center text-greygreen dark:text-ivory/60 text-xs">
                  No registered assessors found in database.
                </div>
              ) : (
                <div className="space-y-4">
                  {assessors.map((item) => {
                    const isItemApproved = item.verification_status === 'approved';
                    const isItemPending = item.verification_status === 'pending';
                    const isProcessing = processingId === item.id;

                    return (
                      <div
                        key={item.id}
                        className="p-5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-teal dark:text-ivory font-heading">
                              {item.full_name}
                            </h4>

                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isItemApproved
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : isItemPending
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                            }`}>
                              {item.verification_status}
                            </span>
                          </div>

                          <p className="text-xs text-greygreen dark:text-ivory/70">
                            {item.email} • {item.professional_qualification}
                          </p>

                          <div className="text-[11px] text-greygreen dark:text-ivory/50 flex items-center gap-2 pt-0.5">
                            <span>Specialisation: <strong className="text-terracotta capitalize">{item.specialisation || 'General'}</strong></span>
                            <span>•</span>
                            <span>Experience: {item.years_of_experience || 0} years</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          {!isItemApproved && (
                            <button
                              type="button"
                              onClick={() => handleApproveAssessor(item.id)}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isProcessing ? 'Saving...' : 'Approve Assessor'}</span>
                            </button>
                          )}

                          {item.verification_status !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => handleRejectAssessor(item.id)}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
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

          {/* TAB 3: CONTRACTOR HUB & JOB MODERATION */}
          {activeTab === 'contractors' && (
            <div className="space-y-8">
              {/* SECTION A: CONTRACTOR VERIFICATION */}
              <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-beige dark:border-charcoal-700 gap-2">
                  <div>
                    <h3 className="text-base font-bold text-teal dark:text-ivory font-heading flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-terracotta" />
                      Contractor Organization Governance ({contractors.length})
                    </h3>
                    <p className="text-xs text-greygreen dark:text-ivory/60 mt-0.5">
                      Verify company credentials, GSTIN validity, and authorize direct hiring on SkillSetu
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 font-bold self-start sm:self-auto">
                    {contractors.filter(c => c.verification_status === 'pending').length} Pending Review
                  </span>
                </div>

                {loadingContractors ? (
                  <div className="py-12 text-center text-greygreen dark:text-ivory/60 text-xs flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-terracotta" />
                    <span>Loading registered contractor profiles...</span>
                  </div>
                ) : contractors.length === 0 ? (
                  <div className="py-10 text-center text-greygreen dark:text-ivory/60 text-sm">
                    No contractors registered on the platform yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {contractors.map((c) => {
                      const isProc = processingId === `contractor-${c.id}`;
                      const status = c.verification_status || 'pending';
                      return (
                        <div
                          key={c.id}
                          className="p-5 rounded-2xl border border-beige/80 dark:border-charcoal-700 bg-sand-50/50 dark:bg-charcoal-900/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h4 className="font-bold text-sm text-teal dark:text-ivory">
                                {c.company_name || 'Organization Details Pending'}
                              </h4>
                              <span
                                className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full ${
                                  status === 'verified'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : status === 'rejected'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                }`}
                              >
                                {status}
                              </span>
                              {c.business_type && (
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-sand-200/80 dark:bg-charcoal-700 text-greygreen dark:text-ivory/80 font-medium">
                                  {c.business_type}
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-greygreen dark:text-ivory/70 flex flex-wrap gap-x-4 gap-y-1">
                              <span><strong>Contact:</strong> {c.name} ({c.email})</span>
                              {c.phone && <span><strong>Phone:</strong> {c.phone}</span>}
                              {(c.city || c.state) && (
                                <span><strong>Location:</strong> {[c.city, c.state].filter(Boolean).join(', ')}</span>
                              )}
                            </div>

                            <div className="text-xs text-greygreen dark:text-ivory/60 flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
                              <span>
                                <strong>GSTIN:</strong>{' '}
                                <span className="font-mono bg-sand-200/60 dark:bg-charcoal-800 px-1.5 py-0.5 rounded">
                                  {c.gstin || 'Not Provided'}
                                </span>
                              </span>
                              <span><strong>Active Jobs:</strong> {c.active_jobs_count || 0}</span>
                              {c.created_at && (
                                <span><strong>Joined:</strong> {new Date(c.created_at).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-beige/60 dark:border-charcoal-700">
                            {status !== 'verified' && (
                              <button
                                type="button"
                                onClick={() => handleVerifyContractor(c.id, 'verified')}
                                disabled={isProc}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{isProc ? 'Saving...' : 'Verify Contractor'}</span>
                              </button>
                            )}
                            {status !== 'rejected' && (
                              <button
                                type="button"
                                onClick={() => handleVerifyContractor(c.id, 'rejected')}
                                disabled={isProc}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950/60 dark:text-red-300 dark:hover:bg-red-900/60 font-bold text-xs transition-all active:scale-95 disabled:opacity-50"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject / Suspend</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECTION B: PLATFORM JOB POSTING MODERATION */}
              <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-beige dark:border-charcoal-700 gap-2">
                  <div>
                    <h3 className="text-base font-bold text-teal dark:text-ivory font-heading flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-terracotta" />
                      Platform Job Postings Moderation ({adminJobs.length})
                    </h3>
                    <p className="text-xs text-greygreen dark:text-ivory/60 mt-0.5">
                      Audit all active, paused and closed job listings across India. Remove fraudulent or wage-exploitative postings.
                    </p>
                  </div>
                </div>

                {loadingAdminJobs ? (
                  <div className="py-12 text-center text-greygreen dark:text-ivory/60 text-xs flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-terracotta" />
                    <span>Loading platform job postings...</span>
                  </div>
                ) : adminJobs.length === 0 ? (
                  <div className="py-10 text-center text-greygreen dark:text-ivory/60 text-sm">
                    No job postings found on the platform.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {adminJobs.map((j) => {
                      const isProc = processingId === `job-${j.id}`;
                      return (
                        <div
                          key={j.id}
                          className="p-5 rounded-2xl border border-beige/80 dark:border-charcoal-700 bg-sand-50/50 dark:bg-charcoal-900/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h4 className="font-bold text-sm text-teal dark:text-ivory">
                                {j.title}
                              </h4>
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sand-200 dark:bg-charcoal-700 text-teal dark:text-ivory">
                                {j.trade}
                              </span>
                              <span
                                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                  j.status === 'active'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : j.status === 'paused'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                    : 'bg-sand-200 text-greygreen dark:bg-charcoal-700 dark:text-ivory/60'
                                }`}
                              >
                                {j.status}
                              </span>
                            </div>

                            <div className="text-xs text-greygreen dark:text-ivory/70 flex flex-wrap gap-x-4 gap-y-1">
                              <span><strong>Company:</strong> {j.company_name || j.contractor_name}</span>
                              <span><strong>Location:</strong> {[j.city, j.state].filter(Boolean).join(', ')}</span>
                              <span>
                                <strong>Wage:</strong> ₹{j.wage_min?.toLocaleString()} - ₹{j.wage_max?.toLocaleString()} / {j.wage_type}
                              </span>
                            </div>

                            <div className="text-xs text-greygreen dark:text-ivory/60 flex flex-wrap gap-x-4 gap-y-1">
                              <span><strong>Openings:</strong> {j.openings}</span>
                              <span><strong>Applications:</strong> {j.applications_count || 0}</span>
                              {j.created_at && (
                                <span><strong>Posted:</strong> {new Date(j.created_at).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-beige/60 dark:border-charcoal-700">
                            <button
                              type="button"
                              onClick={() => handleDeleteJob(j.id)}
                              disabled={isProc}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950/60 dark:text-red-300 dark:hover:bg-red-900/60 font-bold text-xs transition-all active:scale-95 disabled:opacity-50"
                              title="Remove fraudulent or non-compliant job posting"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{isProc ? 'Removing...' : 'Remove Listing'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Revocation Reason Modal */}
      {revokingCredential && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-beige dark:border-charcoal-700 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-teal dark:text-ivory font-heading">
                  Revoke Digital Skill Passport
                </h3>
                <p className="text-xs text-greygreen dark:text-ivory/60">
                  Credential ID: {revokingCredential.credential_id}
                </p>
              </div>
            </div>

            <p className="text-xs text-greygreen dark:text-ivory/70 leading-relaxed">
              Revoking this credential will immediately mark it as <strong>REVOKED</strong> on the public verification page. A formal reason is mandatory for platform audit logs.
            </p>

            <form onSubmit={handleRevokeCredential} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                  Reason for Revocation *
                </label>
                <textarea
                  rows="3"
                  value={revocationReason}
                  onChange={(e) => setRevocationReason(e.target.value)}
                  placeholder="e.g. Audit revealed non-compliant demonstration evidence or safety breach."
                  required
                  className="w-full p-3 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50 dark:bg-charcoal-900 text-xs text-teal dark:text-ivory focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRevokingCredential(null)}
                  className="px-4 py-2 rounded-xl border border-beige dark:border-charcoal-700 text-xs font-bold text-greygreen hover:bg-sand-50 dark:hover:bg-charcoal-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!revocationReason.trim() || processingId === `cred-${revokingCredential.id}`}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  {processingId === `cred-${revokingCredential.id}` ? 'Revoking...' : 'Confirm Revocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
