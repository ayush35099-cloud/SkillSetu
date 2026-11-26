import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../../services/api';
import {
  Award,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  HardHat
} from 'lucide-react';

export default function AssessorLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/assessor';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(null); // { type: 'auth'|'server'|'network', message: string }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorState({ type: 'auth', message: 'Please enter both email address and password.' });
      return;
    }

    setLoading(true);
    setErrorState(null);
    try {
      await apiService.assessorLogin(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      if (err?.isNetworkError) {
        setErrorState({
          type: 'network',
          message: err.message || 'Unable to reach SkillSetu server. Render may be waking up (~45s); please retry shortly.'
        });
      } else if (err?.isServerError || (err?.status >= 500)) {
        setErrorState({
          type: 'server',
          message: err.message || 'The authentication service is temporarily unavailable. Please try again in a moment.'
        });
      } else {
        setErrorState({
          type: 'auth',
          message: err?.message || 'Invalid email address or password.'
        });
      }
    } finally {
      setLoading(false);
    }
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
          <span>Back to SkillSetu Home</span>
        </Link>

        <Link
          to="/worker"
          className="text-xs font-bold text-terracotta hover:underline"
        >
          Worker Portal Demo →
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-teal dark:bg-charcoal-800 text-white flex items-center justify-center mx-auto shadow-md border border-teal-700 dark:border-charcoal-700">
            <Award className="w-7 h-7 text-amber-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-teal dark:text-ivory font-heading">
            Assessor Portal Login
          </h2>
          <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/70">
            Phase 3: Certified Vocational Evaluation & Rubric Scoring Engine
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-charcoal-800 py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-beige dark:border-charcoal-700 space-y-6">
          
          {errorState && (
            <div
              role="alert"
              className={`p-3.5 rounded-2xl text-xs font-bold flex items-start gap-2 border ${
                errorState.type === 'network'
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="block uppercase text-[10px] tracking-wider opacity-80">
                  {errorState.type === 'network'
                    ? 'Connection / Cold-Start Notice'
                    : errorState.type === 'server'
                      ? 'Service Unavailable'
                      : 'Authentication Notice'}
                </span>
                <span>{errorState.message}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                Email Address:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-greygreen" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="assessor@organization.in"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-600 text-xs sm:text-sm text-teal dark:text-ivory focus:ring-2 focus:ring-terracotta font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                Password:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-greygreen" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-600 text-xs sm:text-sm text-teal dark:text-ivory focus:ring-2 focus:ring-terracotta font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-terracotta/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Assessor</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Access Roles Overview (No Hardcoded Credentials) */}
          <div className="pt-4 border-t border-beige dark:border-charcoal-700 space-y-2">
            <div className="p-3 rounded-2xl bg-sand-50 dark:bg-charcoal-900 border border-beige dark:border-charcoal-700 text-[11px] text-greygreen dark:text-ivory/70 leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-teal dark:text-amber-300 shrink-0 mt-0.5" />
              <span>
                Only accredited trade assessors and authorized administrators may sign in here. Approved assessors can score submissions and issue review decisions.
              </span>
            </div>
          </div>

          {/* Registration Link */}
          <div className="text-center pt-2">
            <span className="text-xs text-greygreen dark:text-ivory/60">
              Applying as a new trade assessor?{' '}
            </span>
            <Link
              to="/assessor/register"
              className="text-xs font-bold text-terracotta hover:underline"
            >
              Register here
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
