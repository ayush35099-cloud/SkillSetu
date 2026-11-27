import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Globe,
  CheckCircle2,
  Clock,
  Save,
  AlertCircle,
  Building,
  ShieldCheck
} from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi (NCT)', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function ContractorProfile() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    company_name: '',
    business_type: 'General Contractor',
    gstin: '',
    business_address: '',
    city: '',
    state: 'Maharashtra',
    contact_phone: '',
    contact_email: '',
    website: '',
    description: '',
    full_name: ''
  });

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await apiService.getContractorProfile();
      if (res) {
        setUser(res.user);
        const p = res.profile;
        setProfile(p);
        if (p) {
          setFormData({
            company_name: p.company_name || '',
            business_type: p.business_type || 'General Contractor',
            gstin: p.gstin || '',
            business_address: p.business_address || '',
            city: p.city || '',
            state: p.state || 'Maharashtra',
            contact_phone: p.contact_phone || res.user?.phone || '',
            contact_email: p.contact_email || res.user?.email || '',
            website: p.website || '',
            description: p.description || '',
            full_name: res.user?.full_name || ''
          });
        }
      }
    } catch (err) {
      console.error('Failed to load contractor profile:', err);
      setErrorMsg(err.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company_name.trim()) {
      setErrorMsg('Company name is required.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    try {
      const res = await apiService.updateContractorProfile(formData);
      setProfile(res.profile);
      setUser(res.user);
      setSuccessToast('Company profile updated successfully.');
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update company profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-sand-200 dark:bg-charcoal-800 rounded-3xl" />
        <div className="h-96 bg-sand-200 dark:bg-charcoal-800 rounded-3xl" />
      </div>
    );
  }

  const isVerified = profile?.verification_status === 'verified';

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-bold">{successToast}</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal dark:bg-charcoal-700 text-white flex items-center justify-center shadow-md">
            <Building className="w-8 h-8 text-terracotta-200" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-black text-teal dark:text-ivory font-heading">
                {profile?.company_name || 'Company Profile'}
              </h2>
              {isVerified ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Contractor</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pending Admin Verification</span>
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/60">
              {formData.business_type} • {formData.city}, {formData.state}
            </p>
          </div>
        </div>

        <div className="text-xs text-greygreen dark:text-ivory/60 bg-sand-50 dark:bg-charcoal-900 p-3 rounded-2xl border border-beige/60 dark:border-charcoal-700">
          <span className="block font-bold text-teal dark:text-ivory">Authorized Representative:</span>
          <span>{user?.full_name} ({user?.email})</span>
        </div>
      </div>

      {/* Edit Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs space-y-6">
        
        <div>
          <h3 className="text-lg font-black text-teal dark:text-ivory font-heading">
            Company & Compliance Details
          </h3>
          <p className="text-xs text-greygreen dark:text-ivory/60">
            Keep your business profile and contact information up-to-date for artisan credibility.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1">
                Company Name *
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1">
                Business Type
              </label>
              <select
                name="business_type"
                value={formData.business_type}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none"
              >
                <option value="General Contractor">General Contractor</option>
                <option value="Civil & Infrastructure">Civil & Infrastructure</option>
                <option value="Commercial Electrical">Commercial Electrical</option>
                <option value="Plumbing & MEP">Plumbing & MEP</option>
                <option value="Residential Builder">Residential Builder</option>
                <option value="Facility Management">Facility Management</option>
                <option value="Specialized Subcontractor">Specialized Subcontractor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1">
                Authorized Rep Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1">
                GSTIN / Tax ID
              </label>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                placeholder="27AAAPM1234F1Z5"
                className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm uppercase focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1">
                State *
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1">
                Business Address / Office Location
              </label>
              <input
                type="text"
                name="business_address"
                value={formData.business_address}
                onChange={handleChange}
                placeholder="Building, street, tech park..."
                className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://company.com"
                className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1">
              Company Description & Project Expertise
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Highlight major project milestones, safety protocols, and recruitment scope..."
              className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none resize-none"
            />
          </div>

          <div className="pt-3 border-t border-beige dark:border-charcoal-700 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal hover:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
