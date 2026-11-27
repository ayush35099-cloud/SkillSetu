/**
 * SkillSetu API Client Service
 * Configured via VITE_API_BASE_URL environment variable with reliable production fallback.
 */

const PROD_DEFAULT_BACKEND = 'https://skillsetu-backend-47ww.onrender.com';
const envBase = import.meta.env.VITE_API_BASE_URL;

// Determine active API base URL
const rawUrl = envBase
  ? envBase
  : (typeof window !== 'undefined' && window.location.hostname.includes('github.io'))
    ? PROD_DEFAULT_BACKEND
    : 'http://localhost:5000';

const API_BASE_URL = (rawUrl || '').replace(/\/+$/, '');

const AUTH_TOKEN_KEY = 'skillsetu_auth_token';
const AUTH_USER_KEY = 'skillsetu_auth_user';
const LEGACY_ASSESSOR_TOKEN_KEY = 'skillsetu_assessor_token';
const LEGACY_ASSESSOR_USER_KEY = 'skillsetu_assessor_user';
const DEFAULT_TIMEOUT_MS = 65000; // Covers Render free-tier cold-start spin-up

export class ApiError extends Error {
  constructor(
    message,
    { status = 0, code = null, isNetworkError = false, isServerError = false, isAuthError = false } = {}
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.isNetworkError = isNetworkError;
    this.isServerError = isServerError;
    this.isAuthError = isAuthError;
  }
}

