import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Languages, Check, ArrowRight, X, Sparkles } from 'lucide-react';

export default function LanguageModal() {
  const {
    language,
    confirmLanguage,
    showLanguageModal,
    setShowLanguageModal,
    hasSelectedLanguage,
    supportedLanguages,
    t,
  } = useLanguage();

  const [selectedCode, setSelectedCode] = useState(language);

  if (!showLanguageModal) return null;

  const handleContinue = () => {
    confirmLanguage(selectedCode);
  };

  const selectedMeta = supportedLanguages.find(l => l.code === selectedCode) || supportedLanguages[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-teal-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-ivory rounded-3xl border border-beige shadow-2xl p-6 sm:p-8 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-modal-title"
      >
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta-100/40 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-beige/40 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

        {/* Close Button (only accessible if user has previously chosen a language) */}
        {hasSelectedLanguage && (
          <button
            onClick={() => setShowLanguageModal(false)}
            aria-label="Close"
            className="absolute top-5 right-5 p-2 rounded-full text-greygreen hover:text-teal hover:bg-beige/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="relative text-center max-w-lg mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta-50 border border-terracotta-200 text-terracotta-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Languages className="w-3.5 h-3.5 text-terracotta" />
            <span>अपनी भाषा चुनें • Select Language</span>
          </div>

          <h2 id="language-modal-title" className="text-2xl sm:text-3xl font-extrabold text-teal tracking-tight font-heading">
            {t('modal.title', 'Choose Your Preferred Language')}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-greygreen leading-relaxed">
            {t('modal.subtitle', 'Select the language you are most comfortable with. You can change this anytime from the top menu.')}
          </p>
        </div>

        {/* Languages Grid */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[52vh] overflow-y-auto pr-1">
          {supportedLanguages.map((lang) => {
            const isSelected = selectedCode === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedCode(lang.code)}
                className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all relative group ${
                  isSelected
                    ? 'border-terracotta bg-white shadow-md shadow-terracotta/10 ring-2 ring-terracotta/20'
                    : 'border-beige/70 bg-white/70 hover:bg-white hover:border-beige hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xl sm:text-2xl font-bold text-teal font-heading">
                    {lang.nativeName}
                  </span>
                  {isSelected ? (
                    <span className="w-5 h-5 rounded-full bg-terracotta text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="text-[11px] text-greygreen font-medium group-hover:text-terracotta transition-colors">
                      {lang.greeting}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-1">
                  <span className="text-xs font-semibold text-greygreen">
                    {lang.name}
                  </span>
                  <span className="text-[10px] text-greygreen/80 bg-beige/40 px-2 py-0.5 rounded-md font-medium">
                    {lang.region}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Button & Note */}
        <div className="relative mt-6 pt-4 border-t border-beige/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-greygreen text-center sm:text-left">
            {t('modal.changeLater', 'You can change your language anytime from the top bar.')}
          </p>

          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-sm shadow-md shadow-terracotta/20 transition-all transform active:scale-[0.98]"
          >
            <span>{t('modal.continueBtn', 'Continue in')} {selectedMeta.nativeName}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
