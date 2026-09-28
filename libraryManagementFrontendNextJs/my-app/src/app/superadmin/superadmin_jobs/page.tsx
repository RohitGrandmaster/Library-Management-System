'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import JobDetailsView from './JobDetailsView';
import { 
  Activity, Search, Filter, Settings2, CheckCircle, AlertTriangle, 
  RefreshCw, Clock, Play, Server, ServerCog, ListChecks, PlayCircle, 
  PauseCircle, RotateCcw, Box, HardDrive
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  { id: "Job Dashboard", icon: ListChecks, color: "blue", tabClass: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400", iconClass: "text-blue-600 dark:text-blue-400" },
  { id: "Worker Nodes", icon: Server, color: "emerald", tabClass: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400", iconClass: "text-emerald-600 dark:text-emerald-400" },
  { id: "Cron / Scheduler", icon: Clock, color: "fuchsia", tabClass: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700 dark:bg-fuchsia-900/20 dark:border-fuchsia-800/50 dark:text-fuchsia-400", iconClass: "text-fuchsia-600 dark:text-fuchsia-400" },
  { id: "Retry Queue", icon: RotateCcw, color: "amber", tabClass: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400", iconClass: "text-amber-600 dark:text-amber-400" }
];

// Mock Data
const mockJobs = [
  { id: '1001', name: 'Email Sending (Bulk)', type: 'Communication', status: 'Running', queue: 'High Priority', progress: 45, nextRun: 'N/A' },
  { id: '1002', name: 'Automated DB Backup', type: 'Infrastructure', status: 'Completed', queue: 'System', progress: 100, nextRun: 'Tomorrow, 02:00 AM' },
  { id: '1003', name: 'Overdue Notifications', type: 'Cron', status: 'Failed', queue: 'Default', progress: 12, nextRun: 'In 5 mins (Retry 1/3)' },
  { id: '1004', name: 'Subscription Expiry Check', type: 'Scheduler', status: 'Scheduled', queue: 'System', progress: 0, nextRun: 'Today, 11:59 PM' },
  { id: '1005', name: 'WhatsApp Sending (Alerts)', type: 'Communication', status: 'Pending', queue: 'High Priority', progress: 0, nextRun: 'Waiting for worker' },
  { id: '1006', name: 'Monthly Report Generation', type: 'Analytics', status: 'Completed', queue: 'Background', progress: 100, nextRun: 'Nov 1, 00:00 AM' },
  { id: '1007', name: 'Data Cleanup (Soft Deletes)', type: 'System', status: 'Running', queue: 'Low Priority', progress: 89, nextRun: 'N/A' },
  { id: '1008', name: 'Membership Reminders', type: 'Communication', status: 'Failed', queue: 'Default', progress: 0, nextRun: 'Stopped (Max Retries)' },
  { id: '1009', name: 'Data Sync (Elasticsearch)', type: 'Infrastructure', status: 'Running', queue: 'System', progress: 34, nextRun: 'N/A' },
];

export default function JobsPage() {
  const [activeMenu, setActiveMenu] = useState("Job Dashboard");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const gridRef = useRef<AgGridReact>(null);

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'Background Job', field: 'name', flex: 2, minWidth: 260,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-3 h-full cursor-pointer group" onClick={() => setSelectedJob(p.data)}>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-extrabold text-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
            <Settings2 size={18} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-extrabold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors leading-tight">{p.data?.name}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">ID: {p.data?.id} • {p.data?.type}</p>
          </div>
        </div>
      ),
    },
    { 
      headerName: 'Queue Assignment', field: 'queue', flex: 1.2, minWidth: 160,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-2 h-full">
          <ServerCog size={16} className="text-gray-400" />
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{p.data?.queue}</span>
        </div>
      )
    },
    { 
      headerName: 'Progress / Execution', field: 'progress', flex: 1.5, minWidth: 180,
      cellRenderer: (p: ICellRendererParams) => {
        let barColor = 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]';
        if (p.data?.status === 'Completed') barColor = 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
        if (p.data?.status === 'Failed') barColor = 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
        if (p.data?.status === 'Scheduled' || p.data?.status === 'Pending') barColor = 'bg-yellow-500';

        return (
          <div className="flex flex-col justify-center h-full gap-1.5 w-full pr-4">
            <div className="flex justify-between text-[11px] font-bold text-gray-700 dark:text-gray-300">
              <span className="uppercase tracking-wider">{p.data?.status}</span>
              <span>{p.data?.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
              <div className={`h-full transition-all duration-500 ease-out ${barColor}`} style={{ width: `${p.data?.progress}%` }} />
            </div>
          </div>
        )
      }
    },
    { 
      headerName: 'Timeline', field: 'nextRun', flex: 1.2, minWidth: 160,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex flex-col justify-center h-full text-xs font-bold text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5"><Clock size={12} className="text-gray-400"/> {p.value}</span>
        </div>
      )
    },
    { 
      headerName: 'Action', field: 'id', flex: 1, minWidth: 140, sortable: false, filter: false,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-2 h-full">
          {p.data?.status === 'Running' ? (
            <button className="p-2 text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors border border-yellow-200"><PauseCircle size={16}/></button>
          ) : (
            <button className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"><PlayCircle size={16}/></button>
          )}
          <button onClick={() => setSelectedJob(p.data)} className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
            Inspect
          </button>
        </div>
      )
    }
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  if (selectedJob) {
    return <JobDetailsView job={selectedJob} onBack={() => setSelectedJob(null)} />;
  }

  const renderContent = () => {
    switch (activeMenu) {
      case "Worker Nodes":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-emerald-50/50 dark:bg-emerald-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <Server size={24} /> Worker Pool Allocation
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Manage processing capacity and container limits.</p>
              </div>
              <button className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
                + Spin up Worker
              </button>
            </div>
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {['High Priority Queue (12)', 'Default Queue (8)', 'Background Jobs (4)'].map((pool, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-sm hover:border-emerald-300 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl">
                      <Box size={24} />
                    </div>
                    <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">{pool}</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                        <span>CPU Load</span><span>{40 + (idx * 15)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{width:`${40 + (idx * 15)}%`}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                        <span>RAM Usage</span><span>{30 + (idx * 20)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{width:`${30 + (idx * 20)}%`}}></div></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "Cron / Scheduler":
      case "Retry Queue":
        return (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-gray-50/30 dark:bg-[#0D1F3C]/20 animate-in zoom-in-95 duration-500 min-h-[400px]">
            <div className="p-5 bg-gray-100 dark:bg-gray-800 rounded-full mb-6 shadow-inner">
              <HardDrive size={48} className="text-gray-400" />
            </div>
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">{activeMenu} Settings</h4>
            <p className="text-gray-500 font-medium max-w-lg mx-auto">
              UI for managing schedules and dead-letter queues.
            </p>
          </div>
        );

      case "Job Dashboard":
      default:
        return (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 flex flex-col min-h-0 h-full">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
              {[
                { title: 'Currently Running', value: '18', icon: <RefreshCw size={24} className="animate-spin" />, color: 'blue' },
                { title: 'Pending / Queued', value: '45', icon: <Clock size={24} />, color: 'amber' },
                { title: 'Completed (24h)', value: '12,842', icon: <CheckCircle size={24} />, color: 'emerald' },
                { title: 'Failed / Retrying', value: '3', icon: <AlertTriangle size={24} />, color: 'red' }
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
                  <Activity size={20} className="text-blue-500" /> Active Job Queue
                </h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:text-blue-600 shadow-sm"><Filter size={16} /></button>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search Jobs..." className="pl-9 pr-4 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none shadow-sm" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0">
                  <AgGridReact
                    ref={gridRef}
                    theme={gridTheme}
                    rowData={mockJobs}
                    columnDefs={colDefs}
                    rowHeight={72}
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
          <span>Nexus 360</span><span>/</span><span className="text-blue-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Jobs & Scheduler</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm border border-blue-200/50 dark:border-blue-800/50">
                <ListChecks size={24} />
              </div>
              Background Jobs & Task Scheduler
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Monitor asynchronous workers, orchestrate automated CRON tasks, and inspect job payloads in real-time.</p>
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
