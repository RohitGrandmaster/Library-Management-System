'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { 
  Database, DatabaseZap, HardDriveDownload, Search, Filter, Activity, 
  ShieldCheck, AlertTriangle, CheckCircle, Clock, GitCommit, HardDrive, Share2,
  Trash2, ShieldAlert, GitPullRequest, SearchCheck, Lock, UploadCloud, Save
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  { id: "Database Dashboard", icon: Database, color: "cyan", tabClass: "bg-cyan-50 border-cyan-200 text-cyan-700 dark:bg-cyan-900/20 dark:border-cyan-800/50 dark:text-cyan-400", iconClass: "text-cyan-600 dark:text-cyan-400" },
  { id: "Schema & Migrations", icon: GitPullRequest, color: "fuchsia", tabClass: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700 dark:bg-fuchsia-900/20 dark:border-fuchsia-800/50 dark:text-fuchsia-400", iconClass: "text-fuchsia-600 dark:text-fuchsia-400" },
  { id: "Retention & Cleanup", icon: Trash2, color: "rose", tabClass: "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-400", iconClass: "text-rose-600 dark:text-rose-400" },
  { id: "Tenant Isolation", icon: Lock, color: "indigo", tabClass: "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800/50 dark:text-indigo-400", iconClass: "text-indigo-600 dark:text-indigo-400" }
];

// Mock Data for Library Databases
const mockTenantDBs = [
  { id: '1', library: 'StudyNest Patna', code: 'SN-001', size: '24.5 GB', rows: '2.4M', schema: 'v4.2.1', health: 'Healthy', isolation: 'Strict Enforced' },
  { id: '2', library: 'Readers Den Delhi', code: 'RD-092', size: '8.2 GB', rows: '840K', schema: 'v4.2.1', health: 'Healthy', isolation: 'Strict Enforced' },
  { id: '3', library: 'LibroHub Mumbai', code: 'LM-404', size: '1.1 GB', rows: '120K', schema: 'v4.2.0', health: 'Migration Pending', isolation: 'Strict Enforced' },
  { id: '4', library: 'Global Config DB', code: 'SYS-GLOBAL', size: '4.5 GB', rows: '550K', schema: 'v4.2.1', health: 'Healthy', isolation: 'Shared System' },
];

