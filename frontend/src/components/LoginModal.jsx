import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, 
  HardHat, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  Sparkles,
  ClipboardCheck,
  ShieldAlert,
  Clock,
  Info
} from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('worker'); // 'worker' | 'contractor' | 'assessor' | 'admin'
  const [showRoleNotice, setShowRoleNotice] = useState(false);

  if (!isOpen) return null;

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleNotice(role === 'contractor');
  };

  const handleContinue = () => {
    if (selectedRole === 'worker') {
      onClose();
      navigate('/worker');
    } else if (selectedRole === 'assessor') {
      onClose();
      navigate('/assessor');
    } else if (selectedRole === 'admin') {
      onClose();
      navigate('/assessor/admin');
    } else {
      setShowRoleNotice(true);
    }
  };

  const getRoleNoticeTitle = () => {
    switch (selectedRole) {
      case 'contractor':
        return 'Contractor Portal: Scheduled for Phase 4';
      default:
        return '';
    }
  };

  const getRoleNoticeBody = () => {
    switch (selectedRole) {
      case 'contractor':
        return 'Contractor onboarding and instant digital skill passport verification will activate in Phase 4. For now, please test the platform using the Worker or Assessor Portals.';
      default:
        return '';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/70 dark:bg-black/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div 
        className="relative w-full max-w-lg bg-ivory dark:bg-charcoal-900 rounded-3xl shadow-2xl border border-beige dark:border-charcoal-700 overflow-hidden transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration bar */}
        <div className="h-2.5 bg-gradient-to-r from-terracotta via-amber-500 to-teal" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-greygreen hover:text-teal dark:text-ivory/60 dark:hover:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-800 transition-colors"
          aria-label={t('loginModal.close', 'Close')}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Brand & Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal dark:bg-charcoal-800 text-white flex items-center justify-center shadow-md shadow-teal/15 border border-teal-700 dark:border-charcoal-600">
              <HardHat className="w-5 h-5 text-terracotta-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="login-modal-title" className="text-xl sm:text-2xl font-black text-teal dark:text-ivory font-heading">
                  {t('loginModal.title', 'Welcome to SkillSetu')}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  MVP Prototype
                </span>
              </div>
              <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/60 font-medium">
                {t('loginModal.subtitle', 'Choose your role to sign in or explore the platform.')}
              </p>
            </div>
          </div>

          {/* Role Selection Cards */}
          <div className="space-y-3 my-5">
            {/* 1. Worker Role Option */}
            <div
              onClick={() => handleRoleSelect('worker')}
              className={`cursor-pointer p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                selectedRole === 'worker'
                  ? 'border-terracotta bg-terracotta-50/70 dark:bg-terracotta/20 shadow-sm'
                  : 'border-beige dark:border-charcoal-700 hover:border-teal/30 dark:hover:border-charcoal-500 bg-white dark:bg-charcoal-800/80'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${selectedRole === 'worker' ? 'bg-terracotta text-white' : 'bg-sand-100 dark:bg-charcoal-700 text-teal dark:text-ivory'}`}>
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-teal dark:text-ivory font-heading">
                    {t('loginModal.workerOption', 'I am a Skilled Worker / Artisan')}
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                    Live Demo
                  </span>
                </div>
                <p className="text-xs text-greygreen dark:text-ivory/60 mt-0.5 leading-relaxed">
                  {t('loginModal.workerOptionDesc', 'Verify your practical skills, manage your digital trade passport, and find projects.')}
                </p>
              </div>
            </div>

            {/* 2. Contractor Role Option */}
            <div
              onClick={() => handleRoleSelect('contractor')}
              className={`cursor-pointer p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                selectedRole === 'contractor'
                  ? 'border-terracotta bg-terracotta-50/70 dark:bg-terracotta/20 shadow-sm'
                  : 'border-beige dark:border-charcoal-700 hover:border-teal/30 dark:hover:border-charcoal-500 bg-white dark:bg-charcoal-800/80'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${selectedRole === 'contractor' ? 'bg-terracotta text-white' : 'bg-sand-100 dark:bg-charcoal-700 text-teal dark:text-ivory'}`}>
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-teal dark:text-ivory font-heading">
                    {t('loginModal.contractorOption', 'I am a Contractor / Builder')}
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sand-200 dark:bg-charcoal-700 text-greygreen dark:text-ivory/60">
                    Phase 4
                  </span>
                </div>
                <p className="text-xs text-greygreen dark:text-ivory/60 mt-0.5 leading-relaxed">
                  {t('loginModal.contractorOptionDesc', 'Browse certified local tradespeople with verified practical competence.')}
                </p>
              </div>
            </div>

            {/* 3. Assessor Role Option */}
            <div
              onClick={() => handleRoleSelect('assessor')}
              className={`cursor-pointer p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                selectedRole === 'assessor'
                  ? 'border-terracotta bg-terracotta-50/70 dark:bg-terracotta/20 shadow-sm'
                  : 'border-beige dark:border-charcoal-700 hover:border-teal/30 dark:hover:border-charcoal-500 bg-white dark:bg-charcoal-800/80'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${selectedRole === 'assessor' ? 'bg-terracotta text-white' : 'bg-sand-100 dark:bg-charcoal-700 text-teal dark:text-ivory'}`}>
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-teal dark:text-ivory font-heading">
                    {t('loginModal.assessorOption', 'I am a Vocational Assessor')}
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    Phase 3 Live
                  </span>
                </div>
                <p className="text-xs text-greygreen dark:text-ivory/60 mt-0.5 leading-relaxed">
                  Review practical trade demonstrations against standardized rubrics stored in PostgreSQL.
                </p>
              </div>
            </div>

            {/* 4. Admin Role Option */}
            <div
              onClick={() => handleRoleSelect('admin')}
              className={`cursor-pointer p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                selectedRole === 'admin'
                  ? 'border-terracotta bg-terracotta-50/70 dark:bg-terracotta/20 shadow-sm'
                  : 'border-beige dark:border-charcoal-700 hover:border-teal/30 dark:hover:border-charcoal-500 bg-white dark:bg-charcoal-800/80'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${selectedRole === 'admin' ? 'bg-terracotta text-white' : 'bg-sand-100 dark:bg-charcoal-700 text-teal dark:text-ivory'}`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-teal dark:text-ivory font-heading">
                    {t('loginModal.adminOption', 'Platform Administrator')}
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    Approval Hub
                  </span>
                </div>
                <p className="text-xs text-greygreen dark:text-ivory/60 mt-0.5 leading-relaxed">
                  Verify assessor credentials, approve new evaluators, and manage platform compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Role Status Notice for Contractor */}
          {selectedRole === 'contractor' && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5 mb-5 animate-fadeIn">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="block font-bold">
                  {getRoleNoticeTitle()}
                </strong>
                <p className="mt-0.5">
                  {getRoleNoticeBody()}
                </p>
              </div>
            </div>
          )}

          {/* Transparent Auth Status Notice */}
          <div className="p-3 rounded-xl bg-teal-50/80 dark:bg-charcoal-800 border border-teal-200/60 dark:border-charcoal-700 text-teal-900 dark:text-ivory/80 text-xs flex items-start gap-2.5 mb-5">
            <Info className="w-4 h-4 text-teal dark:text-ivory/60 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t('loginModal.authNotice', 'Authentication is integrated with PostgreSQL. Assessor demo accounts and Admin credentials are pre-configured.')}
            </p>
          </div>

          {/* Action Button */}
          {selectedRole === 'worker' ? (
            <button
              type="button"
              onClick={handleContinue}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-sm shadow-md shadow-terracotta/20 transition-all transform active:scale-[0.98]"
            >
              <span>{t('loginModal.demoWorkerBtn', 'Enter Worker Demo Portal')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : selectedRole === 'assessor' ? (
            <button
              type="button"
              onClick={handleContinue}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-teal hover:bg-teal-800 text-white font-bold text-sm shadow-md shadow-teal/20 transition-all transform active:scale-[0.98]"
            >
              <span>Enter Assessor Portal (Phase 3)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : selectedRole === 'admin' ? (
            <button
              type="button"
              onClick={handleContinue}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition-all transform active:scale-[0.98]"
            >
              <span>Enter Admin Approval Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('worker');
                  setShowRoleNotice(false);
                }}
                className="w-full py-3 rounded-2xl border border-beige dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-teal dark:text-ivory font-bold text-xs hover:bg-beige/40 dark:hover:bg-charcoal-700 transition-colors"
              >
                Switch to Worker Demo
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-sand-200 dark:bg-charcoal-700 text-teal dark:text-ivory font-bold text-xs hover:bg-sand-300 dark:hover:bg-charcoal-600 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
