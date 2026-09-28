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
                    <button key={idx} onClick={() => { notify(op.label + ' action triggered.'); setShowOpsMenu(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors ${op.color} dark:hover:bg-gray-800 text-left`}>
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
        
  const notify = (msg: string) => {
    window.alert(msg);
  };

  const renderTabContent = () => {
    if (activeTab === "Overview") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 animate-in fade-in duration-300">
          {[
            ['Active Tenants', '12', <Activity size={20} />],
            ['Total Revenue', '$23,880', <Banknote size={20} />],
            ['Pending Renewals', '3', <CalendarClock size={20} />],
            ['Coupons Used', '45', <CheckCircle size={20} />],
          ].map(([label, value, icon]) => (
            <div key={label as string} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E293B] p-5">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0F172A] flex items-center justify-center text-pink-600 shadow-sm">{icon}</div>
              <p className="text-xs font-bold text-gray-500 mt-4">{label as string}</p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{value as string}</p>
            </div>
          ))}
          <div className="sm:col-span-2 xl:col-span-4 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mt-2 bg-gray-50 dark:bg-[#1E293B]">
            <h4 className="font-extrabold text-gray-900 dark:text-white mb-4">Plan Limits Configuration</h4>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#0F172A] border shadow-sm">
              <div>
                <p className="font-bold text-pink-600 flex items-center gap-2"><CreditCard size={16}/> Pro Monthly Plan Base</p>
                <p className="text-xs font-bold text-gray-500 mt-1">Includes 5 Libraries, 100GB Storage, Priority Support</p>
              </div>
              <button onClick={() => notify('Opening plan settings...')} className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-bold">Edit Limits</button>
            </div>
          </div>
        </div>
      );
    }

    const datasets: Record<string, Array<string[]>> = {
      "Usage & Limits": [['LIB-1','Storage','85%','Warning'],['LIB-2','Members','45%','Normal'],['LIB-3','API Calls','99%','Critical']],
      "Invoices": [['INV-2024-01','StudyNest Patna','$199.00','Paid'],['INV-2024-02','Readers Den Delhi','$199.00','Paid'],['INV-2024-03','LibroHub Mumbai','$199.00','Pending']],
      "Payments": [['PAY-991','Stripe','Success','INV-2024-01'],['PAY-992','PayPal','Success','INV-2024-02'],['PAY-993','Bank Transfer','Processing','INV-2024-03']],
      "Refunds": [['REF-001','BookHaven BLR','$49.00','Processed'],['REF-002','Knowledge Lounge','$199.00','Pending']],
      "Coupons / Discounts": [['WELCOME50','50% OFF First Month','Active','12 Uses'],['YEARLY20','20% OFF Annual','Active','5 Uses'],['BLACKFRIDAY','30% OFF','Expired','89 Uses']],
      "Subscription History": [['LOG-1','Plan Created','System','Jan 2024'],['LOG-2','Price Updated','Admin','Feb 2024'],['LOG-3','Features Added','Admin','Mar 2024']],
    };

    const rows = datasets[activeTab] || [];
    
    return (
      <div className="space-y-5 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E293B] p-4"><p className="text-xs text-gray-500">Total Records</p><p className="text-2xl font-extrabold mt-1">{rows.length}</p></div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E293B] p-4"><p className="text-xs text-gray-500">Recent Updates</p><p className="text-2xl font-extrabold mt-1">{Math.max(1, rows.length - 1)}</p></div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E293B] p-4"><p className="text-xs text-gray-500">Status</p><p className="text-2xl font-extrabold mt-1 text-emerald-500">Healthy</p></div>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-[#0F172A]">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E293B] flex items-center justify-between"><h4 className="font-extrabold">{activeTab} Details</h4><button onClick={()=>notify(`${activeTab} refresh requested.`)} className="text-xs font-bold text-pink-600">Refresh Data</button></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead><tr className="text-left text-xs uppercase text-gray-500 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E293B]"><th className="p-4">Ref ID</th><th className="p-4">Detail</th><th className="p-4">Value / Type</th><th className="p-4">Status</th></tr></thead>
              <tbody>
                {rows.length > 0 ? rows.map(row=><tr key={row[0]} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"><td className="p-4 font-mono text-xs text-gray-500">{row[0]}</td><td className="p-4 font-bold text-gray-900 dark:text-gray-100">{row[1]}</td><td className="p-4 text-gray-600 dark:text-gray-400">{row[2] || '-'}</td><td className="p-4"><span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-bold">{row[3] || 'N/A'}</span></td></tr>) : <tr><td colSpan={4} className="p-8 text-center text-gray-500 font-bold">No {activeTab} Records Found for Pro Monthly Plan.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={()=>notify(`Create ${activeTab} action opened.`)} className="px-4 py-2.5 rounded-xl bg-pink-600 text-white font-bold text-sm shadow-sm hover:bg-pink-700 transition-colors">Add New {activeTab}</button>
          <button onClick={()=>notify(`${activeTab} report downloading...`)} className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Export CSV</button>
        </div>
      </div>
    );
  };
      </div>
    </div>
  );
}

