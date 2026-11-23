import React from 'react';
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
  const apiUrl = apiService.getBaseUrl();

  return (
    <section id="system-status" className="py-8 bg-slate-100 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  System Integration & Health Monitoring
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Live verification of Flask REST backend and PostgreSQL database connectivity
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">
                Last checked: {lastChecked ? lastChecked.toLocaleTimeString() : 'Never'}
              </span>
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-300 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brand-600' : ''}`} />
                {isRefreshing ? 'Checking...' : 'Refresh'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            
            {/* Backend Service Card */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className={`p-2 rounded-lg shrink-0 ${
                backendStatus === 'connected' ? 'bg-emerald-100 text-emerald-700' :
                backendStatus === 'checking' ? 'bg-amber-100 text-amber-700' :
                'bg-rose-100 text-rose-700'
              }`}>
                <Server className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-slate-500">Flask API Service</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`inline-flex items-center gap-1 text-sm font-bold ${
                    backendStatus === 'connected' ? 'text-emerald-700' :
                    backendStatus === 'checking' ? 'text-amber-700' :
                    'text-rose-700'
                  }`}>
                    {backendStatus === 'connected' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {backendStatus === 'checking' && <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />}
                    {backendStatus === 'disconnected' && <XCircle className="w-4 h-4 text-rose-600" />}
                    {backendStatus === 'connected' && 'Backend Connected'}
                    {backendStatus === 'checking' && 'Checking Connection'}
                    {backendStatus === 'disconnected' && 'Backend Disconnected'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 truncate mt-1">
                  Service: <span className="font-medium text-slate-800">{backendInfo?.service || 'SkillSetu Backend'}</span>
                </p>
              </div>
            </div>

            {/* PostgreSQL Health Card */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className={`p-2 rounded-lg shrink-0 ${
                dbStatus?.status === 'connected' ? 'bg-emerald-100 text-emerald-700' :
                dbStatus?.status === 'unconfigured' ? 'bg-blue-100 text-blue-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                <Database className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-slate-500">PostgreSQL Connection</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`inline-flex items-center gap-1 text-sm font-bold ${
                    dbStatus?.status === 'connected' ? 'text-emerald-700' :
                    dbStatus?.status === 'unconfigured' ? 'text-blue-700' :
                    'text-amber-700'
                  }`}>
                    {dbStatus?.status === 'connected' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {dbStatus?.status === 'unconfigured' && <AlertTriangle className="w-4 h-4 text-blue-600" />}
                    {dbStatus?.status === 'error' && <XCircle className="w-4 h-4 text-rose-600" />}
                    {dbStatus?.status === 'connected' ? 'Database Connected' :
                     dbStatus?.status === 'unconfigured' ? 'Ready for DB Config' :
                     'Connection Pending'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 truncate mt-1">
                  {dbStatus?.message || 'Database status ready'}
                </p>
              </div>
            </div>

            {/* API Endpoint Details */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="p-2 rounded-lg shrink-0 bg-slate-200 text-slate-700">
                <Globe className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-slate-500">Configured API Base</span>
                <div className="text-xs font-mono font-bold text-slate-800 truncate mt-1 bg-white px-2 py-1 rounded border border-slate-200">
                  {apiUrl}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Source: <code className="text-brand-600">VITE_API_BASE_URL</code>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
