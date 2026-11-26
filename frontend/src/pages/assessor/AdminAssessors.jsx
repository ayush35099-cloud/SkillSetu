import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
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
  Lock
} from 'lucide-react';

export default function AdminAssessors() {
  const { user } = useOutletContext();
  const isAdmin = user?.role === 'admin';

  const [assessors, setAssessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Admin login toggle for testing
  const [adminPassword, setAdminPassword] = useState('Admin@123');
  const [adminLoggingIn, setAdminLoggingIn] = useState(false);

  const fetchAssessors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getAdminAssessors();
      if (res.assessors) setAssessors(res.assessors);
    } catch (err) {
      console.warn('Could not fetch assessors:', err);
      setError(err.message || 'Administrator authentication required.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAssessors();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleApprove = async (id) => {
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

  const handleReject = async (id) => {
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

  const handleAdminQuickLogin = async (e) => {
    e.preventDefault();
    setAdminLoggingIn(true);
    setError(null);
    try {
      await apiService.adminLogin('admin@skillsetu.in', adminPassword);
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Admin login failed');
    } finally {
      setAdminLoggingIn(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-teal dark:text-ivory font-heading">
            Assessor Accreditation Governance
          </h2>
          <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/60 mt-0.5">
            Admin review & approval engine for certified vocational evaluators
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={fetchAssessors}
            disabled={loading}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 text-teal dark:text-ivory text-xs font-bold hover:bg-sand-50 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh List</span>
          </button>
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
            You are currently logged in with a standard Assessor session. To approve or reject pending assessors, switch to the platform Administrator session.
          </p>

          <form onSubmit={handleAdminQuickLogin} className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-sand-50 dark:bg-charcoal-900 border border-beige dark:border-charcoal-600 text-xs text-left">
              <span className="font-bold text-teal dark:text-ivory">Demo Admin Credentials:</span>
              <p className="text-[11px] text-greygreen dark:text-ivory/60 mt-0.5">
                admin@skillsetu.in / Admin@123
              </p>
            </div>

            <button
              type="submit"
              disabled={adminLoggingIn}
              className="w-full py-3 rounded-2xl bg-teal dark:bg-charcoal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition-all"
            >
              {adminLoggingIn ? 'Authenticating Admin...' : 'Log in as Demo Administrator'}
            </button>
          </form>
        </div>
      ) : (
        /* Admin Assessors Table */
        <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-beige dark:border-charcoal-700">
            <h3 className="text-base font-bold text-teal dark:text-ivory font-heading">
              Registered Assessor Applications ({assessors.length})
            </h3>
            <span className="text-xs text-greygreen dark:text-ivory/60">
              PostgreSQL `users` Table
            </span>
          </div>

          {loading ? (
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
                          onClick={() => handleApprove(item.id)}
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
                          onClick={() => handleReject(item.id)}
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

    </div>
  );
}
