'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import { 
  Shield, ShieldAlert, KeyRound, Smartphone, Monitor, Globe, 
  Activity, AlertTriangle, XOctagon, Lock, EyeOff, Save, CheckCircle, Search, Filter, Ban
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  "Security Dashboard", "Authentication", "Password Policy", "Two-Factor Authentication", 
  "Session Management", "Active Sessions", "Failed Login Attempts", "Blocked Accounts", 
  "IP Restrictions", "Device Management", "Suspicious Activity", "Security Policies", "Security Events"
];

const mockSuspiciousActivity = [
  { id: 1, type: 'Multiple-country/IP change', user: 'admin@readersden.org', desc: 'Login attempt from IP 182.xx (Russia) after recent login from IP 45.xx (India).', time: '10 mins ago', risk: 'High' },
  { id: 2, type: 'Repeated failed logins', user: 'manager@studynest.in', desc: '5 failed login attempts using incorrect password within 2 minutes.', time: '45 mins ago', risk: 'Medium' },
  { id: 3, type: 'Suspicious support access', user: 'superadmin_rohit', desc: 'SuperAdmin bypassed tenant lock to access Lib_0912 without logged ticket.', time: '2 hours ago', risk: 'High' },
  { id: 4, type: 'Privilege changes', user: 'system_auth', desc: 'Role "Library Manager" permissions unexpectedly escalated to include "Delete Data".', time: '5 hours ago', risk: 'Critical' },
  { id: 5, type: 'Excessive API calls', user: 'api_key_88ax', desc: '400 requests/sec observed on Search endpoint, rate limit triggered.', time: '1 day ago', risk: 'Medium' },
  { id: 6, type: 'Unusual access', user: 'staff@librohub.com', desc: 'Accessing platform at 03:45 AM local time, outside normal working hours.', time: '2 days ago', risk: 'Low' },
];

const mockDevices = [
  { id: 'dev_1', user: 'Rohit Sharma (SuperAdmin)', device: 'MacBook Pro M3', os: 'macOS Sonoma', browser: 'Chrome 122', ip: '45.112.x.x (Mumbai, IN)', lastActive: 'Active Now' },
  { id: 'dev_2', user: 'Priya Singh (Admin)', device: 'iPhone 15 Pro', os: 'iOS 17.4', browser: 'Safari', ip: '114.22.x.x (Delhi, IN)', lastActive: '12 mins ago' },
  { id: 'dev_3', user: 'Alex (Support)', device: 'ThinkPad X1', os: 'Windows 11', browser: 'Edge 119', ip: 'Unknown (VPN)', lastActive: '5 hours ago' },
  { id: 'dev_4', user: 'Neha (Manager)', device: 'Samsung S24', os: 'Android 14', browser: 'Chrome Mobile', ip: '192.168.x.x (Local)', lastActive: '2 days ago' },
];

