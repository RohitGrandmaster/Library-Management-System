"use client";
import React, { useState } from 'react';
import { 
  Building2, Users, BookOpen, Activity, ShieldAlert, Database, CreditCard, 
  Settings, Key, Clock, FileText, ArrowLeft, Terminal, Shield, 
  BarChart2, HardDrive, Bell, RefreshCw, User
} from 'lucide-react';

const DRILLDOWN_TABS = [
  "Overview", "Branches", "Admins", "Managers", "Books", "Members", "Circulation", 
  "Inventory", "Reservations", "Fines", "Subscription", "Usage", "Storage", 
  "Database", "Integrations", "Notifications", "Security", "Audit", "Backup", "Settings"
];

// Helper to map tab to an icon and color
const getTabMeta = (tab: string) => {
  switch(tab) {
    case "Branches": return { icon: <Building2 size={24} />, color: "text-indigo-600", bg: "bg-indigo-100" };
    case "Admins":
    case "Managers":
    case "Members": return { icon: <Users size={24} />, color: "text-blue-600", bg: "bg-blue-100" };
    case "Books": 
    case "Inventory": return { icon: <BookOpen size={24} />, color: "text-amber-600", bg: "bg-amber-100" };
    case "Circulation":
    case "Usage": return { icon: <Activity size={24} />, color: "text-emerald-600", bg: "bg-emerald-100" };
    case "Fines":
    case "Subscription": return { icon: <CreditCard size={24} />, color: "text-fuchsia-600", bg: "bg-fuchsia-100" };
    case "Storage":
    case "Database":
    case "Backup": return { icon: <Database size={24} />, color: "text-cyan-600", bg: "bg-cyan-100" };
    case "Security":
    case "Audit": return { icon: <ShieldAlert size={24} />, color: "text-red-600", bg: "bg-red-100" };
    case "Settings": return { icon: <Settings size={24} />, color: "text-gray-600", bg: "bg-gray-100" };
    default: return { icon: <BarChart2 size={24} />, color: "text-blue-600", bg: "bg-blue-100" };
  }
};

export default function LibraryDetailsView({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [supportMode, setSupportMode] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSupportToggle = () => {
    if (!supportMode) {
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        setSupportMode(true);
      }, 800);
    } else {
      setSupportMode(false);
    }
  };

  const meta = getTabMeta(activeTab);

  return (
    <div className="flex flex-col gap-6 w-full h-full flex-1 animate-in fade-in zoom-in-95 duration-300">
      {/* Header & Support Access */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-6">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
          <div className="flex-1">
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-600 mb-4 transition-colors">
              <ArrowLeft size={14} /> Back to Organizations
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-extrabold text-2xl shadow-inner border border-white/50 dark:border-white/5">
                SN
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3 mb-1">
                  StudyNest Patna 
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[11px] uppercase tracking-wider border border-emerald-200 dark:border-emerald-800 shadow-sm">
                    Active
                  </span>
                </h2>
                <div className="flex items-center gap-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5"><Key size={14} /> SN-001</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5"><CreditCard size={14} /> Enterprise Annual</span>
                </div>
              </div>
            </div>
          </div>

          {/* Support Access Control Panel */}
          <div className={`p-5 rounded-2xl border ${supportMode ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0D1F3C] shadow-inner'} w-full xl:max-w-[420px] transition-all duration-300`}>
            <h3 className="text-xs font-extrabold uppercase tracking-widest mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Terminal size={16} className={supportMode ? "text-red-600 animate-pulse" : "text-gray-400"} /> 
              SuperAdmin Support Access
            </h3>
            
            {supportMode ? (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 text-xs font-bold bg-red-100 dark:bg-red-900/40 p-2.5 rounded-xl border border-red-200 dark:border-red-800">
                  <Shield size={16} className="animate-pulse" /> ACTIVE SUPPORT SESSION (Logged)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                    <Users size={14} /> View as Admin
                  </button>
                  <button className="p-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                    <User size={14} /> View as Manager
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 pt-4 border-t border-red-200 dark:border-red-900/50 gap-3">
                  <div className="flex items-center gap-2 text-xs text-red-600/70 dark:text-red-400/70 font-semibold">
                    <Clock size={14} /> Duration: <span className="text-red-700 dark:text-red-400 font-bold">12:45</span>
                  </div>
                  <button onClick={handleSupportToggle} className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-red-700 bg-red-200 hover:bg-red-300 dark:bg-red-900/60 dark:hover:bg-red-900 dark:text-red-300 rounded-lg transition-colors">
                    End Session
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <input type="text" placeholder="Mandatory Support Reason..." className="w-full p-2.5 text-sm font-medium bg-white dark:bg-[#1E293B] border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all shadow-sm" />
                </div>
                <button onClick={handleSupportToggle} disabled={isConnecting} className="w-full p-3 text-sm font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 hover:border-gray-400 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 dark:hover:bg-[#0F172A] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70">
                  {isConnecting ? <RefreshCw size={16} className="animate-spin text-red-500" /> : <Terminal size={16} />}
                  {isConnecting ? 'Connecting...' : 'Enter Support Mode'}
                </button>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center font-semibold">* All impersonation actions are heavily audited & monitored.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 20 Tabs Navigation */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden flex flex-col h-full">
        <div className="flex overflow-x-auto border-b [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-[#0D1F3C]/30">
          {DRILLDOWN_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-5 py-4 text-sm font-bold transition-all border-b-2 outline-none ${
                activeTab === tab 
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-900/20' 
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Dynamic Tab Content Area */}
        <div className="p-8 min-h-[500px] flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 rounded-2xl ${meta.bg} dark:bg-opacity-20 flex items-center justify-center ${meta.color} shadow-sm`}>
              {meta.icon}
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{activeTab}</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Managing {activeTab.toLowerCase()} specifically for StudyNest Patna.</p>
            </div>
          </div>
          
          <div className="flex-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-[#0F172A]/50 animate-in zoom-in-95 duration-500">
            <div className={`p-4 rounded-full ${meta.bg} dark:bg-opacity-10 mb-4`}>
              {React.cloneElement(meta.icon, { size: 40, className: meta.color })}
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No {activeTab} Configuration Found</h4>
            <p className="text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
              This space is dedicated to the isolated <span className={`font-bold ${meta.color}`}>{activeTab}</span> analytics and settings for StudyNest Patna. Use the tools above to configure or import data.
            </p>
            <button className={`mt-6 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5`}>
              Configure {activeTab}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
