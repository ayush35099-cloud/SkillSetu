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

  const [email, setEmail] = useState('assessor@skillsetu.in');
  const [password, setPassword] = useState('Assessor@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiService.assessorLogin(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Assessor login failed:', err);
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const setCredentials = (eMail, pwd) => {
    setEmail(eMail);
    setPassword(pwd);
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
          
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2 border border-red-200 dark:border-red-800">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
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
                  placeholder="assessor@skillsetu.in"
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

          {/* Quick Demo Pre-fill Accounts */}
          <div className="pt-4 border-t border-beige dark:border-charcoal-700 space-y-2">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-greygreen dark:text-ivory/60 text-center">
              1-Click Demo Testing Credentials:
            </span>

            <div className="grid grid-cols-1 gap-1.5">
              <button
                type="button"
                onClick={() => setCredentials('assessor@skillsetu.in', 'Assessor@123')}
                className="w-full p-2.5 rounded-xl bg-sand-50 hover:bg-sand-100 dark:bg-charcoal-700/60 dark:hover:bg-charcoal-700 border border-beige dark:border-charcoal-600 text-left flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <strong className="block text-teal dark:text-ivory font-bold">Approved Master Assessor</strong>
                  <span className="text-[10px] text-greygreen dark:text-ivory/60">assessor@skillsetu.in (Full Access)</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Approved</span>
              </button>

              <button
                type="button"
                onClick={() => setCredentials('vikram.assessor@skillsetu.in', 'Assessor@123')}
                className="w-full p-2.5 rounded-xl bg-sand-50 hover:bg-sand-100 dark:bg-charcoal-700/60 dark:hover:bg-charcoal-700 border border-beige dark:border-charcoal-600 text-left flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <strong className="block text-teal dark:text-ivory font-bold">Pending Assessor</strong>
                  <span className="text-[10px] text-greygreen dark:text-ivory/60">vikram.assessor@skillsetu.in (Test Gating)</span>
                </div>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Pending</span>
              </button>

              <button
                type="button"
                onClick={() => setCredentials('admin@skillsetu.in', 'Admin@123')}
                className="w-full p-2.5 rounded-xl bg-sand-50 hover:bg-sand-100 dark:bg-charcoal-700/60 dark:hover:bg-charcoal-700 border border-beige dark:border-charcoal-600 text-left flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <strong className="block text-teal dark:text-ivory font-bold">Platform Administrator</strong>
                  <span className="text-[10px] text-greygreen dark:text-ivory/60">admin@skillsetu.in (Approvals)</span>
                </div>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">Admin</span>
              </button>
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
