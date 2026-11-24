import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Server, Database, RefreshCw, CheckCircle2, XCircle, AlertTriangle, Globe } from 'lucide-react';
import { apiService } from '../services/api';

export default function StatusIndicator({
  backendStatus,
  dbStatus,
  backendInfo,
  lastChecked,
  isRefreshing,
  onRefresh
}) {
  const { t } = useLanguage();
  const apiUrl = apiService.getBaseUrl();

  return (
    <section id="system-status" className="py-12 bg-ivory-100 dark:bg-charcoal-950 border-y border-beige dark:border-charcoal-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-charcoal-800 rounded-3xl shadow-sm border border-beige dark:border-charcoal-700 p-6 sm:p-7">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-beige/60 dark:border-charcoal-700">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-terracotta"></span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory font-heading">
                  {t('status.title', 'System Integration & Health Monitoring')}
                </h3>
              </div>
              <p className="text-xs text-greygreen dark:text-ivory/60 mt-0.5">
                {t('status.desc', 'Live verification of Flask REST backend and PostgreSQL database connectivity')}
              </p>
            </div>

            <div className="flex items-center gap-2.5 text-xs">
              <span className="text-greygreen dark:text-ivory/60">
                {t('status.lastChecked', 'Last checked')}: {lastChecked ? lastChecked.toLocaleTimeString() : 'Never'}
              </span>
              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-ivory dark:bg-charcoal-700 hover:bg-beige/40 dark:hover:bg-charcoal-600 text-teal dark:text-ivory font-bold border border-beige dark:border-charcoal-600 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-terracotta' : ''}`} />
                <span>{isRefreshing ? 'Checking...' : t('status.refresh', 'Refresh Status')}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            
            {/* Backend Service Card */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-ivory/60 dark:bg-charcoal-700/50 border border-beige dark:border-charcoal-600">
              <div className={`p-2.5 rounded-xl shrink-0 ${
                backendStatus === 'connected' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' :
                backendStatus === 'checking' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' :
                'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
              }`}>
                <Server className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-greygreen dark:text-ivory/60">
                  {t('status.backendService', 'Flask API Service')}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-flex items-center gap-1 text-sm font-bold font-heading ${
                    backendStatus === 'connected' ? 'text-emerald-800 dark:text-emerald-300' :
                    backendStatus === 'checking' ? 'text-amber-800 dark:text-amber-300' :
                    'text-rose-800 dark:text-rose-300'
                  }`}>
                    {backendStatus === 'connected' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                    {backendStatus === 'checking' && <RefreshCw className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-spin" />}
                    {backendStatus === 'disconnected' && <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                    {backendStatus === 'connected' && t('status.backendConnected', 'Backend Connected')}
                    {backendStatus === 'checking' && t('status.backendChecking', 'Checking Connection')}
                    {backendStatus === 'disconnected' && t('status.backendDisconnected', 'Backend Disconnected')}
                  </span>
                </div>
                <p className="text-[11px] text-greygreen dark:text-ivory/50 truncate mt-1">
                  Target: <span className="font-mono">{apiUrl || 'Local'}</span>
                </p>
              </div>
            </div>

            {/* PostgreSQL Database Card */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-ivory/60 dark:bg-charcoal-700/50 border border-beige dark:border-charcoal-600">
              <div className={`p-2.5 rounded-xl shrink-0 ${
                dbStatus?.status === 'connected' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' :
                backendStatus === 'checking' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' :
                'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
              }`}>
                <Database className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-greygreen dark:text-ivory/60">
                  {t('status.dbService', 'PostgreSQL Database')}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-flex items-center gap-1 text-sm font-bold font-heading ${
                    dbStatus?.status === 'connected' ? 'text-emerald-800 dark:text-emerald-300' :
                    backendStatus === 'checking' ? 'text-amber-800 dark:text-amber-300' :
                    'text-rose-800 dark:text-rose-300'
                  }`}>
                    {dbStatus?.status === 'connected' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                    {backendStatus === 'checking' && <RefreshCw className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-spin" />}
                    {dbStatus?.status !== 'connected' && backendStatus !== 'checking' && <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                    {dbStatus?.status === 'connected' ? t('status.dbConnected', 'DB Connected') : t('status.dbDisconnected', 'DB Disconnected')}
                  </span>
                </div>
                <p className="text-[11px] text-greygreen dark:text-ivory/50 truncate mt-1">
                  {dbStatus?.message || 'Checking PostgreSQL dialect...'}
                </p>
              </div>
            </div>

            {/* Architecture Card */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-ivory/60 dark:bg-charcoal-700/50 border border-beige dark:border-charcoal-600">
              <div className="p-2.5 rounded-xl shrink-0 bg-teal text-white dark:bg-charcoal-600">
                <Globe className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-greygreen dark:text-ivory/60">
                  Deployment Infrastructure
                </span>
                <p className="text-sm font-bold font-heading text-teal dark:text-ivory mt-0.5">
                  Render Free + GitHub Pages
                </p>
                <p className="text-[11px] text-greygreen dark:text-ivory/50 mt-1">
                  Gunicorn Python 3.11 • SQLAlchemy
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