export default function SecurityCenterPage() {
  const [activeMenu, setActiveMenu] = useState("Security Dashboard");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const gridRef = useRef<AgGridReact>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1200);
  };

  const deviceColDefs = useMemo<any[]>(() => [
    {
      headerName: 'Device & User', field: 'device', flex: 2, minWidth: 260,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-3 h-full">
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 font-extrabold text-sm shadow-sm">
            {p.data?.os.includes('iOS') || p.data?.os.includes('Android') ? <Smartphone size={18} /> : <Monitor size={18} />}
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-bold text-gray-900 dark:text-white leading-tight">{p.data?.device}</p>
            <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">{p.data?.user}</p>
          </div>
        </div>
      ),
    },
    { 
      headerName: 'Environment', field: 'os', flex: 1.5, minWidth: 180,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex flex-col justify-center h-full">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{p.data?.os}</p>
          <p className="text-xs font-medium text-gray-500">{p.data?.browser}</p>
        </div>
      )
    },
    { 
      headerName: 'Network (IP)', field: 'ip', flex: 1.5, minWidth: 200,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-1.5 h-full text-sm font-bold text-slate-600 dark:text-slate-400">
          <Globe size={14} className="text-gray-400" /> {p.data?.ip}
        </div>
      )
    },
    { 
      headerName: 'Last Activity', field: 'lastActive', flex: 1, minWidth: 140,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center h-full">
          {p.data?.lastActive === 'Active Now' ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> {p.data.lastActive}
            </span>
          ) : (
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{p.data?.lastActive}</span>
          )}
        </div>
      )
    },
    { 
      headerName: 'Action', field: 'action', flex: 1, minWidth: 120,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center justify-center h-full">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 dark:border-red-900/30 hover:bg-red-50 hover:text-red-600 text-gray-600 dark:bg-[#1E293B] dark:text-gray-300 rounded-lg text-xs font-bold transition-all shadow-sm">
            <Ban size={12} /> Revoke
          </button>
        </div>
      )
    }
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  const renderContent = () => {
    switch (activeMenu) {
      case "Suspicious Activity":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-red-50/50 dark:bg-red-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Activity size={24} /> Automated Threat Detection Log
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Review AI-flagged behavioral anomalies and security breaches.</p>
              </div>
              <button className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-500/20 hover:-translate-y-0.5 transition-all">
                Export Audit Log
              </button>
            </div>
            <div className="p-0">
              {mockSuspiciousActivity.map((activity, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-4 p-5 md:items-center justify-between border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1E293B] transition-colors">
                  <div className="flex gap-4">
                    <div className="pt-1">
                      {activity.risk === 'Critical' && <XOctagon size={20} className="text-red-600" />}
                      {activity.risk === 'High' && <AlertTriangle size={20} className="text-orange-500" />}
                      {activity.risk === 'Medium' && <ShieldAlert size={20} className="text-yellow-500" />}
                      {activity.risk === 'Low' && <Shield size={20} className="text-blue-500" />}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                        {activity.type}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                          ${activity.risk === 'Critical' ? 'bg-red-100 text-red-700' : 
                            activity.risk === 'High' ? 'bg-orange-100 text-orange-700' : 
                            activity.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}
                        `}>
                          {activity.risk} Risk
                        </span>
                      </h4>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{activity.desc}</p>
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                        <span className="flex items-center gap-1"><Monitor size={12} /> {activity.user}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg hover:bg-gray-50 hover:text-red-600 transition-colors shadow-sm">
                      Investigate
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg hover:bg-gray-50 hover:text-emerald-600 transition-colors shadow-sm">
                      Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "Device Management":
      case "Active Sessions":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-[#0D1F3C]">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Monitor size={20} className="text-red-600" /> Device & Session Management
                </h3>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Monitor and revoke active sessions across all platforms.</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search user, IP or device..." 
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all shadow-sm"
                    onChange={e => gridRef.current?.api.setGridOption('quickFilterText', e.target.value)}
                  />
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all hover:border-gray-400">
                  <Filter size={14} className="text-gray-500" /> Filters
                </button>
              </div>
            </div>
            
            <div className="h-[500px] w-full">
              <AgGridReact
                ref={gridRef}
                theme={gridTheme}
                rowData={mockDevices}
                columnDefs={deviceColDefs}
                rowHeight={70}
                headerHeight={52}
                onGridReady={onGridReady}
              />
            </div>
          </div>
        );

      case "Security Dashboard":
      case "Authentication":
      default:
        return (
          <form onSubmit={handleSave} className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col xl:flex-row">
            {/* Form Left Side */}
            <div className="flex-1 p-8">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
                <KeyRound className="text-red-600" size={24} /> Authentication Policies
              </h2>

              <div className="space-y-6">
                <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Platform Global Login Policy</label>
                  <select className="w-full p-3 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all shadow-sm">
                    <option>Standard (Email + Password)</option>
                    <option>Strict (Password + Force 2FA on Admins)</option>
                    <option>Zero Trust (Force 2FA on All Users)</option>
                    <option>SSO Only (SAML/OAuth)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Account Lockout Threshold</label>
                    <select className="w-full p-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold outline-none focus:border-red-500 shadow-sm">
                      <option>3 Failed Attempts</option>
                      <option defaultValue="5 Failed Attempts">5 Failed Attempts</option>
                      <option>10 Failed Attempts</option>
                    </select>
                  </div>
                  <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Lockout Duration</label>
                    <select className="w-full p-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold outline-none focus:border-red-500 shadow-sm">
                      <option>15 Minutes</option>
                      <option>30 Minutes</option>
                      <option>1 Hour</option>
                      <option>Until Admin Unlock</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Idle Session Timeout</label>
                    <select className="w-full p-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold outline-none focus:border-red-500 shadow-sm">
                      <option>15 Minutes</option>
                      <option>30 Minutes</option>
                      <option>1 Hour</option>
                      <option>24 Hours</option>
                    </select>
                  </div>
                  <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <label className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                      <span>Allow "Remember Device"</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-red-600 rounded" />
                    </label>
                    <select className="w-full p-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold outline-none focus:border-red-500 shadow-sm">
                      <option>Max 7 Days</option>
                      <option>Max 30 Days</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* Form Right Side */}
            <div className="xl:w-1/3 bg-gray-50/50 dark:bg-[#0D1F3C] border-l border-gray-100 dark:border-gray-800 p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Lock className="text-red-600" size={18} /> Global 2FA Requirement
                </h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  Enforcing 2FA globally will immediately sign out all users who have not configured a second factor. They will be prompted to setup Authenticator on next login.
                </p>
                <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-xl flex items-start gap-3 mb-6">
                  <AlertTriangle size={18} className="text-red-600 dark:text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-red-800 dark:text-red-500">SuperAdmin Exclusion</p>
                    <p className="text-xs text-red-700 dark:text-red-600/80 mt-1 font-medium">To prevent platform lockout, at least one SuperAdmin must have 2FA enabled before enforcing globally.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-3">
                {saved && (
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5 animate-in slide-in-from-bottom-2">
                    <CheckCircle size={16} /> Security Policies Applied
                  </span>
                )}
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSaving ? "Saving Config..." : <><Save size={18} /> Update Security Policies</>}
                </button>
              </div>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Page Header */}
      <div>
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-red-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Security Center</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl shadow-sm border border-red-200/50 dark:border-red-800/50">
                <ShieldAlert size={28} className="text-red-600 dark:text-red-400" />
              </div>
              Global Security Center
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Enforce authentication policies, monitor suspicious automated activities, and manage active tenant sessions.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800 rounded-lg text-sm font-bold shadow-sm">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Security Defcon: Normal
          </div>
        </div>
      </div>

      {/* Sub-menu Tabs */}
      <div className="flex overflow-x-auto custom-scrollbar gap-2 pb-2">
        {SUB_MENUS.map(menu => (
          <button
            key={menu}
            onClick={() => setActiveMenu(menu)}
            className={`px-5 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all shadow-sm ${
              activeMenu === menu 
                ? 'bg-red-600 text-white shadow-red-600/20 scale-105' 
                : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-red-50 dark:hover:bg-[#1E293B] hover:text-red-600 hover:border-red-200'
            }`}
          >
            {menu}
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
      <div className="w-full mt-2">
        {renderContent()}
      </div>
    </div>
  );
}
