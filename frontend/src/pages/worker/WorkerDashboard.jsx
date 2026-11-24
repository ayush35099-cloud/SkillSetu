import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  QrCode, 
  ShieldCheck, 
  Zap, 
  Wrench, 
  Hammer, 
  Building, 
  Flame, 
  Paintbrush, 
  Cog, 
  Layers, 
  ExternalLink, 
  Award,
  Sparkles,
  ChevronRight,
  TrendingUp,
  FileCheck2
} from 'lucide-react';

export default function WorkerDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('skillsetu_worker_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      fullName: 'Ramesh Kumar',
      primaryTrade: 'Electrician'
    };
  });

  const trades = [
    {
      id: 'electrician',
      icon: Zap,
      name: t('professions.electrician.name', 'Electrician'),
      nativeName: t('professions.electrician.nativeName', 'Electrician / विद्युत कर्मी'),
      status: 'verified',
      level: 'Level 2 Verified',
      color: 'amber'
    },
    {
      id: 'plumber',
      icon: Wrench,
      name: t('professions.plumber.name', 'Plumber'),
      nativeName: t('professions.plumber.nativeName', 'Plumber / प्लंबर'),
      status: 'in-review',
      level: 'Under Review',
      color: 'cyan'
    },
    {
      id: 'mason',
      icon: Building,
      name: t('professions.mason.name', 'Mason'),
      nativeName: t('professions.mason.nativeName', 'Mason / राजमिस्त्री'),
      status: 'available',
      level: 'Ready to Test',
      color: 'emerald'
    },
    {
      id: 'carpenter',
      icon: Hammer,
      name: t('professions.carpenter.name', 'Carpenter'),
      nativeName: t('professions.carpenter.nativeName', 'Carpenter / बढ़ई'),
      status: 'available',
      level: 'Ready to Test',
      color: 'amber'
    },
    {
      id: 'welder',
      icon: Flame,
      name: t('professions.welder.name', 'Welder'),
      nativeName: t('professions.welder.nativeName', 'Welder / वेल्डर'),
      status: 'available',
      level: 'Ready to Test',
      color: 'rose'
    },
    {
      id: 'painter',
      icon: Paintbrush,
      name: t('professions.painter.name', 'Painter'),
      nativeName: t('professions.painter.nativeName', 'Painter / पेंटर'),
      status: 'available',
      level: 'Ready to Test',
      color: 'purple'
    },
    {
      id: 'mechanic',
      icon: Cog,
      name: t('professions.mechanic.name', 'Mechanic'),
      nativeName: t('professions.mechanic.nativeName', 'Mechanic / मैकेनिक'),
      status: 'available',
      level: 'Ready to Test',
      color: 'blue'
    },
    {
      id: 'other',
      icon: Layers,
      name: t('professions.other.name', 'Other Trades'),
      nativeName: t('professions.other.nativeName', 'Other Trades / अन्य हुनर'),
      status: 'available',
      level: 'Ready to Test',
      color: 'stone'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Welcome & Profile Completion Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-beige shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-50 text-terracotta-800 text-xs font-bold border border-terracotta-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-terracotta" />
              <span>Track 4 – Localized Vocational Skill Verification</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-teal font-heading">
              {t('worker.dashboard.welcome', 'Welcome back, {name}').replace('{name}', profile.fullName || 'Ramesh Kumar')}
            </h2>
            
            <p className="text-sm text-greygreen mt-2 leading-relaxed max-w-2xl">
              {t('worker.dashboard.subWelcome', 'Manage your practical trade credentials, track assessment milestones, and connect directly with local contractors.')}
            </p>
          </div>

          {/* Quick status counters */}
          <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-beige/60">
            <div className="bg-emerald-50/80 rounded-2xl p-3 border border-emerald-200/80">
              <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>2</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                {t('worker.dashboard.verifiedCount', '2 Verified Skills')}
              </p>
            </div>

            <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200/80">
              <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>1</span>
              </div>
              <p className="text-[11px] text-amber-700 font-medium mt-1">
                {t('worker.dashboard.inReviewCount', '1 In Review')}
              </p>
            </div>

            <div className="bg-teal-50/80 rounded-2xl p-3 border border-teal-200/80">
              <div className="flex items-center gap-1.5 text-teal-800 text-xs font-bold">
                <Award className="w-4 h-4 text-teal-600" />
                <span>3</span>
              </div>
              <p className="text-[11px] text-teal-700 font-medium mt-1">
                {t('worker.dashboard.pendingCount', '3 Available')}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Completion Indicator */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-beige shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-teal font-heading">
                {t('worker.dashboard.completionTitle', 'Profile Completion')}
              </h3>
              <span className="text-lg font-black text-terracotta font-heading">75%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-sand-200 rounded-full h-3 overflow-hidden mb-4">
              <div 
                className="bg-gradient-to-r from-amber-500 to-terracotta h-3 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: '75%' }} 
              />
            </div>

            <p className="text-xs text-greygreen leading-relaxed">
              {t('worker.dashboard.completionDesc', 'Complete all sections to boost your profile ranking with local construction and infrastructure contractors.')}
            </p>

            {/* Checklist */}
            <ul className="space-y-2 mt-4 text-xs font-medium text-teal-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Basic Profile & Contact Details</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Primary Trade Selection (Electrician)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>2 Hands-on Practical Tests Passed</span>
              </li>
              <li className="flex items-center gap-2 text-greygreen">
                <div className="w-4 h-4 rounded-full border-2 border-dashed border-greygreen/50 shrink-0" />
                <span>Practical Demonstration: 3-Phase Wiring</span>
              </li>
            </ul>
          </div>

          <Link
            to="/worker/profile"
            className="mt-5 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-beige/50 hover:bg-beige text-teal font-bold text-xs transition-colors"
          >
            <span>Update Profile Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* 2. Digital Skill Passport Compact Preview Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-900 via-teal to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-md border border-teal-700">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0">
              <QrCode className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  {t('worker.dashboard.passportPreview', 'Digital Skill Passport')}
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Active Credential
                </span>
              </div>
              <h3 className="text-xl font-bold font-heading text-white mt-0.5">
                {t('worker.dashboard.passportId', 'Trade ID: SKL-IND-2026-8842')}
              </h3>
              <p className="text-xs text-teal-200 mt-1 max-w-xl">
                Laminated QR-enabled vocational card verifiable by contractors, site engineers, and government skilling councils across India.
              </p>
            </div>
          </div>

          <Link
            to="/worker/passport"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-teal-950 font-bold text-xs sm:text-sm shadow-md transition-all whitespace-nowrap active:scale-95"
          >
            <span>{t('worker.dashboard.viewPassport', 'View Full Passport')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 3. Vocational Skill Categories (8 Trades Grid) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-beige shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-xl font-bold text-teal font-heading">
              {t('worker.dashboard.allCategories', 'Vocational Skill Categories')}
            </h3>
            <p className="text-xs sm:text-sm text-greygreen mt-1">
              {t('worker.dashboard.allCategoriesSub', 'Explore certified competencies, tool proficiencies, and practical assessment tasks across 8 core trades.')}
            </p>
          </div>
          
          <Link
            to="/worker/skills"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta hover:underline shrink-0"
          >
            <span>Full Verification Benchmarks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trades.map((trade) => {
            const Icon = trade.icon;
            return (
              <div
                key={trade.id}
                onClick={() => navigate('/worker/skills')}
                className="cursor-pointer group p-4 rounded-2xl border border-beige hover:border-terracotta/40 bg-sand-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-teal text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-terracotta-200" />
                    </div>
                    {trade.status === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    ) : trade.status === 'in-review' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>In Review</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-sand-200/60 text-greygreen px-2 py-0.5 rounded-full">
                        <span>Ready to Test</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-teal font-heading group-hover:text-terracotta transition-colors">
                    {trade.name}
                  </h4>
                  <p className="text-[11px] text-greygreen mt-0.5">
                    {trade.nativeName}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-beige/60 flex items-center justify-between text-[11px] text-teal-700 font-semibold">
                  <span>{trade.level}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-greygreen group-hover:text-terracotta group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Recent Activity Feed & Recommended Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Activity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-beige shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-terracotta" />
            <h3 className="text-lg font-bold text-teal font-heading">
              {t('worker.dashboard.recentActivity', 'Recent Activity')}
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200/60">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-teal-900 leading-snug">
                  {t('worker.dashboard.activity1', 'Practical Assessment approved for Conduit Wiring & MCB Sizing')}
                </p>
                <span className="text-[10px] text-emerald-700 font-medium mt-1 block">
                  {t('worker.dashboard.activity1Time', 'Yesterday at 4:30 PM')}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-sand-50 border border-beige/80">
              <div className="p-2 rounded-xl bg-sand-200 text-teal shrink-0 mt-0.5">
                <Award className="w-4 h-4 text-terracotta" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-teal-900 leading-snug">
                  {t('worker.dashboard.activity2', 'Digital Trade Credential updated with Level 2 Badge')}
                </p>
                <span className="text-[10px] text-greygreen font-medium mt-1 block">
                  {t('worker.dashboard.activity2Time', '2 days ago')}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-sand-50 border border-beige/80">
              <div className="p-2 rounded-xl bg-teal-50 text-teal shrink-0 mt-0.5">
                <FileCheck2 className="w-4 h-4 text-teal" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-teal-900 leading-snug">
                  {t('worker.dashboard.activity3', 'Direct contractor inquiry viewed by Sharma Builders, Bengaluru')}
                </p>
                <span className="text-[10px] text-greygreen font-medium mt-1 block">
                  {t('worker.dashboard.activity3Time', '3 days ago')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Next Steps */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-beige shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-teal font-heading">
              {t('worker.dashboard.recommendedSteps', 'Recommended Next Steps')}
            </h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-beige bg-sand-50/50 hover:bg-white hover:border-teal/30 transition-all flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-teal font-heading">
                  {t('worker.dashboard.step1Title', 'Submit Practical Evidence for 3-Phase Industrial Wiring')}
                </h4>
                <p className="text-[11px] text-greygreen mt-1">
                  {t('worker.dashboard.step1Desc', 'Upload brief hands-on task demonstration for vocational assessor verification.')}
                </p>
              </div>
              <Link
                to="/worker/skills"
                className="shrink-0 px-3 py-1.5 rounded-lg bg-teal text-white text-[11px] font-bold hover:bg-teal-800 transition-colors"
              >
                {t('worker.dashboard.actionBtn', 'Take Action')}
              </Link>
            </div>

            <div className="p-4 rounded-2xl border border-beige bg-sand-50/50 hover:bg-white hover:border-teal/30 transition-all flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-teal font-heading">
                  {t('worker.dashboard.step2Title', 'Download or Print Physical Passport Card')}
                </h4>
                <p className="text-[11px] text-greygreen mt-1">
                  {t('worker.dashboard.step2Desc', 'Carry your QR-enabled laminated ID to job sites for instant contractor verification.')}
                </p>
              </div>
              <Link
                to="/worker/passport"
                className="shrink-0 px-3 py-1.5 rounded-lg bg-terracotta text-white text-[11px] font-bold hover:bg-terracotta-600 transition-colors"
              >
                {t('worker.dashboard.actionBtn', 'Take Action')}
              </Link>
            </div>

            <div className="p-4 rounded-2xl border border-beige bg-sand-50/50 hover:bg-white hover:border-teal/30 transition-all flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-teal font-heading">
                  {t('worker.dashboard.step3Title', 'Keep Location and Contact Preferences Updated')}
                </h4>
                <p className="text-[11px] text-greygreen mt-1">
                  {t('worker.dashboard.step3Desc', 'Ensure local contractors can reach you for daily and long-term project contracts.')}
                </p>
              </div>
              <Link
                to="/worker/profile"
                className="shrink-0 px-3 py-1.5 rounded-lg bg-sand-200 text-teal text-[11px] font-bold hover:bg-sand-300 transition-colors"
              >
                {t('worker.dashboard.actionBtn', 'Take Action')}
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
