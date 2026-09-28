"use client";
import React, { useState } from 'react';
import {
  Building2, Users, BookOpen, Activity, ShieldAlert, Database, CreditCard,
  Settings, Key, ArrowLeft, BarChart2, HardDrive, Bell, Power,
  PauseCircle, Archive, UserCog, Edit, CheckCircle2, Save
} from 'lucide-react';

type Branch = {
  id: string;
  name: string;
  code: string;
  parent: string;
  location: string;
  manager: string;
  status: string;
  capacity: number;
  occupied: number;
};

const DRILLDOWN_TABS = [
  'Overview', 'Users', 'Books', 'Members', 'Circulation', 'Inventory',
  'Reservations', 'Fines', 'Reports', 'Audit', 'Settings'
];

const getTabMeta = (tab: string) => {
  switch (tab) {
    case 'Users':
    case 'Members': return { icon: <Users size={24} />, color: 'text-blue-600', bg: 'bg-blue-100' };
    case 'Books':
    case 'Inventory': return { icon: <BookOpen size={24} />, color: 'text-amber-600', bg: 'bg-amber-100' };
    case 'Circulation':
    case 'Reservations': return { icon: <Activity size={24} />, color: 'text-emerald-600', bg: 'bg-emerald-100' };
    case 'Fines': return { icon: <CreditCard size={24} />, color: 'text-fuchsia-600', bg: 'bg-fuchsia-100' };
    case 'Reports': return { icon: <BarChart2 size={24} />, color: 'text-cyan-600', bg: 'bg-cyan-100' };
    case 'Audit': return { icon: <ShieldAlert size={24} />, color: 'text-red-600', bg: 'bg-red-100' };
    case 'Settings': return { icon: <Settings size={24} />, color: 'text-gray-600', bg: 'bg-gray-100' };
    default: return { icon: <Building2 size={24} />, color: 'text-indigo-600', bg: 'bg-indigo-100' };
  }
};

