"use client";
import React, { useState } from 'react';
import { 
  ArrowLeft, Terminal, Play, PauseCircle, RefreshCw, XCircle, 
  Settings2, Activity, Clock, Server, FileText, CheckCircle, AlertTriangle 
} from 'lucide-react';

const DRILLDOWN_TABS = [
  "Execution Logs", "Payload Details", "Performance Metrics", "Worker Allocation"
];

const getTabMeta = (tab: string) => {
  switch(tab) {
    case "Execution Logs": return { icon: <Terminal size={24} />, color: "text-gray-600", bg: "bg-gray-100" };
    case "Payload Details": return { icon: <FileText size={24} />, color: "text-blue-600", bg: "bg-blue-100" };
    case "Performance Metrics": return { icon: <Activity size={24} />, color: "text-emerald-600", bg: "bg-emerald-100" };
    case "Worker Allocation": return { icon: <Server size={24} />, color: "text-fuchsia-600", bg: "bg-fuchsia-100" };
    default: return { icon: <Clock size={24} />, color: "text-slate-600", bg: "bg-slate-100" };
  }
};

export default function JobDetailsView({ job, onBack }: { job: any, onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("Execution Logs");

  const meta = getTabMeta(activeTab);

  return (
    <div className="flex flex-col gap-6 w-full h-full flex-1 animate-in fade-in zoom-in-95 duration-300">
      {/* Header & Job Operations */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-6">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
          <div className="flex-1">
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-fuchsia-600 mb-4 transition-colors">
              <ArrowLeft size={14} /> Back to Job Dashboard
            </button>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-100 to-pink-100 dark:from-fuchsia-900/40 dark:to-pink-900/40 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 font-extrabold shadow-inner border border-white/50 dark:border-white/5">
                <Settings2 size={32} />
              </div>
              
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3 mb-1">
                  {job.name}
                  <span className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wider border shadow-sm flex items-center gap-1.5 
                    ${job.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : ''}
                    ${job.status === 'Failed' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' : ''}
                    ${job.status === 'Running' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' : ''}
                    ${job.status === 'Scheduled' || job.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' : ''}
                  `}>
                    {job.status === 'Completed' && <CheckCircle size={12} />}
                    {job.status === 'Failed' && <AlertTriangle size={12} />}
                    {job.status === 'Running' && <RefreshCw size={12} className="animate-spin" />}
                    {job.status === 'Scheduled' && <Clock size={12} />}
                    {job.status}
                  </span>
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                  <span className="flex items-center gap-1.5 font-mono text-gray-600 dark:text-gray-300 font-bold">JobID: #{job.id}-8823</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5">Queue: {job.queue || 'Default'}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5 text-fuchsia-600 dark:text-fuchsia-400 font-bold bg-fuchsia-50 dark:bg-fuchsia-900/20 px-2 py-0.5 rounded-md">Attempts: {job.attempts || '1/3'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Action Buttons - Placed directly as buttons for easier access */}
          <div className="flex flex-wrap items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-emerald-600 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-300 transition-all">
              <Play size={14} /> Resume
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-yellow-600 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-300 transition-all">
              <PauseCircle size={14} /> Pause
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-blue-600 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-300 transition-all">
              <RefreshCw size={14} /> Retry
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg shadow-sm hover:bg-red-50 dark:bg-[#1E293B] dark:border-red-900/30 dark:hover:bg-red-900/20 transition-all">
              <XCircle size={14} /> Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Drilldown Navigation */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden flex flex-col h-full">
        <div className="flex overflow-x-auto border-b [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-[#0D1F3C]/30">
          {DRILLDOWN_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-4 text-sm font-bold transition-all border-b-2 outline-none ${
                activeTab === tab 
                  ? 'border-fuchsia-600 text-fuchsia-600 bg-fuchsia-50/50 dark:bg-fuchsia-900/20' 
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Dynamic Tab Content Area */}
        <div className="p-8 min-h-[500px] flex flex-col bg-gray-50/30 dark:bg-[#0D1F3C]/30">
          
          {activeTab === "Execution Logs" ? (
            <div className="flex-1 bg-[#0d1117] rounded-xl border border-gray-800 p-4 font-mono text-xs text-gray-300 overflow-y-auto custom-scrollbar shadow-inner animate-in fade-in">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-800">
                <span className="text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Terminal size={14} className="text-fuchsia-500" /> Live Console Output
                </span>
                <div className="flex items-center gap-3">
                  <button className="text-gray-400 hover:text-white transition-colors">Clear</button>
                  <button className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors font-bold">Download Logs</button>
                </div>
              </div>
              <div className="space-y-1.5">
                <p><span className="text-emerald-400">[2026-09-28 10:15:00]</span> [INFO] Initializing job '{job.name}' (ID: {job.id}-8823)...</p>
                <p><span className="text-emerald-400">[2026-09-28 10:15:01]</span> [INFO] Acquiring worker from queue: {job.queue || 'Default'}...</p>
                <p><span className="text-emerald-400">[2026-09-28 10:15:01]</span> [INFO] Worker allocation successful. Process ID: 9482.</p>
                <p><span className="text-blue-400">[2026-09-28 10:15:02]</span> [DEBUG] Parsing payload parameters...</p>
                {job.status === 'Failed' ? (
                  <>
                    <p><span className="text-red-400 font-bold">[2026-09-28 10:15:05]</span> [ERROR] Fatal exception during execution: Timeout exceeded connecting to external API.</p>
                    <p className="text-red-300 pl-4">at ServiceRequest.execute (node_modules/api/req.js:42)</p>
                    <p className="text-red-300 pl-4">at JobHandler.process (src/jobs/handler.js:108)</p>
                    <p><span className="text-yellow-400">[2026-09-28 10:15:06]</span> [WARN] Job marked as failed. Enqueueing for retry (Attempt 2/3).</p>
                  </>
                ) : job.status === 'Completed' ? (
                  <>
                    <p><span className="text-emerald-400">[2026-09-28 10:16:45]</span> [INFO] Processing batch 1/1...</p>
                    <p><span className="text-emerald-400">[2026-09-28 10:16:47]</span> [INFO] Action completed successfully.</p>
                    <p><span className="text-emerald-500 font-bold">[2026-09-28 10:16:48]</span> [SUCCESS] Job finished with exit code 0.</p>
                  </>
                ) : (
                  <>
                    <p><span className="text-blue-400">[2026-09-28 10:15:05]</span> [DEBUG] Process running, awaiting response...</p>
                    <div className="flex gap-1 items-center mt-2 text-gray-500">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-white dark:bg-[#0F172A] animate-in zoom-in-95 duration-500">
              <div className={`p-4 rounded-full ${meta.bg} dark:bg-opacity-10 mb-4`}>
                {React.cloneElement(meta.icon, { size: 40, className: meta.color })}
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{activeTab}</h4>
              <p className="text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
                Detailed information for <span className={`font-bold ${meta.color}`}>{activeTab}</span> is available while the job is active or within 24 hours of completion.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
