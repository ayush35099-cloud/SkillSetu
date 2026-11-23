import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HardHat, Globe, Server, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function Navbar({ backendStatus, onRefreshStatus, onOpenGetStarted, onOpenLogin }) {
  const { currentLanguageMeta, setShowLanguageModal, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-md border-b border-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* Logo & Brand Identity */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal text-white flex items-center justify-center shadow-md shadow-teal/15 transition-transform group-hover:scale-105">
              <HardHat className="w-6 h-6 text-terracotta-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-teal font-heading">
                  Skill<span className="text-terracotta">Setu</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-terracotta-50 text-terracotta-700 px-1.5 py-0.5 rounded border border-terracotta-200">
                  कौशल सेतु
                </span>
              </div>
              <p className="text-[11px] text-greygreen font-medium hidden sm:block">
                {t('nav.brandSub', 'Vocational Skill Verification')}
              </p>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-teal-700">
            <a href="#about" className="hover:text-terracotta transition-colors">{t('nav.about', 'About')}</a>
            <a href="#how-it-works" className="hover:text-terracotta transition-colors">{t('nav.howItWorks', 'How It Works')}</a>
            <a href="#professions" className="hover:text-terracotta transition-colors">{t('nav.professions', 'Professions')}</a>
            <a href="#system-status" className="hover:text-terracotta transition-colors">{t('nav.status', 'API Status')}</a>
          </nav>

          {/* Controls: Language Picker, Backend Status Pill & CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher Button */}
            <button
              type="button"
              onClick={() => setShowLanguageModal(true)}
              title={t('nav.changeLang', 'Change Language')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-beige/40 text-teal text-xs font-bold border border-beige shadow-xs transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-terracotta" />
              <span className="font-heading">{currentLanguageMeta.nativeName}</span>
            </button>

            {/* Backend Status Indicator Pill */}
            <div 
              onClick={onRefreshStatus}
              title="Click to check backend status"
              className={`cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                backendStatus === 'connected'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : backendStatus === 'checking'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
              }`}
            >
              {backendStatus === 'connected' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="hidden xl:inline text-[11px]">API Live</span>
                </>
              ) : backendStatus === 'checking' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span className="hidden xl:inline text-[11px]">Checking</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden xl:inline text-[11px]">Offline</span>
                </>
              )}
            </div>

            {/* Login CTA (Static Clean Trigger) */}
            <button
              type="button"
              onClick={onOpenLogin}
              className="hidden sm:inline-flex items-center text-xs font-bold text-teal hover:text-terracotta px-2 py-1.5 transition-colors"
            >
              {t('nav.login', 'Login')}
            </button>

            {/* Primary CTA */}
            <button
              type="button"
              onClick={onOpenGetStarted}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs sm:text-sm shadow-sm shadow-terracotta/25 transition-all transform active:scale-95"
            >
              {t('nav.getStarted', 'Get Started')}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
