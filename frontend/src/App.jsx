import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LanguageModal from './components/LanguageModal';
import VoiceAssistantPill from './components/VoiceAssistantPill';
import Home from './pages/Home';
import { apiService } from './services/api';

function AppContent() {
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking' | 'connected' | 'disconnected'
  const [dbStatus, setDbStatus] = useState(null);
  const [backendInfo, setBackendInfo] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkHealth = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // 1. Health check
      const healthData = await apiService.checkBackendHealth();
      setBackendInfo(healthData);
      setBackendStatus('connected');

      // 2. Database health check
      try {
        const dbData = await apiService.checkDatabaseHealth();
        setDbStatus(dbData);
      } catch (dbErr) {
        setDbStatus({
          status: 'error',
          database: 'PostgreSQL',
          message: 'Unable to reach database health endpoint'
        });
      }
    } catch (err) {
      console.warn('Backend connection check failed:', err);
      setBackendStatus('disconnected');
      setBackendInfo(null);
      setDbStatus(null);
    } finally {
      setIsRefreshing(false);
      setLastChecked(new Date());
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  const handleOpenGetStarted = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenLogin = () => {
    const el = document.getElementById('system-status');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-teal font-body selection:bg-terracotta/20 selection:text-terracotta-800">
      {/* First-visit Language Selection Modal */}
      <LanguageModal />

      {/* Navigation */}
      <Navbar
        backendStatus={backendStatus}
        onRefreshStatus={checkHealth}
        onOpenGetStarted={handleOpenGetStarted}
        onOpenLogin={handleOpenLogin}
      />
      
      {/* Page Routing */}
      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                backendStatus={backendStatus}
                dbStatus={dbStatus}
                backendInfo={backendInfo}
                lastChecked={lastChecked}
                isRefreshing={isRefreshing}
                onRefreshStatus={checkHealth}
              />
            }
          />
          <Route
            path="*"
            element={
              <Home
                backendStatus={backendStatus}
                dbStatus={dbStatus}
                backendInfo={backendInfo}
                lastChecked={lastChecked}
                isRefreshing={isRefreshing}
                onRefreshStatus={checkHealth}
              />
            }
          />
        </Routes>
      </div>

      {/* Floating Multilingual Voice Assistant Pill */}
      <VoiceAssistantPill />

      {/* Community Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
