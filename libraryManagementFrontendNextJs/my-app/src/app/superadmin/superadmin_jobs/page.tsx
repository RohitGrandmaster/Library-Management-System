'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import JobDetailsView from './JobDetailsView';
import { 
  Activity, Search, Filter, Settings2, CheckCircle, AlertTriangle, 
  RefreshCw, Clock, Play, Server, ServerCog
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  "Job Dashboard", "Pending Jobs", "Running Jobs", "Completed Jobs", 
  "Failed Jobs", "Scheduled Jobs", "Recurring Jobs", "Job History", 
  "Retry Queue", "Workers", "Cron / Scheduler"
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
  const [workerCount, setWorkerCount] = useState(12);
  const gridRef = useRef<AgGridReact>(null);

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'Background Job', field: 'name', flex: 2, minWidth: 260,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-3 h-full cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-900/40 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 font-extrabold text-sm group-hover:scale-110 group-hover:bg-fuchsia-600 group-hover:text-white transition-all shadow-sm">
            <Settings2 size={18} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-bold text-gray-900 dark:text-white group-hover:text-fuchsia-600 transition-colors leading-tight">{p.data?.name}</p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">ID: {p.data?.id} • {p.data?.type}</p>
          </div>
        </div>
      ),
    },
    { 
      headerName: 'Queue Assignment', field: 'queue', flex: 1.2, minWidth: 160,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-2 h-full">
          <ServerCog size={14} className="text-gray-400" />
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{p.data?.queue}</span>
        </div>
      )
    },
    { 
      headerName: 'Progress / Execution', field: 'progress', flex: 1.5, minWidth: 180,
      cellRenderer: (p: ICellRendererParams) => {
        let barColor = 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]';
        if (p.data?.status === 'Completed') barColor = 'bg-emerald-500';
        if (p.data?.status === 'Failed') barColor = 'bg-red-500';
        if (p.data?.status === 'Scheduled' || p.data?.status === 'Pending') barColor = 'bg-yellow-500';

        return (
          <div className="flex flex-col justify-center h-full gap-1.5 w-full pr-4">
            <div className="flex justify-between text-[11px] font-bold text-gray-700 dark:text-gray-300">
              <span>{p.data?.status}</span>
              <span>{p.data?.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
              <div className={`h-full transition-all duration-500 ease-out ${barColor}`} style={{ width: `${p.data?.progress}%` }} />
            </div>
          </div>
        )
      }
    },
    { 
      headerName: 'Status', field: 'status', flex: 1, minWidth: 140,
      cellRenderer: (p: ICellRendererParams) => {
        let colors = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
        let icon = <Clock size={12} />;
        
        if (p.data?.status === 'Completed') {
          colors = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
          icon = <CheckCircle size={12} />;
        } else if (p.data?.status === 'Failed') {
          colors = 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800';
          icon = <AlertTriangle size={12} />;
        } else if (p.data?.status === 'Running') {
          colors = 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800';
          icon = <RefreshCw size={12} className="animate-spin" />;
        } else {
          colors = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
          icon = <Clock size={12} />;
        }
        
        return (
          <div className="flex items-center h-full">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm border flex items-center gap-1.5 ${colors}`}>
              {icon} {p.data?.status}
            </span>
          </div>
        )
      }
    },
    { 
      headerName: 'Next Run / Detail', field: 'nextRun', flex: 1.5, minWidth: 180,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center h-full text-xs font-semibold text-gray-500 dark:text-gray-400">
          {p.data?.nextRun}
        </div>
      )
    }
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  const getFilteredJobs = () => {
    if (activeMenu === "Pending Jobs") return mockJobs.filter(p => p.status === 'Pending');
    if (activeMenu === "Running Jobs") return mockJobs.filter(p => p.status === 'Running');
    if (activeMenu === "Completed Jobs") return mockJobs.filter(p => p.status === 'Completed');
    if (activeMenu === "Failed Jobs" || activeMenu === "Retry Queue") return mockJobs.filter(p => p.status === 'Failed');
    if (activeMenu === "Scheduled Jobs" || activeMenu === "Recurring Jobs" || activeMenu === "Cron / Scheduler") return mockJobs.filter(p => p.status === 'Scheduled');
    return mockJobs; // Default to Dashboard/All
  };

  if (selectedJob) {
    return <JobDetailsView job={selectedJob} onBack={() => setSelectedJob(null)} />;
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full flex-1 animate-in fade-in zoom-in-95 duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Nexus 360</span><span>/</span><span className="text-fuchsia-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Jobs & Scheduler</span>
          </div>
          <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-xl shadow-sm border border-fuchsia-200/50 dark:border-fuchsia-800/50">
              <Activity size={28} className="text-fuchsia-600 dark:text-fuchsia-400" />
            </div>
            Background Jobs & Scheduler
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-2xl">Monitor asynchronous workers, cron jobs, email queues, and automated background tasks running across the platform.</p>
        </div>
        
        {/* Quick Worker Control */}
        <div className="flex items-center gap-3 bg-white dark:bg-[#0F172A] p-2 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="px-3 border-r border-gray-100 dark:border-gray-800">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Active Workers</p>
            <p className="text-sm font-extrabold text-emerald-600">{workerCount} / 16</p>
          </div>
          <button onClick={() => setWorkerCount(n => Math.min(16, n + 1))} disabled={workerCount >= 16} className="flex items-center gap-1.5 px-3 py-1.5 bg-fuchsia-50 hover:bg-fuchsia-100 dark:bg-fuchsia-900/20 dark:hover:bg-fuchsia-900/40 text-fuchsia-700 dark:text-fuchsia-400 text-xs font-bold rounded-lg transition-colors disabled:opacity-50">
            <Play size={12} /> Spawn Worker
          </button>
        </div>
      </div>

      {/* Sub-menu Tabs */}
      <div className="flex gap-1.5 pb-2 pt-1 px-1 overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {SUB_MENUS.map(menu => (
          <button
            key={menu}
            onClick={() => setActiveMenu(menu)}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all shadow-sm flex-1 ${
              activeMenu === menu 
                ? 'bg-fuchsia-600 text-white shadow-fuchsia-600/20 scale-105' 
                : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-fuchsia-50 dark:hover:bg-[#1E293B] hover:text-fuchsia-600 hover:border-fuchsia-200'
            }`}
          >
            {menu}
          </button>
        ))}
      </div>

      {/* Main Content Area based on Tab */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col flex-1">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-[#0D1F3C]">
          <div className="relative max-w-md w-full">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search jobs by ID, name, or queue..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/10 transition-all shadow-sm"
              onChange={e => gridRef.current?.api.setGridOption('quickFilterText', e.target.value)}
            />
          </div>
          <button onClick={() => gridRef.current?.api.setFilterModel(null)} className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all hover:border-gray-400">
            <Filter size={16} className="text-gray-500" /> Reset Filters
          </button>
        </div>
        
        <div className="flex-1 w-full min-h-0 relative">
          <AgGridReact
            ref={gridRef}
            theme={gridTheme}
            rowData={getFilteredJobs()}
            columnDefs={colDefs}
            rowHeight={72}
            headerHeight={52}
            onGridReady={onGridReady}
            onRowClicked={p => setSelectedJob(p.data)}
            pagination={true}
            paginationPageSize={15}
            rowClass="cursor-pointer hover:bg-fuchsia-50/50 dark:hover:bg-fuchsia-900/10 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
