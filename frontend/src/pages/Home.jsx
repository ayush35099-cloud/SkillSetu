import React, { useState } from 'react';
import Hero from '../components/Hero';
import StatusIndicator from '../components/StatusIndicator';
import SkillVerification from '../components/SkillVerification';
import Professions from '../components/Professions';
import { Info, X } from 'lucide-react';

export default function Home({
  backendStatus,
  dbStatus,
  backendInfo,
  lastChecked,
  isRefreshing,
  onRefreshStatus
}) {
  const [notice, setNotice] = useState(null);

  const handleGetStarted = (e) => {
    // In Phase 1, we show a clean informative banner/modal as required:
    // "Important: These are static homepage elements only. Do not implement actual registration or login. Do not add fake functionality to buttons."
    e.preventDefault();
    const target = document.getElementById('verification');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setNotice({
      title: "Phase 1 Foundation Active",
      message: "Worker onboarding, practical video submissions, and contractor matching modules will be introduced in subsequent project phases. Explore the verified trades and system architecture below."
    });
  };

  const handleExplore = (e) => {
    e.preventDefault();
    const target = document.getElementById('professions');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main>
      {/* Informative Notice Banner (if triggered) */}
      {notice && (
        <div className="bg-brand-50 border-b border-brand-200 px-4 py-3 text-brand-900 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-brand-600 shrink-0" />
              <span>
                <strong className="font-semibold">{notice.title}:</strong> {notice.message}
              </span>
            </div>
            <button
              onClick={() => setNotice(null)}
              className="text-brand-700 hover:text-brand-900 font-bold p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <Hero
        onOpenGetStarted={handleGetStarted}
        onOpenExplore={handleExplore}
      />

      {/* Backend & DB Status Indicator */}
      <StatusIndicator
        backendStatus={backendStatus}
        dbStatus={dbStatus}
        backendInfo={backendInfo}
        lastChecked={lastChecked}
        isRefreshing={isRefreshing}
        onRefresh={onRefreshStatus}
      />

      {/* Introduction to Skill Verification */}
      <SkillVerification />

      {/* Example Professions */}
      <Professions />
    </main>
  );
}
