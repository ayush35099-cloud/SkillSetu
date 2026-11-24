import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Hero from '../components/Hero';
import About from '../components/About';
import HowItWorks from '../components/HowItWorks';
import Professions from '../components/Professions';
import StatusIndicator from '../components/StatusIndicator';
import { Info, X } from 'lucide-react';

export default function Home({
  backendStatus,
  dbStatus,
  backendInfo,
  lastChecked,
  isRefreshing,
  onRefreshStatus
}) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  const handleGetStarted = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    navigate('/worker');
  };

  const handleHowItWorks = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const target = document.getElementById('how-it-works');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setNotice({
      title: 'Login & Verification Portal',
      message: 'Worker and Contractor credential login will be enabled in the authentication phase. System foundation is active.'
    });
  };

  return (
    <main>
      {/* Informative Notice Banner (if triggered) */}
      {notice && (
        <div className="bg-terracotta-50 border-b border-terracotta-200 px-4 py-3 text-terracotta-800 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-terracotta shrink-0" />
              <span>
                <strong className="font-bold">{notice.title}:</strong> {notice.message}
              </span>
            </div>
            <button
              onClick={() => setNotice(null)}
              className="text-terracotta hover:text-terracotta-800 font-bold p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <Hero
        onOpenGetStarted={handleGetStarted}
        onOpenHowItWorks={handleHowItWorks}
      />

      {/* About Section */}
      <About />

      {/* How It Works Section */}
      <HowItWorks
        onOpenGetStarted={handleGetStarted}
      />

      {/* Professions Covered (All 6 Trades) */}
      <Professions />

      {/* System Status & Backend Monitoring */}
      <StatusIndicator
        backendStatus={backendStatus}
        dbStatus={dbStatus}
        backendInfo={backendInfo}
        lastChecked={lastChecked}
        isRefreshing={isRefreshing}
        onRefresh={onRefreshStatus}
      />
    </main>
  );
}
