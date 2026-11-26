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

const ASSESSOR_TOKEN_KEY = 'skillsetu_assessor_token';
const ASSESSOR_USER_KEY = 'skillsetu_assessor_user';

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
      return localStorage.getItem(ASSESSOR_TOKEN_KEY) || '';
    } catch {
      return '';
    }
  },

  setToken(token) {
    try {
      if (token) {
        localStorage.setItem(ASSESSOR_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(ASSESSOR_TOKEN_KEY);
      }
    } catch (e) {
      console.warn('Could not store token in localStorage:', e);
    }
  },

  getStoredUser() {
    try {
      const data = localStorage.getItem(ASSESSOR_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setStoredUser(user) {
    try {
      if (user) {
        localStorage.setItem(ASSESSOR_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(ASSESSOR_USER_KEY);
      }
    } catch (e) {
      console.warn('Could not store user in localStorage:', e);
    }
  },

  logout() {
    try {
      localStorage.removeItem(ASSESSOR_TOKEN_KEY);
      localStorage.removeItem(ASSESSOR_USER_KEY);
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
  // Health & Root Status
  // --------------------------------------------------------------------------
  async checkBackendHealth() {
    const url = `${API_BASE_URL}/api/health`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  },

  async checkDatabaseHealth() {
    const url = `${API_BASE_URL}/api/health/db`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    return await response.json();
  },

  async getRootInfo() {
    const url = `${API_BASE_URL}/`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  },

  // --------------------------------------------------------------------------
  // Assessor Authentication
  // --------------------------------------------------------------------------
  async assessorRegister(payload) {
    const response = await fetch(`${API_BASE_URL}/api/auth/assessor/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Registration failed (HTTP ${response.status})`);
    }
    if (data.token) {
      this.setToken(data.token);
      this.setStoredUser(data.user);
    }
    return data;
  },

  async assessorLogin(email, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/assessor/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Login failed (HTTP ${response.status})`);
    }
    if (data.token) {
      this.setToken(data.token);
      this.setStoredUser(data.user);
    }
    return data;
  },

  async adminLogin(email, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Admin login failed (HTTP ${response.status})`);
    }
    if (data.token) {
      this.setToken(data.token);
      this.setStoredUser(data.user);
    }
    return data;
  },

  async getMe() {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Session expired');
    if (data.user) this.setStoredUser(data.user);
    return data;
  },

  // --------------------------------------------------------------------------
  // Assessment Tasks & Rubrics
  // --------------------------------------------------------------------------
  async getTasks(trade = '') {
    const query = trade ? `?trade=${encodeURIComponent(trade)}` : '';
    const response = await fetch(`${API_BASE_URL}/api/tasks${query}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to load tasks');
    return data;
  },

  async getTask(id) {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to load task');
    return data;
  },

  // --------------------------------------------------------------------------
  // Assessor Portal Operations
  // --------------------------------------------------------------------------
  async getAssessorDashboard() {
    const response = await fetch(`${API_BASE_URL}/api/assessor/dashboard`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to load dashboard');
    return data;
  },

  async getAssessorSubmissions({ trade = '', status = '', search = '' } = {}) {
    const params = new URLSearchParams();
    if (trade && trade !== 'all') params.append('trade', trade);
    if (status && status !== 'all') params.append('status', status);
    if (search) params.append('search', search);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/api/assessor/submissions${qs}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to load submissions');
    return data;
  },

  async getAssessorSubmission(id) {
    const response = await fetch(`${API_BASE_URL}/api/assessor/submissions/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to load submission');
    return data;
  },

  async submitReview(submissionId, reviewPayload) {
    const response = await fetch(`${API_BASE_URL}/api/assessor/submissions/${submissionId}/review`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reviewPayload)
    });
    const data = await response.json();
    if (!response.ok) {
      const err = new Error(data.message || 'Failed to submit assessment review');
      err.code = data.code;
      throw err;
    }
    return data;
  },

  async getAssessorHistory() {
    const response = await fetch(`${API_BASE_URL}/api/assessor/history`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to load history');
    return data;
  },

  async getAssessorProfile() {
    const response = await fetch(`${API_BASE_URL}/api/assessor/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to load profile');
    return data;
  },

  async updateAssessorProfile(payload) {
    const response = await fetch(`${API_BASE_URL}/api/assessor/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
  },

  // --------------------------------------------------------------------------
  // Worker Demonstration APIs
  // --------------------------------------------------------------------------
  async getWorkerAssessments(workerId = 101) {
    const response = await fetch(`${API_BASE_URL}/api/worker/assessments?worker_id=${workerId}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to load worker assessments');
    return data;
  },

  async getWorkerAssessment(id) {
    const response = await fetch(`${API_BASE_URL}/api/worker/assessments/${id}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to load assessment detail');
    return data;
  },

  async submitWorkerDemonstration(payload) {
    const response = await fetch(`${API_BASE_URL}/api/worker/assessments/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to submit demonstration');
    return data;
  },

  async resubmitWorkerDemonstration(id, payload) {
    const response = await fetch(`${API_BASE_URL}/api/worker/assessments/${id}/resubmit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to resubmit demonstration');
    return data;
  },

  // --------------------------------------------------------------------------
  // Admin Assessor Management APIs
  // --------------------------------------------------------------------------
  async getAdminAssessors(status = '') {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    const response = await fetch(`${API_BASE_URL}/api/admin/assessors${qs}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to load assessors');
    return data;
  },

  async approveAssessor(id) {
    const response = await fetch(`${API_BASE_URL}/api/admin/assessors/${id}/approve`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to approve assessor');
    return data;
  },

  async rejectAssessor(id) {
    const response = await fetch(`${API_BASE_URL}/api/admin/assessors/${id}/reject`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to reject assessor');
    return data;
  }
};
