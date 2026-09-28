"use client";
import React, { useState } from 'react';
import { 
  Building2, Users, BookOpen, Activity, ShieldAlert, Database, CreditCard, 
  Settings, Key, FileText, ArrowLeft, BarChart2, HardDrive, Bell, Power, 
  PauseCircle, Archive, UserCog, Edit, MoreVertical
} from 'lucide-react';

const DRILLDOWN_TABS = [
  "Overview", "Users", "Books", "Members", "Circulation", "Inventory", 
  "Reservations", "Fines", "Reports", "Audit", "Settings"
];

const getTabMeta = (tab: string) => {
  switch(tab) {
    case "Users":
    case "Members": return { icon: <Users size={24} />, color: "text-blue-600", bg: "bg-blue-100" };
    case "Books": 
    case "Inventory": return { icon: <BookOpen size={24} />, color: "text-amber-600", bg: "bg-amber-100" };
    case "Circulation": return { icon: <Activity size={24} />, color: "text-emerald-600", bg: "bg-emerald-100" };
    case "Fines": return { icon: <CreditCard size={24} />, color: "text-fuchsia-600", bg: "bg-fuchsia-100" };
    case "Reports": return { icon: <BarChart2 size={24} />, color: "text-cyan-600", bg: "bg-cyan-100" };
    case "Audit": return { icon: <ShieldAlert size={24} />, color: "text-red-600", bg: "bg-red-100" };
    case "Settings": return { icon: <Settings size={24} />, color: "text-gray-600", bg: "bg-gray-100" };
    default: return { icon: <Building2 size={24} />, color: "text-indigo-600", bg: "bg-indigo-100" };
  }
};

export default function BranchDetailsView({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showOpsMenu, setShowOpsMenu] = useState(false);

  const meta = getTabMeta(activeTab);

  const operations = [
    { label: "Activate Branch", icon: <Power size={14} />, color: "text-emerald-600 hover:bg-emerald-50" },
    { label: "Suspend Branch", icon: <PauseCircle size={14} />, color: "text-yellow-600 hover:bg-yellow-50" },
    { label: "Archive Branch", icon: <Archive size={14} />, color: "text-red-600 hover:bg-red-50" },
    { label: "Transfer Ownership", icon: <UserCog size={14} />, color: "text-blue-600 hover:bg-blue-50" },
    { label: "Change Manager", icon: <Users size={14} />, color: "text-indigo-600 hover:bg-indigo-50" },
    { label: "Change Limits", icon: <Edit size={14} />, color: "text-fuchsia-600 hover:bg-fuchsia-50" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in zoom-in-95 duration-300">
      {/* Header & Branch Operations */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-6">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
          <div className="flex-1">
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-indigo-600 mb-4 transition-colors">
              <ArrowLeft size={14} /> Back to All Branches
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-2xl shadow-inner border border-white/50 dark:border-white/5">
                KB
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3 mb-1">
                  Kankarbagh Branch 
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[11px] uppercase tracking-wider border border-emerald-200 dark:border-emerald-800 shadow-sm">
                    Active
                  </span>
                </h2>
                <div className="flex items-center gap-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5"><Key size={14} /> SN-KKB</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5"><Building2 size={14} /> Parent: StudyNest Patna</span>
                </div>
              </div>
            </div>
          </div>

          {/* Branch Operations Control Panel */}
          <div className="relative">
            <button 
              onClick={() => setShowOpsMenu(!showOpsMenu)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all hover:border-gray-400"
            >
              Branch Operations <MoreVertical size={16} className="text-gray-400" />
            </button>

            {showOpsMenu && (
              <div className="absolute right-0 top-12 w-56 bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl z-50 py-2 animate-in slide-in-from-top-2 duration-200">
                <div className="px-3 pb-2 mb-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">SuperAdmin Actions</p>
                </div>
                {operations.map((op, idx) => (
                  <button key={idx} className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-bold transition-colors ${op.color} dark:hover:bg-gray-800 text-left`}>
                    {op.icon} {op.label}
                  </button>
                ))}
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
              className={`whitespace-nowrap px-5 py-4 text-sm font-bold transition-all border-b-2 outline-none ${
                activeTab === tab 
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' 
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
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{activeTab} Management</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monitoring & configuring {activeTab.toLowerCase()} specifically for Kankarbagh Branch.</p>
            </div>
          </div>
          
          <div className="flex-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-[#0F172A]/50 animate-in zoom-in-95 duration-500">
            <div className={`p-4 rounded-full ${meta.bg} dark:bg-opacity-10 mb-4`}>
              {React.cloneElement(meta.icon, { size: 40, className: meta.color })}
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No {activeTab} Records Found for this Branch</h4>
            <p className="text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
              This space handles the isolated <span className={`font-bold ${meta.color}`}>{activeTab}</span> data for the Kankarbagh Branch. Utilize the "Branch Operations" menu for administrative actions.
            </p>
            <button className={`mt-6 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5`}>
              Configure Branch {activeTab}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
