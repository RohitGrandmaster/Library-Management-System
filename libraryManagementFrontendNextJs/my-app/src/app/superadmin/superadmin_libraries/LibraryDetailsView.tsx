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

  const notify = (msg: string) => {
    alert(msg); // Placeholder, wait, I will use a proper toast below
  };

  const renderTabContent = () => {
    if (activeTab === "Overview") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 animate-in fade-in duration-300">
          {[
            ['Total Branches', '3', <Building2 size={20} />],
            ['Registered Users', '1,542', <Users size={20} />],
            ['Books Catalog', '12,400', <BookOpen size={20} />],
            ['Storage Used', '42 GB', <HardDrive size={20} />],
          ].map(([label, value, icon]) => (
            <div key={label as string} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E293B] p-5">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0F172A] flex items-center justify-center text-blue-600 shadow-sm">{icon}</div>
              <p className="text-xs font-bold text-gray-500 mt-4">{label as string}</p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{value as string}</p>
            </div>
          ))}
          <div className="sm:col-span-2 xl:col-span-4 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mt-2 bg-gray-50 dark:bg-[#1E293B]">
            <h4 className="font-extrabold text-gray-900 dark:text-white mb-4">Subscription Plan</h4>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#0F172A] border shadow-sm">
              <div>
                <p className="font-bold text-blue-600 flex items-center gap-2"><CreditCard size={16}/> Enterprise Annual</p>
                <p className="text-xs font-bold text-gray-500 mt-1">Renews on 15 Jan 2025</p>
              </div>
              <button onClick={() => window.alert('Redirecting to billing...')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">Manage Billing</button>
            </div>
          </div>
        </div>
      );
    }

    const datasets: Record<string, Array<string[]>> = {
      Branches: [['BR-01','Kankarbagh','Active','Amit Kumar'],['BR-02','Boring Road','Active','Neha Singh'],['BR-03','Patliputra','Pending','Unassigned']],
      Admins: [['AD-01','Rahul Sharma','Active'],['AD-02','Priya Desai','Active']],
      Managers: [['MG-01','Amit Kumar','Kankarbagh'],['MG-02','Neha Singh','Boring Road']],
      Books: [['BK-001','Clean Code','Tech','12'],['BK-002','Atomic Habits','Self Help','45'],['BK-003','The Alchemist','Fiction','30']],
      Members: [['MB-01','Ravi Kumar','Active'],['MB-02','Sita Devi','Active'],['MB-03','Ramesh Singh','Expired']],
      Circulation: [['CR-01','BK-001','MB-01','Due 29 Sep'],['CR-02','BK-002','MB-02','Overdue']],
      Inventory: [['INV-1','Books','12,400'],['INV-2','Magazines','1,200'],['INV-3','Journals','450']],
      Reservations: [['RS-01','BK-003','MB-03','Queued'],['RS-02','BK-001','MB-02','Ready']],
      Fines: [['FN-01','MB-02','₹150','Unpaid'],['FN-02','MB-03','₹50','Paid']],
      Subscription: [['SUB-01','Enterprise Annual','Active','Jan 2024'],['SUB-02','Pro Annual','Expired','Jan 2023']],
      Usage: [['USG-1','API Calls','45,000/100,000'],['USG-2','Emails Sent','12,000/50,000']],
      Storage: [['STG-1','Database','12 GB'],['STG-2','Assets','30 GB']],
      Database: [['DB-01','Main Replica','Healthy'],['DB-02','Backup Node','Syncing']],
      Integrations: [['INT-1','Payment Gateway','Stripe','Active'],['INT-2','SMS Gateway','Twilio','Active']],
      Notifications: [['NOT-1','System Update','Read'],['NOT-2','Backup Failed','Unread']],
      Security: [['SEC-1','2FA Enabled','Yes'],['SEC-2','IP Whitelist','No']],
      Audit: [['AUD-1','Admin Login','Success'],['AUD-2','Branch Created','Success']],
      Backup: [['BCK-1','Daily Snapshot','Completed'],['BCK-2','Weekly Full','Completed']],
      Settings: [['SET-1','Theme','Dark'],['SET-2','Timezone','IST']],
    };

    const rows = datasets[activeTab] || [];
    
    return (
      <div className="space-y-5 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E293B] p-4"><p className="text-xs text-gray-500">Total Records</p><p className="text-2xl font-extrabold mt-1">{rows.length}</p></div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E293B] p-4"><p className="text-xs text-gray-500">Recent Updates</p><p className="text-2xl font-extrabold mt-1">{Math.max(1, rows.length - 1)}</p></div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E293B] p-4"><p className="text-xs text-gray-500">System Status</p><p className="text-2xl font-extrabold mt-1 text-emerald-500">Healthy</p></div>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-[#0F172A]">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E293B] flex items-center justify-between"><h4 className="font-extrabold">{activeTab} Directory</h4><button onClick={()=>window.alert(`${activeTab} refresh requested.`)} className="text-xs font-bold text-blue-600">Refresh Data</button></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead><tr className="text-left text-xs uppercase text-gray-500 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E293B]"><th className="p-4">ID</th><th className="p-4">Primary Detail</th><th className="p-4">Secondary Detail</th><th className="p-4">Status / Ext</th></tr></thead>
              <tbody>
                {rows.length > 0 ? rows.map(row=><tr key={row[0]} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"><td className="p-4 font-mono text-xs text-gray-500">{row[0]}</td><td className="p-4 font-bold text-gray-900 dark:text-gray-100">{row[1]}</td><td className="p-4 text-gray-600 dark:text-gray-400">{row[2] || '-'}</td><td className="p-4"><span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-bold">{row[3] || 'N/A'}</span></td></tr>) : <tr><td colSpan={4} className="p-8 text-center text-gray-500 font-bold">No {activeTab} Records Found for StudyNest Patna.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={()=>window.alert(`Create ${activeTab} action opened.`)} className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-sm hover:bg-blue-700 transition-colors">Add New {activeTab}</button>
          <button onClick={()=>window.alert(`${activeTab} report downloading...`)} className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Export CSV</button>
        </div>
      </div>
    );
  };

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
          
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