export default function DatabasePage() {
  const [activeMenu, setActiveMenu] = useState("Database Dashboard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const gridRef = useRef<AgGridReact>(null);

  const tenantColDefs = useMemo<any[]>(() => [
    {
      headerName: 'Tenant Library', field: 'library', flex: 2, minWidth: 250,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-3 h-full group">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 border border-cyan-200 dark:border-cyan-800/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-extrabold text-sm shadow-sm">
            <Database size={18} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-extrabold text-gray-900 dark:text-white leading-tight">{p.data?.library}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Tenant ID: {p.data?.code}</p>
          </div>
        </div>
      ),
    },
    { 
      headerName: 'Storage & Volume', field: 'size', flex: 1.5, minWidth: 150,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex flex-col justify-center h-full">
          <p className="text-sm font-black text-gray-700 dark:text-gray-300">{p.data?.size}</p>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{p.data?.rows} Rows</p>
        </div>
      )
    },
    { 
      headerName: 'Schema Version', field: 'schema', flex: 1, minWidth: 140,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center h-full text-xs font-bold text-slate-600 dark:text-slate-400 font-mono">
          <GitCommit size={14} className="mr-1.5 text-cyan-500" /> {p.data?.schema}
        </div>
      )
    },
    { 
      headerName: 'Isolation Status', field: 'isolation', flex: 1.5, minWidth: 160,
      cellRenderer: (p: ICellRendererParams) => {
        const isStrict = p.data?.isolation === 'Strict Enforced';
        return (
          <div className="flex items-center h-full">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 border shadow-sm ${isStrict ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800'}`}>
              {isStrict ? <ShieldCheck size={12} /> : <Share2 size={12} />} {p.data?.isolation}
            </span>
          </div>
        );
      }
    },
    { 
      headerName: 'Health', field: 'health', flex: 1, minWidth: 140,
      cellRenderer: (p: ICellRendererParams) => {
        let colors = 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50';
        if (p.data?.health === 'Healthy') {
          colors = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50';
        }
        
        return (
          <div className="flex items-center h-full">
            <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-extrabold shadow-sm flex items-center gap-1.5 ${colors}`}>
              {p.data?.health === 'Healthy' ? <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> : <Clock size={12} />}
              {p.data?.health}
            </span>
          </div>
        )
      }
    },
    {
      headerName: 'Action', field: 'id', flex: 1, minWidth: 100, sortable: false, filter: false,
      cellRenderer: () => (
        <div className="flex items-center h-full">
          <button className="px-3 py-1.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Manage
          </button>
        </div>
      )
    }
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setProcessed(true);
      setTimeout(() => setProcessed(false), 3000);
    }, 1500);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "Schema & Migrations":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 p-8 flex flex-col items-center justify-center min-h-[500px]">
             <div className="w-20 h-20 bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 rounded-full flex items-center justify-center mb-6 shadow-sm border border-fuchsia-200 dark:border-fuchsia-800">
               <GitPullRequest size={40} />
             </div>
             <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Schema Migrations</h2>
             <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 text-center font-medium">Roll out database schema changes to all tenants simultaneously using the Prisma migration engine.</p>
             <div className="w-full max-w-2xl bg-gray-50 dark:bg-[#1E293B] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-8 text-center">
               <DatabaseZap size={32} className="text-gray-400 mx-auto mb-4" />
               <p className="text-gray-500 font-bold mb-4">Pending Migration: <code className="text-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-900/20 px-2 py-0.5 rounded">v4.2.2_add_indexes</code></p>
               <button className="px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center justify-center mx-auto gap-2">
                 <Play size={16} /> Execute Migration
               </button>
             </div>
          </div>
        )

      case "Tenant Isolation":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-indigo-50/50 dark:bg-indigo-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                  <Lock size={24} /> Row-Level Security (RLS) & Isolation
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Configure multi-tenant data architecture and privacy walls.</p>
              </div>
            </div>

            <form onSubmit={handleAction} className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">
                
                {/* Data Privacy */}
                <div className="bg-gray-50 dark:bg-[#1E293B] p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-indigo-500" /> PostgreSQL RLS Policies
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-white dark:bg-[#0F172A] rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer shadow-sm hover:border-indigo-300 transition-colors">
                      <div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white block">Enforce strict Tenant_ID filtering</span>
                        <span className="text-xs font-medium text-gray-500 mt-0.5 block">Every query is automatically scoped to the user's tenant ID via middleware.</span>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded-md border-gray-300" />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-white dark:bg-[#0F172A] rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer shadow-sm hover:border-indigo-300 transition-colors">
                      <div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white block">Cross-tenant queries block</span>
                        <span className="text-xs font-medium text-gray-500 mt-0.5 block">Deny DB roles from performing JOINs across tenant partitions.</span>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded-md border-gray-300" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/3 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 p-6 rounded-2xl flex flex-col shadow-sm">
                <div className="flex-1">
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2"><ShieldAlert size={18} className="text-indigo-500"/> Enforcement Status</h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">RLS is currently active at the database level for 42 managed tables.</p>
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-400 font-mono">
                    ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;
                  </div>
                </div>
                <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                  <button type="submit" disabled={isProcessing} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                    {isProcessing ? <Activity size={18} className="animate-spin" /> : <Save size={18} />}
                    {isProcessing ? 'Saving Policies...' : 'Update RLS Settings'}
                  </button>
                  {processed && <p className="text-emerald-600 text-xs font-bold mt-4 text-center flex items-center justify-center gap-1.5"><CheckCircle size={14} /> Isolation Policies Saved</p>}
                </div>
              </div>
            </form>
          </div>
        );

      case "Retention & Cleanup":
        return (
          <div className="border-2 border-dashed border-rose-300 dark:border-rose-700/50 rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-rose-50/30 dark:bg-rose-900/10 animate-in zoom-in-95 duration-500 min-h-[400px]">
            <div className="p-5 bg-rose-100 dark:bg-rose-900/40 rounded-full mb-6 shadow-inner">
              <Trash2 size={48} className="text-rose-500 dark:text-rose-400" />
            </div>
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">Data Retention Policies</h4>
            <p className="text-gray-500 font-medium max-w-lg mx-auto">
              Configure automated purging of soft-deleted records, old audit logs, and orphaned files to reclaim database volume.
            </p>
          </div>
        );

      case "Database Dashboard":
      default:
        return (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 flex flex-col min-h-0 h-full">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
              {[
                { title: 'Total Volume', value: '412 GB', icon: <HardDrive size={24} />, color: 'cyan' },
                { title: 'Active Connections', value: '1,402', icon: <Activity size={24} />, color: 'emerald' },
                { title: 'Query Latency (Avg)', value: '18 ms', icon: <SearchCheck size={24} />, color: 'amber' },
                { title: 'Dead Tuples', value: '2.4%', icon: <AlertTriangle size={24} />, color: 'rose' }
              ].map(stat => (
                <div key={stat.title} className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between group overflow-hidden relative">
                   <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 dark:bg-${stat.color}-500/10 rounded-bl-full transition-transform group-hover:scale-110`}></div>
                  <div className="relative z-10">
                    <h3 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">{stat.title}</h3>
                    <div className="text-3xl font-black text-gray-900 dark:text-white leading-none">{stat.value}</div>
                  </div>
                  <div className={`relative z-10 w-14 h-14 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 flex items-center justify-center border border-${stat.color}-100 dark:border-${stat.color}-800/50 shadow-sm`}>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col flex-1 min-h-[400px]">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1F3C]/50 flex justify-between items-center shrink-0">
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <Database size={20} className="text-cyan-500" /> Multi-Tenant Architecture Overview
                </h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:text-cyan-600 shadow-sm"><Filter size={16} /></button>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search Tenant DBs..." className="pl-9 pr-4 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none shadow-sm" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0">
                  <AgGridReact
                    ref={gridRef}
                    theme={gridTheme}
                    rowData={mockTenantDBs}
                    columnDefs={tenantColDefs}
                    rowHeight={64}
                    headerHeight={48}
                    onGridReady={onGridReady}
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-[calc(100vh-6rem)]">
      
      {/* Page Header */}
      <div className="shrink-0">
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-cyan-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Database & Data</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-sm border border-cyan-200/50 dark:border-cyan-800/50">
                <DatabaseZap size={24} />
              </div>
              Database & Data Architecture
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Manage multi-tenant isolation, execute schema migrations, monitor database performance, and configure retention policies.</p>
          </div>
        </div>
      </div>

      {/* Sub-menu Grid */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
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
      <div className="w-full flex-1 min-h-0 relative">
        {renderContent()}
      </div>
    </div>
  );
}
