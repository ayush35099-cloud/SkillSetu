import React, { useState, useEffect } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRegion } from '../../context/RegionContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  getWorkerProfile, 
  calculateProfileCompletion 
} from '../../services/demoWorkerService';
import { apiService } from '../../services/api';
import ThemeSwitcher from '../ThemeSwitcher';
import { 
  LayoutDashboard, 
  User, 
  Award, 
  QrCode, 
  ShieldAlert, 
  ArrowLeft, 
  MapPin, 
  HardHat, 
  CheckCircle2, 
  Sparkles,
  AlertTriangle,
  Globe2,
  HelpCircle,
  UserCheck
} from 'lucide-react';

export default function WorkerLayout() {
  const { t } = useLanguage();
  const { currentRegionMeta, setShowRegionModal } = useRegion();
  const { resolvedTheme } = useTheme();

  const [profile, setProfile] = useState(() => getWorkerProfile());
  const [completion, setCompletion] = useState(() => calculateProfileCompletion(profile));
  const [authUser, setAuthUser] = useState(() => apiService.getStoredUser());

  useEffect(() => {
    const handleProfileUpdate = () => {
      const p = getWorkerProfile();
      setProfile(p);
      setCompletion(calculateProfileCompletion(p));
      setAuthUser(apiService.getStoredUser());
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, []);

  // Use authenticated user profile if logged in
  const displayName = authUser?.full_name || profile.fullName || t('worker.nav.workerName', 'Ramesh Kumar');
  const displayTrade = authUser?.trade || authUser?.specialisation || profile.primaryTrade || 'Electrician';
  const displayLocation = authUser?.location || profile.location || 'Bengaluru, Karnataka';
  const displayExp = authUser?.years_of_experience ?? profile.experience ?? 8;

  const navItems = [
    {
      to: '/worker',
      end: true,
      label: t('worker.nav.dashboard', 'Dashboard'),
      icon: LayoutDashboard,
    },
    {
      to: '/worker/profile',
      end: false,
      label: t('worker.nav.profile', 'My Profile'),
      icon: User,
    },
    {
      to: '/worker/skills',
      end: false,
      label: t('worker.nav.skills', 'Skills & Verification'),
      icon: Award,
    },
    {
      to: '/worker/passport',
      end: false,
      label: t('worker.nav.passport', 'Skill Passport'),
      icon: QrCode,
    },
  ];

  return (
    <div className="min-h-screen bg-ivory dark:bg-charcoal-900 transition-colors">
      
      {/* 1. Mandatory Honest Demo Disclaimer Banner */}
      <div className="bg-amber-500 text-teal-950 px-4 py-2 text-xs font-bold border-b border-amber-600 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-teal-950" />
            <span>
              <strong>{t('worker.demoBannerTitle', 'PROTOTYPE DEMONSTRATION MODE')}:</strong>{' '}
              {t('worker.demoBannerBody', 'Worker data, skills, and passport credentials shown here are interactive sample previews for usability testing. They are not official government certifications or trade licenses.')}
            </span>
          </div>

          <span className="shrink-0 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-teal-950/15 font-mono">
            MVP Phase 2
          </span>
        </div>
      </div>

      {/* 2. Top Banner / Worker Header */}
      <div className="bg-gradient-to-b from-teal via-teal-800 to-teal-900 dark:from-charcoal-950 dark:via-charcoal-900 dark:to-charcoal-950 text-white pt-8 pb-6 border-b border-teal-800 dark:border-charcoal-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Bar: Return Link, Region Indicator & Theme Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-xs font-semibold text-teal-100 hover:text-white bg-teal-800/60 dark:bg-charcoal-800 hover:bg-teal-800 px-3 py-1.5 rounded-xl transition-colors border border-teal-700/60 dark:border-charcoal-600"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('worker.nav.backHome', 'Back to Home')}</span>
            </Link>

            <div className="flex items-center gap-2">
              {/* Region Selector Pill */}
              <button
                type="button"
                onClick={() => setShowRegionModal(true)}
                title="Change region preference"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-800/80 dark:bg-charcoal-800 hover:bg-teal-700 border border-teal-600/50 dark:border-charcoal-600 text-xs font-bold text-amber-200 transition-colors shadow-xs"
              >
                <MapPin className="w-3.5 h-3.5 text-terracotta-300" />
                <span>{currentRegionMeta.name}</span>
                <span className="text-[10px] text-teal-300 dark:text-ivory/50 uppercase">Change</span>
              </button>

              {/* Theme Switcher */}
              <ThemeSwitcher compact={true} />

              {/* Sample Trade ID Badge */}
              <div className="hidden sm:inline-flex items-center gap-1.5 bg-terracotta/20 border border-terracotta/40 text-terracotta-200 text-xs font-bold px-3 py-1 rounded-xl">
                <span>Sample ID: DEMO-IND-2026-8842</span>
              </div>
            </div>
          </div>

          {/* Worker Identity Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-200 flex items-center justify-center font-heading text-2xl font-black shadow-inner">
                  {displayName ? displayName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'RK'}
                </div>
                <div 
                  title={authUser ? 'Verified Worker Account' : 'Demo Profile Status'}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-teal-950 flex items-center justify-center ring-2 ring-teal-900 dark:ring-charcoal-900 shadow-sm"
                >
                  {authUser ? <UserCheck className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* Name & Credentials */}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
                    {displayName}
                  </h1>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    authUser
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                  }`}>
                    <span>{authUser ? 'Verified Worker Account' : t('worker.demoProfileBadge', 'Demo Worker Profile')}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-teal-200 dark:text-ivory/70">
                  <span className="flex items-center gap-1 font-medium capitalize">
                    <HardHat className="w-3.5 h-3.5 text-terracotta-300" />
                    <span>{displayTrade}</span>
                  </span>
                  <span className="text-teal-400">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-300" />
                    <span>{displayLocation}</span>
                  </span>
                  <span className="text-teal-400">•</span>
                  <span>{displayExp} yrs practical exp</span>
                  <span className="text-teal-400">•</span>
                  <span className="text-amber-300 font-semibold">{completion.percentage}% Profile Complete</span>
                </div>
              </div>
            </div>

            {/* Quick Action / Passport Badge */}
            <div className="flex items-center gap-3">
              <Link
                to="/worker/passport"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-white text-xs font-bold border border-white/20 dark:border-charcoal-600 transition-all shadow-sm"
              >
                <QrCode className="w-4 h-4 text-amber-300" />
                <span>{t('worker.dashboard.viewPassport', 'View Skill Passport Preview')}</span>
              </Link>
            </div>
          </div>

          {/* Sub-navigation Tabs */}
          <div className="mt-8 pt-2 border-t border-teal-800/80 dark:border-charcoal-700">
            <nav className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none" aria-label="Worker Subtabs">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-ivory dark:bg-charcoal-800 text-teal dark:text-ivory shadow-md ring-1 ring-beige dark:ring-charcoal-600'
                          : 'text-teal-200 dark:text-ivory/60 hover:text-white hover:bg-teal-800/50 dark:hover:bg-charcoal-800/50'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

        </div>
      </div>

      {/* Main Content View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
}
