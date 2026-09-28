'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { useLibraries } from '@/app/superadmin/superadmin_libraries/useLibraries';
import type { Library } from '@/app/superadmin/superadmin_libraries/superadmin_libraries_types';

import CreateLibraryForm from './CreateLibraryForm';
import LibraryDetailsView from './LibraryDetailsView';
import { 
  Building2, Search, Filter, Plus, ShieldCheck, PieChart, MapPin, 
  Clock, ShieldAlert, BarChart3, Users, Building
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  { id: "Libraries Directory", icon: Building2, color: "blue", tabClass: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400", iconClass: "text-blue-600 dark:text-blue-400" },
  { id: "Register Library", icon: Plus, color: "emerald", tabClass: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400", iconClass: "text-emerald-600 dark:text-emerald-400" },
  { id: "Verification Queue", icon: ShieldAlert, color: "amber", tabClass: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400", iconClass: "text-amber-600 dark:text-amber-400" },
  { id: "Global Insights", icon: PieChart, color: "violet", tabClass: "bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-900/20 dark:border-violet-800/50 dark:text-violet-400", iconClass: "text-violet-600 dark:text-violet-400" }
];

export default function LibrariesPage() {
  const { libraries, loading } = useLibraries();
  const [activeMenu, setActiveMenu] = useState("Libraries Directory");
  const [selectedLibraryId, setSelectedLibraryId] = useState<string | null>(null);
  const gridRef = useRef<AgGridReact>(null);

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'Tenant Details', field: 'name', flex: 2, minWidth: 260,
      cellRenderer: (p: ICellRendererParams<Library>) => {
        if (!p.data) return null;
        return (
          <div className="flex items-center gap-3 h-full cursor-pointer group" onClick={() => setSelectedLibraryId(p.data?.id ?? null)}>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-extrabold text-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm shrink-0">
              <Building2 size={18} />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <p className="font-extrabold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors leading-tight truncate">{p.data.name}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider truncate flex items-center gap-1 mt-0.5"><MapPin size={10}/> {p.data.location || 'HQ Server'}</p>
            </div>
          </div>
        );
      },
    },
    { 
      headerName: 'Subscription Plan', field: 'plan', flex: 1.5, minWidth: 150,
      cellRenderer: (p: ICellRendererParams<Library>) => {
        if (!p.data) return null;
        return (
          <div className="flex items-center h-full">
            <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
              {p.data.plan}
            </span>
          </div>
        );
      }
    },
    {
      headerName: 'Seat Utilization', field: 'occupied', flex: 1.5, minWidth: 180,
      cellRenderer: (p: ICellRendererParams<Library>) => {
        if (!p.data) return null;
        const pct = Math.round(((p.data.occupied ?? 0) / (p.data.seats ?? 1)) * 100);
        const colorClass = pct > 90 ? 'bg-rose-500' : pct > 75 ? 'bg-amber-500' : 'bg-emerald-500';
        
        return (
          <div className="flex flex-col justify-center h-full pr-4">
            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-1">
              <span>{p.data.occupied} / {p.data.seats} Seats</span>
              <span>{pct}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className={`h-full ${colorClass}`} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
          </div>
        );
      }
    },
    { 
      headerName: 'Status', field: 'status', flex: 1, minWidth: 120,
      cellRenderer: (p: ICellRendererParams<Library>) => {
        if (!p.data) return null;
        let colors = 'bg-gray-50 text-gray-700 dark:bg-gray-900/40 dark:text-gray-400 border-gray-200 dark:border-gray-700';
        let dot = 'bg-gray-400';
        
        if (p.data.status === 'Active') {
          colors = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
          dot = 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]';
        } else if (p.data.status === 'Pending') {
          colors = 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
          dot = 'bg-amber-500';
        } else if (p.data.status === 'Suspended' || p.data.status === 'Archived') {
          colors = 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/50';
          dot = 'bg-rose-500';
        }
        
        return (
          <div className="flex items-center h-full">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm border flex items-center gap-1.5 ${colors}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${dot}`}></div> {p.data.status}
            </span>
          </div>
        )
      }
    }
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  if (selectedLibraryId) {
    const lib = libraries.find(l => l.id === selectedLibraryId);
    if (lib) return <LibraryDetailsView library={lib} onBack={() => setSelectedLibraryId(null)} />;
  }

  const renderContent = () => {
    switch (activeMenu) {
      case "Register Library":
        return (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <CreateLibraryForm />
          </div>
        );
        
      case "Verification Queue":
      case "Global Insights":
        return (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-gray-50/30 dark:bg-[#0D1F3C]/20 animate-in zoom-in-95 duration-500 min-h-[400px]">
            <div className="p-5 bg-gray-100 dark:bg-gray-800 rounded-full mb-6 shadow-inner">
               {activeMenu === "Verification Queue" ? <ShieldAlert size={48} className="text-gray-400" /> : <PieChart size={48} className="text-gray-400" />}
            </div>
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">{activeMenu}</h4>
            <p className="text-gray-500 font-medium max-w-lg mx-auto">
              This module allows you to verify new institutional signups or view aggregate platform analytics across all tenants.
            </p>
          </div>
        )

      case "Libraries Directory":
      default:
        return (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 flex flex-col min-h-0 h-full">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
              {[
                { title: 'Total Registered', value: libraries.length.toString(), icon: <Building size={24} />, color: 'blue' },
                { title: 'Active Tenants', value: libraries.filter(l=>l.status==='Active').length.toString(), icon: <ShieldCheck size={24} />, color: 'emerald' },
                { title: 'Total Members', value: '48.2K', icon: <Users size={24} />, color: 'indigo' },
                { title: 'Platform Uptime', value: '99.9%', icon: <Clock size={24} />, color: 'violet' }
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
                  <BarChart3 size={20} className="text-blue-500" /> Platform Tenants
                </h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:text-blue-600 shadow-sm"><Filter size={16} /></button>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search Tenants..." className="pl-9 pr-4 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none shadow-sm" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0">
                  <AgGridReact
                    ref={gridRef}
                    theme={gridTheme}
                    rowData={libraries}
                    columnDefs={colDefs}
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
          <span>Nexus 360</span><span>/</span><span className="text-blue-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Libraries</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm border border-blue-200/50 dark:border-blue-800/50">
                <Building2 size={24} />
              </div>
              Library & Tenant Hub
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Command center for institutional onboarding, verification queues, compliance monitoring, and global platform analytics.</p>
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
