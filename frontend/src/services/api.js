/**
 * SkillSetu API Client Service
 * Configured via VITE_API_BASE_URL environment variable.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

export const apiService = {
  /**
   * Get the configured API Base URL
   */
  getBaseUrl() {
    return API_BASE_URL || 'Local / Relative Proxy';
  },

  /**
   * Check core backend health status
   * Expected response: { status: 'healthy', service: 'SkillSetu Backend' }
   */
  async checkBackendHealth() {
    const url = `${API_BASE_URL}/api/health`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    return await response.json();
  },

  /**
   * Check database connectivity status
   */
  async checkDatabaseHealth() {
    const url = `${API_BASE_URL}/api/health/db`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    return await response.json();
  },

  /**
   * Get root API information
   */
  async getRootInfo() {
    const url = `${API_BASE_URL}/`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    return await response.json();
  }
};
