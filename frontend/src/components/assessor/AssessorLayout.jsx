import React, { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { apiService } from '../../services/api';
import ThemeSwitcher from '../ThemeSwitcher';
import {
  LayoutDashboard,
  ClipboardList,
  History,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  ArrowLeft,
  LogOut,
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HardHat,
  Sliders
} from 'lucide-react';

export default function AssessorLayout() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [user, setUser] = useState(() => apiService.getStoredUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Refresh user profile from backend
    const fetchUser = async () => {
      try {
        const res = await apiService.getMe();
        if (res.user) {
          setUser(res.user);
        }
      } catch (err) {
        console.warn('Could not refresh assessor profile:', err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    apiService.logout();
    navigate('/assessor/login');
  };

  const isApproved = user?.verification_status === 'approved';
  const isAdmin = user?.role === 'admin';

  const navItems = [
    {
      to: '/assessor',
      end: true,
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      to: '/assessor/submissions',
      end: false,
      label: 'Submissions Queue',
      icon: ClipboardList,
    },
    {
      to: '/assessor/history',
      end: false,
      label: 'Evaluation History',
      icon: History,
    },
    {
      to: '/assessor/profile',
      end: false,
      label: 'My Credentials',
      icon: UserCheck,
    },
    ...(isAdmin ? [{
      to: '/assessor/admin',
      end: false,
      label: 'Admin Approvals',
      icon: Sliders,
    }] : [])
  ];

  return (
    <div className="min-h-screen bg-ivory dark:bg-charcoal-900 transition-colors">
      
      {/* 1. Top Operational Status Bar */}
      <div className="bg-teal-950 dark:bg-black text-ivory px-4 py-2 text-xs font-bold border-b border-teal-800 dark:border-charcoal-700 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>SKILLSETU PHASE 3:</strong> Certified Assessor Portal & Practical Evaluation Engine (PostgreSQL Backed)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isApproved ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] uppercase font-bold tracking-wider">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified Assessor</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] uppercase font-bold tracking-wider">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>Pending Approval (View Only)</span>
              </span>
            )}
            <Link
              to="/worker"
              className="text-[11px] text-terracotta-200 hover:text-white underline underline-offset-2 transition-colors"
            >
              Switch to Worker Portal →
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Assessor Header Banner */}
      <div className="bg-gradient-to-b from-teal via-teal-800 to-teal-900 dark:from-charcoal-950 dark:via-charcoal-900 dark:to-charcoal-950 text-white pt-8 pb-6 border-b border-teal-800 dark:border-charcoal-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Assessor Identity */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-400 text-teal-950 flex items-center justify-center font-black text-2xl shadow-lg ring-4 ring-amber-400/20 shrink-0 font-heading">
                {user?.full_name ? user.full_name[0].toUpperCase() : 'A'}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
                    {user?.full_name || 'Vocational Assessor'}
                  </h1>

                  {isApproved ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/50 text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Certified Assessor</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/50 text-xs font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                      <span>Awaiting Admin Verification</span>
                    </span>
                  )}

                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/50 text-xs font-bold">
                      <span>Administrator</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-ivory/80 mt-1 font-medium">
                  {user?.professional_qualification || 'Master Trades Evaluator'} • {user?.years_of_experience || 10} Years Industry Experience
                </p>

                <p className="text-[11px] text-ivory/60 mt-0.5">
                  Assigned Domain: <strong className="text-amber-300 uppercase">{user?.specialisation || 'Vocational Trades'}</strong> • Email: {user?.email}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/20 transition-all backdrop-blur-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>

              <ThemeSwitcher />

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600/80 hover:bg-red-700 text-white text-xs font-bold border border-red-500 transition-all shadow-sm active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-none border-b border-teal-700/60 dark:border-charcoal-700">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                      isActive
                        ? 'border-amber-400 bg-white/15 text-amber-300 dark:text-amber-200'
                        : 'border-transparent text-ivory/70 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

        </div>
      </div>

      {/* 3. Main Outlet Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet context={{ user, isApproved, isAdmin }} />
      </main>

    </div>
  );
}
