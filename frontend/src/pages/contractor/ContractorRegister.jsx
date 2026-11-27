import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import {
  Building2,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  FileText,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Globe
} from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi (NCT)', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function ContractorRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    password: '',
    phone: '',
    businessAddress: '',
    city: '',
    state: 'Maharashtra',
    businessType: 'General Contractor',
    gstin: '',
    website: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.fullName.trim() || !formData.email.trim() || !formData.password) {
      setErrorMsg('Company name, contact person name, email, and password are required.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await apiService.contractorRegister({
        full_name: formData.fullName.trim(),
        company_name: formData.companyName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        business_address: formData.businessAddress.trim(),
        city: formData.city.trim() || 'Mumbai',
        state: formData.state,
        business_type: formData.businessType,
        gstin: formData.gstin.trim(),
        website: formData.website.trim(),
        description: formData.description.trim()
      });

      navigate('/contractor', { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. An account with this email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-charcoal-900 flex flex-col justify-center py-10 sm:px-6 lg:px-8 transition-colors">
      
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl px-4 mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal dark:text-ivory hover:text-terracotta transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Link
          to="/contractor/login"
          className="text-xs font-bold text-terracotta hover:underline"
        >
          Already registered? Sign In →
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl px-4">
        
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-teal dark:bg-charcoal-800 text-white flex items-center justify-center mx-auto shadow-md border border-teal-700 dark:border-charcoal-700">
            <Building2 className="w-7 h-7 text-terracotta-200" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-teal dark:text-ivory font-heading">
            Register your Company
          </h2>
          <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/70 max-w-md mx-auto">
            Join SkillSetu's Direct Hiring Marketplace to discover verified Indian artisans and manage jobs.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-charcoal-800 py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-beige dark:border-charcoal-700 space-y-6">
          
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <p className="font-semibold">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Row 1: Company Name & Business Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1">
                  Company / Firm Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-greygreen">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Apex Infra Projects LLP"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1">
                  Business Type
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal"
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

            {/* Row 2: Authorized Representative & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1">
                  Contact Person / Authorized Rep *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-greygreen">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Rajiv Mehra"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1">
                  Mobile / Contact Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-greygreen">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="98XXXXXXXX"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1">
                  Official Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-greygreen">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="procurement@company.com"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1">
                  Password (min 6 chars) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-greygreen">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>
              </div>
            </div>

            {/* Row 4: City, State, GSTIN */}
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
                  placeholder="e.g. Mumbai, Bengaluru"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1">
                  State / UT *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1">
                  GSTIN (Optional)
                </label>
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="27AAAPM1234F1Z5"
                  className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal uppercase"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-teal dark:text-ivory uppercase tracking-wider mb-1">
                Company Description / Project Scope
              </label>
              <textarea
                name="description"
                rows="2"
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe your company's active construction or trade projects..."
                className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal hover:bg-teal-800 text-white font-bold text-sm shadow-md shadow-teal/20 transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Creating Contractor Account...' : 'Complete Contractor Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-center text-greygreen dark:text-ivory/60">
            By registering, you agree to discover workers respectfully and comply with Indian labor welfare benchmarks.
          </p>

        </div>

      </div>
    </div>
  );
}
