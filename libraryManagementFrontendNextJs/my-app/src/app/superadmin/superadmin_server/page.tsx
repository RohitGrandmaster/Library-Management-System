'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { 
  Server, Activity, Cpu, HardDrive, Network, Clock, ShieldCheck, 
  Database, Globe, Lock, Mail, ServerCrash, EyeOff, Search, Filter 
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  "Server Dashboard", "Servers", "Application Health", "Database Health", 
  "Storage", "Cache", "Queue Services", "Web Services", "Worker Services", 
  "Scheduler Services", "File Storage", "CDN", "Domains", "SSL / Certificates", 
  "Service Configuration"
];

// Mock Data for Domains
const mockDomains = [
  { id: '1', domain: 'app.nexus360.com', type: 'Platform Core', target: 'Load Balancer A', sslStatus: 'Valid', sslExpiry: '120 Days', status: 'Active' },
  { id: '2', domain: 'api.nexus360.com', type: 'API Gateway', target: 'API Cluster', sslStatus: 'Valid', sslExpiry: '120 Days', status: 'Active' },
  { id: '3', domain: 'library.studynest.in', type: 'Custom Tenant', target: 'Tenant Router', sslStatus: 'Valid', sslExpiry: '45 Days', status: 'Active' },
  { id: '4', domain: 'opac.readersden.org', type: 'Custom Tenant', target: 'Tenant Router', sslStatus: 'Expiring', sslExpiry: '5 Days', status: 'Warning' },
  { id: '5', domain: 'assets.nexus360.com', type: 'CDN', target: 'CloudFront', sslStatus: 'Invalid', sslExpiry: 'Expired', status: 'Error' }
];

