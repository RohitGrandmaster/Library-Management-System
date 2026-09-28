"use client";
import React, { useState } from 'react';
import { 
  CreditCard, Activity, ArrowLeft, Terminal, Shield, MoreVertical, 
  Power, PauseCircle, RefreshCw, Edit, ShieldAlert, CheckCircle, 
  ArrowUpCircle, ArrowDownCircle, Banknote, CalendarClock, Ban, Receipt
} from 'lucide-react';

const DRILLDOWN_TABS = [
  "Overview", "Usage & Limits", "Invoices", "Payments", "Refunds", 
  "Coupons / Discounts", "Subscription History"
];

const getTabMeta = (tab: string) => {
  switch(tab) {
    case "Usage & Limits": return { icon: <Activity size={24} />, color: "text-purple-600", bg: "bg-purple-100" };
    case "Invoices":
    case "Payments": return { icon: <Banknote size={24} />, color: "text-emerald-600", bg: "bg-emerald-100" };
    case "Refunds": return { icon: <Receipt size={24} />, color: "text-orange-600", bg: "bg-orange-100" };
    case "Coupons / Discounts": return { icon: <CheckCircle size={24} />, color: "text-teal-600", bg: "bg-teal-100" };
    case "Subscription History": return { icon: <CalendarClock size={24} />, color: "text-amber-600", bg: "bg-amber-100" };
    default: return { icon: <CreditCard size={24} />, color: "text-pink-600", bg: "bg-pink-100" };
  }
};

export default function SubscriptionDetailsView({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showOpsMenu, setShowOpsMenu] = useState(false);

  const meta = getTabMeta(activeTab);

  const operations = [
    { label: "Assign Plan", icon: <Edit size={14} />, color: "text-blue-600 hover:bg-blue-50" },
    { label: "Upgrade Plan", icon: <ArrowUpCircle size={14} />, color: "text-emerald-600 hover:bg-emerald-50" },
    { label: "Downgrade Plan", icon: <ArrowDownCircle size={14} />, color: "text-orange-600 hover:bg-orange-50" },
    { label: "Renew Subscription", icon: <RefreshCw size={14} />, color: "text-teal-600 hover:bg-teal-50" },
    { label: "Extend Trial", icon: <CalendarClock size={14} />, color: "text-purple-600 hover:bg-purple-50" },
    { label: "Suspend Subscription", icon: <PauseCircle size={14} />, color: "text-yellow-600 hover:bg-yellow-50" },
    { label: "Resume Subscription", icon: <Power size={14} />, color: "text-emerald-600 hover:bg-emerald-50" },
    { label: "Cancel Subscription", icon: <Ban size={14} />, color: "text-red-600 hover:bg-red-50" },
    { label: "Issue Refund", icon: <Banknote size={14} />, color: "text-rose-600 hover:bg-rose-50" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full h-full flex-1 animate-in fade-in zoom-in-95 duration-300">
      {/* Header & Subscription Operations */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-6">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
          <div className="flex-1">
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-pink-600 mb-4 transition-colors">
              <ArrowLeft size={14} /> Back to All Plans & Subscriptions
            </button>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/40 flex items-center justify-center text-pink-600 dark:text-pink-400 font-extrabold text-2xl shadow-inner border border-white/50 dark:border-white/5">
                PRO
              </div>
              
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3 mb-1">
                  Pro Monthly Plan 
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[11px] uppercase tracking-wider border border-emerald-200 dark:border-emerald-800 shadow-sm flex items-center gap-1.5">
                    Active
                  </span>
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                  <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-bold">$199.00 / mo</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5"><Activity size={14} /> 5 Libraries limit</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5">Currently assigned to 12 organizations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operations Control Panel */}
          <div className="relative">
            <button 
              onClick={() => setShowOpsMenu(!showOpsMenu)}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all hover:border-gray-400"
            >
              Subscription Actions <MoreVertical size={16} className="text-gray-400" />
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
                  ? 'border-pink-600 text-pink-600 bg-pink-50/50 dark:bg-pink-900/20' 
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
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Viewing detailed {activeTab.toLowerCase()} data for the Pro Monthly Plan.</p>
            </div>
          </div>
          
          <div className="flex-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-[#0F172A]/50 animate-in zoom-in-95 duration-500">
            <div className={`p-4 rounded-full ${meta.bg} dark:bg-opacity-10 mb-4`}>
              {React.cloneElement(meta.icon, { size: 40, className: meta.color })}
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No {activeTab} Records Found</h4>
            <p className="text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
              This space isolatedly displays the <span className={`font-bold ${meta.color}`}>{activeTab}</span> for this specific plan. Lifecycle actions can be performed via the "Subscription Actions" menu.
            </p>
            <button className={`mt-6 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-500/20 transition-all hover:-translate-y-0.5`}>
              Manage {activeTab}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
