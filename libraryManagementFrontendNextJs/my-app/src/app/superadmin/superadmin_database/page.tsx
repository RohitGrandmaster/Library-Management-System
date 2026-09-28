'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { 
  Database, DatabaseZap, HardDriveDownload, Search, Filter, Activity, 
  ShieldCheck, AlertTriangle, CheckCircle, Clock, GitCommit, HardDrive, Share2
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  "Database Dashboard", "Library Databases", "Database Usage", "Database Health", 
  "Schema Versions", "Migrations", "Data Export", "Data Import", "Data Retention", 
  "Data Cleanup", "Data Integrity", "Tenant Isolation"
];

// Mock Data for Library Databases
const mockTenantDBs = [
  { id: '1', library: 'StudyNest Patna', code: 'SN-001', size: '24.5 GB', rows: '2.4M', schema: 'v4.2.1', health: 'Healthy', isolation: 'Strict Enforced' },
  { id: '2', library: 'Readers Den Delhi', code: 'RD-092', size: '8.2 GB', rows: '840K', schema: 'v4.2.1', health: 'Healthy', isolation: 'Strict Enforced' },
  { id: '3', library: 'LibroHub Mumbai', code: 'LM-404', size: '1.1 GB', rows: '120K', schema: 'v4.2.0', health: 'Migration Pending', isolation: 'Strict Enforced' },
];

