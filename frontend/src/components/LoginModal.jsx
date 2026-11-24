import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { X, HardHat, Building2, ArrowRight, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('worker'); // 'worker' | 'contractor'

  if (!isOpen) return null;

  const handleContinue = () => {
    onClose();
    if (selectedRole === 'worker') {
      navigate('/worker');
    } else {
      // Future contractor portal
      navigate('/worker');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div 
        className="relative w-full max-w-lg bg-ivory rounded-3xl shadow-2xl border border-beige overflow-hidden transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration bar */}
        <div className="h-2.5 bg-gradient-to-r from-terracotta via-amber-500 to-teal" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-greygreen hover:text-teal hover:bg-beige/40 transition-colors"
          aria-label={t('loginModal.close', 'Close')}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Brand & Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal text-white flex items-center justify-center shadow-md shadow-teal/15">
              <HardHat className="w-5 h-5 text-terracotta-200" />
            </div>
            <div>
              <h2 id="login-modal-title" className="text-xl sm:text-2xl font-black text-teal font-heading">
                {t('loginModal.title', 'Welcome to SkillSetu')}
              </h2>
              <p className="text-xs sm:text-sm text-greygreen font-medium">
                {t('loginModal.subtitle', 'Choose your role to sign in or explore the platform.')}
              </p>
            </div>
          </div>

          {/* Role Selection Cards */}
          <div className="space-y-3 my-6">
            {/* Worker Role Option */}
            <div
              onClick={() => setSelectedRole('worker')}
              className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                selectedRole === 'worker'
                  ? 'border-terracotta bg-terracotta-50/50 shadow-sm'
                  : 'border-beige hover:border-teal/30 bg-white'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${selectedRole === 'worker' ? 'bg-terracotta text-white' : 'bg-sand-100 text-teal'}`}>
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-teal font-heading">
                    {t('loginModal.workerOption', 'I am a Skilled Worker / Artisan')}
                  </h3>
                  {selectedRole === 'worker' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-terracotta ring-4 ring-terracotta/20" />
                  )}
                </div>
                <p className="text-xs text-greygreen mt-0.5 leading-relaxed">
                  {t('loginModal.workerOptionDesc', 'Verify your practical skills, manage your digital trade passport, and find projects.')}
                </p>
              </div>
            </div>

            {/* Contractor Role Option */}
            <div
              onClick={() => setSelectedRole('contractor')}
              className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                selectedRole === 'contractor'
                  ? 'border-terracotta bg-terracotta-50/50 shadow-sm'
                  : 'border-beige hover:border-teal/30 bg-white'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${selectedRole === 'contractor' ? 'bg-terracotta text-white' : 'bg-sand-100 text-teal'}`}>
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-teal font-heading">
                    {t('loginModal.contractorOption', 'I am a Contractor / Builder')}
                  </h3>
                  {selectedRole === 'contractor' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-terracotta ring-4 ring-terracotta/20" />
                  )}
                </div>
                <p className="text-xs text-greygreen mt-0.5 leading-relaxed">
                  {t('loginModal.contractorOptionDesc', 'Browse certified local tradespeople with verified practical competence.')}
                </p>
              </div>
            </div>
          </div>

          {/* Transparent Auth Status Notice */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5 mb-6">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t('loginModal.authNotice', 'Full mobile OTP & voice authentication is coming in future phases. For now, continue directly to test the Worker experience.')}
            </p>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-sm shadow-md shadow-terracotta/20 transition-all transform active:scale-[0.98]"
          >
            <span>{t('loginModal.demoWorkerBtn', 'Continue to Worker Portal')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
