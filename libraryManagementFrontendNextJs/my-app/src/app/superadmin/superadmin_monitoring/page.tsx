'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import { 
  LineChart, Activity, Cpu, HardDrive, ShieldAlert, 
  Database, Network, Cloud, Lock, ServerCrash, 
  CheckCircle, Clock, Users, ArrowUpRight, BellRing, BellOff, XCircle, Search,
  Radio, ShieldCheck, Zap
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  { id: "Active Alerts Feed", icon: BellRing, color: "rose", tabClass: "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-400", iconClass: "text-rose-600 dark:text-rose-400" },
  { id: "Infrastructure Health", icon: ServerCrash, color: "indigo", tabClass: "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800/50 dark:text-indigo-400", iconClass: "text-indigo-600 dark:text-indigo-400" },
  { id: "API & Performance", icon: Zap, color: "sky", tabClass: "bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-900/20 dark:border-sky-800/50 dark:text-sky-400", iconClass: "text-sky-600 dark:text-sky-400" },
  { id: "Security Monitoring", icon: ShieldCheck, color: "emerald", tabClass: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400", iconClass: "text-emerald-600 dark:text-emerald-400" },
  { id: "Alert Rules & Logic", icon: Activity, color: "amber", tabClass: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400", iconClass: "text-amber-600 dark:text-amber-400" }
];

// Mock Data matching the user's specific alert requirements
const activeAlerts = [
  { id: 'ALT-991', title: 'Server CPU High', desc: 'Worker node 3 CPU utilization is at 95% for 15+ mins.', severity: 'Critical', source: 'Infrastructure', time: '5 mins ago', status: 'New', icon: Cpu },
  { id: 'ALT-992', title: 'RAM High', desc: 'API Gateway cluster memory usage exceeding 88%.', severity: 'High', source: 'Infrastructure', time: '12 mins ago', status: 'Acknowledged', assignee: 'Priya S.', icon: Activity },
  { id: 'ALT-993', title: 'Disk Almost Full', desc: 'Volume /data on DB-Replica-2 has less than 10% space remaining.', severity: 'Critical', source: 'Infrastructure', time: '30 mins ago', status: 'New', icon: HardDrive },
  { id: 'ALT-994', title: 'Database Unavailable', desc: 'Connection timeouts on tenant isolated cluster #B.', severity: 'Critical', source: 'Infrastructure', time: '1 hour ago', status: 'Escalated', assignee: 'Rohit S.', icon: Database },
  { id: 'ALT-995', title: 'API Errors High', desc: 'Spike in 5xx errors on external webhook endpoints.', severity: 'High', source: 'API & Performance', time: '2 hours ago', status: 'Acknowledged', assignee: 'System', icon: Network },
  { id: 'ALT-996', title: 'Backup Failed', desc: 'Daily automated S3 snapshot failed for StudyNest library.', severity: 'High', source: 'Infrastructure', time: 'Yesterday', status: 'New', icon: Cloud },
  { id: 'ALT-997', title: 'Queue Stuck', desc: 'Email sending worker queue has not processed items for 1 hour.', severity: 'Medium', source: 'API & Performance', time: 'Yesterday', status: 'New', icon: Clock },
  { id: 'ALT-998', title: 'SSL Expiry', desc: 'Custom domain ssl cert for opac.readersden.org expires in 3 days.', severity: 'Medium', source: 'Security Monitoring', time: 'Yesterday', status: 'Snoozed', icon: Lock },
  { id: 'ALT-999', title: 'Storage Limit Reached', desc: 'Tenant LibroHub exceeded their 50GB file storage limit.', severity: 'Low', source: 'Infrastructure', time: '2 days ago', status: 'New', icon: HardDrive },
  { id: 'ALT-1000', title: 'Suspicious Login', desc: 'Admin login from unrecognized IP address outside operational region.', severity: 'High', source: 'Security Monitoring', time: '3 days ago', status: 'Resolved', icon: ShieldAlert },
];

export default function MonitoringPage() {
  const [activeMenu, setActiveMenu] = useState("Active Alerts Feed");
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);
  const [alerts, setAlerts] = useState(activeAlerts);

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'Critical': return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/40';
      case 'High': return 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800/40';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/40';
      default: return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/40';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New': return <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold text-rose-600 dark:text-rose-400"><BellRing size={12} className="animate-pulse" /> New Alert</span>;
      case 'Acknowledged': return <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold text-blue-600 dark:text-blue-400"><CheckCircle size={12} /> Acknowledged</span>;
      case 'Escalated': return <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold text-orange-600 dark:text-orange-400"><ArrowUpRight size={12} /> Escalated</span>;
      case 'Snoozed': return <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold text-gray-500 dark:text-gray-400"><BellOff size={12} /> Snoozed</span>;
      case 'Resolved': return <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold text-emerald-600 dark:text-emerald-400"><CheckCircle size={12} /> Resolved</span>;
      default: return null;
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "Infrastructure Health":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 p-8 flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
               <div>
                 <h2 className="text-xl font-extrabold text-indigo-700 dark:text-indigo-400 flex items-center gap-2"><ServerCrash size={24}/> Server & Database Infrastructure</h2>
                 <p className="text-sm text-gray-500 font-medium mt-1">Live metrics from Kubernetes clusters and RDS databases.</p>
               </div>
               <span className="flex items-center gap-2 text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute"></span><span className="w-2 h-2 rounded-full bg-emerald-500 relative z-10"></span> Live Monitoring Active</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="bg-gray-50 dark:bg-[#1E293B] rounded-2xl p-6 border border-gray-200 dark:border-gray-700 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl"></div>
                 <div className="flex items-center gap-3 mb-4 text-sky-600 dark:text-sky-400">
                   <Cpu size={24} /> <h3 className="font-extrabold uppercase tracking-wider text-xs">CPU Usage</h3>
                 </div>
                 <p className="text-4xl font-black text-gray-900 dark:text-white">62<span className="text-xl text-gray-500 font-bold">%</span></p>
                 <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-4 overflow-hidden"><div className="bg-sky-500 h-full w-[62%]"></div></div>
               </div>

               <div className="bg-gray-50 dark:bg-[#1E293B] rounded-2xl p-6 border border-gray-200 dark:border-gray-700 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl"></div>
                 <div className="flex items-center gap-3 mb-4 text-rose-600 dark:text-rose-400">
                   <Activity size={24} /> <h3 className="font-extrabold uppercase tracking-wider text-xs">Memory (RAM)</h3>
                 </div>
                 <p className="text-4xl font-black text-gray-900 dark:text-white">88<span className="text-xl text-gray-500 font-bold">%</span></p>
                 <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-4 overflow-hidden"><div className="bg-rose-500 h-full w-[88%]"></div></div>
               </div>

               <div className="bg-gray-50 dark:bg-[#1E293B] rounded-2xl p-6 border border-gray-200 dark:border-gray-700 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
                 <div className="flex items-center gap-3 mb-4 text-amber-600 dark:text-amber-400">
                   <Database size={24} /> <h3 className="font-extrabold uppercase tracking-wider text-xs">DB Connections</h3>
                 </div>
                 <p className="text-4xl font-black text-gray-900 dark:text-white">4,210</p>
                 <p className="text-xs font-bold text-gray-500 mt-2 text-right">Limit: 10,000</p>
               </div>
            </div>

            <div className="flex-1 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1E293B]/50 flex items-center justify-center">
              <p className="text-gray-400 font-bold flex flex-col items-center gap-3">
                <LineChart size={40} className="text-indigo-300 dark:text-indigo-900" />
                Live Telemetry Graph Area
              </p>
            </div>
          </div>
        );

      case "API & Performance":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 p-8 flex flex-col items-center justify-center min-h-[500px]">
             <div className="w-20 h-20 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-full flex items-center justify-center mb-6 shadow-sm border border-sky-200 dark:border-sky-800">
               <Zap size={40} />
             </div>
             <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">API & App Performance</h2>
             <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 text-center font-medium">Trace requests, track latency bottlenecks, and monitor background queue delays.</p>
             <div className="w-full flex-1 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1E293B]/50 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-400">APM Waterfall Visualization Area</span>
             </div>
          </div>
        );

      case "Security Monitoring":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 p-8 flex flex-col items-center justify-center min-h-[500px]">
             <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-200 dark:border-emerald-800">
               <ShieldCheck size={40} />
             </div>
             <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Security Perimeter Secure</h2>
             <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 text-center font-medium">Monitoring brute-force attempts, unauthorized geography access, and WAF rules.</p>
             <div className="flex gap-4 w-full max-w-2xl">
               <div className="flex-1 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1E293B]">
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Blocked IPs (24H)</span>
                 <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">1,204</p>
               </div>
               <div className="flex-1 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1E293B]">
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">WAF Violations</span>
                 <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">34</p>
               </div>
             </div>
          </div>
        );

      case "Alert Rules & Logic":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col min-h-[500px]">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-amber-50/50 dark:bg-amber-900/10 flex justify-between items-center">
               <div>
                 <h2 className="text-xl font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-2"><Activity size={24}/> Alert Evaluation Rules</h2>
                 <p className="text-sm text-gray-500 font-medium mt-1">Configure thresholds that trigger PagerDuty or email notifications.</p>
               </div>
               <button className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2">
                 + Add New Rule
               </button>
            </div>
            <div className="flex-1 p-8 bg-gray-50 dark:bg-[#0D1F3C]/30 flex flex-col items-center justify-center border-dashed border-2 border-transparent">
              <Database size={40} className="text-amber-300 dark:text-amber-900/50 mb-4" />
              <p className="text-gray-400 font-bold">Rule Engine UI Area</p>
            </div>
          </div>
        );

      case "Active Alerts Feed":
      default:
        const filteredAlerts = alerts.filter(a => activeMenu === "Active Alerts Feed" || a.source === activeMenu);
        return (
          <div className="flex flex-col xl:flex-row gap-6 w-full animate-in fade-in zoom-in-95 duration-300 h-full">
            
            {/* Active Alerts Feed (PagerDuty Style) */}
            <div className="flex-1 bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col flex-1 h-full min-h-[500px]">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-rose-50/50 dark:bg-rose-900/10 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    <Radio size={24} className="text-rose-500" /> Active Alert Stream
                  </h3>
                  <p className="text-sm font-medium text-gray-500 mt-1">Real-time infrastructure and security incidents.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setAlerts(items => items.map(a => a.status === "Resolved" ? a : { ...a, status: "Acknowledged", assignee: a.assignee || "Super Admin" }))} className="px-4 py-2 bg-white border border-gray-200 dark:bg-[#1E293B] dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold shadow-sm hover:text-rose-600 hover:border-rose-300 transition-colors">
                    Acknowledge All
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                {filteredAlerts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle size={40} />
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">All Clear!</p>
                    <p className="text-sm mt-1">No active alerts matching the current view.</p>
                  </div>
                ) : (
                  filteredAlerts.map((alert) => {
                    const isExpanded = expandedAlertId === alert.id;
                    const Icon = alert.icon;
                    return (
                      <div 
                        key={alert.id} 
                        className={`border-b border-gray-100 dark:border-gray-800 transition-colors ${alert.status === 'Resolved' ? 'opacity-60 bg-gray-50 dark:bg-[#0F172A]/50' : 'hover:bg-gray-50 dark:hover:bg-[#1E293B] bg-white dark:bg-[#0F172A]'}`}
                      >
                        <div 
                          onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
                          className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4"
                        >
                          {/* Alert Left Side: Icon & Status */}
                          <div className="flex items-center gap-4 min-w-[200px]">
                            <div className={`p-3 rounded-xl border shadow-sm ${getSeverityColor(alert.severity)}`}>
                              <Icon size={20} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              {getStatusBadge(alert.status)}
                              <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">{alert.source}</span>
                            </div>
                          </div>
                          
                          {/* Alert Middle: Content */}
                          <div className="flex-1">
                            <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">{alert.title}</h4>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{alert.desc}</p>
                          </div>
                          
                          {/* Alert Right: Meta */}
                          <div className="flex flex-col sm:items-end gap-1.5 text-right">
                            <span className="text-[11px] font-extrabold text-gray-400 flex items-center gap-1"><Clock size={12}/> {alert.time}</span>
                            {alert.assignee && (
                              <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800/40">{alert.assignee}</span>
                            )}
                          </div>
                        </div>

                        {/* Expanded Area */}
                        {isExpanded && (
                          <div className="px-5 pb-5 pt-2 animate-in slide-in-from-top-2">
                            <div className="ml-[68px] p-5 bg-gray-50 dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-inner">
                              <h5 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Detailed Diagnostics</h5>
                              <p className="text-sm font-mono text-gray-600 dark:text-gray-400 bg-white dark:bg-[#0F172A] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                {alert.desc}<br/>
                                <span className="text-rose-500 mt-2 block">Trace ID: x-req-{Math.random().toString(36).substring(7)}</span>
                              </p>
                              
                              <div className="flex flex-wrap items-center gap-3 mt-5">
                                {alert.status !== 'Resolved' && (
                                  <>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setAlerts(items => items.map(a => a.id === alert.id ? {...a, status: 'Resolved'} : a))}} 
                                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                                    >
                                      <CheckCircle size={14} /> Resolve Incident
                                    </button>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setAlerts(items => items.map(a => a.id === alert.id ? {...a, status: 'Acknowledged', assignee: 'Super Admin'} : a))}} 
                                      className="px-4 py-2.5 bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                                    >
                                      Acknowledge
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full min-h-0">
      
      {/* Page Header */}
      <div className="shrink-0">
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-rose-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Monitoring</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2.5 bg-rose-100 dark:bg-rose-900/30 rounded-xl shadow-sm border border-rose-200/50 dark:border-rose-800/50">
                <Radio size={28} className="text-rose-600 dark:text-rose-400" />
              </div>
              Platform Monitoring & Alerts
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Real-time observability of infrastructure health, API latency, active security threats, and database load.</p>
          </div>
        </div>
      </div>

      {/* Sub-menu Grid */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-5 gap-3 w-full">
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
