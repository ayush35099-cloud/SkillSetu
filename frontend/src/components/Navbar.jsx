import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useRegion } from '../context/RegionContext';
import ThemeSwitcher from './ThemeSwitcher';
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
  MapPin,
  ClipboardCheck
} from 'lucide-react';

export default function Navbar({ backendStatus, onRefreshStatus, onOpenLogin }) {
  const { currentLanguageMeta, setShowLanguageModal, t } = useLanguage();
  const { currentRegionMeta, setShowRegionModal } = useRegion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isWorkerPortal = location.pathname.startsWith('/worker');
  const isAssessorPortal = location.pathname.startsWith('/assessor');
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
    <header className="sticky top-0 z-40 bg-ivory/95 dark:bg-charcoal-900/95 backdrop-blur-md border-b border-beige dark:border-charcoal-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* Logo & Brand Identity */}
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal dark:bg-charcoal-800 text-white flex items-center justify-center shadow-md shadow-teal/15 border border-teal-700 dark:border-charcoal-600 transition-transform group-hover:scale-105">
              <HardHat className="w-6 h-6 text-terracotta-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-teal dark:text-ivory font-heading">
                  Skill<span className="text-terracotta dark:text-terracotta-400">Setu</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-terracotta-50 dark:bg-terracotta/20 text-terracotta-700 dark:text-terracotta-300 px-1.5 py-0.5 rounded border border-terracotta-200 dark:border-terracotta-800">
                  कौशल सेतु
                </span>
              </div>
              <p className="text-[11px] text-greygreen dark:text-ivory/60 font-medium hidden sm:block">
                {t('nav.brandSub', 'Vocational Skill Verification')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-semibold text-teal-700 dark:text-ivory/80">
            <a 
              href="#about" 
              onClick={(e) => handleNavAnchor(e, 'about')} 
              className="hover:text-terracotta dark:hover:text-amber-300 transition-colors"
            >
              {t('nav.about', 'About')}
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => handleNavAnchor(e, 'how-it-works')} 
              className="hover:text-terracotta dark:hover:text-amber-300 transition-colors"
            >
              {t('nav.howItWorks', 'How It Works')}
            </a>
            <a 
              href="#professions" 
              onClick={(e) => handleNavAnchor(e, 'professions')} 
              className="hover:text-terracotta dark:hover:text-amber-300 transition-colors"
            >
              {t('nav.professions', 'Professions')}
            </a>
            
            {/* Worker Portal Link with Active Highlight */}
            <Link
              to="/worker"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                isWorkerPortal
                  ? 'bg-teal dark:bg-charcoal-700 text-white shadow-xs'
                  : 'bg-beige/40 dark:bg-charcoal-800 text-teal dark:text-ivory hover:bg-beige dark:hover:bg-charcoal-700 hover:text-terracotta'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{t('worker.nav.portalTitle', 'Worker Portal')}</span>
              {isWorkerPortal && (
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
              )}
            </Link>

            {/* Assessor Portal Link */}
            <Link
              to="/assessor"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                isAssessorPortal
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200/80 dark:border-amber-800/40'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Assessor Portal</span>
            </Link>

            <a 
              href="#system-status" 
              onClick={(e) => handleNavAnchor(e, 'system-status')} 
              className="hover:text-terracotta dark:hover:text-amber-300 transition-colors"
            >
              {t('nav.status', 'API Status')}
            </a>
          </nav>

          {/* Controls: Region, Language, Theme, API Pill, Login, CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Region Selector Button (Searchable Indian States/UTs) */}
            <button
              type="button"
              onClick={() => setShowRegionModal(true)}
              title={`Selected Region: ${currentRegionMeta.name} (Click to change)`}
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-charcoal-800 hover:bg-beige/40 dark:hover:bg-charcoal-700 text-teal dark:text-ivory text-xs font-bold border border-beige dark:border-charcoal-700 shadow-xs transition-all max-w-[150px] truncate"
            >
              <MapPin className="w-3.5 h-3.5 text-terracotta dark:text-amber-400 shrink-0" />
              <span className="truncate">{currentRegionMeta.name.split(' ')[0]}</span>
            </button>

            {/* Language Switcher Button */}
            <button
              type="button"
              onClick={() => setShowLanguageModal(true)}
              title={t('nav.changeLang', 'Change Language')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-charcoal-800 hover:bg-beige/40 dark:hover:bg-charcoal-700 text-teal dark:text-ivory text-xs font-bold border border-beige dark:border-charcoal-700 shadow-xs transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-terracotta shrink-0" />
              <span className="font-heading">{currentLanguageMeta.nativeName}</span>
            </button>

            {/* Accessible Theme Switcher (Light / Dark / System) */}
            <ThemeSwitcher compact={true} />

            {/* Backend Status Indicator Pill */}
            <div 
              onClick={onRefreshStatus}
              title="Click to check backend status"
              className={`cursor-pointer inline-flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                backendStatus === 'connected'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100'
                  : backendStatus === 'checking'
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700 hover:bg-rose-100'
              }`}
            >
              {backendStatus === 'connected' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="hidden lg:inline text-[11px]">API Live</span>
                </>
              ) : backendStatus === 'checking' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span className="hidden lg:inline text-[11px]">Checking</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden lg:inline text-[11px]">Offline</span>
                </>
              )}
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={onOpenLogin}
              className="hidden sm:inline-flex items-center text-xs font-bold text-teal dark:text-ivory hover:text-terracotta dark:hover:text-amber-300 px-2 py-1.5 rounded-xl hover:bg-beige/30 dark:hover:bg-charcoal-700 transition-colors"
            >
              {t('nav.login', 'Login')}
            </button>

            {/* Primary Get Started Button */}
            <button
              type="button"
              onClick={handleGetStarted}
              className="hidden sm:inline-flex items-center justify-center px-3.5 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs sm:text-sm shadow-sm shadow-terracotta/25 transition-all transform active:scale-95"
            >
              {t('nav.getStarted', 'Get Started')}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-teal dark:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-800 border border-beige dark:border-charcoal-700 transition-colors"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer / Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-ivory dark:bg-charcoal-900 border-b border-beige dark:border-charcoal-700 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fadeIn">
          <div className="flex flex-col space-y-1">
            <a
              href="#about"
              onClick={(e) => handleNavAnchor(e, 'about')}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-teal dark:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-800 transition-colors flex items-center justify-between"
            >
              <span>{t('nav.about', 'About')}</span>
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleNavAnchor(e, 'how-it-works')}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-teal dark:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-800 transition-colors flex items-center justify-between"
            >
              <span>{t('nav.howItWorks', 'How It Works')}</span>
            </a>
            <a
              href="#professions"
              onClick={(e) => handleNavAnchor(e, 'professions')}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-teal dark:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-800 transition-colors flex items-center justify-between"
            >
              <span>{t('nav.professions', 'Professions')}</span>
            </a>
            <Link
              to="/worker"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
                isWorkerPortal 
                  ? 'bg-teal dark:bg-charcoal-700 text-white' 
                  : 'text-teal dark:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-800'
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
            <Link
              to="/assessor"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
                isAssessorPortal 
                  ? 'bg-amber-600 text-white' 
                  : 'text-teal dark:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-amber-500" />
                <span>Assessor Portal</span>
              </div>
              <span className="text-xs bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                Phase 3 Live
              </span>
            </Link>
            <a
              href="#system-status"
              onClick={(e) => handleNavAnchor(e, 'system-status')}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-teal dark:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-800 transition-colors flex items-center justify-between"
            >
              <span>{t('nav.status', 'API Status')}</span>
            </a>
          </div>

          {/* Mobile Region & Theme Quick Bar */}
          <div className="pt-3 border-t border-beige dark:border-charcoal-700 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setShowRegionModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 text-xs font-bold text-teal dark:text-ivory"
            >
              <MapPin className="w-3.5 h-3.5 text-terracotta" />
              <span>Region: {currentRegionMeta.name.split(' ')[0]}</span>
            </button>

            <ThemeSwitcher />
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-teal dark:text-ivory bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 hover:bg-beige/30 transition-colors flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4 text-teal dark:text-ivory" />
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
