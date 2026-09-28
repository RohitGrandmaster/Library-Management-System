'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { 
  Eye, X, Shield, ScrollText, Filter, Download, 
  Search, ShieldAlert, Activity, CreditCard, Clock, Server, UserCheck
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  { id: "Global Audit Stream", icon: ScrollText, color: "blue", tabClass: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400", iconClass: "text-blue-600 dark:text-blue-400" },
  { id: "Security Events", icon: ShieldAlert, color: "rose", tabClass: "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-400", iconClass: "text-rose-600 dark:text-rose-400" },
  { id: "System Activity", icon: Server, color: "indigo", tabClass: "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800/50 dark:text-indigo-400", iconClass: "text-indigo-600 dark:text-indigo-400" },
  { id: "Financial Logs", icon: CreditCard, color: "emerald", tabClass: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400", iconClass: "text-emerald-600 dark:text-emerald-400" },
];

const MOCK_LOGS = [
  { id: 'LOG-99125', time: '2026-09-28 14:30', user: 'Super Admin', category: 'Financial', entity: 'Subscription', target: 'City Reading Hub', action: 'Created', ip: '192.168.1.42', detail: 'New Enterprise (Annual) subscription created. Amount: $15,000.' },
  { id: 'LOG-99124', time: '2026-09-28 11:15', user: 'System Auto', category: 'System', entity: 'Maintenance', target: 'Global Platform', action: 'Executed', ip: 'internal', detail: 'Automated database vacuum process completed successfully.' },
  { id: 'LOG-99123', time: '2026-09-27 18:45', user: 'Rohit Sharma', category: 'Security', entity: 'Role Policy', target: 'Tenant Admin', action: 'Updated', ip: '10.0.0.5', detail: 'Permissions modified. Added "Bypass MFA" privilege to Tenant Admin role.' },
  { id: 'LOG-99122', time: '2026-09-27 09:20', user: 'Super Admin', category: 'System', entity: 'Feature Flag', target: 'Beta Analytics', action: 'Deleted', ip: '192.168.1.42', detail: 'Feature flag disabled globally for all tenants.' },
  { id: 'LOG-99121', time: '2026-09-26 16:05', user: 'Super Admin', category: 'Financial', entity: 'Billing Plan', target: 'Enterprise', action: 'Created', ip: '192.168.1.42', detail: 'New SaaS plan created. Price: $999/mo. Max seats: 200.' },
  { id: 'LOG-99120', time: '2026-09-26 02:00', user: 'System Auto', category: 'System', entity: 'Backup Job', target: 'DB Snapshot', action: 'Created', ip: 'internal', detail: 'Nightly automated backup completed. Snapshot stored in AWS S3 (145GB).' },
  { id: 'LOG-99119', time: '2026-09-25 15:30', user: 'Security Bot', category: 'Security', entity: 'Login Attempt', target: 'admin@nexus.com', action: 'Blocked', ip: '45.22.11.90', detail: '5 consecutive failed login attempts blocked by WAF rate limiter.' },
  { id: 'LOG-99118', time: '2026-09-25 14:10', user: 'Super Admin', category: 'Security', entity: 'API Key', target: 'Mobile App Prod', action: 'Rotated', ip: '192.168.1.42', detail: 'Production API keys rotated. Old keys invalidated.' },
];

type Log = typeof MOCK_LOGS[0];

export default function AuditLogsPage() {
  const [activeMenu, setActiveMenu] = useState("Global Audit Stream");
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const gridRef = useRef<AgGridReact>(null);

  const filteredLogs = useMemo(() => {
    let logs = MOCK_LOGS;
    if (activeMenu === "Security Events") logs = logs.filter(l => l.category === 'Security');
    if (activeMenu === "System Activity") logs = logs.filter(l => l.category === 'System');
    if (activeMenu === "Financial Logs") logs = logs.filter(l => l.category === 'Financial');
    
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      logs = logs.filter(l => 
        l.target.toLowerCase().includes(lower) || 
        l.action.toLowerCase().includes(lower) ||
        l.user.toLowerCase().includes(lower) ||
        l.id.toLowerCase().includes(lower)
      );
    }
    return logs;
  }, [activeMenu, searchTerm]);

  const ActionBadge = useCallback(({ action }: { action: string }) => {
    let color = 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300';
    if (['Created', 'Executed'].includes(action)) color = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800/40 dark:text-emerald-400';
    if (['Updated', 'Rotated'].includes(action)) color = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800/40 dark:text-blue-400';
    if (['Deleted', 'Blocked'].includes(action)) color = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:border-rose-800/40 dark:text-rose-400';
    
    return <span className={`px-2.5 py-1 rounded-full border text-[10px] font-extrabold uppercase tracking-wider ${color}`}>{action}</span>;
  }, []);

  const colDefs = useMemo<any[]>(() => [
    { field: 'time', headerName: 'Timestamp', flex: 1.2, minWidth: 150, cellClass: 'font-mono text-xs text-gray-500 dark:text-gray-400 flex items-center' },
    { field: 'user', headerName: 'Actor', flex: 1, minWidth: 140, cellRenderer: (p: ICellRendererParams) => (
      <div className="flex items-center gap-1.5 h-full">
        {p.value === 'System Auto' || p.value === 'Security Bot' ? <Server size={12} className="text-indigo-500" /> : <UserCheck size={12} className="text-emerald-500" />}
        <span className="font-bold text-gray-900 dark:text-white">{p.value}</span>
      </div>
    )},
    { field: 'target', headerName: 'Target Entity', flex: 1.5, minWidth: 200, cellRenderer: (p: ICellRendererParams) => (
      <div className="flex flex-col justify-center h-full gap-0.5">
        <span className="text-sm font-extrabold text-gray-800 dark:text-gray-200">{p.value}</span>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{p.data?.entity}</span>
      </div>
    )},
    { field: 'action', headerName: 'Action', flex: 1, minWidth: 120, cellRenderer: (p: ICellRendererParams) => <ActionBadge action={p.value} /> },
    { field: 'ip', headerName: 'Source IP', flex: 1, minWidth: 120, cellClass: 'font-mono text-xs text-gray-500 dark:text-gray-400' },
    { field: 'id', headerName: 'View Details', flex: 0.8, minWidth: 100, sortable: false, filter: false, cellRenderer: (p: ICellRendererParams) => (
      <button 
        onClick={(e) => { e.stopPropagation(); setSelectedLog(p.data!); }}
        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
      >
        <Eye size={14} /> Inspect
      </button>
    )}
  ], [ActionBadge]);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  return (
    <div className="flex flex-col gap-6 w-full h-full min-h-0 relative">
      
      {/* Page Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 shrink-0">
        <div>
          <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Nexus 360</span><span>/</span><span className="text-blue-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Audit Logs</span>
          </div>
          <h1 className="sa-page-title text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl shadow-sm border border-blue-200/50 dark:border-blue-800/50">
              <ScrollText size={28} className="text-blue-600 dark:text-blue-400" />
            </div>
            Global Audit Center
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Immutable, cryptographically verifiable ledger of all administrative actions, system events, and security access logs.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search logs by ID, Actor, Target..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-blue-500 shadow-sm w-64 md:w-80"
            />
          </div>
          <button className="px-4 py-2.5 bg-white border border-gray-300 dark:bg-[#1E293B] dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Sub-menu Grid */}
      <div className="shrink-0 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {SUB_MENUS.map(menu => {
          const Icon = menu.icon;
          const isActive = activeMenu === menu.id;
          
          return (
            <button
              key={menu.id}
              onClick={() => setActiveMenu(menu.id)}
              className={`flex flex-col items-center justify-center p-5 gap-3 rounded-2xl border text-center transition-all ${
                isActive 
                  ? `${menu.tabClass} shadow-md scale-[1.02]`
                  : 'bg-white dark:bg-[#0F172A] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-gray-900 dark:hover:text-white shadow-sm'
              }`}
            >
              <Icon size={24} className={isActive ? menu.iconClass : 'opacity-70'} />
              <span className="text-xs font-extrabold uppercase tracking-wider">{menu.id}</span>
            </button>
          )
        })}
      </div>

      {/* Grid Container */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col flex-1 min-h-[500px]">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1F3C]/50 flex justify-between items-center shrink-0">
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity size={20} className="text-blue-500" /> Active Ledger
          </h3>
          <p className="text-xs text-gray-500 font-bold px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">Showing {filteredLogs.length} events</p>
        </div>
        
        <div className="flex-1 w-full relative">
          <div className="absolute inset-0">
            <AgGridReact
              ref={gridRef}
              theme={gridTheme}
              rowData={filteredLogs}
              columnDefs={colDefs}
              rowHeight={64}
              headerHeight={48}
              onGridReady={onGridReady}
            />
          </div>
        </div>
      </div>

      {/* Log Details Slide-Over / Modal */}
      {selectedLog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setSelectedLog(null)} />
          <div className="bg-white dark:bg-[#0F172A] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-gray-700">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1E293B] flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-blue-500" />
                  <span className="font-mono text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider">EVENT ID: {selectedLog.id}</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Audit Trail Inspection</h3>
              </div>
              <button onClick={() => setSelectedLog(null)} className="p-2 bg-white dark:bg-[#0F172A] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors border border-gray-200 dark:border-gray-700 shadow-sm">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto">
              
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-5 rounded-2xl">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-200 leading-relaxed">
                  <strong className="font-black">Event Detail:</strong> {selectedLog.detail}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-[#1E293B]/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1">Timestamp</span>
                  <span className="font-mono text-sm text-gray-900 dark:text-white font-bold"><Clock size={12} className="inline mr-1 text-gray-400"/> {selectedLog.time}</span>
                </div>
                <div className="bg-gray-50 dark:bg-[#1E293B]/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1">Source IP Address</span>
                  <span className="font-mono text-sm text-gray-900 dark:text-white font-bold">{selectedLog.ip}</span>
                </div>
                <div className="bg-gray-50 dark:bg-[#1E293B]/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1">Performed By (Actor)</span>
                  <span className="text-sm font-black text-gray-900 dark:text-white">{selectedLog.user}</span>
                </div>
                <div className="bg-gray-50 dark:bg-[#1E293B]/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1">Action Type</span>
                    <ActionBadge action={selectedLog.action} />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-4">Cryptographic Verification</h4>
                <div className="bg-gray-900 rounded-xl p-4 font-mono text-[10px] text-emerald-400 break-all leading-relaxed shadow-inner">
                  {">"} VERIFYING LEDGER HASH...<br/>
                  {">"} PREV_HASH: 9a3c8f12be40...<br/>
                  {">"} BLOCK_SIGNATURE: Validated via HSM.<br/>
                  {">"} STATUS: SECURE (IMMUTABLE RECORD)
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
