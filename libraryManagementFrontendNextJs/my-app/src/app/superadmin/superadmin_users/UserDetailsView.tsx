"use client";
import React, { useState } from 'react';
import { 
  Users, Activity, ShieldAlert, Settings, Key, ArrowLeft, Terminal, 
  UserCircle, Clock, Globe, Shield, MoreVertical, Power, PauseCircle, 
  UserX, RefreshCw, LogOut, Edit, MapPin, Building2, Store
} from 'lucide-react';

const DRILLDOWN_TABS = [
  "Overview", "User Sessions", "Login History", "User Activity"
];

const getTabMeta = (tab: string) => {
  switch(tab) {
    case "User Sessions": return { icon: <Globe size={24} />, color: "text-blue-600", bg: "bg-blue-100" };
    case "Login History": return { icon: <Clock size={24} />, color: "text-amber-600", bg: "bg-amber-100" };
    case "User Activity": return { icon: <Activity size={24} />, color: "text-emerald-600", bg: "bg-emerald-100" };
    default: return { icon: <UserCircle size={24} />, color: "text-teal-600", bg: "bg-teal-100" };
  }
};

export default function UserDetailsView({ onBack, role = 'Manager' }: { onBack: () => void, role?: string }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showOpsMenu, setShowOpsMenu] = useState(false);

  const meta = getTabMeta(activeTab);

  const operations = [
    { label: "Edit User Profile", icon: <Edit size={14} />, color: "text-gray-700 hover:bg-gray-50" },
    { label: "Activate User", icon: <Power size={14} />, color: "text-emerald-600 hover:bg-emerald-50" },
    { label: "Suspend User", icon: <PauseCircle size={14} />, color: "text-yellow-600 hover:bg-yellow-50" },
    { label: "Deactivate User", icon: <UserX size={14} />, color: "text-red-600 hover:bg-red-50" },
    { label: "Reset Password", icon: <Key size={14} />, color: "text-amber-600 hover:bg-amber-50" },
    { label: "Force Logout", icon: <LogOut size={14} />, color: "text-orange-600 hover:bg-orange-50" },
    { label: "Revoke All Sessions", icon: <ShieldAlert size={14} />, color: "text-rose-600 hover:bg-rose-50" },
    { label: "Change Role", icon: <Shield size={14} />, color: "text-purple-600 hover:bg-purple-50" },
    { label: "Change Assigned Library", icon: <Building2 size={14} />, color: "text-blue-600 hover:bg-blue-50" },
    { label: "Change Assigned Branch", icon: <Store size={14} />, color: "text-indigo-600 hover:bg-indigo-50" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in zoom-in-95 duration-300">
      {/* Header & User Operations */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-6">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
          <div className="flex-1">
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-teal-600 mb-4 transition-colors">
              <ArrowLeft size={14} /> Back to All Users
            </button>
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/40 dark:to-emerald-900/40 flex items-center justify-center text-teal-600 dark:text-teal-400 font-extrabold text-3xl shadow-inner border border-white/50 dark:border-white/5">
                  AK
                </div>
                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0F172A]" title="Online Now"></div>
              </div>
              
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3 mb-1">
                  Amit Kumar 
                  <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 text-[11px] uppercase tracking-wider border border-teal-200 dark:border-teal-800 shadow-sm flex items-center gap-1.5">
                    <Shield size={12} /> {role}
                  </span>
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                  <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300"><Key size={14} className="text-teal-500" /> user_ak992</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5"><Globe size={14} /> amit.kumar@library.com</span>
                  <span className="hidden sm:inline">•</span>
                  {role === 'SuperAdmin' ? (
                    <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-md"><Shield size={14} /> Scope: Global Platform</span>
                  ) : role === 'Admin' ? (
                    <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md"><Building2 size={14} /> Scope: StudyNest Patna</span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-md"><Store size={14} /> Scope: Kankarbagh Branch</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User Operations Control Panel */}
          <div className="relative">
            <button 
              onClick={() => setShowOpsMenu(!showOpsMenu)}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all hover:border-gray-400"
            >
              User Actions <MoreVertical size={16} className="text-gray-400" />
            </button>

            {showOpsMenu && (
              <div className="absolute right-0 top-14 w-64 bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl z-50 py-2 animate-in slide-in-from-top-2 duration-200">
                <div className="px-3 pb-2 mb-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">SuperAdmin Controls</p>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {operations.map((op, idx) => (
                    <button key={idx} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors ${op.color} dark:hover:bg-gray-800 text-left`}>
                      {op.icon} {op.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drilldown Navigation */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden flex flex-col h-full">
        <div className="flex overflow-x-auto custom-scrollbar border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-[#0D1F3C]/30">
          {DRILLDOWN_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-4 text-sm font-bold transition-all border-b-2 outline-none ${
                activeTab === tab 
                  ? 'border-teal-600 text-teal-600 bg-teal-50/50 dark:bg-teal-900/20' 
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
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Viewing detailed {activeTab.toLowerCase()} data for Amit Kumar.</p>
            </div>
          </div>
          
          <div className="flex-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-[#0F172A]/50 animate-in zoom-in-95 duration-500">
            <div className={`p-4 rounded-full ${meta.bg} dark:bg-opacity-10 mb-4`}>
              {React.cloneElement(meta.icon, { size: 40, className: meta.color })}
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No {activeTab} Records Found</h4>
            <p className="text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
              This space is strictly isolated to display the <span className={`font-bold ${meta.color}`}>{activeTab}</span> for this specific user. Administrative actions can be performed via the "User Actions" menu.
            </p>
            <button className={`mt-6 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-500/20 transition-all hover:-translate-y-0.5`}>
              Refresh {activeTab}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
