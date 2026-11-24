import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  HardHat, 
  Globe, 
  AlertCircle, 
  Loader2, 
  Menu, 
  X, 
  Briefcase, 
  User, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function Navbar({ backendStatus, onRefreshStatus, onOpenLogin }) {
  const { currentLanguageMeta, setShowLanguageModal, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isWorkerPortal = location.pathname.startsWith('/worker');
  const isHome = location.pathname === '/';

  const handleNavAnchor = (e, anchorId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (!isHome) {
      navigate('/#' + anchorId);
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(anchorId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    setMobileMenuOpen(false);
    navigate('/worker');
  };

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-md border-b border-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* Logo & Brand Identity */}
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 group"
          >
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
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-teal-700">
            <a 
              href="#about" 
              onClick={(e) => handleNavAnchor(e, 'about')} 
              className="hover:text-terracotta transition-colors"
            >
              {t('nav.about', 'About')}
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => handleNavAnchor(e, 'how-it-works')} 
              className="hover:text-terracotta transition-colors"
            >
              {t('nav.howItWorks', 'How It Works')}
            </a>
            <a 
              href="#professions" 
              onClick={(e) => handleNavAnchor(e, 'professions')} 
              className="hover:text-terracotta transition-colors"
            >
              {t('nav.professions', 'Professions')}
            </a>
            
            {/* Worker Portal Link with Active Highlight */}
            <Link
              to="/worker"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                isWorkerPortal
                  ? 'bg-teal text-white shadow-xs'
                  : 'bg-beige/40 text-teal hover:bg-beige hover:text-terracotta'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{t('worker.nav.portalTitle', 'Worker Portal')}</span>
              {isWorkerPortal && (
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
              )}
            </Link>

            <a 
              href="#system-status" 
              onClick={(e) => handleNavAnchor(e, 'system-status')} 
              className="hover:text-terracotta transition-colors"
            >
              {t('nav.status', 'API Status')}
            </a>
          </nav>

          {/* Controls: Language, API Pill, Login, CTA & Mobile Toggle */}
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

            {/* Login Button */}
            <button
              type="button"
              onClick={onOpenLogin}
              className="hidden sm:inline-flex items-center text-xs font-bold text-teal hover:text-terracotta px-2.5 py-1.5 rounded-xl hover:bg-beige/30 transition-colors"
            >
              {t('nav.login', 'Login')}
            </button>

            {/* Primary Get Started Button */}
            <button
              type="button"
              onClick={handleGetStarted}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs sm:text-sm shadow-sm shadow-terracotta/25 transition-all transform active:scale-95"
            >
              {t('nav.getStarted', 'Get Started')}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-teal hover:bg-beige/40 border border-beige transition-colors"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-teal" />
              ) : (
                <Menu className="w-5 h-5 text-teal" />
              )}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer / Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-ivory border-b border-beige px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fadeIn">
          <div className="flex flex-col space-y-1">
            <a
              href="#about"
              onClick={(e) => handleNavAnchor(e, 'about')}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-teal hover:bg-beige/40 transition-colors flex items-center justify-between"
            >
              <span>{t('nav.about', 'About')}</span>
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleNavAnchor(e, 'how-it-works')}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-teal hover:bg-beige/40 transition-colors flex items-center justify-between"
            >
              <span>{t('nav.howItWorks', 'How It Works')}</span>
            </a>
            <a
              href="#professions"
              onClick={(e) => handleNavAnchor(e, 'professions')}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-teal hover:bg-beige/40 transition-colors flex items-center justify-between"
            >
              <span>{t('nav.professions', 'Professions')}</span>
            </a>
            <Link
              to="/worker"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
                isWorkerPortal ? 'bg-teal text-white' : 'text-teal hover:bg-beige/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-terracotta" />
                <span>{t('worker.nav.portalTitle', 'Worker Portal')}</span>
              </div>
              <span className="text-xs bg-terracotta/20 text-terracotta px-2 py-0.5 rounded-full font-bold">
                Active
              </span>
            </Link>
            <a
              href="#system-status"
              onClick={(e) => handleNavAnchor(e, 'system-status')}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-teal hover:bg-beige/40 transition-colors flex items-center justify-between"
            >
              <span>{t('nav.status', 'API Status')}</span>
            </a>
          </div>

          <div className="pt-3 border-t border-beige flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-teal bg-white border border-beige hover:bg-beige/30 transition-colors flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4 text-teal" />
              <span>{t('nav.login', 'Login')}</span>
            </button>

            <button
              type="button"
              onClick={handleGetStarted}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-terracotta hover:bg-terracotta-600 shadow-sm shadow-terracotta/25 transition-all flex items-center justify-center gap-2"
            >
              <span>{t('nav.getStarted', 'Get Started')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
