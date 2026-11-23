import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import { apiService } from './services/api';

export default function App() {
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        backendStatus={backendStatus}
        dbStatus={dbStatus}
        onRefreshStatus={checkHealth}
      />
      
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
          {/* Catch-all route to redirect back to home */}
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

      <Footer />
    </div>
  );
}
