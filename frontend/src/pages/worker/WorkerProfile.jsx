import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useRegion } from '../../context/RegionContext';
import { 
  getWorkerProfile, 
  saveWorkerProfile, 
  calculateProfileCompletion 
} from '../../services/demoWorkerService';
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
  Edit3,
  AlertTriangle
} from 'lucide-react';

export default function WorkerProfile() {
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const { regions, currentRegionMeta } = useRegion();

  const [formData, setFormData] = useState(() => getWorkerProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  const completion = calculateProfileCompletion(formData);

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
    if (!formData.fullName?.trim()) {
      errs.fullName = 'Full Name is required.';
    }
    const cleanPhone = formData.phone ? formData.phone.replace(/\D/g, '') : '';
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Valid 10-digit mobile number required.';
    }
    if (!formData.location?.trim()) {
      errs.location = 'City / Location is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const success = saveWorkerProfile(formData);
    if (success) {
      setSuccessMessage(t('worker.profile.saveSuccess', 'Worker profile updated successfully!'));
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Page Title & Instructions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-teal dark:text-ivory font-heading">
              {t('worker.profile.title', 'Worker Profile Details')}
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
              Demo Profile ({completion.percentage}% Complete)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/60 mt-1">
            {t('worker.profile.subtitle', 'Your verified trade identity, work history, and localized communication preferences.')}
          </p>
        </div>

        <div>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal dark:bg-charcoal-700 hover:bg-teal-800 dark:hover:bg-charcoal-600 text-white font-bold text-xs shadow-sm transition-all"
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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sand-200 dark:bg-charcoal-700 hover:bg-sand-300 dark:hover:bg-charcoal-600 text-teal dark:text-ivory font-bold text-xs transition-all"
            >
              <span>{t('worker.profile.cancelEdit', 'Cancel')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Honest Demo Notice */}
      <div className="p-3.5 rounded-2xl bg-sand-100/80 dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 text-xs text-greygreen dark:text-ivory/70 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Demo Profile Storage:</strong> Information saved here is maintained safely in your browser session for evaluation. Official verification records will connect to backend database services upon assessor integration.
        </p>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-sm font-bold flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Profile Form Card */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-beige dark:border-charcoal-700 shadow-sm space-y-8 transition-colors">
        
        {/* Top Avatar & Overview */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-beige dark:border-charcoal-700">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-700 dark:text-amber-300 flex items-center justify-center font-heading text-2xl font-black">
              {formData.fullName ? formData.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'RK'}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-teal dark:text-ivory font-heading">
                {formData.fullName}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-2 py-0.5 rounded-full">
                <span>Demo Profile Status</span>
              </span>
            </div>
            <p className="text-xs text-greygreen dark:text-ivory/60 mt-1">
              Your profile information helps illustrate how local contractors discover verified trade talent in {formData.location || currentRegionMeta.name}.
            </p>
          </div>
        </div>

        {/* Section 1: Personal Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-teal dark:text-ivory font-heading flex items-center gap-2">
            <User className="w-4 h-4 text-terracotta" />
            <span>{t('worker.profile.personalInfo', 'Personal Information')}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                {t('worker.profile.fullName', 'Full Name')} *
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border font-medium transition-all ${
                  !isEditing 
                    ? 'bg-sand-50/60 dark:bg-charcoal-700/60 border-beige dark:border-charcoal-600 text-teal-900 dark:text-ivory cursor-not-allowed'
                    : errors.fullName 
                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-400 text-rose-900 dark:text-rose-200' 
                    : 'bg-white dark:bg-charcoal-700 border-beige dark:border-charcoal-600 focus:border-teal text-teal-950 dark:text-ivory'
                }`}
                placeholder="e.g. Ramesh Kumar"
              />
              {errors.fullName && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                {t('worker.profile.phone', 'Mobile Number (WhatsApp enabled)')} *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-greygreen dark:text-ivory/50">+91</span>
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full pl-12 pr-4 py-2.5 rounded-xl text-sm border font-medium transition-all ${
                    !isEditing 
                      ? 'bg-sand-50/60 dark:bg-charcoal-700/60 border-beige dark:border-charcoal-600 text-teal-900 dark:text-ivory cursor-not-allowed'
                      : errors.phone 
                      ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-400 text-rose-900 dark:text-rose-200' 
                      : 'bg-white dark:bg-charcoal-700 border-beige dark:border-charcoal-600 focus:border-teal text-teal-950 dark:text-ivory'
                  }`}
                  placeholder="9876543210"
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Home State (Origin) */}
            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                Home State (Native Origin) *
              </label>
              <select
                disabled={!isEditing}
                value={formData.homeStateCode || 'BR'}
                onChange={(e) => {
                  const selectedReg = regions.find(r => r.code === e.target.value);
                  setFormData({
                    ...formData,
                    homeStateCode: e.target.value,
                    homeState: selectedReg ? selectedReg.name : ''
                  });
                }}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border font-medium transition-all ${
                  !isEditing 
                    ? 'bg-sand-50/60 dark:bg-charcoal-700/60 border-beige dark:border-charcoal-600 text-teal-900 dark:text-ivory cursor-not-allowed' 
                    : 'bg-white dark:bg-charcoal-700 border-beige dark:border-charcoal-600 text-teal-950 dark:text-ivory'
                }`}
              >
                {regions.filter(r => r.code !== 'IN-ALL').map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name} ({r.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Current City / Work Hub */}
            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                Current City / Work Hub *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-greygreen dark:text-ivory/40 absolute left-3.5 top-3" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.currentCity || formData.location?.split(',')[0] || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    currentCity: e.target.value,
                    location: `${e.target.value}, ${formData.currentState || 'Karnataka'}` 
                  })}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border font-medium transition-all ${
                    !isEditing 
                      ? 'bg-sand-50/60 dark:bg-charcoal-700/60 border-beige dark:border-charcoal-600 text-teal-900 dark:text-ivory cursor-not-allowed'
                      : 'bg-white dark:bg-charcoal-700 border-beige dark:border-charcoal-600 focus:border-teal text-teal-950 dark:text-ivory'
                  }`}
                  placeholder="e.g. Bengaluru"
                />
              </div>
            </div>

            {/* Current State Selection */}
            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                Current State / Union Territory *
              </label>
              <select
                disabled={!isEditing}
                value={formData.currentStateCode || formData.stateCode || 'KA'}
                onChange={(e) => {
                  const selectedReg = regions.find(r => r.code === e.target.value);
                  const stateName = selectedReg ? selectedReg.name : '';
                  setFormData({
                    ...formData,
                    currentStateCode: e.target.value,
                    currentState: stateName,
                    stateCode: e.target.value,
                    state: stateName,
                    location: `${formData.currentCity || 'Bengaluru'}, ${stateName}`
                  });
                }}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border font-medium transition-all ${
                  !isEditing 
                    ? 'bg-sand-50/60 dark:bg-charcoal-700/60 border-beige dark:border-charcoal-600 text-teal-900 dark:text-ivory cursor-not-allowed' 
                    : 'bg-white dark:bg-charcoal-700 border-beige dark:border-charcoal-600 text-teal-950 dark:text-ivory'
                }`}
              >
                {regions.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Work Locations */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                Preferred Work Locations (Interstate Mobility)
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.preferredWorkLocations || 'Bengaluru, Patna, All India'}
                onChange={(e) => setFormData({ ...formData, preferredWorkLocations: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border font-medium transition-all ${
                  !isEditing 
                    ? 'bg-sand-50/60 dark:bg-charcoal-700/60 border-beige dark:border-charcoal-600 text-teal-900 dark:text-ivory cursor-not-allowed' 
                    : 'bg-white dark:bg-charcoal-700 border-beige dark:border-charcoal-600 focus:border-teal text-teal-950 dark:text-ivory'
                }`}
                placeholder="e.g. Bengaluru, Patna, Hyderabad, All India"
              />
              <p className="text-[11px] text-greygreen dark:text-ivory/60 mt-1">
                SkillSetu supports national mobility. You can find projects and contractors across any Indian State regardless of your home state.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Vocational Trade & Experience */}
        <div className="space-y-4 pt-6 border-t border-beige dark:border-charcoal-700">
          <h3 className="text-sm font-bold uppercase tracking-wider text-teal dark:text-ivory font-heading flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-terracotta" />
            <span>{t('worker.profile.tradeInfo', 'Vocational Trade & Experience')}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Primary Trade Selection */}
            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                {t('worker.profile.primaryTrade', 'Primary Trade')}
              </label>
              <select
                disabled={!isEditing}
                value={formData.primaryTrade}
                onChange={(e) => setFormData({ ...formData, primaryTrade: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border font-medium transition-all ${
                  !isEditing ? 'bg-sand-50/60 dark:bg-charcoal-700/60 border-beige dark:border-charcoal-600 text-teal-900 dark:text-ivory cursor-not-allowed' : 'bg-white dark:bg-charcoal-700 border-beige dark:border-charcoal-600 text-teal-950 dark:text-ivory'
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
                <label className="text-xs font-bold text-teal dark:text-ivory">
                  {t('worker.profile.experience', 'Years of Practical Experience')}
                </label>
                <span className="text-xs font-bold text-terracotta dark:text-amber-300">
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
              <div className="flex justify-between text-[10px] text-greygreen dark:text-ivory/50 font-medium">
                <span>1 yr</span>
                <span>15 yrs</span>
                <span>30+ yrs</span>
              </div>
            </div>

            {/* Preferred Language */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-teal dark:text-ivory mb-1">
                {t('worker.profile.prefLanguage', 'Preferred Interface Language')} (Independent from Region)
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
                        ? 'border-terracotta bg-terracotta-50 dark:bg-terracotta/20 text-terracotta-800 dark:text-amber-200'
                        : 'border-beige dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-teal dark:text-ivory'
                    } ${!isEditing ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div>
                      <p className="font-heading">{lang.nativeName}</p>
                      <p className="text-[10px] text-greygreen dark:text-ivory/50 font-normal">{lang.name}</p>
                    </div>
                    {formData.preferredLanguage === lang.code && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-terracotta dark:text-amber-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Specializations */}
        <div className="space-y-3 pt-6 border-t border-beige dark:border-charcoal-700">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal dark:text-ivory font-heading">
              {t('worker.profile.specializations', 'Specializations & Tool Proficiencies')}
            </h3>
            <p className="text-xs text-greygreen dark:text-ivory/60 mt-0.5">
              Select tool operations and practical benchmarks you are qualified to perform.
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
                      ? 'bg-teal dark:bg-charcoal-600 text-white border-teal dark:border-charcoal-500 shadow-xs'
                      : 'bg-white dark:bg-charcoal-800 border-beige dark:border-charcoal-700 text-teal-800 dark:text-ivory/70 hover:border-teal/40'
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
          <div className="pt-6 border-t border-beige dark:border-charcoal-700 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setErrors({});
              }}
              className="px-5 py-2.5 rounded-xl border border-beige dark:border-charcoal-700 bg-white dark:bg-charcoal-800 hover:bg-beige/40 text-teal dark:text-ivory text-xs font-bold transition-colors"
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
