import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { RegionProvider } from './context/RegionContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LanguageModal from './components/LanguageModal';
import RegionModal from './components/RegionModal';
import LoginModal from './components/LoginModal';
import VoiceAssistantPill from './components/VoiceAssistantPill';
import Home from './pages/Home';
import WorkerLayout from './components/worker/WorkerLayout';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import WorkerProfile from './pages/worker/WorkerProfile';
import WorkerSkills from './pages/worker/WorkerSkills';
import SkillPassport from './pages/worker/SkillPassport';
import { apiService } from './services/api';

function AppContent() {
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking' | 'connected' | 'disconnected'
  const [dbStatus, setDbStatus] = useState(null);
  const [backendInfo, setBackendInfo] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col bg-ivory dark:bg-charcoal-900 text-teal dark:text-ivory font-body selection:bg-terracotta/20 selection:text-terracotta-800 dark:selection:bg-amber-400/20 dark:selection:text-amber-200 transition-colors">
      {/* First-visit Language Selection Modal */}
      <LanguageModal />

      {/* Searchable Indian Region / State Selection Modal */}
      <RegionModal />

      {/* Role Selection / Login Modal */}
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />

      {/* Primary Navigation */}
      <Navbar
        backendStatus={backendStatus}
        onRefreshStatus={checkHealth}
        onOpenLogin={() => setLoginModalOpen(true)}
      />
      
      {/* Application Routing */}
      <div className="flex-1">
        <Routes>
          {/* Public Landing Page */}
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

          {/* Dedicated Worker Experience Experience Routes */}
          <Route path="/worker" element={<WorkerLayout />}>
            <Route index element={<WorkerDashboard />} />
            <Route path="profile" element={<WorkerProfile />} />
            <Route path="skills" element={<WorkerSkills />} />
            <Route path="passport" element={<SkillPassport />} />
          </Route>

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
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
    <ThemeProvider>
      <LanguageProvider>
        <RegionProvider>
          <AppContent />
        </RegionProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
