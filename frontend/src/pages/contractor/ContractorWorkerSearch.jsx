import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  QrCode,
  MapPin,
  ExternalLink,
  Mail,
  Send,
  X,
  AlertCircle,
  Briefcase,
  Phone,
  ShieldCheck,
  Clock,
  Sparkles
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

export default function ContractorWorkerSearch() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tradeFilter, setTradeFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [minExpFilter, setMinExpFilter] = useState('');

  // Contact requests history
  const [contactRequests, setContactRequests] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Send request modal
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [modalError, setModalError] = useState('');

  const loadWorkers = async () => {
    setLoading(true);
    try {
      const res = await apiService.discoverVerifiedWorkers({
        trade: tradeFilter,
        state: stateFilter,
        q: searchQuery,
        min_experience: minExpFilter
      });
      if (res && res.workers) {
        setWorkers(res.workers);
      }
    } catch (err) {
      console.error('Failed to load workers:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadContactRequests = async () => {
    try {
      const res = await apiService.getContractorContactRequests();
      if (res && res.contact_requests) {
        setContactRequests(res.contact_requests);
      }
    } catch (err) {
      console.warn('Failed to load contact requests:', err);
    }
  };

  useEffect(() => {
    loadWorkers();
    loadContactRequests();
  }, [tradeFilter, stateFilter, minExpFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadWorkers();
  };

  const handleOpenContactModal = (worker) => {
    setSelectedWorker(worker);
    setMessage(`Hello ${worker.full_name}, we reviewed your verified SkillSetu profile and would like to invite you for an interview regarding an active trade opening.`);
    setModalError('');
    setContactModalOpen(true);
  };

  const handleSendContactRequest = async (e) => {
    e.preventDefault();
    if (!selectedWorker || !message.trim()) return;

    setSending(true);
    setModalError('');
    try {
      await apiService.sendContactRequest({
        worker_id: selectedWorker.id,
        message: message.trim()
      });
      setContactModalOpen(false);
      setToastMsg(`Interview request sent to ${selectedWorker.full_name}.`);
      loadContactRequests();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      setModalError(err.message || 'Could not send contact request.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-teal dark:text-ivory font-heading">
            Discover Verified Vocational Talent
          </h2>
          <p className="text-xs sm:text-sm text-greygreen dark:text-ivory/60">
            Browse Indian artisans with authentic, rubric-scored Digital Skill Passports
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowHistoryModal(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-teal-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-teal dark:text-ivory text-xs font-bold hover:bg-sand-50 transition-colors self-start sm:self-auto"
        >
          <Mail className="w-4 h-4 text-terracotta" />
          <span>Sent Interview Requests ({contactRequests.length})</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs space-y-4">
        
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-greygreen absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by worker name, trade skill, or qualification..."
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-900 text-xs sm:text-sm text-teal dark:text-ivory focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-teal hover:bg-teal-800 text-white font-bold text-xs sm:text-sm transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-beige/60 dark:border-charcoal-700 text-xs">
          
          {/* Trade Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-greygreen" />
            <span className="font-bold text-teal dark:text-ivory">Trade:</span>
            <select
              value={tradeFilter}
              onChange={(e) => setTradeFilter(e.target.value)}
              className="px-2.5 py-1 rounded-xl border border-beige dark:border-charcoal-600 bg-white dark:bg-charcoal-900 text-teal dark:text-ivory font-semibold capitalize"
            >
              <option value="all">All Trades</option>
              {TRADES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-terracotta" />
            <span className="font-bold text-teal dark:text-ivory">State:</span>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-2.5 py-1 rounded-xl border border-beige dark:border-charcoal-600 bg-white dark:bg-charcoal-900 text-teal dark:text-ivory font-semibold"
            >
              <option value="">All States</option>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Min Experience */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-teal dark:text-ivory">Min Exp:</span>
            <select
              value={minExpFilter}
              onChange={(e) => setMinExpFilter(e.target.value)}
              className="px-2.5 py-1 rounded-xl border border-beige dark:border-charcoal-600 bg-white dark:bg-charcoal-900 text-teal dark:text-ivory font-semibold"
            >
              <option value="">Any</option>
              <option value="2">2+ Years</option>
              <option value="5">5+ Years</option>
              <option value="8">8+ Years</option>
            </select>
          </div>

        </div>

      </div>

      {/* Workers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-60 rounded-3xl bg-sand-200 dark:bg-charcoal-800 animate-pulse" />
          ))}
        </div>
      ) : workers.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700">
          <Users className="w-10 h-10 text-greygreen dark:text-ivory/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-teal dark:text-ivory">No Verified Workers Found</h3>
          <p className="text-xs text-greygreen dark:text-ivory/60 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria, trade category, or geographic state filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-beige dark:border-charcoal-700 shadow-xs flex flex-col justify-between hover:border-teal/30 dark:hover:border-charcoal-600 transition-all"
            >
              <div>
                
                {/* Header: Trade pill & Verified Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sand-200 dark:bg-charcoal-700 text-teal dark:text-ivory">
                    {worker.trade}
                  </span>
                  {worker.has_skill_passport && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Skill Passport</span>
                    </span>
                  )}
                </div>

                {/* Worker Name & Skill level */}
                <h3 className="text-base font-bold text-teal dark:text-ivory font-heading">
                  {worker.full_name}
                </h3>
                <p className="text-xs font-semibold text-terracotta dark:text-terracotta-400 mt-0.5">
                  {worker.skill_level}
                </p>

                {/* Experience & Location */}
                <div className="mt-2.5 space-y-1 text-xs text-greygreen dark:text-ivory/70">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-greygreen" />
                    <span>{worker.years_of_experience} Years Trade Experience</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-terracotta" />
                    <span>{worker.location}</span>
                  </div>
                </div>

                {/* Qualification */}
                {worker.professional_qualification && (
                  <p className="mt-3 text-xs text-greygreen dark:text-ivory/60 bg-sand-50/50 dark:bg-charcoal-900 p-2.5 rounded-xl border border-beige/60 dark:border-charcoal-700">
                    {worker.professional_qualification}
                  </p>
                )}

                {/* Assessment Score if available */}
                {worker.assessment_score && (
                  <div className="mt-3 flex items-center justify-between p-2 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200 text-xs">
                    <span className="font-semibold">Practical Evaluation:</span>
                    <span className="font-bold">{worker.assessment_score.percentage}% Verified</span>
                  </div>
                )}

              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-4 border-t border-beige dark:border-charcoal-700 flex items-center justify-between gap-2">
                
                {/* QR Verification Link */}
                {worker.verification_url ? (
                  <a
                    href={worker.verification_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-terracotta hover:underline"
                    title="Open live Digital Skill Passport proof"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Passport QR</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-greygreen dark:text-ivory/50">Verified Profile</span>
                )}

                {/* Send Interview Request Button */}
                <button
                  type="button"
                  onClick={() => handleOpenContactModal(worker)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal hover:bg-teal-800 text-white font-bold text-xs transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>Interview</span>
                </button>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* Send Contact Request Modal */}
      {contactModalOpen && selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/70 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-charcoal-900 rounded-3xl shadow-2xl border border-beige dark:border-charcoal-700 p-6 sm:p-8 animate-scaleUp">
            
            <button
              type="button"
              onClick={() => setContactModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-greygreen hover:text-teal dark:text-ivory/60 hover:bg-sand-100 dark:hover:bg-charcoal-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
                Safe Worker Contact Workflow
              </span>
              <h3 className="text-lg font-black text-teal dark:text-ivory font-heading mt-0.5">
                Send Interview Invitation to {selectedWorker.full_name}
              </h3>
              <p className="text-xs text-greygreen dark:text-ivory/60 mt-1">
                In compliance with privacy standards, candidate phone & contact details will be revealed only after {selectedWorker.full_name} accepts your request.
              </p>
            </div>

            {modalError && (
              <div className="mb-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSendContactRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-teal dark:text-ivory uppercase mb-1">
                  Invitation Message & Job Scope *
                </label>
                <textarea
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Detail the project location, compensation, shift hours, and interview preference..."
                  className="w-full px-3 py-2 rounded-xl border border-beige dark:border-charcoal-600 bg-sand-50/50 dark:bg-charcoal-800 text-teal dark:text-ivory text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-beige dark:border-charcoal-700">
                <button
                  type="button"
                  onClick={() => setContactModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-beige dark:border-charcoal-700 text-teal dark:text-ivory font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-5 py-2.5 rounded-xl bg-teal hover:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-sm disabled:opacity-50"
                >
                  {sending ? 'Sending Request...' : 'Send Interview Request'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Sent Contact Requests Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/70 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-charcoal-900 rounded-3xl shadow-2xl border border-beige dark:border-charcoal-700 p-6 sm:p-8 animate-scaleUp">
            
            <button
              type="button"
              onClick={() => setShowHistoryModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-greygreen hover:text-teal dark:text-ivory/60 hover:bg-sand-100 dark:hover:bg-charcoal-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <h3 className="text-xl font-black text-teal dark:text-ivory font-heading">
                Sent Interview & Contact Requests
              </h3>
              <p className="text-xs text-greygreen dark:text-ivory/60">
                Contact information is securely revealed when the artisan accepts your invitation.
              </p>
            </div>

            {contactRequests.length === 0 ? (
              <div className="p-8 text-center text-xs text-greygreen dark:text-ivory/60">
                No contact requests sent yet.
              </div>
            ) : (
              <div className="space-y-3">
                {contactRequests.map((cr) => (
                  <div
                    key={cr.id}
                    className="p-4 rounded-2xl border border-beige dark:border-charcoal-700 bg-sand-50/40 dark:bg-charcoal-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal dark:text-ivory text-sm">
                        {cr.worker_name} ({cr.worker_trade || 'Vocational Artisan'})
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        cr.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : cr.status === 'declined'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {cr.status}
                      </span>
                    </div>

                    <p className="text-xs text-greygreen dark:text-ivory/70 italic">
                      "{cr.message}"
                    </p>

                    {cr.status === 'accepted' && cr.worker_contact_shared && (
                      <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex flex-wrap items-center gap-4 font-semibold">
                        {cr.worker_phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            <span>Phone: {cr.worker_phone}</span>
                          </span>
                        )}
                        {cr.worker_email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            <span>Email: {cr.worker_email}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
