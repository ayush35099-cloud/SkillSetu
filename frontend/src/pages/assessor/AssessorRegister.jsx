import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import {
  Award,
  Lock,
  Mail,
  User,
  Briefcase,
  Clock,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  RefreshCw,
  ShieldAlert
} from 'lucide-react';

export default function AssessorRegister() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState(8);
  const [specialisation, setSpecialisation] = useState('electrician');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiService.assessorRegister({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        professional_qualification: qualification.trim(),
        years_of_experience: experience,
        specialisation
      });
      navigate('/assessor', { replace: true });
    } catch (err) {
      console.error('Assessor registration failed:', err);
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-charcoal-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      
      {/* Back to Home Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg px-4 mb-4 flex items-center justify-between">
        <Link
          to="/assessor/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal dark:text-ivory hover:text-terracotta transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assessor Login</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg px-4">
        
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-teal dark:bg-charcoal-800 text-white flex items-center justify-center mx-auto shadow-md border border-teal-700 dark:border-charcoal-700">
            <Award className="w-7 h-7 text-amber-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-teal dark:text-ivory font-heading">
            Register as Vocational Assessor
          </h2>
          <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/70">
            Join SkillSetu's decentralized peer evaluation panel for India's blue-collar trades
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-charcoal-800 py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-beige dark:border-charcoal-700 space-y-6">
          
          {/* Admin Approval Notice */}
          <div className="p-4 rounded-2xl bg-amber-500/15 dark:bg-amber-950/40 border border-amber-400 dark:border-amber-700 text-teal-950 dark:text-amber-100 text-xs flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 leading-relaxed">
              <strong className="block font-bold text-amber-950 dark:text-amber-200">
                Governance Requirement: Admin Verification Required
              </strong>
              <p>
                In accordance with Phase 3 security guidelines, all new assessor registrations require administrator verification before final evaluation decisions and scores can be issued to workers.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2 border border-red-200 dark:border-red-800">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                Full Legal Name:
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-greygreen" />
                <input
                  type="text"
                  placeholder="e.g. Anand R. Patel"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-600 text-xs sm:text-sm text-teal dark:text-ivory focus:ring-2 focus:ring-terracotta font-medium"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                Professional Email Address:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-greygreen" />
                <input
                  type="email"
                  placeholder="anand.patel@vocational.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-600 text-xs sm:text-sm text-teal dark:text-ivory focus:ring-2 focus:ring-terracotta font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                Password (min. 6 characters):
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-greygreen" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-600 text-xs sm:text-sm text-teal dark:text-ivory focus:ring-2 focus:ring-terracotta font-medium"
                />
              </div>
            </div>

            {/* Professional Qualification */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                Professional Qualification / Certification:
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-greygreen" />
                <input
                  type="text"
                  placeholder="e.g. ITI Certified Master Instructor, Diploma in Electrical"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-600 text-xs sm:text-sm text-teal dark:text-ivory focus:ring-2 focus:ring-terracotta font-medium"
                />
              </div>
            </div>

            {/* Grid for Experience & Specialisation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                  Years of Experience:
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-greygreen" />
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-600 text-xs sm:text-sm text-teal dark:text-ivory focus:ring-2 focus:ring-terracotta font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                  Trade Specialisation:
                </label>
                <select
                  value={specialisation}
                  onChange={(e) => setSpecialisation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-600 text-xs sm:text-sm text-teal dark:text-ivory focus:ring-2 focus:ring-terracotta font-medium"
                >
                  <option value="electrician">Electrician</option>
                  <option value="plumber">Plumber</option>
                  <option value="mason">Mason</option>
                  <option value="carpenter">Carpenter</option>
                  <option value="welder">Welder</option>
                  <option value="painter">Painter</option>
                  <option value="mechanic">Mechanic</option>
                  <option value="technician">Technician</option>
                </select>
              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-terracotta/20 transition-all flex items-center justify-center gap-2 active:scale-95 pt-3"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting Application to Database...</span>
                </>
              ) : (
                <>
                  <span>Complete Assessor Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center pt-2 border-t border-beige dark:border-charcoal-700">
            <span className="text-xs text-greygreen dark:text-ivory/60">
              Already have an assessor account?{' '}
            </span>
            <Link
              to="/assessor/login"
              className="text-xs font-bold text-teal dark:text-ivory hover:underline"
            >
              Sign in here
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