export default function BranchDetailsView({
  branch,
  onBack,
  onStatusChange,
}: {
  branch: Branch;
  onBack: () => void;
  onStatusChange: (status: string) => void;
}) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showOpsMenu, setShowOpsMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [manager, setManager] = useState(branch.manager);
  const [capacity, setCapacity] = useState(String(branch.capacity));
  const [workingHours, setWorkingHours] = useState('09:00 AM - 08:00 PM');
  const [autoRenew, setAutoRenew] = useState(true);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const doStatus = (status: string) => {
    onStatusChange(status);
    notify(`Branch marked ${status}.`);
    setShowOpsMenu(false);
  };

  const changeManager = () => {
    const next = window.prompt('Enter branch manager name', manager);
    if (next && next.trim()) {
      setManager(next.trim());
      notify('Branch manager updated.');
      setShowOpsMenu(false);
    }
  };

  const changeLimits = () => {
    const next = window.prompt('Enter maximum seat/capacity', capacity);
    if (next && Number(next) > 0) {
      setCapacity(String(Number(next)));
      notify('Branch capacity updated.');
      setShowOpsMenu(false);
    }
  };

  const meta = getTabMeta(activeTab);
  const pct = Math.round((branch.occupied / Math.max(1, Number(capacity))) * 100);

  const renderTabContent = () => {
    if (activeTab === 'Overview') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            ['Staff Users', '18', <Users size={20} />],
            ['Books', '5,420', <BookOpen size={20} />],
            ['Members', '1,840', <Users size={20} />],
            ['Open Loans', '326', <Activity size={20} />],
          ].map(([label, value, icon]) => (
            <div key={label as string} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E293B] p-5">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0F172A] flex items-center justify-center text-indigo-600 shadow-sm">{icon}</div>
              <p className="text-xs font-bold text-gray-500 mt-4">{label as string}</p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{value as string}</p>
            </div>
          ))}
          <div className="sm:col-span-2 xl:col-span-4 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div><p className="font-extrabold text-gray-900 dark:text-white">Capacity Utilization</p><p className="text-xs text-gray-500 mt-1">{branch.occupied} / {capacity} occupied</p></div>
              <span className="text-lg font-extrabold text-indigo-600">{Math.min(100, pct)}%</span>
            </div>
            <div className="mt-4 h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className={`h-full ${pct > 90 ? 'bg-red-500' : 'bg-indigo-600'}`} style={{ width: `${Math.min(100, pct)}%` }} /></div>
          </div>
        </div>
      );
    }

    if (activeTab === 'Settings') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border p-5 space-y-4"><h4 className="font-extrabold">Operational Settings</h4><label className="block text-sm font-bold">Working Hours<input value={workingHours} onChange={e=>setWorkingHours(e.target.value)} className="mt-2 w-full px-3 py-2.5 rounded-xl border bg-gray-50 dark:bg-[#1E293B]" /></label><label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#1E293B]"><span>Auto-renew eligible loans</span><input type="checkbox" checked={autoRenew} onChange={e=>setAutoRenew(e.target.checked)} className="h-5 w-5 accent-indigo-600" /></label><button onClick={()=>notify('Branch settings saved.')} className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold flex items-center gap-2"><Save size={16}/> Save Settings</button></div>
          <div className="rounded-2xl border p-5"><h4 className="font-extrabold">Limits</h4><label className="block text-sm font-bold mt-4">Maximum Capacity<input value={capacity} onChange={e=>setCapacity(e.target.value)} className="mt-2 w-full px-3 py-2.5 rounded-xl border bg-gray-50 dark:bg-[#1E293B]" /></label><button onClick={changeLimits} className="mt-4 px-4 py-2.5 rounded-xl border font-bold flex items-center gap-2"><Edit size={15}/> Update Capacity</button></div>
        </div>
      );
    }

    const datasets: Record<string, Array<[string,string,string]>> = {
      Users: [['U-1001','Amit Kumar','Librarian'],['U-1002','Neha Singh','Assistant'],['U-1003','Sanjay Verma','Operator']],
      Books: [['BK-1022','Clean Code','Available'],['BK-2201','Atomic Habits','Issued'],['BK-3018','The Alchemist','Reserved']],
      Members: [['MB-1001','Rahul Singh','Active'],['MB-1002','Pooja Kumari','Active'],['MB-1003','Ankit Raj','Blocked']],
      Circulation: [['LN-9911','Rahul Singh','Due 29 Sep'],['LN-9912','Pooja Kumari','Due 30 Sep'],['LN-9913','Amit Kumar','Overdue']],
      Inventory: [['INV-01','Books','5,420'],['INV-02','Magazines','460'],['INV-03','Digital Assets','1,280']],
      Reservations: [['RS-8821','Atomic Habits','Queued'],['RS-8822','The Psychology of Money','Ready'],['RS-8823','Ikigai','Expired']],
      Fines: [['FN-2211','Rahul Singh','₹120'],['FN-2212','Pooja Kumari','₹80'],['FN-2213','Ankit Raj','₹350']],
      Reports: [['RPT-01','Daily Circulation','Ready'],['RPT-02','Inventory Summary','Ready'],['RPT-03','Fine Collection','Generated']],
      Audit: [['AUD-01','Manager updated','Super Admin'],['AUD-02','Loan issued','Librarian'],['AUD-03','Settings changed','Super Admin']],
    };
    const rows = datasets[activeTab] || [];
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border p-4"><p className="text-xs text-gray-500">Records</p><p className="text-2xl font-extrabold mt-1">{rows.length * 100}</p></div>
          <div className="rounded-2xl border p-4"><p className="text-xs text-gray-500">Today</p><p className="text-2xl font-extrabold mt-1">{rows.length * 7}</p></div>
          <div className="rounded-2xl border p-4"><p className="text-xs text-gray-500">Exceptions</p><p className="text-2xl font-extrabold mt-1">{activeTab === 'Audit' ? 2 : 1}</p></div>
        </div>
        <div className="rounded-2xl border overflow-hidden">
          <div className="p-4 border-b bg-gray-50 dark:bg-[#1E293B] flex items-center justify-between"><h4 className="font-extrabold">{activeTab} Records</h4><button onClick={()=>notify(`${activeTab} refresh completed.`)} className="text-xs font-bold text-indigo-600">Refresh</button></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm"><thead><tr className="text-left text-xs uppercase text-gray-500 border-b"><th className="p-4">ID</th><th className="p-4">Name / Action</th><th className="p-4">Status / Actor</th></tr></thead><tbody>{rows.map(row=><tr key={row[0]} className="border-b last:border-0"><td className="p-4 font-mono text-xs">{row[0]}</td><td className="p-4 font-bold">{row[1]}</td><td className="p-4">{row[2]}</td></tr>)}</tbody></table></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={()=>notify(`Create ${activeTab} action opened.`)} className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm">Add {activeTab}</button>
          <button onClick={()=>notify(`${activeTab} report prepared.`)} className="px-4 py-2.5 rounded-xl border font-bold text-sm">Export Report</button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full min-w-0 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-5 sm:p-6">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-indigo-600 mb-4"><ArrowLeft size={14}/> Back to Branches</button>
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-2xl shrink-0">{branch.name.slice(0,2).toUpperCase()}</div>
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex flex-wrap items-center gap-3 mb-1">{branch.name}<span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] uppercase tracking-wider">{branch.status}</span></h2>
                <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-500 dark:text-gray-400"><span className="flex items-center gap-1.5"><Key size={14}/>{branch.code}</span><span>•</span><span className="flex items-center gap-1.5"><Building2 size={14}/>{branch.parent}</span></div>
              </div>
            </div>
          </div>
          <div className="relative shrink-0">
            <button onClick={()=>setShowOpsMenu(x=>!x)} className="w-full xl:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200">Branch Operations</button>
            {showOpsMenu && <div className="absolute right-0 top-12 w-[min(92vw,280px)] bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 py-2">
              <button onClick={()=>doStatus('Active')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-emerald-600 hover:bg-emerald-50"><Power size={15}/>Activate Branch</button>
              <button onClick={()=>doStatus('Suspended')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-yellow-600 hover:bg-yellow-50"><PauseCircle size={15}/>Suspend Branch</button>
              <button onClick={()=>doStatus('Archived')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50"><Archive size={15}/>Archive Branch</button>
              <button onClick={()=>{notify('Ownership transfer flow opened.');setShowOpsMenu(false)}} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50"><UserCog size={15}/>Transfer Ownership</button>
              <button onClick={changeManager} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50"><Users size={15}/>Change Manager</button>
              <button onClick={changeLimits} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-fuchsia-600 hover:bg-fuchsia-50"><Edit size={15}/>Change Limits</button>
            </div>}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden flex flex-col min-h-[560px]">
        <div className="flex overflow-x-auto border-b [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-[#0D1F3C]/30">
          {DRILLDOWN_TABS.map(tab=><button key={tab} onClick={()=>setActiveTab(tab)} className={`shrink-0 whitespace-nowrap px-5 py-4 text-sm font-bold transition-all border-b-2 ${activeTab===tab?'border-indigo-600 text-indigo-600 bg-indigo-50/50':'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}>{tab}</button>)}
        </div>
        <div className="p-5 sm:p-8 min-w-0">
          <div className="flex items-center gap-4 mb-8"><div className={`w-12 h-12 rounded-2xl ${meta.bg} flex items-center justify-center ${meta.color} shrink-0`}>{meta.icon}</div><div className="min-w-0"><h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">{activeTab} Management</h3><p className="text-sm text-gray-500">Managing {activeTab.toLowerCase()} for {branch.name}.</p></div></div>
          {renderTabContent()}
        </div>
      </div>

      {toast && <div className="fixed bottom-5 right-5 z-[100] rounded-xl bg-gray-900 text-white px-4 py-3 text-sm font-bold shadow-2xl flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400"/>{toast}</div>}
    </div>
  );
}
