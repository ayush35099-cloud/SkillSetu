import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { apiService } from '../../services/api';
import {
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  Award,
  Mail,
  Clock,
  Briefcase,
  CheckCircle2,
  RefreshCw,
  Save,
  HardHat
} from 'lucide-react';

export default function AssessorProfile() {
  const { user: initialUser } = useOutletContext();

  const [profile, setProfile] = useState(initialUser || null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Edit fields
  const [fullName, setFullName] = useState(initialUser?.full_name || '');
  const [qualification, setQualification] = useState(initialUser?.professional_qualification || '');
  const [experience, setExperience] = useState(initialUser?.years_of_experience || 10);
  const [specialisation, setSpecialisation] = useState(initialUser?.specialisation || 'electrician');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await apiService.getAssessorProfile();
        if (res.profile) {
          setProfile(res.profile);
          setFullName(res.profile.full_name || '');
          setQualification(res.profile.professional_qualification || '');
          setExperience(res.profile.years_of_experience || 0);
          setSpecialisation(res.profile.specialisation || 'electrician');
        }
      } catch (err) {
        console.warn('Could not fetch fresh profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await apiService.updateAssessorProfile({
        full_name: fullName.trim(),
        professional_qualification: qualification.trim(),
        years_of_experience: experience,
        specialisation: specialisation.trim()
      });
      if (res.profile) setProfile(res.profile);
      setMessage('Profile updated successfully.');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const isApproved = profile?.verification_status === 'approved';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-teal dark:text-ivory font-heading">
          Assessor Credentials & Profile
        </h2>
        <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/60 mt-0.5">
          Official vocational assessor accreditation records stored in PostgreSQL
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm animate-scaleUp">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm animate-shake">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Verification Status Card */}
      <div className={`p-6 rounded-3xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isApproved
          ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100'
          : 'bg-amber-500/15 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-100'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            isApproved ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-teal-950'
          }`}>
            {isApproved ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>

          <div>
            <h3 className="font-bold text-base font-heading">
              {isApproved ? 'Accredited Assessor Account' : 'Account Awaiting Administrative Verification'}
            </h3>
            <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
              {isApproved
                ? 'Your credentials have been verified by SkillSetu Governance. You are authorized to evaluate practical submissions.'
                : 'Your profile has been created and is pending approval by the platform administrator before assessment decisions can be submitted.'}
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap ${
          isApproved ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-teal-950'
        }`}>
          {isApproved ? 'Verified' : 'Pending Approval'}
        </span>
      </div>

      {/* Profile Form */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-beige dark:border-charcoal-700">
          <div className="w-10 h-10 rounded-2xl bg-teal dark:bg-charcoal-700 text-white flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-terracotta-200" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-teal dark:text-ivory font-heading">
              Professional Qualifications & Trade Domain
            </h3>
            <p className="text-xs text-greygreen dark:text-ivory/60">
              Update your industry background and vocational specialties
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                Full Name:
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-600 text-xs sm:text-sm text-teal dark:text-ivory focus:ring-2 focus:ring-terracotta font-medium"
              />
            </div>

            {/* Email (Readonly) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-greygreen dark:text-ivory/60">
                Email Address (Permanent):
              </label>
              <input
                type="email"
                value={profile?.email || ''}
                readOnly
                disabled
                className="w-full px-4 py-2.5 rounded-2xl bg-sand-100 dark:bg-charcoal-900/60 border border-beige dark:border-charcoal-700 text-xs sm:text-sm text-greygreen dark:text-ivory/50 cursor-not-allowed font-medium"
              />
            </div>

            {/* Professional Qualification */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                Professional Qualification & Accreditation:
              </label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. ITI Certified Master Instructor, NSDC Assessor Level 4"
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-600 text-xs sm:text-sm text-teal dark:text-ivory focus:ring-2 focus:ring-terracotta font-medium"
              />
            </div>

            {/* Years of Experience */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                Years of Vocational Experience:
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-600 text-xs sm:text-sm text-teal dark:text-ivory focus:ring-2 focus:ring-terracotta font-medium"
              />
            </div>

            {/* Specialisation Trade */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory">
                Primary Trade Specialisation:
              </label>
              <select
                value={specialisation}
                onChange={(e) => setSpecialisation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-600 text-xs sm:text-sm text-teal dark:text-ivory focus:ring-2 focus:ring-terracotta font-medium"
              >
                <option value="electrician">Electrician (Electrical & Power)</option>
                <option value="plumber">Plumber (Plumbing & Hydro)</option>
                <option value="mason">Mason (Civil & Masonry)</option>
                <option value="carpenter">Carpenter (Timber & Joinery)</option>
                <option value="welder">Welder (Structural Fabrication)</option>
                <option value="painter">Painter (Finishes & Coatings)</option>
                <option value="mechanic">Mechanic (Automotive & Engines)</option>
                <option value="technician">Technician (Appliance & Systems)</option>
              </select>
            </div>

          </div>

          <div className="pt-4 border-t border-beige dark:border-charcoal-700 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-teal dark:bg-charcoal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
