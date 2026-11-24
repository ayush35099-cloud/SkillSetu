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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-teal-950/70 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-ivory dark:bg-charcoal-900 rounded-3xl border border-beige dark:border-charcoal-700 shadow-2xl p-6 sm:p-8 overflow-hidden transition-colors"
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-modal-title"
      >
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta-100/40 dark:bg-terracotta-900/20 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-beige/40 dark:bg-charcoal-800/20 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

        {/* Close Button (only accessible if user has previously chosen a language) */}
        {hasSelectedLanguage && (
          <button
            onClick={() => setShowLanguageModal(false)}
            aria-label="Close"
            className="absolute top-5 right-5 p-2 rounded-full text-greygreen hover:text-teal dark:text-ivory/60 dark:hover:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="relative text-center max-w-lg mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta-50 dark:bg-terracotta/20 border border-terracotta-200 dark:border-terracotta-800 text-terracotta-700 dark:text-terracotta-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Languages className="w-3.5 h-3.5 text-terracotta" />
            <span>अपनी भाषा चुनें • Select Language</span>
          </div>

          <h2 id="language-modal-title" className="text-2xl sm:text-3xl font-extrabold text-teal dark:text-ivory tracking-tight font-heading">
            {t('modal.title', 'Choose Your Preferred Language')}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-greygreen dark:text-ivory/70 leading-relaxed">
            {t('modal.subtitle', 'SkillSetu is built for India’s skilled workforce. Select your primary language to navigate, listen to voice instructions, and verify skills comfortably.')}
          </p>
        </div>

        {/* Language Grid */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 mb-8">
          {supportedLanguages.map((lang) => {
            const isSelected = selectedCode === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedCode(lang.code)}
                className={`relative flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-charcoal-800 border-terracotta ring-2 ring-terracotta/20 dark:ring-terracotta/40 shadow-sm'
                    : 'bg-white/70 dark:bg-charcoal-800/70 border-beige dark:border-charcoal-700 hover:border-teal/40 dark:hover:border-charcoal-500 hover:bg-white dark:hover:bg-charcoal-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-teal dark:text-ivory font-heading">
                      {lang.nativeName}
                    </span>
                    {lang.code === 'hi' && (
                      <span className="text-[10px] font-semibold bg-sand-200 dark:bg-charcoal-700 text-teal dark:text-ivory/80 px-1.5 py-0.5 rounded">
                        लोकप्रिय
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-greygreen dark:text-ivory/60 font-medium">
                    {lang.name}
                  </span>
                </div>

                <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                  isSelected
                    ? 'bg-terracotta border-terracotta text-white shadow-xs'
                    : 'border-beige dark:border-charcoal-600 bg-ivory dark:bg-charcoal-700'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-3" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-beige dark:border-charcoal-700">
          <div className="text-xs text-greygreen dark:text-ivory/60 text-center sm:text-left flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            <span>
              {t('modal.note', 'You can change your language anytime from the menu.')}
            </span>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-sm shadow-md shadow-terracotta/25 transition-all transform active:scale-95 cursor-pointer"
          >
            <span>{t('modal.confirm', 'Continue')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
