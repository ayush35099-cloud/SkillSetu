import React, { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { 
  Building2, 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  UserCheck, 
  LogOut, 
  Menu, 
  X, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function ContractorLayout() {
  const [user, setUser] = useState(() => apiService.getStoredUser());
  const [profile, setProfile] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await apiService.getContractorProfile();
        if (res && res.profile) {
          setProfile(res.profile);
        }
      } catch (err) {
        console.warn('Could not load contractor profile:', err);
      }
    }
    loadProfile();
  }, []);

  const handleLogout = () => {
    apiService.logout();
    navigate('/contractor/login');
  };

  const companyName = profile?.company_name || user?.contractor_profile?.company_name || user?.full_name || 'Contractor Portal';
  const isVerified = (profile?.verification_status === 'verified') || (user?.contractor_profile?.verification_status === 'verified') || (user?.verification_status === 'verified');

  const navLinks = [
    { to: '/contractor', end: true, label: 'Dashboard', icon: LayoutDashboard },
    { to: '/contractor/jobs', end: false, label: 'Manage Jobs', icon: Briefcase },
    { to: '/contractor/applications', end: false, label: 'Applications', icon: FileText },
    { to: '/contractor/workers', end: false, label: 'Find Verified Workers', icon: Users },
    { to: '/contractor/profile', end: false, label: 'Company Profile', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-sand-50/60 dark:bg-charcoal-900 transition-colors">
      
      {/* Contractor Top Header */}
      <header className="sticky top-18 sm:top-20 z-30 bg-white/90 dark:bg-charcoal-800/90 backdrop-blur-md border-b border-beige dark:border-charcoal-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Branding & Role info */}
            <div className="flex items-center gap-3">
              <Link 
                to="/" 
                className="p-1.5 rounded-lg text-greygreen hover:text-teal dark:text-ivory/60 dark:hover:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-700 transition-colors"
                title="Back to Public Homepage"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="w-9 h-9 rounded-xl bg-teal dark:bg-charcoal-700 text-white flex items-center justify-center shadow-xs">
                <Building className="w-5 h-5 text-terracotta-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-teal dark:text-ivory font-heading leading-tight truncate max-w-[200px] sm:max-w-xs">
                    {companyName}
                  </h1>
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Partner</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Pending Verification</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-greygreen dark:text-ivory/60 font-medium">
                  Direct Hiring Marketplace & Contractor Hub
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-teal text-white shadow-xs'
                          : 'text-teal dark:text-ivory/80 hover:bg-beige/40 dark:hover:bg-charcoal-700'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* User action button & mobile toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors"
                title="Sign out of Contractor Hub"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-teal dark:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-700 border border-beige dark:border-charcoal-700 transition-colors"
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-charcoal-800 border-t border-beige dark:border-charcoal-700 px-4 py-3 space-y-1 shadow-lg animate-fadeIn">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-teal text-white'
                        : 'text-teal dark:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-700'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <div className="pt-2 border-t border-beige dark:border-charcoal-700">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

    </div>
  );
}
