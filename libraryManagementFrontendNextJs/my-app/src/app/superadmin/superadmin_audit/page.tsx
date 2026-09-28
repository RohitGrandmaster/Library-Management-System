'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import AuditDetailsView from './AuditDetailsView';
import { 
  FileText, Search, Filter, Download, Archive, Calendar, User, 
  Database, Shield, Activity, XCircle, CheckCircle, Clock
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  "All Audit Logs", "Authentication Logs", "User Activity", "Library Activity", 
  "Branch Activity", "Book Activity", "Member Activity", "Circulation Activity", 
  "Inventory Activity", "Payment Activity", "Permission Changes", "Configuration Changes", 
  "API Logs", "Security Logs", "Support Access Logs", "Server Logs"
];

// Mock Data
const mockAudits = [
  { id: 'aud_001', actor: 'Priya Singh', role: 'Platform Admin', action: 'Update Plan Limits', module: 'Libraries', library: 'StudyNest Patna', branch: 'Global', recordId: 'PLN-882', oldValue: '{"max_users": 50}', newValue: '{"max_users": 100}', date: '2026-09-28', time: '14:22:01', ip: '45.112.x.x', device: 'Windows', browser: 'Chrome', sessionId: 'sess_123', reqId: 'req_892x', result: 'Success', reason: 'Requested via support ticket #8812' },
  { id: 'aud_002', actor: 'System Auto', role: 'System', action: 'Trigger Subscription Expiry', module: 'Subscriptions', library: 'Readers Den', branch: 'Global', recordId: 'SUB-991', oldValue: '{"status": "Active"}', newValue: '{"status": "Expired"}', date: '2026-09-28', time: '00:00:05', ip: '127.0.0.1', device: 'Server', browser: 'Worker', sessionId: 'sys_job_11', reqId: 'req_0001', result: 'Success', reason: 'Cron job execution' },
  { id: 'aud_003', actor: 'Rahul Verma', role: 'Branch Manager', action: 'Delete Book Record', module: 'Inventory', library: 'LibroHub', branch: 'Andheri West', recordId: 'BOK-551', oldValue: '{"title": "Clean Code"}', newValue: 'null', date: '2026-09-27', time: '18:45:10', ip: '192.168.1.5', device: 'Android', browser: 'Safari', sessionId: 'sess_99x', reqId: 'req_412p', result: 'Failed', reason: 'Insufficient permissions (Role Matrix)' },
  { id: 'aud_004', actor: 'Rohit S.', role: 'SuperAdmin', action: 'Force Unlock Tenant', module: 'Support', library: 'StudyNest Patna', branch: 'Global', recordId: 'TEN-001', oldValue: '{"locked": true}', newValue: '{"locked": false}', date: '2026-09-26', time: '10:15:33', ip: '10.0.0.4', device: 'MacBook', browser: 'Edge', sessionId: 'sess_sup1', reqId: 'req_sup9', result: 'Success', reason: 'Emergency unlock requested by founder.' },
];

