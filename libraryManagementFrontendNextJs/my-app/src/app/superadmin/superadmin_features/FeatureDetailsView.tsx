"use client";
import React, { useState } from 'react';
import { 
  Wand2, ArrowLeft, MoreVertical, Power, PauseCircle, CheckCircle, 
  Building2, Store, CreditCard, TestTube, Zap, Settings2, Globe
} from 'lucide-react';

const DRILLDOWN_TABS = [
  "Overview", "Library-wise Scope", "Branch-wise Scope", "Plan-wise Scope", "Audit & Logs"
];

const getTabMeta = (tab: string) => {
  switch(tab) {
    case "Library-wise Scope": return { icon: <Building2 size={24} />, color: "text-blue-600", bg: "bg-blue-100" };
    case "Branch-wise Scope": return { icon: <Store size={24} />, color: "text-indigo-600", bg: "bg-indigo-100" };
    case "Plan-wise Scope": return { icon: <CreditCard size={24} />, color: "text-pink-600", bg: "bg-pink-100" };
    case "Audit & Logs": return { icon: <Settings2 size={24} />, color: "text-gray-600", bg: "bg-gray-100" };
    default: return { icon: <Globe size={24} />, color: "text-violet-600", bg: "bg-violet-100" };
  }
};

export default function FeatureDetailsView({ feature, onBack }: { feature: any, onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showOpsMenu, setShowOpsMenu] = useState(false);

  const meta = getTabMeta(activeTab);

  const operations = [
    { label: "Enable Feature Globally", icon: <Power size={14} />, color: "text-emerald-600 hover:bg-emerald-50" },
    { label: "Disable Feature Globally", icon: <Power size={14} className="rotate-180" />, color: "text-red-600 hover:bg-red-50" },
    { label: "Enable for Selected Libraries", icon: <Building2 size={14} />, color: "text-blue-600 hover:bg-blue-50" },
    { label: "Enable for Specific Plan", icon: <CreditCard size={14} />, color: "text-pink-600 hover:bg-pink-50" },
    { label: "Temporary Disable", icon: <PauseCircle size={14} />, color: "text-yellow-600 hover:bg-yellow-50" },
    { label: "Release as Beta", icon: <TestTube size={14} />, color: "text-violet-600 hover:bg-violet-50" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in zoom-in-95 duration-300">
      {/* Header & Feature Operations */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-6">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
          <div className="flex-1">
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-violet-600 mb-4 transition-colors">
              <ArrowLeft size={14} /> Back to Feature Catalog
            </button>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 font-extrabold text-2xl shadow-inner border border-white/50 dark:border-white/5">
                <Wand2 size={32} />
              </div>
              
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3 mb-1">
                  {feature.name}
                  <span className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wider border shadow-sm flex items-center gap-1.5 
                    ${feature.status === 'Enabled' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : ''}
                    ${feature.status === 'Beta' ? 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800' : ''}
                    ${feature.status === 'Disabled' ? 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' : ''}
                  `}>
                    {feature.status === 'Beta' && <TestTube size={12} />}
                    {feature.status === 'Enabled' && <CheckCircle size={12} />}
                    {feature.status}
                  </span>
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                  <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-bold"><Zap size={14} className="text-amber-500" /> Module Category: Core</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5">Currently accessed by {feature.usage} tenants</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operations Control Panel */}
          <div className="relative">
            <button 
              onClick={() => setShowOpsMenu(!showOpsMenu)}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all hover:border-gray-400 focus:ring-4 focus:ring-violet-500/10"
            >
              Feature Controls <MoreVertical size={16} className="text-gray-400" />
            </button>

            {showOpsMenu && (
              <div className="absolute right-0 top-14 w-64 bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl z-50 py-2 animate-in slide-in-from-top-2 duration-200">
                <div className="px-3 pb-2 mb-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">SuperAdmin Actions</p>
                </div>
                <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
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
        <div className="flex overflow-x-auto border-b [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-[#0D1F3C]/30">
          {DRILLDOWN_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-4 text-sm font-bold transition-all border-b-2 outline-none ${
                activeTab === tab 
                  ? 'border-violet-600 text-violet-600 bg-violet-50/50 dark:bg-violet-900/20' 
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
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Managing {activeTab.toLowerCase()} specifically for the {feature.name} feature.</p>
            </div>
          </div>
          
          <div className="flex-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-[#0F172A]/50 animate-in zoom-in-95 duration-500">
            <div className={`p-4 rounded-full ${meta.bg} dark:bg-opacity-10 mb-4`}>
              {React.cloneElement(meta.icon, { size: 40, className: meta.color })}
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Active {activeTab} Constraints</h4>
            <p className="text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
              This space handles the granular <span className={`font-bold ${meta.color}`}>{activeTab}</span> for {feature.name}. Use the "Feature Controls" menu to toggle access globally or target specific segments.
            </p>
            <button className={`mt-6 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/20 transition-all hover:-translate-y-0.5`}>
              Configure {activeTab}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
