import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../../services/api';
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  HardHat,
  Briefcase
} from 'lucide-react';

export default function ContractorLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/contractor';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorState({ type: 'auth', message: 'Please enter both email address and password.' });
      return;
    }

    setLoading(true);
    setErrorState(null);
    try {
      await apiService.contractorLogin(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      if (err?.isNetworkError) {
        setErrorState({
          type: 'network',
          message: err.message || 'Unable to reach backend server. Cold start may take ~45s on Render; please retry shortly.'
        });
      } else if (err?.isServerError || (err?.status >= 500)) {
        setErrorState({
          type: 'server',
          message: err.message || 'Authentication service temporarily unavailable. Please retry shortly.'
        });
      } else {
        setErrorState({
          type: 'auth',
          message: err?.message || 'Invalid contractor email address or password.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('contractor@skillsetu.in');
    setPassword('Contractor@123');
    setErrorState(null);
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-charcoal-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      
      {/* Back to Home Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal dark:text-ivory hover:text-terracotta transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Link
          to="/worker"
          className="text-xs font-bold text-terracotta hover:underline"
        >
          Worker Portal →
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-teal dark:bg-charcoal-800 text-white flex items-center justify-center mx-auto shadow-md border border-teal-700 dark:border-charcoal-700">
            <Building2 className="w-7 h-7 text-terracotta-200" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-teal dark:text-ivory font-heading">
            Contractor Hub Login
          </h2>
          <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/70">
            Phase 4: Verified Worker Discovery & Direct Job Hiring
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-charcoal-800 py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-beige dark:border-charcoal-700 space-y-6">
          
          {errorState && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{errorState.message}</p>
                {errorState.type === 'network' && (
                  <p className="mt-1 text-[11px] text-rose-700 dark:text-rose-300">
                    If backend is sleeping, wait 20-30 seconds and click Sign In again.
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1.5">
                Contractor / Company Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-greygreen">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contractor@skillsetu.in"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-sm focus:outline-none focus:ring-2 focus:ring-teal dark:focus:ring-terracotta transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-greygreen">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-sm focus:outline-none focus:ring-2 focus:ring-teal dark:focus:ring-terracotta transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal hover:bg-teal-800 text-white font-bold text-sm shadow-md shadow-teal/20 transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Contractor Hub'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Demo Fill */}
          <div className="pt-2 border-t border-beige dark:border-charcoal-700">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-teal-200 dark:border-charcoal-600 text-teal dark:text-ivory text-xs font-bold hover:bg-sand-50 dark:hover:bg-charcoal-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-terracotta" />
              <span>Fill Verified Contractor Credentials (L&T Urban Infra)</span>
            </button>
            <p className="text-[11px] text-center text-greygreen dark:text-ivory/50 mt-1.5">
              Email: <code>contractor@skillsetu.in</code> | Password: <code>Contractor@123</code>
            </p>
          </div>

          {/* Registration link */}
          <div className="text-center text-xs text-greygreen dark:text-ivory/70 pt-1">
            New contractor or builder?{' '}
            <Link
              to="/contractor/register"
              className="font-bold text-terracotta hover:underline"
            >
              Register your Company
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
