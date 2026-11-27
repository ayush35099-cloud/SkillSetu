import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import {
  Briefcase,
  PlusCircle,
  MapPin,
  Calendar,
  Clock,
  ShieldAlert,
  Edit2,
  PauseCircle,
  PlayCircle,
  Trash2,
  Users,
  AlertCircle,
  CheckCircle2,
  X,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';

const TRADES = [
  'electrician',
  'plumber',
  'mason',
  'carpenter',
  'welder',
  'painter',
  'mechanic',
  'technician'
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi (NCT)', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const initialJobForm = {
  title: '',
  trade: 'electrician',
  description: '',
  required_skills: '',
  workers_needed: 1,
  experience_years: 2,
  location: '',
  city: 'Mumbai',
  state: 'Maharashtra',
  employment_type: 'Full-time',
  payment_type: 'Monthly',
  wage_min: 25000,
  wage_max: 35000,
  duration: '6 Months',
  start_date: 'Immediate',
  working_hours: '8 Hours / Day (9:00 AM - 5:30 PM)',
  safety_requirements: 'Standard PPE, safety shoes, helmet.',
  contact_details: ''
};

export default function ContractorJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [tradeFilter, setTradeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState(initialJobForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await apiService.getContractorJobs(statusFilter === 'all' ? '' : statusFilter);
      if (res && res.jobs) {
        setJobs(res.jobs);
      }
    } catch (err) {
      console.error('Failed to load contractor jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [statusFilter]);

  const handleOpenCreateModal = () => {
    setEditingJob(null);
    setFormData(initialJobForm);
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      trade: job.trade,
      description: job.description,
      required_skills: job.required_skills || '',
      workers_needed: job.workers_needed,
      experience_years: job.experience_years,
      location: job.location,
      city: job.city,
      state: job.state,
      employment_type: job.employment_type || 'Full-time',
      payment_type: job.payment_type || 'Monthly',
      wage_min: job.wage_min,
      wage_max: job.wage_max,
      duration: job.duration || '',
      start_date: job.start_date || '',
      working_hours: job.working_hours || '',
      safety_requirements: job.safety_requirements || '',
      contact_details: job.contact_details || ''
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      setFormError('Job title, trade description, and location are required.');
      return;
    }

    if (Number(formData.wage_min) > Number(formData.wage_max)) {
      setFormError('Minimum wage cannot exceed maximum wage.');
      return;
    }

    setFormLoading(true);
    setFormError('');

    try {
      if (editingJob) {
        await apiService.updateContractorJob(editingJob.id, formData);
        setSuccessToast(`Job '${formData.title}' updated successfully.`);
      } else {
        await apiService.createContractorJob(formData);
        setSuccessToast(`New job posting '${formData.title}' published successfully.`);
      }
      setModalOpen(false);
      loadJobs();
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err) {
      setFormError(err.message || 'Operation failed. Please verify the input values.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (job) => {
    const nextStatus = job.status === 'active' ? 'paused' : 'active';
    try {
      await apiService.setContractorJobStatus(job.id, nextStatus);
      setSuccessToast(`Job '${job.title}' marked as ${nextStatus}.`);
      loadJobs();
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      alert(`Could not change status: ${err.message}`);
    }
  };

  const handleDeleteJob = async (job) => {
    if (!window.confirm(`Are you sure you want to delete the job posting "${job.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await apiService.deleteContractorJob(job.id);
      setSuccessToast(`Job '${job.title}' deleted successfully.`);
      loadJobs();
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      alert(`Could not delete job: ${err.message}`);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (tradeFilter !== 'all' && j.trade !== tradeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const target = `${j.title} ${j.description} ${j.city} ${j.state} ${j.trade} ${j.required_skills || ''}`.toLowerCase();
      if (!target.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-bold">{successToast}</span>
        </div>
      )}

      {/* Header & Post Job Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-teal dark:text-ivory font-heading">
            Manage Job Postings
          </h2>
          <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/60">
            Publish verified vacancies, manage wages, pause or close applications
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-sm shadow-sm shadow-terracotta/25 transition-all transform active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a Job</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs flex flex-wrap items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-greygreen absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, skill, location..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-xs sm:text-sm text-teal dark:text-ivory focus:outline-none focus:ring-2 focus:ring-teal"
          />
        </div>

        {/* Status Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'active', 'paused', 'closed'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-teal text-white shadow-xs'
                  : 'bg-sand-100 dark:bg-charcoal-700 text-teal dark:text-ivory/70 hover:bg-beige/40'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Trade Filter Dropdown */}
        <div className="flex items-center gap-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-greygreen" />
          <select
            value={tradeFilter}
            onChange={(e) => setTradeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-beige dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-teal dark:text-ivory font-bold capitalize focus:outline-none"
          >
            <option value="all">All Trades</option>
            {TRADES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Jobs Grid / List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-sand-200 dark:bg-charcoal-800 animate-pulse" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700">
          <Briefcase className="w-10 h-10 text-greygreen dark:text-ivory/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-teal dark:text-ivory">No Job Postings Found</h3>
          <p className="text-xs text-greygreen dark:text-ivory/60 mt-1 max-w-sm mx-auto">
            {jobs.length === 0
              ? 'You have not published any job openings yet. Click "Post a Job" to start recruiting verified artisans.'
              : 'No job postings match your selected filters. Try adjusting your search query or trade filter.'}
          </p>
          {jobs.length === 0 && (
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta text-white font-bold text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create First Job</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs flex flex-col justify-between hover:border-teal/30 dark:hover:border-charcoal-600 transition-all"
            >
              <div>
                
                {/* Card Top: Trade badge & Status */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sand-200 dark:bg-charcoal-700 text-teal dark:text-ivory">
                    {job.trade}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    job.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : job.status === 'paused'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-sand-200 text-greygreen dark:bg-charcoal-700 dark:text-ivory/60'
                  }`}>
                    {job.status}
                  </span>
                </div>

                {/* Job Title */}
                <h3 className="text-base sm:text-lg font-bold text-teal dark:text-ivory font-heading leading-snug">
                  {job.title}
                </h3>

                {/* Wage & Location */}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-greygreen dark:text-ivory/70">
                  <span className="font-bold text-teal dark:text-ivory">
                    ₹{job.wage_min.toLocaleString()} - ₹{job.wage_max.toLocaleString()}/{job.payment_type === 'Daily' ? 'day' : 'mo'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                    <span>{job.city}, {job.state}</span>
                  </span>
                  <span>•</span>
                  <span>{job.employment_type}</span>
                </div>

                {/* Description snippet */}
                <p className="mt-2.5 text-xs text-greygreen dark:text-ivory/60 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills tags */}
                {job.required_skills && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.required_skills.split(',').slice(0, 3).map((sk, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sand-100 dark:bg-charcoal-900 text-teal dark:text-ivory/70 border border-beige/60 dark:border-charcoal-700"
                      >
                        {sk.trim()}
                      </span>
                    ))}
                  </div>
                )}

              </div>

              {/* Bottom: Applicant count & Action Buttons */}
              <div className="pt-4 mt-4 border-t border-beige dark:border-charcoal-700 flex items-center justify-between gap-2">
                
                {/* View Applications Link */}
                <Link
                  to={`/contractor/applications?job_id=${job.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal dark:text-ivory hover:text-terracotta transition-colors"
                >
                  <Users className="w-4 h-4 text-terracotta" />
                  <span>{job.applications_count} {job.applications_count === 1 ? 'applicant' : 'applicants'}</span>
                </Link>

                {/* Card Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(job)}
                    className="p-1.5 rounded-lg border border-beige dark:border-charcoal-700 hover:bg-beige/40 dark:hover:bg-charcoal-700 text-teal dark:text-ivory transition-colors"
                    title={job.status === 'active' ? 'Pause applications' : 'Activate job'}
                  >
                    {job.status === 'active' ? (
                      <PauseCircle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <PlayCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(job)}
                    className="p-1.5 rounded-lg border border-beige dark:border-charcoal-700 hover:bg-beige/40 dark:hover:bg-charcoal-700 text-teal dark:text-ivory transition-colors"
                    title="Edit job posting"
                  >
                    <Edit2 className="w-4 h-4 text-teal dark:text-ivory" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteJob(job)}
                    className="p-1.5 rounded-lg border border-beige dark:border-charcoal-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 transition-colors"
                    title="Delete job posting"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* Post / Edit Job Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/70 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-charcoal-900 rounded-3xl shadow-2xl border border-beige dark:border-charcoal-700 p-6 sm:p-8 animate-scaleUp">
            
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-greygreen hover:text-teal dark:text-ivory/60 hover:bg-sand-100 dark:hover:bg-charcoal-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <h3 className="text-xl font-black text-teal dark:text-ivory font-heading">
                {editingJob ? 'Edit Job Posting' : 'Post a New Job Vacancy'}
              </h3>
              <p className="text-xs text-greygreen dark:text-ivory/60">
                Detailed information helps verified artisans apply with confidence.
              </p>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Row 1: Title & Trade */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-teal dark:text-ivory uppercase mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="e.g. Industrial Substation Electrician"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal dark:text-ivory uppercase mb-1">
                    Trade *
                  </label>
                  <select
                    name="trade"
                    value={formData.trade}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal capitalize"
                  >
                    {TRADES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory uppercase mb-1">
                  Job Description & Scope of Work *
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Detail the daily site duties, machines/tools handled, and project standards..."
                  required
                  className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal resize-none"
                />
              </div>

              {/* Required Skills */}
              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory uppercase mb-1">
                  Required Skills & Competencies (comma separated)
                </label>
                <input
                  type="text"
                  name="required_skills"
                  value={formData.required_skills}
                  onChange={handleFormChange}
                  placeholder="e.g. Conduit Bending, MCB Termination, Megger Loop Testing"
                  className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                />
              </div>

              {/* Row 2: Location, City, State */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-teal dark:text-ivory uppercase mb-1">
                    Site / Area Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    placeholder="e.g. Powai Commercial Site"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal dark:text-ivory uppercase mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    placeholder="e.g. Mumbai"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal dark:text-ivory uppercase mb-1">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Compensation & Employment Type */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-teal dark:text-ivory uppercase mb-1">
                    Payment Type
                  </label>
                  <select
                    name="payment_type"
                    value={formData.payment_type}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Daily">Daily</option>
                    <option value="Project-based">Project-based</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal dark:text-ivory uppercase mb-1">
                    Min Wage (₹) *
                  </label>
                  <input
                    type="number"
                    name="wage_min"
                    value={formData.wage_min}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal dark:text-ivory uppercase mb-1">
                    Max Wage (₹) *
                  </label>
                  <input
                    type="number"
                    name="wage_max"
                    value={formData.wage_max}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal dark:text-ivory uppercase mb-1">
                    Employment
                  </label>
                  <select
                    name="employment_type"
                    value={formData.employment_type}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Day-wage">Day-wage</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Workers needed, Min Experience, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-teal dark:text-ivory uppercase mb-1">
                    Workers Needed
                  </label>
                  <input
                    type="number"
                    name="workers_needed"
                    min="1"
                    value={formData.workers_needed}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal dark:text-ivory uppercase mb-1">
                    Min Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="experience_years"
                    min="0"
                    value={formData.experience_years}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal dark:text-ivory uppercase mb-1">
                    Work Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleFormChange}
                    placeholder="e.g. 6 Months, Permanent"
                    className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Safety Requirements */}
              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory uppercase mb-1">
                  Safety Requirements & PPE Compliance
                </label>
                <input
                  type="text"
                  name="safety_requirements"
                  value={formData.safety_requirements}
                  onChange={handleFormChange}
                  placeholder="e.g. Mandatory 1000V insulated safety shoes and helmet."
                  className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-beige dark:border-charcoal-700 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-beige dark:border-charcoal-700 text-teal dark:text-ivory font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-terracotta/25 disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : editingJob ? 'Update Job Posting' : 'Publish Job Posting'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