export default function GlobalAuditPage() {
  const [activeMenu, setActiveMenu] = useState("All Audit Logs");
  const [selectedAudit, setSelectedAudit] = useState<any>(null);
  const gridRef = useRef<AgGridReact>(null);

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'Actor / User', field: 'actor', flex: 1.5, minWidth: 200,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-3 h-full cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-extrabold text-xs group-hover:scale-110 group-hover:bg-slate-600 group-hover:text-white transition-all shadow-sm">
            <User size={14} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-tight">{p.data?.actor}</p>
            <p className="text-[10px] text-gray-500 font-semibold">{p.data?.role}</p>
          </div>
        </div>
      ),
    },
    { 
      headerName: 'Action & Target', field: 'action', flex: 2, minWidth: 250,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex flex-col justify-center h-full">
          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{p.data?.action}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{p.data?.module}</span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span className="text-[10px] font-bold text-gray-500 font-mono">{p.data?.recordId}</span>
          </div>
        </div>
      )
    },
    { 
      headerName: 'Scope (Lib/Branch)', field: 'library', flex: 1.5, minWidth: 180,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex flex-col justify-center h-full">
          <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 truncate">{p.data?.library}</p>
          <p className="text-[10px] font-medium text-gray-500 truncate">{p.data?.branch}</p>
        </div>
      )
    },
    { 
      headerName: 'Date & Time', field: 'date', flex: 1.2, minWidth: 160,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex flex-col justify-center h-full">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"><Calendar size={12} className="text-slate-400" /> {p.data?.date}</p>
          <p className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5"><Clock size={12} className="text-slate-400" /> {p.data?.time}</p>
        </div>
      )
    },
    { 
      headerName: 'Result', field: 'result', flex: 1, minWidth: 120,
      cellRenderer: (p: ICellRendererParams) => {
        let icon = <CheckCircle size={12} />;
        let colors = 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800';
        
        if (p.data?.result === 'Failed') {
          icon = <XCircle size={12} />;
          colors = 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-800';
        }
        
        return (
          <div className="flex items-center h-full">
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm border ${colors}`}>
              {icon} {p.data?.result}
            </span>
          </div>
        )
      }
    }
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  const getFilteredLogs = () => {
    if (activeMenu === "Authentication Logs") return mockAudits.filter(p => p.module === 'Authentication' || p.module === 'Support');
    if (activeMenu === "Configuration Changes") return mockAudits.filter(p => p.module === 'Libraries' || p.module === 'Subscriptions');
    if (activeMenu === "Support Access Logs") return mockAudits.filter(p => p.role === 'SuperAdmin');
    return mockAudits; // Default "All Audit Logs"
  };

  if (selectedAudit) {
    return <AuditDetailsView audit={selectedAudit} onBack={() => setSelectedAudit(null)} />;
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in zoom-in-95 duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Nexus 360</span><span>/</span><span className="text-slate-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Global Audit Center</span>
          </div>
          <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <FileText size={28} className="text-slate-600 dark:text-slate-400" />
            </div>
            Global Audit Center
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Immutable, compliance-ready logs of every action performed on the platform. Review old/new values, IPs, and system events.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all">
            <Download size={16} /> Export CSV/PDF
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-red-600 bg-white border border-red-200 rounded-xl shadow-sm hover:bg-red-50 dark:bg-[#1E293B] dark:border-red-900/30 transition-all">
            <Archive size={16} /> Archive Logs
          </button>
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
                ? 'bg-slate-800 text-white shadow-lg scale-105 dark:bg-slate-700' 
                : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-[#1E293B] hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {menu}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col">
        
        {/* Advanced Filters Bar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1F3C] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className="relative lg:col-span-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search actor, action, or record ID..." 
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold outline-none focus:border-slate-500 shadow-sm"
              onChange={e => gridRef.current?.api.setGridOption('quickFilterText', e.target.value)}
            />
          </div>

          <select className="p-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold outline-none focus:border-slate-500 shadow-sm text-gray-600 dark:text-gray-300">
            <option value="">All Libraries</option>
            <option>StudyNest Patna</option>
            <option>Readers Den</option>
          </select>
          
          <select className="p-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold outline-none focus:border-slate-500 shadow-sm text-gray-600 dark:text-gray-300">
            <option value="">All Modules</option>
            <option>Authentication</option>
            <option>Inventory</option>
            <option>Subscriptions</option>
          </select>

          <select className="p-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold outline-none focus:border-slate-500 shadow-sm text-gray-600 dark:text-gray-300">
            <option value="">Date Range: Last 7 Days</option>
            <option>Today</option>
            <option>Last 30 Days</option>
          </select>

          <button className="flex items-center justify-center gap-1.5 p-2 bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-slate-700 transition-colors">
            <Filter size={14} /> Apply Filters
          </button>
        </div>
        
        <div className="h-[600px] w-full">
          <AgGridReact
            ref={gridRef}
            theme={gridTheme}
            rowData={getFilteredLogs()}
            columnDefs={colDefs}
            rowHeight={64}
            headerHeight={52}
            onGridReady={onGridReady}
            onRowClicked={p => setSelectedAudit(p.data)}
            pagination={true}
            paginationPageSize={15}
            rowClass="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors"
          />
        </div>

        <div className="bg-red-50 dark:bg-red-900/10 p-3 border-t border-red-100 dark:border-red-900/20 flex items-center justify-center gap-2">
          <Shield size={14} className="text-red-500" />
          <p className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-widest">
            Audit logs are immutable. Modification or deletion by platform users is strictly prohibited by system architecture.
          </p>
        </div>
      </div>
    </div>
  );
}