export default function DatabasePage() {
  const [activeMenu, setActiveMenu] = useState("Database Dashboard");
  const gridRef = useRef<AgGridReact>(null);

  const tenantColDefs = useMemo<any[]>(() => [
    {
      headerName: 'Tenant Library', field: 'library', flex: 2, minWidth: 250,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-3 h-full group">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-extrabold text-sm shadow-sm">
            <Database size={18} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-bold text-gray-900 dark:text-white leading-tight">{p.data?.library}</p>
            <p className="text-[11px] text-gray-500 font-semibold">Tenant ID: {p.data?.code}</p>
          </div>
        </div>
      ),
    },
    { 
      headerName: 'Storage & Volume', field: 'size', flex: 1.5, minWidth: 150,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex flex-col justify-center h-full">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{p.data?.size}</p>
          <p className="text-xs font-medium text-gray-500">{p.data?.rows} Rows</p>
        </div>
      )
    },
    { 
      headerName: 'Schema Version', field: 'schema', flex: 1, minWidth: 120,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center h-full text-sm font-bold text-slate-600 dark:text-slate-400 font-mono">
          <GitCommit size={14} className="mr-2 text-cyan-500" /> {p.data?.schema}
        </div>
      )
    },
    { 
      headerName: 'Isolation Status', field: 'isolation', flex: 1.5, minWidth: 160,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center h-full">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800 shadow-sm">
            <ShieldCheck size={12} /> {p.data?.isolation}
          </span>
        </div>
      )
    },
    { 
      headerName: 'Health', field: 'health', flex: 1, minWidth: 140,
      cellRenderer: (p: ICellRendererParams) => {
        let colors = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800';
        if (p.data?.health === 'Healthy') {
          colors = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
        }
        
        return (
          <div className="flex items-center h-full">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm ${colors}`}>
              {p.data?.health}
            </span>
          </div>
        )
      }
    }
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in zoom-in-95 duration-300">
      {/* Page Header */}
      <div>
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-cyan-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Database & Data</span>
        </div>
        <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl shadow-sm border border-cyan-200/50 dark:border-cyan-800/50">
            <Database size={28} className="text-cyan-600 dark:text-cyan-400" />
          </div>
          Database Architecture & Data
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-2xl">Manage platform data, enforce tenant isolation policies, and monitor global database health and schema migrations.</p>
      </div>

      {/* Sub-menu Tabs */}
      <div className="flex overflow-x-auto custom-scrollbar gap-2 pb-2">
        {SUB_MENUS.map(menu => (
          <button
            key={menu}
            onClick={() => setActiveMenu(menu)}
            className={`px-5 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all shadow-sm ${
              activeMenu === menu 
                ? 'bg-cyan-600 text-white shadow-cyan-600/20 scale-105' 
                : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-cyan-50 dark:hover:bg-[#1E293B] hover:text-cyan-600 dark:hover:text-cyan-400'
            }`}
          >
            {menu}
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
      <div className="w-full">
        
        {/* Main Database Dashboard */}
        {activeMenu === "Database Dashboard" && (
          <div className="space-y-6">
            
            {/* Global Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {[
                { title: 'Global Data Size', value: '412.5 GB', icon: <HardDrive size={20} />, status: '+1.2GB this week', color: 'cyan' },
                { title: 'Active Connections', value: '1,842', icon: <Share2 size={20} />, status: 'Peak: 2,100', color: 'blue' },
                { title: 'Slow Queries / Errors', value: '14', icon: <AlertTriangle size={20} />, status: 'Down by 5% today', color: 'yellow' },
                { title: 'Schema Version', value: 'v4.2.1', icon: <GitCommit size={20} />, status: 'Latest Stable', color: 'purple' }
              ].map(stat => (
                <div key={stat.title} className="bg-white dark:bg-[#0F172A] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2.5 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                      {stat.icon}
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.title}</h3>
                  </div>
                  <div className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                  <p className="text-[11px] font-semibold text-gray-400">{stat.status}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tenant Isolation Policy Display */}
              <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20 p-8 rounded-2xl shadow-inner border border-indigo-100 dark:border-indigo-800 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck size={28} className="text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-xl font-extrabold text-indigo-900 dark:text-indigo-300">Tenant Data Isolation Engine</h2>
                </div>
                <div className="space-y-4 relative">
                  <div className="absolute top-0 bottom-0 left-[23px] w-0.5 bg-indigo-200 dark:bg-indigo-800"></div>
                  <div className="relative pl-12">
                    <div className="absolute left-0 top-1 w-12 h-12 rounded-full bg-white dark:bg-[#0F172A] border-4 border-indigo-100 dark:border-indigo-900 flex items-center justify-center -translate-x-1/2">
                      <DatabaseZap size={18} className="text-emerald-500" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Row-Level Security (RLS) Active</h4>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">Queries are strictly bound to `tenant_id`. Library A cannot access Library B's data under any circumstance at the application level.</p>
                  </div>
                  <div className="relative pl-12 pt-4">
                    <div className="absolute left-0 top-5 w-12 h-12 rounded-full bg-white dark:bg-[#0F172A] border-4 border-indigo-100 dark:border-indigo-900 flex items-center justify-center -translate-x-1/2">
                      <DatabaseZap size={18} className="text-blue-500" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Schema Segregation Evaluated</h4>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">Platform utilizes single database shared schema with hard tenant isolation policies. Dedicated schema provisioning is available for Enterprise tiers.</p>
                  </div>
                </div>
              </div>

              {/* Health & Maintenance */}
              <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Activity className="text-slate-400" size={18} /> Global Database Health
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1E293B] rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-emerald-500" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Primary Database Status</p>
                        <p className="text-xs text-gray-500">Read/Write operations normal</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[11px] font-bold rounded-full">Healthy</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1E293B] rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <Clock size={20} className="text-blue-500" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Last Automated Backup</p>
                        <p className="text-xs text-gray-500">2026-09-28 02:00 AM (Complete)</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-cyan-600 text-[11px] font-bold rounded-lg transition-colors">
                      View Log
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1E293B] rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <HardDriveDownload size={20} className="text-purple-500" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Data Retention Policy</p>
                        <p className="text-xs text-gray-500">Soft deletes kept for 90 days</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-cyan-600 text-[11px] font-bold rounded-lg transition-colors">
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tenant Database List */}
        {activeMenu === "Library Databases" && (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col animate-in fade-in">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-[#0D1F3C]">
              <div className="relative max-w-md w-full">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search tenants by library name or ID..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-sm"
                  onChange={e => gridRef.current?.api.setGridOption('quickFilterText', e.target.value)}
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all hover:border-gray-400">
                <Filter size={16} className="text-gray-500" /> Advanced Filter
              </button>
            </div>
            
            <div className="h-[600px] w-full">
              <AgGridReact
                ref={gridRef}
                theme={gridTheme}
                rowData={mockTenantDBs}
                columnDefs={tenantColDefs}
                rowHeight={72}
                headerHeight={52}
                onGridReady={onGridReady}
                pagination={true}
                paginationPageSize={15}
              />
            </div>
          </div>
        )}

        {/* Placeholder for other configurations */}
        {activeMenu !== "Database Dashboard" && activeMenu !== "Library Databases" && (
          <div className="bg-white dark:bg-[#0F172A] p-16 rounded-2xl shadow-lg border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center animate-in fade-in">
            <Database size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{activeMenu} Settings</h3>
            <p className="text-sm font-medium text-gray-500 max-w-md">Detailed configuration and reports for {activeMenu.toLowerCase()} are managed directly by Database Administrators.</p>
          </div>
        )}

      </div>
    </div>
  );
}
