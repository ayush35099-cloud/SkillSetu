import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mic, Sparkles, X, Volume2, Shield } from 'lucide-react';

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
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-teal hover:bg-teal-600 text-white shadow-xl shadow-teal/25 border-2 border-beige transition-all transform hover:scale-105 active:scale-95"
          aria-label={t('voiceAssistant.micBtn', 'Voice Assistance')}
        >
          <div className="relative">
            <span className="absolute -inset-1 rounded-full bg-terracotta/50 animate-ping opacity-75"></span>
            <div className="w-8 h-8 rounded-full bg-terracotta text-white flex items-center justify-center relative">
              <Mic className="w-4 h-4" />
            </div>
          </div>
          <div className="text-left hidden sm:block pr-1">
            <span className="block text-xs font-bold font-heading text-white leading-tight">
              {t('voiceAssistant.micBtn', 'Voice Assistance')}
            </span>
            <span className="block text-[10px] text-ivory/80 font-medium">
              {currentLanguageMeta.nativeName}
            </span>
          </div>
        </button>
      </div>

      {/* Voice Architecture Modal (Explaining upcoming speech integration) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-ivory rounded-3xl border border-beige shadow-2xl p-6 sm:p-7">
            
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-greygreen hover:text-teal hover:bg-beige/40 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-beige text-terracotta text-xs font-bold uppercase tracking-wider mb-4 w-fit">
              <Volume2 className="w-3.5 h-3.5 text-terracotta" />
              <span>{t('voiceAssistant.badge', 'Future Feature Architecture')}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-teal font-heading mb-2">
              {t('voiceAssistant.modalTitle', 'Voice Assistance Architecture Prepared')}
            </h3>

            <p className="text-xs sm:text-sm text-greygreen leading-relaxed mb-5">
              {t('voiceAssistant.modalBody', 'Multilingual voice interaction (speech-to-text and spoken instructions) will be activated in the dedicated Voice Assistant phase. You will be able to speak naturally in Hindi, Bengali, Marathi, Telugu, Tamil, Kannada, or English.')}
            </p>

            <div className="p-4 rounded-2xl bg-white border border-beige mb-6 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-greygreen font-medium">Active Language Profile:</span>
                <span className="font-bold text-teal font-heading bg-ivory px-2 py-0.5 rounded border border-beige">
                  {currentLanguageMeta.nativeName} ({currentLanguageMeta.name})
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-greygreen font-medium">Voice Interaction Protocol:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready for Audio Stream
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 rounded-xl bg-teal hover:bg-teal-600 text-white font-bold text-sm shadow-md transition-all active:scale-98"
            >
              {t('voiceAssistant.closeBtn', 'Understood')}
            </button>

          </div>
        </div>
      )}
    </>
  );
}
