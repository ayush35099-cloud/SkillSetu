import React from 'react';
import { ShieldCheck, HardHat, Server, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function Navbar({ backendStatus, dbStatus, onRefreshStatus }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  Skill<span className="text-brand-600">Setu</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded border border-brand-200">
                  Phase 1
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                कौशल से सेतु • Vocational Skill Verification
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#hero" className="hover:text-brand-600 transition-colors">Overview</a>
            <a href="#verification" className="hover:text-brand-600 transition-colors">Verification</a>
            <a href="#professions" className="hover:text-brand-600 transition-colors">Professions</a>
            <a href="#system-status" className="hover:text-brand-600 transition-colors">API Status</a>
          </nav>

          {/* Status Badge in Navbar */}
          <div className="flex items-center gap-3">
            <div 
              onClick={onRefreshStatus}
              title="Click to re-check API status"
              className={`cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                backendStatus === 'connected'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : backendStatus === 'checking'
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
              }`}
            >
              {backendStatus === 'connected' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="hidden sm:inline">Backend</span> Connected
                </>
              ) : backendStatus === 'checking' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span className="hidden sm:inline">Checking</span> Connection
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden sm:inline">Backend</span> Disconnected
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