export const apiService = {
  /**
   * Get the configured API Base URL
   */
  getBaseUrl() {
    return API_BASE_URL || PROD_DEFAULT_BACKEND;
  },

  // --------------------------------------------------------------------------
  // Token & Session Storage Helpers
  // --------------------------------------------------------------------------
  getToken() {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(LEGACY_ASSESSOR_TOKEN_KEY) || '';
    } catch {
      return '';
    }
  },

  setToken(token) {
    try {
      if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(LEGACY_ASSESSOR_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(LEGACY_ASSESSOR_TOKEN_KEY);
      }
    } catch (e) {
      console.warn('Could not store token in localStorage:', e);
    }
  },

  getStoredUser() {
    try {
      const data = localStorage.getItem(AUTH_USER_KEY) || localStorage.getItem(LEGACY_ASSESSOR_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setStoredUser(user) {
    try {
      if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        localStorage.setItem(LEGACY_ASSESSOR_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
        localStorage.removeItem(LEGACY_ASSESSOR_USER_KEY);
      }
    } catch (e) {
      console.warn('Could not store user in localStorage:', e);
    }
  },

  logout() {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(LEGACY_ASSESSOR_TOKEN_KEY);
      localStorage.removeItem(LEGACY_ASSESSOR_USER_KEY);
    } catch (e) {
      console.warn('Logout error:', e);
    }
  },

  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  },

  // --------------------------------------------------------------------------
  // Unified Safe Fetch Helper
  // --------------------------------------------------------------------------
  async _requestJson(
    path,
    { method = 'GET', headers = {}, body = undefined, timeoutMs = DEFAULT_TIMEOUT_MS, allowStatuses = [] } = {},
    fallbackError = 'Request failed'
  ) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    // Merge default JSON request headers safely
    const finalHeaders = {
      'Accept': 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers
    };

    let response;
    try {
      response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: finalHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });
    } catch (err) {
      const isTimeout = err?.name === 'AbortError';
      throw new ApiError(
        isTimeout
          ? 'The server took too long to respond. Render free-tier services take 30–60s to wake from sleep — please try again.'
          : 'Unable to connect to the SkillSetu backend. If it was idle, it may be waking up (~45s). Please check your connection and try again.',
        { status: 0, isNetworkError: true }
      );
    } finally {
      clearTimeout(timer);
    }

    let data = null;
    try {
      const rawText = await response.text();
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      data = null;
    }

    if (!response.ok && !allowStatuses.includes(response.status)) {
      const isServerError = response.status >= 500;
      const isAuthError = response.status === 401 || response.status === 403;
      const rawMsg = data?.message;

      let message;
      if (isServerError) {
        message =
          rawMsg && rawMsg !== 'Internal server error'
            ? rawMsg
            : `Backend service error (HTTP ${response.status}). The server may be restarting or updating — please retry shortly.`;
      } else {
        message = rawMsg || `${fallbackError} (HTTP ${response.status})`;
      }

      throw new ApiError(message, {
        status: response.status,
        code: data?.code || null,
        isServerError,
        isAuthError
      });
    }

    if (data === null) {
      throw new ApiError('Received an unexpected non-JSON response from the server.', {
        status: response.status,
        isServerError: response.status >= 500
      });
    }

    return data;
  },

  // --------------------------------------------------------------------------
  // Health & Root Status
  // --------------------------------------------------------------------------
  async checkBackendHealth() {
    return this._requestJson(
      '/api/health',
      { headers: { 'Accept': 'application/json' } },
      'Backend health check failed'
    );
  },

  async checkDatabaseHealth() {
    return this._requestJson(
      '/api/health/db',
      { headers: { 'Accept': 'application/json' }, allowStatuses: [503] },
      'Database health check failed'
    );
  },

  async getRootInfo() {
    return this._requestJson(
      '/',
      { headers: { 'Accept': 'application/json' } },
      'Failed to load API info'
    );
  },

  // --------------------------------------------------------------------------
  // Authentication (Assessor, Worker, Admin)
  // --------------------------------------------------------------------------
  _persistSession(data) {
    if (data?.token) {
      this.setToken(data.token);
      if (data.user) this.setStoredUser(data.user);
    }
    return data;
  },

  async assessorRegister(payload) {
    const data = await this._requestJson(
      '/api/auth/assessor/register',
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: payload },
      'Registration failed'
    );
    return this._persistSession(data);
  },

  async assessorLogin(email, password) {
    const data = await this._requestJson(
      '/api/auth/assessor/login',
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: { email, password } },
      'Assessor sign-in failed'
    );
    return this._persistSession(data);
  },

  async workerRegister(payload) {
    const data = await this._requestJson(
      '/api/auth/worker/register',
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: payload },
      'Worker registration failed'
    );
    return this._persistSession(data);
  },

  async workerLogin(email, password) {
    const data = await this._requestJson(
      '/api/auth/worker/login',
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: { email, password } },
      'Worker sign-in failed'
    );
    return this._persistSession(data);
  },

  async login(email, password) {
    const data = await this._requestJson(
      '/api/auth/login',
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: { email, password } },
      'Sign-in failed'
    );
    return this._persistSession(data);
  },

  async adminLogin(email, password) {
    const data = await this._requestJson(
      '/api/auth/admin/login',
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: { email, password } },
      'Administrator sign-in failed'
    );
    return this._persistSession(data);
  },

  async getMe() {
    const data = await this._requestJson(
      '/api/auth/me',
      { headers: this.getAuthHeaders() },
      'Session expired'
    );
    if (data.user) this.setStoredUser(data.user);
    return data;
  },

  async getWorkerProfile() {
    return this._requestJson(
      '/api/worker/profile',
      { headers: this.getAuthHeaders() },
      'Failed to fetch worker profile'
    );
  },

  // --------------------------------------------------------------------------
  // Assessment Tasks & Rubrics
  // --------------------------------------------------------------------------
  async getTasks(trade = '') {
    const query = trade ? `?trade=${encodeURIComponent(trade)}` : '';
    return this._requestJson(
      `/api/tasks${query}`,
      { headers: { 'Accept': 'application/json' } },
      'Failed to load tasks'
    );
  },

  async getTask(id) {
    return this._requestJson(
      `/api/tasks/${id}`,
      { headers: { 'Accept': 'application/json' } },
      'Failed to load task'
    );
  },

  // --------------------------------------------------------------------------
  // Assessor Portal Operations
  // --------------------------------------------------------------------------
  async getAssessorDashboard() {
    return this._requestJson(
      '/api/assessor/dashboard',
      { headers: this.getAuthHeaders() },
      'Failed to load dashboard'
    );
  },

  async getAssessorSubmissions({ trade = '', status = '', search = '' } = {}) {
    const params = new URLSearchParams();
    if (trade && trade !== 'all') params.append('trade', trade);
    if (status && status !== 'all') params.append('status', status);
    if (search) params.append('search', search);
    const qs = params.toString() ? `?${params.toString()}` : '';

    return this._requestJson(
      `/api/assessor/submissions${qs}`,
      { headers: this.getAuthHeaders() },
      'Failed to load submissions'
    );
  },

  async getAssessorSubmission(id) {
    return this._requestJson(
      `/api/assessor/submissions/${id}`,
      { headers: this.getAuthHeaders() },
      'Failed to load submission'
    );
  },

  async submitReview(submissionId, reviewPayload) {
    return this._requestJson(
      `/api/assessor/submissions/${submissionId}/review`,
      { method: 'POST', headers: this.getAuthHeaders(), body: reviewPayload },
      'Failed to submit assessment review'
    );
  },

  async getAssessorHistory() {
    return this._requestJson(
      '/api/assessor/history',
      { headers: this.getAuthHeaders() },
      'Failed to load history'
    );
  },

  async getAssessorProfile() {
    return this._requestJson(
      '/api/assessor/profile',
      { headers: this.getAuthHeaders() },
      'Failed to load profile'
    );
  },

  async updateAssessorProfile(payload) {
    return this._requestJson(
      '/api/assessor/profile',
      { method: 'PUT', headers: this.getAuthHeaders(), body: payload },
      'Failed to update profile'
    );
  },

  // --------------------------------------------------------------------------
  // Worker Demonstration APIs (Authenticated with Session Token)
  // --------------------------------------------------------------------------
  async getWorkerAssessments(workerId = null) {
    const qs = workerId ? `?worker_id=${workerId}` : '';
    return this._requestJson(
      `/api/worker/assessments${qs}`,
      { headers: this.getAuthHeaders() },
      'Failed to load worker assessments'
    );
  },

  async getWorkerAssessment(id) {
    return this._requestJson(
      `/api/worker/assessments/${id}`,
      { headers: this.getAuthHeaders() },
      'Failed to load assessment detail'
    );
  },

  async submitWorkerDemonstration(payload) {
    return this._requestJson(
      '/api/worker/assessments/submit',
      { method: 'POST', headers: this.getAuthHeaders(), body: payload },
      'Failed to submit demonstration'
    );
  },

  async resubmitWorkerDemonstration(id, payload) {
    return this._requestJson(
      `/api/worker/assessments/${id}/resubmit`,
      { method: 'POST', headers: this.getAuthHeaders(), body: payload },
      'Failed to resubmit demonstration'
    );
  },

  // --------------------------------------------------------------------------
  // Admin Assessor Management APIs
  // --------------------------------------------------------------------------
  async getAdminAssessors(status = '') {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return this._requestJson(
      `/api/admin/assessors${qs}`,
      { headers: this.getAuthHeaders() },
      'Failed to load assessors'
    );
  },

  async approveAssessor(id) {
    return this._requestJson(
      `/api/admin/assessors/${id}/approve`,
      { method: 'PATCH', headers: this.getAuthHeaders() },
      'Failed to approve assessor'
    );
  },

  async rejectAssessor(id) {
    return this._requestJson(
      `/api/admin/assessors/${id}/reject`,
      { method: 'PATCH', headers: this.getAuthHeaders() },
      'Failed to reject assessor'
    );
  },

  // --------------------------------------------------------------------------
  // Digital Skill Passport Credential APIs
  // --------------------------------------------------------------------------
  async verifyCredential(token) {
    return this._requestJson(
      `/api/credentials/verify/${encodeURIComponent(token)}`,
      { headers: { 'Accept': 'application/json' }, allowStatuses: [404] },
      'Failed to verify credential'
    );
  },

  async getWorkerCredentials(workerId = 101) {
    return this._requestJson(
      `/api/worker/credentials?worker_id=${workerId}`,
      { headers: { 'Accept': 'application/json' } },
      'Failed to load credentials'
    );
  },

  async getAdminCredentials() {
    return this._requestJson(
      '/api/admin/credentials',
      { headers: this.getAuthHeaders() },
      'Failed to load credentials'
    );
  },

  async issueAdminCredential(submissionId, skillLevel = '') {
    return this._requestJson(
      '/api/admin/credentials/issue',
      { method: 'POST', headers: this.getAuthHeaders(), body: { submission_id: submissionId, skill_level: skillLevel } },
      'Failed to issue credential'
    );
  },

  async revokeAdminCredential(credentialId, reason) {
    return this._requestJson(
      `/api/admin/credentials/${credentialId}/revoke`,
      { method: 'PATCH', headers: this.getAuthHeaders(), body: { reason } },
      'Failed to revoke credential'
    );
  },

  // --------------------------------------------------------------------------
  // Phase 4: Contractor Hub & Direct Hiring Marketplace APIs
  // --------------------------------------------------------------------------
  async contractorRegister(payload) {
    const data = await this._requestJson(
      '/api/auth/contractor/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: payload
      },
      'Contractor registration failed'
    );
    return this._persistSession(data);
  },

  async contractorLogin(email, password) {
    const data = await this._requestJson(
      '/api/auth/contractor/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: { email, password }
      },
      'Contractor login failed'
    );
    return this._persistSession(data);
  },

  async getContractorProfile() {
    return this._requestJson(
      '/api/contractor/profile',
      { headers: this.getAuthHeaders() },
      'Failed to fetch contractor profile'
    );
  },

  async updateContractorProfile(payload) {
    return this._requestJson(
      '/api/contractor/profile',
      { method: 'PUT', headers: this.getAuthHeaders(), body: payload },
      'Failed to update contractor profile'
    );
  },

  async getContractorDashboard() {
    return this._requestJson(
      '/api/contractor/dashboard',
      { headers: this.getAuthHeaders() },
      'Failed to load contractor dashboard'
    );
  },

  async getContractorJobs(status = '') {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return this._requestJson(
      `/api/contractor/jobs${qs}`,
      { headers: this.getAuthHeaders() },
      'Failed to load contractor jobs'
    );
  },

  async createContractorJob(payload) {
    return this._requestJson(
      '/api/contractor/jobs',
      { method: 'POST', headers: this.getAuthHeaders(), body: payload },
      'Failed to create job posting'
    );
  },

  async getContractorJob(jobId) {
    return this._requestJson(
      `/api/contractor/jobs/${jobId}`,
      { headers: this.getAuthHeaders() },
      'Failed to load job details'
    );
  },

  async updateContractorJob(jobId, payload) {
    return this._requestJson(
      `/api/contractor/jobs/${jobId}`,
      { method: 'PUT', headers: this.getAuthHeaders(), body: payload },
      'Failed to update job posting'
    );
  },

  async setContractorJobStatus(jobId, status) {
    return this._requestJson(
      `/api/contractor/jobs/${jobId}/status`,
      { method: 'PATCH', headers: this.getAuthHeaders(), body: { status } },
      'Failed to update job status'
    );
  },

  async deleteContractorJob(jobId) {
    return this._requestJson(
      `/api/contractor/jobs/${jobId}`,
      { method: 'DELETE', headers: this.getAuthHeaders() },
      'Failed to delete job posting'
    );
  },

  async getContractorJobApplications(jobId) {
    return this._requestJson(
      `/api/contractor/jobs/${jobId}/applications`,
      { headers: this.getAuthHeaders() },
      'Failed to load applications for job'
    );
  },

  async getAllContractorApplications(status = '') {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return this._requestJson(
      `/api/contractor/applications${qs}`,
      { headers: this.getAuthHeaders() },
      'Failed to load applications'
    );
  },

  async updateApplicationStatus(appId, status) {
    return this._requestJson(
      `/api/contractor/applications/${appId}/status`,
      { method: 'PATCH', headers: this.getAuthHeaders(), body: { status } },
      'Failed to update application status'
    );
  },

  async discoverVerifiedWorkers(params = {}) {
    const query = new URLSearchParams();
    if (params.trade && params.trade !== 'all') query.set('trade', params.trade);
    if (params.city) query.set('city', params.city);
    if (params.state) query.set('state', params.state);
    if (params.q) query.set('q', params.q);
    if (params.min_experience) query.set('min_experience', params.min_experience);
    const qs = query.toString() ? `?${query.toString()}` : '';

    return this._requestJson(
      `/api/contractor/workers${qs}`,
      { headers: this.getAuthHeaders() },
      'Failed to search verified workers'
    );
  },

  async sendContactRequest(payload) {
    return this._requestJson(
      '/api/contractor/contact-requests',
      { method: 'POST', headers: this.getAuthHeaders(), body: payload },
      'Failed to send interview request'
    );
  },

  async getContractorContactRequests() {
    return this._requestJson(
      '/api/contractor/contact-requests',
      { headers: this.getAuthHeaders() },
      'Failed to load contact requests'
    );
  },

  // --------------------------------------------------------------------------
  // Phase 4: Worker Job Browsing & Application APIs
  // --------------------------------------------------------------------------
  async getPublicJobs(params = {}) {
    const query = new URLSearchParams();
    if (params.trade && params.trade !== 'all') query.set('trade', params.trade);
    if (params.city) query.set('city', params.city);
    if (params.state) query.set('state', params.state);
    if (params.employment_type && params.employment_type !== 'all') query.set('employment_type', params.employment_type);
    if (params.q) query.set('q', params.q);
    const qs = query.toString() ? `?${query.toString()}` : '';

    return this._requestJson(
      `/api/worker/jobs${qs}`,
      { headers: { 'Accept': 'application/json' } },
      'Failed to load jobs'
    );
  },

  async getJobDetail(jobId) {
    return this._requestJson(
      `/api/worker/jobs/${jobId}`,
      { headers: { 'Accept': 'application/json' } },
      'Failed to load job details'
    );
  },

  async applyToJob(jobId, coverNote = '') {
    return this._requestJson(
      `/api/worker/jobs/${jobId}/apply`,
      { method: 'POST', headers: this.getAuthHeaders(), body: { cover_note: coverNote } },
      'Failed to submit job application'
    );
  },

  async getMyJobApplications() {
    return this._requestJson(
      '/api/worker/applications',
      { headers: this.getAuthHeaders() },
      'Failed to load your applications'
    );
  },

  async withdrawJobApplication(appId) {
    return this._requestJson(
      `/api/worker/applications/${appId}/withdraw`,
      { method: 'PATCH', headers: this.getAuthHeaders() },
      'Failed to withdraw application'
    );
  },

  async getWorkerContactRequests() {
    return this._requestJson(
      '/api/worker/contact-requests',
      { headers: this.getAuthHeaders() },
      'Failed to load contact requests'
    );
  },

  async respondToContactRequest(requestId, action, shareContact = true) {
    return this._requestJson(
      `/api/worker/contact-requests/${requestId}/respond`,
      { method: 'PATCH', headers: this.getAuthHeaders(), body: { action, share_contact: shareContact } },
      'Failed to respond to contact request'
    );
  },

  // --------------------------------------------------------------------------
  // Phase 4: Admin Contractor Management & Job Moderation APIs
  // --------------------------------------------------------------------------
  async getAdminContractors(status = '') {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return this._requestJson(
      `/api/admin/contractors${qs}`,
      { headers: this.getAuthHeaders() },
      'Failed to load contractors'
    );
  },

  async verifyAdminContractor(contractorId, status, reason = '') {
    return this._requestJson(
      `/api/admin/contractors/${contractorId}/verify`,
      { method: 'PATCH', headers: this.getAuthHeaders(), body: { status, reason } },
      'Failed to update contractor verification'
    );
  },

  async getAdminJobs(params = {}) {
    const query = new URLSearchParams();
    if (params.trade && params.trade !== 'all') query.set('trade', params.trade);
    if (params.status && params.status !== 'all') query.set('status', params.status);
    const qs = query.toString() ? `?${query.toString()}` : '';

    return this._requestJson(
      `/api/admin/jobs${qs}`,
      { headers: this.getAuthHeaders() },
      'Failed to load jobs for moderation'
    );
  },

  async deleteAdminJob(jobId) {
    return this._requestJson(
      `/api/admin/jobs/${jobId}`,
      { method: 'DELETE', headers: this.getAuthHeaders() },
      'Failed to remove job posting'
    );
  }
};
