import React, { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  LayoutDashboard, 
  User, 
  Award, 
  QrCode, 
  ShieldCheck, 
  ArrowLeft, 
  MapPin, 
  HardHat, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export default function WorkerLayout() {
  const { t } = useLanguage();
  const location = useLocation();

  // Load any locally saved worker profile or fallback to defaults
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('skillsetu_worker_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      fullName: 'Ramesh Kumar',
      primaryTrade: 'Electrician',
      location: 'Bengaluru, Karnataka',
      experience: 8,
      phone: '+91 98765 43210'
    };
  });

  // Listen to storage events so profile updates in WorkerProfile reflect immediately
  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('skillsetu_worker_profile');
        if (saved) setProfile(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('profile-updated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('profile-updated', handleStorage);
    };
  }, []);

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
    <div className="min-h-screen bg-ivory">
      {/* Top Banner / Worker Header */}
      <div className="bg-gradient-to-b from-teal to-teal-900 text-white pt-8 pb-6 border-b border-teal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb / Back to Home Link */}
          <div className="flex items-center justify-between mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-xs font-semibold text-teal-100 hover:text-white bg-teal-800/60 hover:bg-teal-800 px-3 py-1.5 rounded-lg transition-colors border border-teal-700/60"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('worker.nav.backHome', 'Back to Home')}</span>
            </Link>

            <div className="inline-flex items-center gap-1.5 bg-terracotta/20 border border-terracotta/40 text-terracotta-200 text-xs font-bold px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-terracotta-300" />
              <span>Trade ID: SKL-IND-2026-8842</span>
            </div>
          </div>

          {/* Worker Identity Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar with Verified Ring */}
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-200 flex items-center justify-center font-heading text-2xl font-black shadow-inner">
                  RK
                </div>
                <div 
                  title="Level 2 Practically Verified"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-teal-900 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              {/* Name & Credentials */}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
                    {profile.fullName || t('worker.nav.workerName', 'Ramesh Kumar')}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>{t('worker.nav.levelBadge', 'Verified Level 2')}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-teal-200">
                  <span className="flex items-center gap-1 font-medium">
                    <HardHat className="w-3.5 h-3.5 text-terracotta-300" />
                    <span>{profile.primaryTrade || t('worker.nav.primaryTrade', 'Electrician')}</span>
                  </span>
                  <span className="text-teal-400">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-300" />
                    <span>{profile.location || 'Bengaluru, Karnataka'}</span>
                  </span>
                  <span className="text-teal-400">•</span>
                  <span>{profile.experience || 8} yrs exp</span>
                </div>
              </div>
            </div>

            {/* Quick Action / Passport Badge */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/worker/passport"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all shadow-sm"
              >
                <QrCode className="w-4 h-4 text-amber-300" />
                <span>{t('worker.dashboard.viewPassport', 'View Full Passport')}</span>
              </Link>
            </div>
          </div>

          {/* Sub-navigation Tabs */}
          <div className="mt-8 pt-2 border-t border-teal-800/80">
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
                          ? 'bg-ivory text-teal shadow-md'
                          : 'text-teal-200 hover:text-white hover:bg-teal-800/50'
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
