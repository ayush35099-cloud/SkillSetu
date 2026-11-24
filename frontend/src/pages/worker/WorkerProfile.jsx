import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  Save, 
  Camera, 
  Globe, 
  ShieldCheck, 
  AlertCircle,
  Sparkles,
  Edit3
} from 'lucide-react';

export default function WorkerProfile() {
  const { language, setLanguage, supportedLanguages, t } = useLanguage();

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('skillsetu_worker_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      fullName: 'Ramesh Kumar',
      phone: '9876543210',
      location: 'Bengaluru, Karnataka',
      primaryTrade: 'electrician',
      experience: 8,
      specializations: ['Conduit Wiring', 'MCB Termination', '3-Phase Sizing', 'Earthing Pit Testing'],
      preferredLanguage: language || 'en'
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  const tradeOptions = [
    { value: 'electrician', label: t('professions.electrician.name', 'Electrician') },
    { value: 'plumber', label: t('professions.plumber.name', 'Plumber') },
    { value: 'mason', label: t('professions.mason.name', 'Mason') },
    { value: 'carpenter', label: t('professions.carpenter.name', 'Carpenter') },
    { value: 'welder', label: t('professions.welder.name', 'Welder') },
    { value: 'painter', label: t('professions.painter.name', 'Painter') },
    { value: 'mechanic', label: t('professions.mechanic.name', 'Mechanic') },
    { value: 'other', label: t('professions.other.name', 'Other Trades') }
  ];

  const allSpecializations = [
    'Conduit Wiring',
    'MCB Termination',
    '3-Phase Sizing',
    'Earthing Pit Testing',
    'Motor Starters',
    'Solar Inverter Setup',
    'CPVC/UPVC Piping',
    'Sanitaryware Fitting',
    'Hydrostatic Testing',
    'Brick Plumb Alignment',
    'RCC Shuttering',
    'Arc & MIG Welding',
    'Putty Smoothening',
    'Four-Stroke Engine Tuning'
  ];

  const handleToggleSpec = (spec) => {
    if (!isEditing) return;
    setFormData((prev) => {
      const current = prev.specializations || [];
      const updated = current.includes(spec)
        ? current.filter((s) => s !== spec)
        : [...current, spec];
      return { ...prev, specializations: updated };
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is required.';
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Valid 10-digit mobile number required.';
    }
    if (!formData.location.trim()) {
      errs.location = 'Location (City, State) is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      localStorage.setItem('skillsetu_worker_profile', JSON.stringify(formData));
      window.dispatchEvent(new Event('profile-updated'));
      setSuccessMessage(t('worker.profile.saveSuccess', 'Worker profile updated successfully!'));
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Page Title & Instructions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-teal font-heading">
            {t('worker.profile.title', 'Worker Profile Details')}
          </h2>
          <p className="text-xs sm:text-sm text-greygreen mt-1">
            {t('worker.profile.subtitle', 'Your verified trade identity, work history, and localized communication preferences.')}
          </p>
        </div>

        <div>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Edit3 className="w-4 h-4 text-terracotta-200" />
              <span>{t('worker.profile.editProfile', 'Edit Profile')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setErrors({});
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sand-200 hover:bg-sand-300 text-teal font-bold text-xs transition-all"
            >
              <span>{t('worker.profile.cancelEdit', 'Cancel')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-bold flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Profile Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-beige shadow-sm space-y-8">
        
        {/* Top Avatar & Trade Quick Overview */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-beige">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-700 flex items-center justify-center font-heading text-2xl font-black">
              RK
            </div>
            {isEditing && (
              <div className="absolute inset-0 rounded-2xl bg-teal-950/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-teal font-heading">
                {formData.fullName}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Worker</span>
              </span>
            </div>
            <p className="text-xs text-greygreen mt-1">
              {t('worker.profile.editingHint', 'Your profile information is visible to verified contractors looking for proven trade talent.')}
            </p>
          </div>
        </div>

        {/* Section 1: Personal Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-teal font-heading flex items-center gap-2">
            <User className="w-4 h-4 text-terracotta" />
            <span>{t('worker.profile.personalInfo', 'Personal Information')}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-teal mb-1">
                {t('worker.profile.fullName', 'Full Name')} *
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border font-medium transition-all ${
                  !isEditing 
                    ? 'bg-sand-50/60 border-beige text-teal-900 cursor-not-allowed'
                    : errors.fullName 
                    ? 'bg-rose-50 border-rose-400 text-rose-900 focus:ring-2 focus:ring-rose-200' 
                    : 'bg-white border-beige focus:border-teal focus:ring-2 focus:ring-teal/20 text-teal-950'
                }`}
                placeholder="e.g. Ramesh Kumar"
              />
              {errors.fullName && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-teal mb-1">
                {t('worker.profile.phone', 'Mobile Number (WhatsApp enabled)')} *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-greygreen">+91</span>
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full pl-12 pr-4 py-2.5 rounded-xl text-sm border font-medium transition-all ${
                    !isEditing 
                      ? 'bg-sand-50/60 border-beige text-teal-900 cursor-not-allowed'
                      : errors.phone 
                      ? 'bg-rose-50 border-rose-400 text-rose-900 focus:ring-2 focus:ring-rose-200' 
                      : 'bg-white border-beige focus:border-teal focus:ring-2 focus:ring-teal/20 text-teal-950'
                  }`}
                  placeholder="9876543210"
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* Location */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-teal mb-1">
                {t('worker.profile.location', 'Primary Location (City, State)')} *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-greygreen absolute left-3.5 top-3" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border font-medium transition-all ${
                    !isEditing 
                      ? 'bg-sand-50/60 border-beige text-teal-900 cursor-not-allowed'
                      : errors.location 
                      ? 'bg-rose-50 border-rose-400 text-rose-900 focus:ring-2 focus:ring-rose-200' 
                      : 'bg-white border-beige focus:border-teal focus:ring-2 focus:ring-teal/20 text-teal-950'
                  }`}
                  placeholder="e.g. Bengaluru, Karnataka"
                />
              </div>
              {errors.location && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.location}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Vocational Trade & Experience */}
        <div className="space-y-4 pt-6 border-t border-beige">
          <h3 className="text-sm font-bold uppercase tracking-wider text-teal font-heading flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-terracotta" />
            <span>{t('worker.profile.tradeInfo', 'Vocational Trade & Experience')}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Primary Trade Selection */}
            <div>
              <label className="block text-xs font-bold text-teal mb-1">
                {t('worker.profile.primaryTrade', 'Primary Trade')}
              </label>
              <select
                disabled={!isEditing}
                value={formData.primaryTrade}
                onChange={(e) => setFormData({ ...formData, primaryTrade: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border font-medium transition-all ${
                  !isEditing ? 'bg-sand-50/60 border-beige text-teal-900 cursor-not-allowed' : 'bg-white border-beige text-teal-950'
                }`}
              >
                {tradeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Years */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-teal">
                  {t('worker.profile.experience', 'Years of Practical Experience')}
                </label>
                <span className="text-xs font-bold text-terracotta">
                  {formData.experience} {t('worker.profile.experienceYears', 'Years')}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                disabled={!isEditing}
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value, 10) })}
                className="w-full accent-terracotta cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-greygreen font-medium">
                <span>1 yr</span>
                <span>15 yrs</span>
                <span>30+ yrs</span>
              </div>
            </div>

            {/* Preferred Navigation Language */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-teal mb-1">
                {t('worker.profile.prefLanguage', 'Preferred Interface Language')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    disabled={!isEditing}
                    onClick={() => {
                      setFormData({ ...formData, preferredLanguage: lang.code });
                      setLanguage(lang.code);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                      formData.preferredLanguage === lang.code
                        ? 'border-terracotta bg-terracotta-50 text-terracotta-800'
                        : 'border-beige bg-white text-teal hover:border-teal/30'
                    } ${!isEditing ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div>
                      <p className="font-heading">{lang.nativeName}</p>
                      <p className="text-[10px] text-greygreen font-normal">{lang.name}</p>
                    </div>
                    {formData.preferredLanguage === lang.code && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-terracotta" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Specializations & Tool Proficiencies */}
        <div className="space-y-3 pt-6 border-t border-beige">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal font-heading">
              {t('worker.profile.specializations', 'Specializations & Tool Proficiencies')}
            </h3>
            <p className="text-xs text-greygreen mt-0.5">
              Select key tool operations and practical benchmarks you are qualified to perform.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {allSpecializations.map((spec) => {
              const isSelected = formData.specializations?.includes(spec);
              return (
                <button
                  key={spec}
                  type="button"
                  onClick={() => handleToggleSpec(spec)}
                  disabled={!isEditing}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-teal text-white border-teal shadow-xs'
                      : 'bg-white border-beige text-teal-800 hover:border-teal/40'
                  } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {isSelected && <CheckCircle2 className="w-3 h-3 text-amber-300" />}
                  <span>{spec}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Actions */}
        {isEditing && (
          <div className="pt-6 border-t border-beige flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setErrors({});
              }}
              className="px-5 py-2.5 rounded-xl border border-beige bg-white hover:bg-beige/40 text-teal text-xs font-bold transition-colors"
            >
              {t('worker.profile.cancelEdit', 'Cancel')}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-md shadow-terracotta/20 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{t('worker.profile.saveBtn', 'Save Profile Changes')}</span>
            </button>
          </div>
        )}

      </form>
    </div>
  );
}
