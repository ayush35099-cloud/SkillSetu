import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mic, Sparkles, X, Volume2, Shield, AlertTriangle } from 'lucide-react';

export default function VoiceAssistantPill() {
  const { currentLanguageMeta, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Accessible Microphone Button */}
      <div className="fixed bottom-5 right-5 z-30">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-teal dark:bg-charcoal-800 hover:bg-teal-700 dark:hover:bg-charcoal-700 text-white shadow-xl shadow-teal/25 dark:shadow-black/50 border-2 border-beige dark:border-charcoal-600 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          aria-label={t('voiceAssistant.micBtn', 'Voice Assistance')}
        >
          <div className="relative">
            <span className="absolute -inset-1 rounded-full bg-terracotta/50 animate-ping opacity-75"></span>
            <div className="w-8 h-8 rounded-full bg-terracotta text-white flex items-center justify-center relative shadow-sm">
              <Mic className="w-4 h-4" />
            </div>
          </div>
          <div className="text-left hidden sm:block pr-1">
            <span className="block text-xs font-bold font-heading text-white leading-tight">
              {t('voiceAssistant.micBtn', 'Voice Assistant')}
            </span>
            <span className="block text-[10px] text-ivory/80 font-medium">
              {currentLanguageMeta.nativeName} (Demo)
            </span>
          </div>
        </button>
      </div>

      {/* Voice Architecture Modal (Transparent Phase 5 Prototype Notice) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/70 dark:bg-black/80 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-ivory dark:bg-charcoal-900 rounded-3xl border border-beige dark:border-charcoal-700 shadow-2xl p-6 sm:p-7 animate-scaleUp">
            
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-greygreen hover:text-teal dark:text-ivory/60 dark:hover:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 text-terracotta dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 w-fit">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Future Feature Architecture</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-teal dark:text-ivory font-heading mb-2">
              Voice Assistance Architecture (Phase 5)
            </h3>

            {/* Prototype Disclaimer */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs leading-relaxed space-y-1 mb-4">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Phase 2 Interface Prototype</span>
              </div>
              <p>
                Actual speech recognition and voice responses belong to Phase 5. In Phase 5, workers will be able to navigate, fill out profiles, and listen to assessment instructions simply by speaking in their native dialect.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 mb-6 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-greygreen dark:text-ivory/60 font-medium">Active Language Profile:</span>
                <span className="font-bold text-teal dark:text-ivory font-heading bg-ivory dark:bg-charcoal-700 px-2 py-0.5 rounded border border-beige dark:border-charcoal-600">
                  {currentLanguageMeta.nativeName} ({currentLanguageMeta.name})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-greygreen dark:text-ivory/60 font-medium">Regional Audio Pipeline:</span>
                <span className="font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700">
                  Scheduled for Phase 5
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 rounded-xl bg-teal dark:bg-charcoal-700 hover:bg-teal-700 dark:hover:bg-charcoal-600 text-white font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer"
            >
              {t('voiceAssistant.closeBtn', 'Understood (Prototype Acknowledged)')}
            </button>

          </div>
        </div>
      )}
    </>
  );
}
