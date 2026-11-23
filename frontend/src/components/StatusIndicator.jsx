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
    <section id="system-status" className="py-12 bg-ivory-100 border-y border-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-beige p-6 sm:p-7">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-beige/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-terracotta"></span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal font-heading">
                  {t('status.title', 'System Integration & Health Monitoring')}
                </h3>
              </div>
              <p className="text-xs text-greygreen mt-0.5">
                {t('status.desc', 'Live verification of Flask REST backend and PostgreSQL database connectivity')}
              </p>
            </div>

            <div className="flex items-center gap-2.5 text-xs">
              <span className="text-greygreen">
                {t('status.lastChecked', 'Last checked')}: {lastChecked ? lastChecked.toLocaleTimeString() : 'Never'}
              </span>
              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-ivory hover:bg-beige/40 text-teal font-bold border border-beige transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-terracotta' : ''}`} />
                <span>{isRefreshing ? 'Checking...' : t('status.refresh', 'Refresh Status')}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            
            {/* Backend Service Card */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-ivory/60 border border-beige">
              <div className={`p-2.5 rounded-xl shrink-0 ${
                backendStatus === 'connected' ? 'bg-emerald-100 text-emerald-800' :
                backendStatus === 'checking' ? 'bg-amber-100 text-amber-800' :
                'bg-rose-100 text-rose-800'
              }`}>
                <Server className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-greygreen">
                  {t('status.backendService', 'Flask API Service')}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-flex items-center gap-1 text-sm font-bold font-heading ${
                    backendStatus === 'connected' ? 'text-emerald-800' :
                    backendStatus === 'checking' ? 'text-amber-800' :
                    'text-rose-800'
                  }`}>
                    {backendStatus === 'connected' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {backendStatus === 'checking' && <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />}
                    {backendStatus === 'disconnected' && <XCircle className="w-4 h-4 text-rose-600" />}
                    {backendStatus === 'connected' && t('status.backendConnected', 'Backend Connected')}
                    {backendStatus === 'checking' && t('status.backendChecking', 'Checking Connection')}
                    {backendStatus === 'disconnected' && t('status.backendDisconnected', 'Backend Disconnected')}
                  </span>
                </div>
                <p className="text-[11px] text-greygreen truncate mt-1">
                  Service: <span className="font-medium text-teal">{backendInfo?.service || 'SkillSetu Backend'}</span>
                </p>
              </div>
            </div>

            {/* PostgreSQL Health Card */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-ivory/60 border border-beige">
              <div className={`p-2.5 rounded-xl shrink-0 ${
                dbStatus?.status === 'connected' ? 'bg-emerald-100 text-emerald-800' :
                dbStatus?.status === 'unconfigured' ? 'bg-blue-100 text-blue-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                <Database className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-greygreen">
                  {t('status.dbService', 'PostgreSQL Database')}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-flex items-center gap-1 text-sm font-bold font-heading ${
                    dbStatus?.status === 'connected' ? 'text-emerald-800' :
                    dbStatus?.status === 'unconfigured' ? 'text-blue-800' :
                    'text-amber-800'
                  }`}>
                    {dbStatus?.status === 'connected' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {dbStatus?.status === 'unconfigured' && <AlertTriangle className="w-4 h-4 text-blue-600" />}
                    {dbStatus?.status === 'error' && <XCircle className="w-4 h-4 text-rose-600" />}
                    {dbStatus?.status === 'connected' ? t('status.dbConnected', 'Database Connected') :
                     dbStatus?.status === 'unconfigured' ? t('status.dbReady', 'Ready for DB Config') :
                     t('status.dbPending', 'Connection Pending')}
                  </span>
                </div>
                <p className="text-[11px] text-greygreen truncate mt-1">
                  {dbStatus?.message || 'Database status ready'}
                </p>
              </div>
            </div>

            {/* API Endpoint Details */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-ivory/60 border border-beige">
              <div className="p-2.5 rounded-xl shrink-0 bg-white border border-beige text-teal">
                <Globe className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-greygreen">
                  {t('status.apiBase', 'Configured API Base')}
                </span>
                <div className="text-xs font-mono font-bold text-teal truncate mt-1 bg-white px-2 py-1 rounded-lg border border-beige">
                  {apiUrl}
                </div>
                <p className="text-[10px] text-greygreen mt-1">
                  Source: <code className="text-terracotta">VITE_API_BASE_URL</code>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