export default function ServerInfrastructurePage() {
  const [activeMenu, setActiveMenu] = useState("Server Dashboard");
  const gridRef = useRef<AgGridReact>(null);

  const domainColDefs = useMemo<any[]>(() => [
    {
      headerName: 'Domain Name', field: 'domain', flex: 2, minWidth: 250,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-3 h-full group">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-extrabold text-sm shadow-sm">
            <Globe size={18} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-bold text-gray-900 dark:text-white leading-tight">{p.data?.domain}</p>
            <p className="text-[11px] text-gray-500 font-semibold">{p.data?.type}</p>
          </div>
        </div>
      ),
    },
    { 
      headerName: 'Target / Routing', field: 'target', flex: 1.5, minWidth: 150,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center h-full text-sm font-bold text-gray-700 dark:text-gray-300">
          <Network size={14} className="mr-2 text-slate-400" /> {p.data?.target}
        </div>
      )
    },
    { 
      headerName: 'SSL Status', field: 'sslStatus', flex: 1.5, minWidth: 180,
      cellRenderer: (p: ICellRendererParams) => {
        let colors = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        let icon = <Lock size={12} />;
        
        if (p.data?.sslStatus === 'Valid') colors = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400';
        if (p.data?.sslStatus === 'Expiring') colors = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400';
        if (p.data?.sslStatus === 'Invalid') {
          colors = 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
          icon = <ServerCrash size={12} />;
        }
        
        return (
          <div className="flex flex-col justify-center h-full gap-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold shadow-sm flex items-center gap-1.5 ${colors}`}>
                {icon} {p.data?.sslStatus}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-semibold">Expires: {p.data?.sslExpiry}</p>
          </div>
        )
      }
    },
    { 
      headerName: 'Platform Status', field: 'status', flex: 1, minWidth: 120,
      cellRenderer: (p: ICellRendererParams) => {
        let dotColor = 'bg-slate-400';
        if (p.data?.status === 'Active') dotColor = 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
        if (p.data?.status === 'Warning') dotColor = 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]';
        if (p.data?.status === 'Error') dotColor = 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
        
        return (
          <div className="flex items-center h-full gap-2">
            <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{p.data?.status}</span>
          </div>
        )
      }
    }
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  return (
    <div className="flex flex-col gap-6 w-full h-full flex-1 animate-in fade-in zoom-in-95 duration-300">
      {/* Page Header */}
      <div>
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-emerald-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Server & Infrastructure</span>
        </div>
        <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl shadow-sm border border-emerald-200/50 dark:border-emerald-800/50">
            <Server size={28} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          Infrastructure Control Panel
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-2xl">Monitor real-time server metrics, manage custom domains, SSL certificates, and core platform services.</p>
      </div>

      {/* Sub-menu Tabs */}
      <div className="flex gap-1.5 pb-2 pt-1 px-1 overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {SUB_MENUS.map(menu => (
          <button
            key={menu}
            onClick={() => setActiveMenu(menu)}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all shadow-sm flex-1 ${
              activeMenu === menu 
                ? 'bg-slate-800 dark:bg-emerald-600 text-white shadow-lg scale-105' 
                : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-[#1E293B] hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            {menu}
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
      <div className="w-full">
        {activeMenu === "Server Dashboard" && (
          <div className="space-y-6">
            {/* Real-time Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[
                { title: 'CPU Utilization', value: '42%', icon: <Cpu size={24} />, color: 'emerald', detail: '4 Cores Active / Load: 1.24' },
                { title: 'Memory (RAM)', value: '18.4 GB', icon: <Activity size={24} />, color: 'blue', detail: 'Total 32 GB / 57% Used' },
                { title: 'Storage (Disk)', value: '840 GB', icon: <HardDrive size={24} />, color: 'purple', detail: 'Total 2 TB / 42% Used' },
                { title: 'Network I/O', value: '1.2 Gbps', icon: <Network size={24} />, color: 'orange', detail: 'In: 800Mbps / Out: 400Mbps' }
              ].map(stat => (
                <div key={stat.title} className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 animate-in fade-in">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                      {stat.icon}
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
                    </div>
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.title}</h3>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{stat.value}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{stat.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Uptime & Connection Overview */}
              <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Clock className="text-slate-400" size={18} /> System Uptime & Connections
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      <span>System Uptime</span>
                      <span className="text-emerald-600">99.99% (45 days, 12 hrs)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[99%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      <span>Active Connections (Web/API)</span>
                      <span className="text-blue-600">8,432 clients</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[60%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      <span>Process Health (Docker Containers)</span>
                      <span className="text-purple-600">24 / 24 Healthy</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-[100%]" />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/50 rounded-xl flex items-start gap-3">
                    <ShieldCheck size={18} className="text-yellow-600 dark:text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-yellow-800 dark:text-yellow-500">Security / Secrets Manager</p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-600/80 mt-1 font-medium flex items-center gap-1.5"><EyeOff size={12} /> Environment variables and connection strings are masked for security reasons.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual Service Statuses */}
              <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Activity className="text-slate-400" size={18} /> Microservice Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Web Server (Next.js)', status: 'Operational', icon: <Globe size={16} /> },
                    { label: 'API Gateway', status: 'Operational', icon: <Network size={16} /> },
                    { label: 'Database (PostgreSQL)', status: 'Operational', icon: <Database size={16} /> },
                    { label: 'Queue (Redis)', status: 'Operational', icon: <Database size={16} /> },
                    { label: 'Background Workers', status: 'Operational', icon: <Activity size={16} /> },
                    { label: 'Scheduler (Cron)', status: 'Operational', icon: <Clock size={16} /> },
                    { label: 'Email Service (SMTP)', status: 'Operational', icon: <Mail size={16} /> },
                    { label: 'Storage Service (S3)', status: 'Operational', icon: <HardDrive size={16} /> },
                  ].map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1E293B] rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                        <span className="text-slate-400">{service.icon}</span> {service.label}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Domains & SSL Table View */}
        {(activeMenu === "Domains" || activeMenu === "SSL / Certificates") && (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col animate-in fade-in">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-[#0D1F3C]">
              <div className="relative max-w-md w-full">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search domains or SSL targets..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                  onChange={e => gridRef.current?.api.setGridOption('quickFilterText', e.target.value)}
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all hover:border-gray-400">
                <Filter size={16} className="text-gray-500" /> Domain Filters
              </button>
            </div>
            
            <div className="h-[600px] w-full">
              <AgGridReact
                ref={gridRef}
                theme={gridTheme}
                rowData={mockDomains}
                columnDefs={domainColDefs}
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
        {activeMenu !== "Server Dashboard" && activeMenu !== "Domains" && activeMenu !== "SSL / Certificates" && (
          <div className="bg-white dark:bg-[#0F172A] p-16 rounded-2xl shadow-lg border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center animate-in fade-in">
            <Server size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{activeMenu} Settings</h3>
            <p className="text-sm font-medium text-gray-500 max-w-md">Configuration panel for {activeMenu.toLowerCase()} is isolated. Production environment variables and secrets are hidden for security compliance.</p>
          </div>
        )}
      </div>
    </div>
  );
}
