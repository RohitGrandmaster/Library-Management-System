"use client";
import React, { useState } from 'react';
import { 
  Users, Activity, ShieldAlert, Settings, Key, ArrowLeft, Terminal, 
  UserCircle, Clock, Globe, Shield, MoreVertical, Power, PauseCircle, 
  UserX, RefreshCw, LogOut, Edit, MapPin, Building2, Store, CheckCircle2
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

export default function UserDetailsView({ user, onBack, role = 'Manager' }: { user: any, onBack: () => void, role?: string }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showOpsMenu, setShowOpsMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2500);
  };

  const meta = getTabMeta(activeTab);

  const operations = [
    { label: "Edit User Profile", icon: <Edit size={14} />, color: "text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800", action: () => notify('Edit profile opened.') },
    { label: "Activate User", icon: <Power size={14} />, color: "text-emerald-600 hover:bg-emerald-50", action: () => notify('User activated successfully.') },
    { label: "Suspend User", icon: <PauseCircle size={14} />, color: "text-yellow-600 hover:bg-yellow-50", action: () => notify('User suspended.') },
    { label: "Deactivate User", icon: <UserX size={14} />, color: "text-red-600 hover:bg-red-50", action: () => notify('User deactivated.') },
    { label: "Reset Password", icon: <Key size={14} />, color: "text-amber-600 hover:bg-amber-50", action: () => notify('Password reset link sent.') },
    { label: "Force Logout", icon: <LogOut size={14} />, color: "text-orange-600 hover:bg-orange-50", action: () => notify('User forcibly logged out.') },
    { label: "Revoke All Sessions", icon: <ShieldAlert size={14} />, color: "text-rose-600 hover:bg-rose-50", action: () => notify('All sessions revoked.') },
  ];

  const renderTabContent = () => {
    if (activeTab === "Overview") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 animate-in fade-in zoom-in-95 duration-300">
          {[
            ['Active Sessions', '2', <Globe size={20} />],
            ['Total Logins', '142', <Clock size={20} />],
            ['Actions Taken', '891', <Activity size={20} />],
            ['Security Alerts', '0', <ShieldAlert size={20} />],
          ].map(([label, value, icon]) => (
            <div key={label as string} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E293B] p-5 shadow-sm">
              <div className={`w-10 h-10 rounded-xl bg-white dark:bg-[#0F172A] flex items-center justify-center ${meta.color} shadow-sm`}>{icon}</div>
              <p className="text-xs font-bold text-gray-500 mt-4">{label as string}</p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{value as string}</p>
            </div>
          ))}
          <div className="sm:col-span-2 xl:col-span-4 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mt-2 bg-gray-50 dark:bg-[#1E293B]">
            <h4 className="font-extrabold text-gray-900 dark:text-white mb-4">Account Permissions & Access</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border shadow-sm">
                <p className="text-xs font-bold text-gray-500 mb-1">System Role</p>
                <p className="font-bold flex items-center gap-2">{user.role}</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border shadow-sm">
                <p className="text-xs font-bold text-gray-500 mb-1">Assigned Scope</p>
                <p className="font-bold">{user.scope}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "User Sessions") {
      const sessions = [
        { os: 'Windows 11', browser: 'Chrome 118', ip: '192.168.1.45', location: 'Patna, India', time: 'Active Now' },
        { os: 'iOS 17', browser: 'Safari Mobile', ip: '117.220.10.5', location: 'Patna, India', time: '2 hours ago' },
      ];
      return (
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl border overflow-hidden animate-in fade-in duration-300">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-gray-500 border-b bg-gray-50 dark:bg-[#1E293B]">
                <th className="p-4">Device & Browser</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Location</th>
                <th className="p-4">Last Active</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="p-4 font-bold">{s.os} • {s.browser}</td>
                  <td className="p-4 font-mono text-xs">{s.ip}</td>
                  <td className="p-4">{s.location}</td>
                  <td className="p-4"><span className={`px-2 py-1 rounded-md text-xs font-bold ${s.time === 'Active Now' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{s.time}</span></td>
                  <td className="p-4"><button onClick={() => notify('Session revoked')} className="text-xs font-bold text-red-600 hover:underline">Revoke</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === "Login History") {
      const logins = [
        { time: 'Today, 09:15 AM', status: 'Success', ip: '192.168.1.45' },
        { time: 'Yesterday, 06:30 PM', status: 'Success', ip: '117.220.10.5' },
        { time: 'Yesterday, 09:00 AM', status: 'Failed', ip: '45.112.33.10' },
        { time: '3 Days Ago, 10:10 AM', status: 'Success', ip: '192.168.1.45' },
      ];
      return (
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl border overflow-hidden animate-in fade-in duration-300">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-gray-500 border-b bg-gray-50 dark:bg-[#1E293B]">
                <th className="p-4">Timestamp</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {logins.map((l, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="p-4 font-bold">{l.time}</td>
                  <td className="p-4 font-mono text-xs">{l.ip}</td>
                  <td className="p-4"><span className={`px-2 py-1 rounded-md text-xs font-bold ${l.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{l.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === "User Activity") {
      const activities = [
        { action: 'Updated Branch Settings', target: 'Kankarbagh Branch', time: '1 hour ago' },
        { action: 'Generated Monthly Report', target: 'System', time: '3 hours ago' },
        { action: 'Waived Late Fine', target: 'Rahul Singh (MB-1001)', time: 'Yesterday' },
        { action: 'Added New Books (50)', target: 'Inventory', time: '2 Days Ago' },
      ];
      return (
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl border overflow-hidden animate-in fade-in duration-300">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-gray-500 border-b bg-gray-50 dark:bg-[#1E293B]">
                <th className="p-4">Action Performed</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Time</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="p-4 font-bold text-gray-900 dark:text-white">{a.action}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{a.target}</td>
                  <td className="p-4 text-gray-500 text-xs font-bold">{a.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full min-w-0 animate-in fade-in zoom-in-95 duration-300">
      {/* Header & User Operations */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-6">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 min-w-0">
          <div className="flex-1 min-w-0">
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-teal-600 mb-4 transition-colors">
              <ArrowLeft size={14} /> Back to All Users
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/40 dark:to-emerald-900/40 flex items-center justify-center text-teal-600 dark:text-teal-400 font-extrabold text-3xl shadow-inner border border-white/50 dark:border-white/5">
                  {user.name.substring(0,2).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0F172A]" title="Online Now"></div>
              </div>
              
              <div className="min-w-0">
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex flex-wrap items-center gap-3 mb-1 min-w-0">
                  <span className="truncate">{user.name}</span>
                  <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 text-[11px] uppercase tracking-wider border border-teal-200 dark:border-teal-800 shadow-sm flex items-center gap-1.5 shrink-0">
                    <Shield size={12} /> {user.role}
                  </span>
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                  <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300"><Key size={14} className="text-teal-500" /> {user.email.split('@')[0]}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 truncate"><Globe size={14} /> {user.email}</span>
                  <span>•</span>
                  {user.role === 'SuperAdmin' ? (
                    <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-md truncate"><Shield size={14} /> Scope: {user.scope}</span>
                  ) : user.role === 'Admin' ? (
                    <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md truncate"><Building2 size={14} /> Scope: {user.scope}</span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-md truncate"><Store size={14} /> Scope: {user.scope}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User Operations Control Panel */}
          <div className="relative shrink-0">
            <button 
              onClick={() => setShowOpsMenu(!showOpsMenu)}
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all hover:border-gray-400 w-full xl:w-auto"
            >
              User Actions <MoreVertical size={16} className="text-gray-400" />
            </button>

            {showOpsMenu && (
              <div className="absolute right-0 top-14 w-full sm:w-64 bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl z-50 py-2 animate-in slide-in-from-top-2 duration-200">
                <div className="px-3 pb-2 mb-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">SuperAdmin Controls</p>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {operations.map((op, idx) => (
                    <button key={idx} onClick={() => { op.action(); setShowOpsMenu(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors ${op.color} dark:hover:bg-gray-800 text-left`}>
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
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden flex flex-col min-h-[560px]">
        <div className="flex overflow-x-auto border-b [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-[#0D1F3C]/30 shrink-0">
          {DRILLDOWN_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-4 text-sm font-bold transition-all border-b-2 outline-none shrink-0 ${
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
        <div className="p-5 sm:p-8 flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 rounded-2xl ${meta.bg} dark:bg-opacity-20 flex items-center justify-center ${meta.color} shadow-sm shrink-0`}>
              {meta.icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white truncate">{activeTab}</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Viewing detailed {activeTab.toLowerCase()} data for {user.name}.</p>
            </div>
          </div>
          
          {renderTabContent()}
        </div>
      </div>
      
      {toast && (
        <div className="fixed bottom-5 right-5 z-[100] rounded-xl bg-gray-900 text-white px-4 py-3 text-sm font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 size={16} className="text-emerald-400" /> {toast}
        </div>
      )}
    </div>
  );
}
