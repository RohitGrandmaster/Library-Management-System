"use client";
import React from 'react';
import { 
  ArrowLeft, FileText, User, Globe, Shield, Clock, Hash, CheckCircle, 
  AlertTriangle, XCircle, Database, Smartphone, GitCommit
} from 'lucide-react';

export default function AuditDetailsView({ audit, onBack }: { audit: any, onBack: () => void }) {
  const isDiff = audit.oldValue && audit.newValue;

  return (
    <div className="flex flex-col gap-6 w-full h-full flex-1 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-slate-700 dark:hover:text-slate-300 mb-3 transition-colors">
            <ArrowLeft size={14} /> Back to Audit Logs
          </button>
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <FileText className="text-slate-500" size={24} />
            Audit Record Details
          </h2>
          <p className="text-sm text-gray-500 font-mono mt-1 flex items-center gap-2">
            ReqID: <span className="font-bold">{audit.reqId || 'REQ-8842-AX91'}</span>
            <span>•</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{audit.date} {audit.time}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {audit.result === 'Success' && <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm"><CheckCircle size={16} /> Success</span>}
          {audit.result === 'Failed' && <span className="px-3 py-1.5 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm"><XCircle size={16} /> Failed</span>}
          {audit.result === 'Blocked' && <span className="px-3 py-1.5 bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 border border-orange-200 dark:border-orange-800 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm"><AlertTriangle size={16} /> Blocked</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Primary Meta Data */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
              <Database size={16} className="text-slate-400" /> Action Context
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Action Attempted</p>
                <p className="text-sm font-extrabold text-gray-900 dark:text-white bg-slate-50 dark:bg-[#1E293B] p-2 rounded-lg border border-gray-100 dark:border-gray-700">{audit.action}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Target Module</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white bg-slate-50 dark:bg-[#1E293B] p-2 rounded-lg border border-gray-100 dark:border-gray-700">{audit.module}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Record ID Affected</p>
                <p className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg">{audit.recordId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Reason / Note</p>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-slate-50 dark:bg-[#1E293B] p-2 rounded-lg border border-gray-100 dark:border-gray-700">{audit.reason || 'No explicit reason provided.'}</p>
              </div>
            </div>
          </div>

          {isDiff && (
            <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-6 animate-in slide-in-from-bottom-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
                <GitCommit size={16} className="text-slate-400" /> Data Modification (Diff)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-red-200 dark:border-red-900/30 rounded-xl overflow-hidden">
                  <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 border-b border-red-200 dark:border-red-900/30">
                    <p className="text-xs font-bold text-red-700 dark:text-red-400">Old Value (Before)</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-[#0F172A]">
                    <pre className="text-sm font-mono text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{audit.oldValue}</pre>
                  </div>
                </div>
                <div className="border border-emerald-200 dark:border-emerald-900/30 rounded-xl overflow-hidden">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 border-b border-emerald-200 dark:border-emerald-900/30">
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">New Value (After)</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-[#0F172A]">
                    <pre className="text-sm font-mono text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{audit.newValue}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Secondary Actor/Environment Data */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
              <User size={16} className="text-slate-400" /> Actor Identity
            </h3>
            <ul className="space-y-3">
              <li className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">User / Actor</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{audit.actor}</span>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{audit.role}</span>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Library Scope</span>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{audit.library || 'Platform Global'}</span>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Branch Scope</span>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{audit.branch || 'N/A'}</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
              <Globe size={16} className="text-slate-400" /> Environment Details
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Globe size={14} className="text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">IP Address</span>
                  <span className="text-sm font-mono font-bold text-gray-700 dark:text-gray-300">{audit.ip || '192.168.1.1'}</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Smartphone size={14} className="text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Device & Browser</span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{audit.device || 'MacBook'} • {audit.browser || 'Chrome'}</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Shield size={14} className="text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Session ID</span>
                  <span className="text-xs font-mono font-bold text-gray-500 truncate w-48">{audit.sessionId || 'sess_8x9a2b3c4d5e6f7'}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
