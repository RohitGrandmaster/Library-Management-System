'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import { 
  Shield, ShieldAlert, KeyRound, Smartphone, Monitor, Globe, 
  Activity, AlertTriangle, XOctagon, Lock, EyeOff, Save, CheckCircle, Search, Filter, Ban,
  UserCheck, ShieldCheck, Fingerprint
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  { id: "Security Dashboard", icon: Shield, color: "blue", tabClass: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400", iconClass: "text-blue-600 dark:text-blue-400" },
  { id: "Access & Authentication", icon: KeyRound, color: "indigo", tabClass: "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800/50 dark:text-indigo-400", iconClass: "text-indigo-600 dark:text-indigo-400" },
  { id: "Active Sessions", icon: Smartphone, color: "emerald", tabClass: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400", iconClass: "text-emerald-600 dark:text-emerald-400" },
  { id: "Suspicious Activity", icon: ShieldAlert, color: "rose", tabClass: "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-400", iconClass: "text-rose-600 dark:text-rose-400" },
  { id: "Global Policies", icon: Lock, color: "amber", tabClass: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400", iconClass: "text-amber-600 dark:text-amber-400" }
];

const mockSuspiciousActivity = [
  { id: 'SA-01', type: 'Multiple-country/IP change', user: 'admin@readersden.org', desc: 'Login attempt from IP 182.xx (Russia) after recent login from IP 45.xx (India).', time: '10 mins ago', risk: 'High' },
  { id: 'SA-02', type: 'Repeated failed logins', user: 'manager@studynest.in', desc: '5 failed login attempts using incorrect password within 2 minutes.', time: '45 mins ago', risk: 'Medium' },
  { id: 'SA-03', type: 'Suspicious support access', user: 'superadmin_rohit', desc: 'SuperAdmin bypassed tenant lock to access Lib_0912 without logged ticket.', time: '2 hours ago', risk: 'High' },
  { id: 'SA-04', type: 'Privilege changes', user: 'system_auth', desc: 'Role "Library Manager" permissions unexpectedly escalated to include "Delete Data".', time: '5 hours ago', risk: 'Critical' },
  { id: 'SA-05', type: 'Excessive API calls', user: 'api_key_88ax', desc: '400 requests/sec observed on Search endpoint, rate limit triggered.', time: '1 day ago', risk: 'Medium' },
  { id: 'SA-06', type: 'Unusual access', user: 'staff@librohub.com', desc: 'Accessing platform at 03:45 AM local time, outside normal working hours.', time: '2 days ago', risk: 'Low' },
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
  const [revokedDevices, setRevokedDevices] = useState<string[]>([]);
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
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 font-extrabold text-sm shadow-sm border border-gray-200 dark:border-gray-700">
            {p.data?.os.includes('iOS') || p.data?.os.includes('Android') ? <Smartphone size={18} /> : <Monitor size={18} />}
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-extrabold text-gray-900 dark:text-white leading-tight">{p.data?.device}</p>
            <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{p.data?.user}</p>
          </div>
        </div>
      ),
    },
    { 
      headerName: 'Environment', field: 'os', flex: 1.5, minWidth: 180,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex flex-col justify-center h-full">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{p.data?.os}</p>
          <p className="text-xs font-bold text-gray-500">{p.data?.browser}</p>
        </div>
      )
    },
    { 
      headerName: 'Network (IP)', field: 'ip', flex: 1.5, minWidth: 200,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-2 h-full text-sm font-mono font-bold text-slate-600 dark:text-slate-400">
          <Globe size={14} className="text-gray-400" /> {p.data?.ip}
        </div>
      )
    },
    { 
      headerName: 'Last Activity', field: 'lastActive', flex: 1, minWidth: 140,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center h-full">
          {p.data?.lastActive === 'Active Now' ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-extrabold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping absolute"></span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full relative"></span> {p.data.lastActive}
            </span>
          ) : (
            <span className="text-[11px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{p.data?.lastActive}</span>
          )}
        </div>
      )
    },
    { 
      headerName: 'Action', field: 'id', flex: 1, minWidth: 140, sortable: false, filter: false,
      cellRenderer: (p: ICellRendererParams) => {
        const isRevoked = revokedDevices.includes(p.value);
        return (
          <div className="flex items-center h-full">
            <button 
              onClick={() => !isRevoked && setRevokedDevices(prev => [...prev, p.value])}
              disabled={isRevoked}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm
                ${isRevoked 
                  ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 border border-gray-200 dark:border-gray-700 cursor-not-allowed' 
                  : 'bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 dark:bg-[#1E293B] dark:border-gray-700 dark:text-rose-400 dark:hover:border-rose-800 dark:hover:bg-rose-900/20'
                }`}
            >
              {isRevoked ? <Ban size={14} /> : <XOctagon size={14} />} 
              {isRevoked ? 'Revoked' : 'Revoke'}
            </button>
          </div>
        );
      }
    }
  ], [revokedDevices]);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  const renderContent = () => {
    switch (activeMenu) {
      case "Global Policies":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-amber-50/50 dark:bg-amber-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <Lock size={24} /> Platform Security Policies
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Configure global platform lockdown and compliance restrictions.</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-8">
                
                {/* Data Privacy */}
                <div className="bg-gray-50 dark:bg-[#1E293B] p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <EyeOff size={16} className="text-amber-500" /> Data Masking & Privacy
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-white dark:bg-[#0F172A] rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer shadow-sm hover:border-amber-300 transition-colors">
                      <div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white block">Mask PII Data Globally</span>
                        <span className="text-xs font-medium text-gray-500 mt-0.5 block">Obscure emails, phones, and names from lower-level staff.</span>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-amber-600 rounded-md border-gray-300" />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-white dark:bg-[#0F172A] rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer shadow-sm hover:border-amber-300 transition-colors">
                      <div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white block">Disable Data Exporting</span>
                        <span className="text-xs font-medium text-gray-500 mt-0.5 block">Prevent all non-admin users from downloading CSV/PDF reports.</span>
                      </div>
                      <input type="checkbox" className="w-5 h-5 text-amber-600 rounded-md border-gray-300" />
                    </label>
                  </div>
                </div>

                {/* Geo Restriction */}
                <div className="bg-gray-50 dark:bg-[#1E293B] p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Globe size={16} className="text-amber-500" /> Geo-Fencing Restrictions
                  </h3>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Allowed Administrative Countries</label>
                  <select multiple className="w-full p-4 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold outline-none focus:border-amber-500 h-32 shadow-inner">
                    <option value="IN" selected>India (IN)</option>
                    <option value="US" selected>United States (US)</option>
                    <option value="UK">United Kingdom (UK)</option>
                    <option value="AE">United Arab Emirates (AE)</option>
                  </select>
                  <p className="text-xs font-bold text-gray-500 mt-2">Hold CMD/CTRL to select multiple. Admin logins from other countries will be blocked.</p>
                </div>
              </div>

              <div className="lg:w-1/3 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 p-6 rounded-2xl flex flex-col shadow-sm">
                <div className="flex-1">
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2"><ShieldCheck size={18} className="text-emerald-500"/> Policy Compliance</h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">Applying these rules immediately affects all active users across the platform.</p>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                      <CheckCircle size={14} className="text-emerald-500" /> ISO 27001 Compliant
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                      <CheckCircle size={14} className="text-emerald-500" /> GDPR Data Masking Active
                    </div>
                  </div>
                </div>
                <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                  <button type="submit" disabled={isSaving} className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2">
                    {isSaving ? <Activity size={18} className="animate-spin" /> : <Save size={18} />}
                    {isSaving ? 'Enforcing Policies...' : 'Save & Enforce Policies'}
                  </button>
                  {saved && <p className="text-emerald-600 text-xs font-bold mt-4 text-center flex items-center justify-center gap-1.5"><CheckCircle size={14} /> Security Policies Updated</p>}
                </div>
              </div>
            </form>
          </div>
        );

      case "Suspicious Activity":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col min-h-[600px]">
             <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-rose-50/50 dark:bg-rose-900/10 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-extrabold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                  <ShieldAlert size={24} /> Threat Intelligence Feed
                </h3>
                <p className="text-sm font-medium text-gray-500 mt-1">AI-detected anomalies and potential security breaches.</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
              {mockSuspiciousActivity.map(activity => (
                <div key={activity.id} className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-5 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                  <div className={`p-4 rounded-xl flex items-center justify-center shrink-0 border ${
                    activity.risk === 'Critical' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:border-red-800/50' : 
                    activity.risk === 'High' ? 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800/50' : 
                    activity.risk === 'Medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800/50' : 
                    'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800/50'
                  }`}>
                    <AlertTriangle size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                      <h4 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">{activity.type}</h4>
                      <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">{activity.time}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{activity.desc}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"><UserCheck size={14} className="text-indigo-500"/> {activity.user}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-row sm:flex-col justify-end gap-2 shrink-0">
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-[#0F172A] dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-colors">Dismiss</button>
                    <button className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 dark:bg-rose-900/20 dark:border-rose-800/40 dark:text-rose-400 rounded-xl text-xs font-bold transition-colors">Investigate</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "Access & Authentication":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 p-8 flex flex-col items-center justify-center min-h-[500px]">
             <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6 shadow-sm border border-indigo-200 dark:border-indigo-800">
               <Fingerprint size={40} />
             </div>
             <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Authentication Security</h2>
             <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 text-center font-medium">Configure global Password Policies, 2FA enforcements, and SSO (SAML/OIDC) settings.</p>
             <div className="w-full max-w-2xl bg-gray-50 dark:bg-[#1E293B] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-8 text-center">
               <KeyRound size={32} className="text-gray-400 mx-auto mb-4" />
               <p className="text-gray-500 font-bold">Identity & Access Management UI</p>
             </div>
          </div>
        )

      case "Active Sessions":
      case "Security Dashboard":
      default:
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col min-h-[600px]">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-emerald-50/50 dark:bg-[#0D1F3C]/50 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <Smartphone size={24} /> Active Device Sessions
                </h3>
                <p className="text-sm font-medium text-gray-500 mt-1">Monitor and revoke currently authenticated devices across the platform.</p>
              </div>
              <button className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2">
                <Ban size={16} /> Revoke All Sessions
              </button>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0">
                <AgGridReact
                  ref={gridRef}
                  theme={gridTheme}
                  rowData={mockDevices}
                  columnDefs={deviceColDefs}
                  rowHeight={64}
                  headerHeight={48}
                  onGridReady={onGridReady}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-0 h-full">
      
      {/* Page Header */}
      <div className="shrink-0">
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-indigo-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Security</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm border border-indigo-200/50 dark:border-indigo-800/50">
                <Shield size={24} />
              </div>
              Platform Security Center
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Manage global authentication policies, monitor active administrative sessions, and investigate suspicious activities.</p>
          </div>
        </div>
      </div>

      {/* Sub-menu Grid */}
      <div className="shrink-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
        {SUB_MENUS.map(menu => {
          const Icon = menu.icon;
          const isActive = activeMenu === menu.id;
          
          return (
            <button
              key={menu.id}
              onClick={() => setActiveMenu(menu.id)}
              className={`flex flex-col items-center justify-center p-4 gap-2 rounded-2xl border text-center transition-all ${
                isActive 
                  ? `${menu.tabClass} shadow-md scale-[1.02]`
                  : 'bg-white dark:bg-[#0F172A] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-gray-900 dark:hover:text-white shadow-sm'
              }`}
            >
              <Icon size={20} className={isActive ? menu.iconClass : 'opacity-70'} />
              <span className="text-[11px] font-extrabold uppercase tracking-wider">{menu.id}</span>
            </button>
          )
        })}
      </div>

      {/* Dynamic Content */}
      <div className="w-full flex-1 min-h-0 overflow-y-auto pb-6 custom-scrollbar pr-2">
        {renderContent()}
      </div>
    </div>
  );
}
