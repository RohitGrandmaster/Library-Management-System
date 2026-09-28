'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { 
  Server, Activity, Cpu, HardDrive, Network, Clock, ShieldCheck, 
  Database, Globe, Lock, Mail, ServerCrash, EyeOff, Search, Filter, 
  Gauge, Cloud, Zap, ShieldAlert, CpuIcon, ActivitySquare
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  { id: "Server Dashboard", icon: Gauge, color: "blue", tabClass: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400", iconClass: "text-blue-600 dark:text-blue-400" },
  { id: "Compute Clusters", icon: Server, color: "indigo", tabClass: "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800/50 dark:text-indigo-400", iconClass: "text-indigo-600 dark:text-indigo-400" },
  { id: "Load Balancers", icon: Network, color: "emerald", tabClass: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400", iconClass: "text-emerald-600 dark:text-emerald-400" },
  { id: "Domains & SSL", icon: Globe, color: "amber", tabClass: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400", iconClass: "text-amber-600 dark:text-amber-400" }
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
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 font-extrabold text-sm shadow-sm border border-gray-200 dark:border-gray-700">
            <Globe size={18} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-extrabold text-gray-900 dark:text-white leading-tight">{p.data?.domain}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{p.data?.type}</p>
          </div>
        </div>
      ),
    },
    { 
      headerName: 'Target / Routing', field: 'target', flex: 1.5, minWidth: 150,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center h-full text-xs font-bold text-gray-700 dark:text-gray-300">
          <Network size={14} className="mr-2 text-indigo-500" /> {p.data?.target}
        </div>
      )
    },
    { 
      headerName: 'SSL Status', field: 'sslStatus', flex: 1.5, minWidth: 180,
      cellRenderer: (p: ICellRendererParams) => {
        let colors = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
        let icon = <Lock size={12} />;
        
        if (p.data?.sslStatus === 'Valid') colors = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
        if (p.data?.sslStatus === 'Expiring') colors = 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
        if (p.data?.sslStatus === 'Invalid') {
          colors = 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/50';
          icon = <ServerCrash size={12} />;
        }
        
        return (
          <div className="flex flex-col justify-center h-full gap-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1.5 border ${colors}`}>
                {icon} {p.data?.sslStatus}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Expires: {p.data?.sslExpiry}</p>
          </div>
        )
      }
    },
    { 
      headerName: 'Health', field: 'status', flex: 1, minWidth: 120,
      cellRenderer: (p: ICellRendererParams) => {
        let dotColor = 'bg-gray-400';
        if (p.data?.status === 'Active') dotColor = 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
        if (p.data?.status === 'Warning') dotColor = 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
        if (p.data?.status === 'Error') dotColor = 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]';
        
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

  const renderContent = () => {
    switch (activeMenu) {
      case "Compute Clusters":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
             <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-indigo-50/50 dark:bg-indigo-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                  <Server size={24} /> Application Servers
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Manage Kubernetes pods, Auto-scaling groups, and raw compute nodes.</p>
              </div>
              <button className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
                + Provision Node
              </button>
            </div>
            
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Core API Cluster', nodes: 4, load: '42%', mem: '64%', status: 'Healthy' },
                { name: 'Web App Frontends', nodes: 6, load: '28%', mem: '45%', status: 'Healthy' },
                { name: 'Background Workers', nodes: 2, load: '89%', mem: '92%', status: 'High Load' }
              ].map((cluster, i) => (
                <div key={i} className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-sm hover:border-indigo-300 transition-all group">
                   <div className="flex justify-between items-start mb-6">
                     <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
                       <Cpu size={24} />
                     </div>
                     <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full border shadow-sm ${
                        cluster.status === 'Healthy' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' 
                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                     }`}>
                       {cluster.status}
                     </span>
                   </div>
                   <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-1">{cluster.name}</h3>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">{cluster.nodes} Active Nodes</p>
                   
                   <div className="space-y-4">
                     <div>
                       <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-1.5">
                         <span>CPU Avg Load</span><span>{cluster.load}</span>
                       </div>
                       <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                         <div className={`h-full ${cluster.status === 'High Load' ? 'bg-amber-500' : 'bg-blue-500'}`} style={{width: cluster.load}}></div>
                       </div>
                     </div>
                     <div>
                       <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-1.5">
                         <span>Memory Usage</span><span>{cluster.mem}</span>
                       </div>
                       <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                         <div className={`h-full ${cluster.status === 'High Load' ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{width: cluster.mem}}></div>
                       </div>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )
        
      case "Domains & SSL":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col flex-1 animate-in fade-in zoom-in-95 duration-300 min-h-[500px]">
             <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-amber-50/50 dark:bg-amber-900/10 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <Globe size={24} /> DNS & SSL Management
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Manage custom domains for tenants and automated Let's Encrypt certificates.</p>
              </div>
              <button className="px-5 py-2.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2">
                + Add Domain
              </button>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0">
                <AgGridReact
                  ref={gridRef}
                  theme={gridTheme}
                  rowData={mockDomains}
                  columnDefs={domainColDefs}
                  rowHeight={64}
                  headerHeight={48}
                  onGridReady={onGridReady}
                />
              </div>
            </div>
          </div>
        )
        
      case "Load Balancers":
        return (
          <div className="border-2 border-dashed border-emerald-300 dark:border-emerald-800/50 rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-emerald-50/30 dark:bg-emerald-900/10 animate-in zoom-in-95 duration-500 min-h-[400px]">
            <div className="p-5 bg-emerald-100 dark:bg-emerald-900/40 rounded-full mb-6 shadow-inner">
              <Network size={48} className="text-emerald-500 dark:text-emerald-400" />
            </div>
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">Traffic Routing & Load Balancing</h4>
            <p className="text-gray-500 font-medium max-w-lg mx-auto">
              Configure AWS ALB/NLB rules, WAF integrations, and geo-routing policies.
            </p>
          </div>
        )

      case "Server Dashboard":
      default:
        return (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 flex flex-col min-h-0 h-full">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
              {[
                { title: 'Global Uptime', value: '99.99%', icon: <ActivitySquare size={24} />, color: 'emerald', detail: 'Last 30 Days' },
                { title: 'Total Compute', value: '42 vCPUs', icon: <CpuIcon size={24} />, color: 'blue', detail: 'Across 12 Nodes' },
                { title: 'Bandwidth (24h)', value: '1.2 TB', icon: <Activity size={24} />, color: 'indigo', detail: 'In/Out Traffic' },
                { title: 'SSL Warnings', value: '1', icon: <ShieldAlert size={24} />, color: 'amber', detail: '1 Domain expiring soon' }
              ].map(stat => (
                <div key={stat.title} className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between group overflow-hidden relative">
                   <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 dark:bg-${stat.color}-500/10 rounded-bl-full transition-transform group-hover:scale-110`}></div>
                  <div className="relative z-10">
                    <h3 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">{stat.title}</h3>
                    <div className="text-3xl font-black text-gray-900 dark:text-white leading-none">{stat.value}</div>
                    <p className="text-[10px] font-bold text-gray-400 mt-2">{stat.detail}</p>
                  </div>
                  <div className={`relative z-10 w-14 h-14 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 flex items-center justify-center border border-${stat.color}-100 dark:border-${stat.color}-800/50 shadow-sm`}>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-[400px]">
                <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Cloud className="text-blue-500" size={18} /> Cloud Resources
                </h3>
                <div className="flex-1 bg-gray-50 dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center p-6 text-center shadow-inner">
                   <Server size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                   <p className="text-sm font-bold text-gray-500">Infrastructure topology graph will load here</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-[400px]">
                <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Globe className="text-blue-500" size={18} /> Edge Locations & CDN
                </h3>
                <div className="flex-1 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-900/30 flex flex-col items-center justify-center p-6 text-center">
                   <Network size={48} className="text-blue-300 dark:text-blue-900/50 mb-4" />
                   <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Global traffic routing heat map</p>
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
          <span>Nexus 360</span><span>/</span><span className="text-blue-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Server & Infra</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm border border-blue-200/50 dark:border-blue-800/50">
                <Server size={24} />
              </div>
              Platform Infrastructure
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Manage cloud servers, review application health, monitor load balancing, and administer custom tenant domains.</p>
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
