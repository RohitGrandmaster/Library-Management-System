'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import { 
  LineChart, Activity, Cpu, HardDrive, ShieldAlert, 
  Database, Network, Cloud, Lock, ServerCrash, 
  CheckCircle, Clock, Users, ArrowUpRight, BellRing, BellOff, XCircle, Search
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  "Monitoring Dashboard", "Application Monitoring", "Server Monitoring", "Database Monitoring", 
  "API Monitoring", "Error Monitoring", "Performance Monitoring", "Uptime Monitoring", 
  "Storage Monitoring", "Security Monitoring", "Alert Rules", "Alert History"
];

// Mock Data matching the user's specific alert requirements
const activeAlerts = [
  { id: 'ALT-991', title: 'Server CPU High', desc: 'Worker node 3 CPU utilization is at 95% for 15+ mins.', severity: 'High', source: 'Server Monitoring', time: '5 mins ago', status: 'New', icon: <Cpu size={20} /> },
  { id: 'ALT-992', title: 'RAM High', desc: 'API Gateway cluster memory usage exceeding 88%.', severity: 'Medium', source: 'Server Monitoring', time: '12 mins ago', status: 'Acknowledged', assignee: 'Priya S.', icon: <Activity size={20} /> },
  { id: 'ALT-993', title: 'Disk Almost Full', desc: 'Volume /data on DB-Replica-2 has less than 10% space remaining.', severity: 'Critical', source: 'Storage Monitoring', time: '30 mins ago', status: 'New', icon: <HardDrive size={20} /> },
  { id: 'ALT-994', title: 'Database Unavailable', desc: 'Connection timeouts on tenant isolated cluster #B.', severity: 'Critical', source: 'Database Monitoring', time: '1 hour ago', status: 'Escalated', assignee: 'Rohit S.', icon: <Database size={20} /> },
  { id: 'ALT-995', title: 'API Errors High', desc: 'Spike in 5xx errors on external webhook endpoints.', severity: 'High', source: 'API Monitoring', time: '2 hours ago', status: 'Acknowledged', assignee: 'System', icon: <Network size={20} /> },
  { id: 'ALT-996', title: 'Backup Failed', desc: 'Daily automated S3 snapshot failed for StudyNest library.', severity: 'High', source: 'Application Monitoring', time: 'Yesterday', status: 'New', icon: <Cloud size={20} /> },
  { id: 'ALT-997', title: 'Queue Stuck', desc: 'Email sending worker queue has not processed items for 1 hour.', severity: 'Medium', source: 'Performance Monitoring', time: 'Yesterday', status: 'New', icon: <Clock size={20} /> },
  { id: 'ALT-998', title: 'SSL Expiry', desc: 'Custom domain ssl cert for opac.readersden.org expires in 3 days.', severity: 'Medium', source: 'Security Monitoring', time: 'Yesterday', status: 'Snoozed', icon: <Lock size={20} /> },
  { id: 'ALT-999', title: 'Storage Limit Reached', desc: 'Tenant LibroHub exceeded their 50GB file storage limit.', severity: 'Low', source: 'Storage Monitoring', time: '2 days ago', status: 'New', icon: <HardDrive size={20} /> },
  { id: 'ALT-1000', title: 'Suspicious Login', desc: 'Admin login from unrecognized IP address outside operational region.', severity: 'High', source: 'Security Monitoring', time: '3 days ago', status: 'Resolved', icon: <ShieldAlert size={20} /> },
];

export default function MonitoringPage() {
  const [activeMenu, setActiveMenu] = useState("Monitoring Dashboard");
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'Critical': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'High': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New': return <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-rose-500"><BellRing size={10} className="animate-pulse" /> New Alert</span>;
      case 'Acknowledged': return <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-blue-500"><CheckCircle size={10} /> Acknowledged</span>;
      case 'Escalated': return <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-orange-500"><ArrowUpRight size={10} /> Escalated</span>;
      case 'Snoozed': return <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-400"><BellOff size={10} /> Snoozed</span>;
      case 'Resolved': return <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-500"><CheckCircle size={10} /> Resolved</span>;
      default: return null;
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "Monitoring Dashboard":
      case "Application Monitoring":
      case "Server Monitoring":
      case "Database Monitoring":
      case "API Monitoring":
      default:
        return (
          <div className="flex flex-col xl:flex-row gap-6 w-full animate-in fade-in zoom-in-95 duration-300">
            
            {/* Active Alerts Feed (PagerDuty Style) */}
            <div className="flex-1 bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-violet-50/50 dark:bg-[#0D1F3C] flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <ShieldAlert size={20} className="text-violet-500" /> Active Platform Alerts
                  </h3>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">Real-time incident response feed.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-white border border-gray-300 dark:bg-[#1E293B] dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold shadow-sm hover:text-violet-600 transition-colors">
                    Acknowledge All
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[700px] custom-scrollbar p-0">
                {activeAlerts.filter(a => activeMenu === "Monitoring Dashboard" || a.source === activeMenu || activeMenu.includes(a.source.split(' ')[0])).map((alert) => {
                  const isExpanded = expandedAlertId === alert.id;
                  
                  return (
                    <div 
                      key={alert.id} 
                      className={`border-b border-gray-100 dark:border-gray-800 transition-colors ${alert.status === 'Resolved' ? 'opacity-60 bg-gray-50 dark:bg-[#0F172A]/50' : 'hover:bg-gray-50 dark:hover:bg-[#1E293B] bg-white dark:bg-[#0F172A]'}`}
                    >
                      <div 
                        onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
                        className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 shrink-0 ${alert.status === 'New' && alert.severity === 'Critical' ? 'animate-pulse bg-red-100 text-red-600 dark:bg-red-900/30' : ''}`}>
                            {alert.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getSeverityColor(alert.severity)}`}>
                                {alert.severity}
                              </span>
                              <h4 className="text-sm font-extrabold text-gray-900 dark:text-white leading-tight">{alert.title}</h4>
                            </div>
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 line-clamp-1">{alert.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-64 shrink-0">
                          <div className="flex flex-col gap-1 items-start sm:items-end">
                            {getStatusBadge(alert.status)}
                            <span className="text-[11px] font-semibold text-gray-500">{alert.time}</span>
                          </div>
                          
                          {/* Incident Assignee Avatar */}
                          {alert.assignee ? (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg" title={`Assigned to ${alert.assignee}`}>
                              <Users size={12} className="text-gray-500" />
                              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 truncate max-w-[60px]">{alert.assignee}</span>
                            </div>
                          ) : (
                            <div className="w-[85px]"></div>
                          )}
                        </div>
                      </div>

                      {/* Expandable Action Panel */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-2 animate-in slide-in-from-top-2">
                          <div className="p-4 bg-gray-50 dark:bg-[#0D1F3C] border border-gray-100 dark:border-gray-800 rounded-xl">
                            <p className="text-xs text-gray-500 font-mono mb-4">Incident ID: <span className="font-bold text-violet-600 dark:text-violet-400">{alert.id}</span> • Source: {alert.source}</p>
                            
                            <div className="flex flex-wrap gap-2">
                              <button disabled={alert.status === 'Acknowledged' || alert.status === 'Resolved'} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50">
                                <CheckCircle size={14} /> Acknowledge
                              </button>
                              <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg shadow-sm transition-colors">
                                <Users size={14} /> Assign
                              </button>
                              <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg shadow-sm transition-colors">
                                <ArrowUpRight size={14} /> Escalate
                              </button>
                              <button disabled={alert.status === 'Snoozed'} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg shadow-sm transition-colors disabled:opacity-50">
                                <BellOff size={14} /> Snooze
                              </button>
                              <div className="flex-1"></div>
                              <button disabled={alert.status === 'Resolved'} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors disabled:opacity-50">
                                <CheckCircle size={14} /> Mark Resolved
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Metrics Right Panel */}
            <div className="xl:w-80 flex flex-col gap-6 shrink-0">
              <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
                  <Activity size={16} className="text-violet-500" /> Platform Health
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      <span>API Availability</span>
                      <span className="text-emerald-500">99.98%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[99%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      <span>Avg Response Time</span>
                      <span className="text-blue-500">142 ms</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[40%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      <span>Error Rate (5xx)</span>
                      <span className="text-red-500">0.05%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 w-[2%]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 p-6 rounded-2xl shadow-inner border border-violet-100 dark:border-violet-800 flex flex-col justify-center text-center">
                <ShieldAlert size={32} className="text-violet-600 dark:text-violet-400 mx-auto mb-3" />
                <h3 className="text-lg font-extrabold text-violet-900 dark:text-violet-300">2 Critical Alerts</h3>
                <p className="text-xs font-medium text-violet-700 dark:text-violet-400/80 mt-1 mb-4 leading-relaxed">
                  Requires immediate attention. Escalation policies will trigger SMS to On-Call Engineer in 10 minutes.
                </p>
                <button className="w-full px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-sm transition-colors">
                  View On-Call Schedule
                </button>
              </div>
            </div>

          </div>
        );

      case "Alert Rules":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden p-16 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
             <div className="p-5 bg-violet-100 dark:bg-violet-900/40 rounded-full mb-6 shadow-inner">
              <Settings size={48} className="text-violet-500 dark:text-violet-400" />
            </div>
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">Configure Alert Rules</h4>
            <p className="text-gray-500 font-medium max-w-lg mx-auto mb-8">
              Define thresholds (e.g. CPU &gt; 90%, Error Rate &gt; 1%) and setup Escalation Policies (Email, SMS, PagerDuty, Slack Webhooks).
            </p>
            <button className="px-6 py-3 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-lg shadow-violet-500/20 hover:-translate-y-0.5 transition-all">
              Create New Alert Rule
            </button>
          </div>
        )
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Page Header */}
      <div>
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-violet-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Monitoring</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-xl shadow-sm border border-violet-200/50 dark:border-violet-800/50">
                <LineChart size={28} className="text-violet-600 dark:text-violet-400" />
              </div>
              Monitoring & Alerts
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Real-time observability into application health, infrastructure performance, and actionable incident alerts.</p>
          </div>
        </div>
      </div>

      {/* Sub-menu Tabs */}
      <div className="flex gap-1.5 pb-2 pt-1 px-1 overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {SUB_MENUS.map(menu => (
          <button
            key={menu}
            onClick={() => { setActiveMenu(menu); setExpandedAlertId(null); }}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all shadow-sm flex-1 ${
              activeMenu === menu 
                ? 'bg-violet-600 text-white shadow-violet-600/20 scale-105' 
                : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-violet-50 dark:hover:bg-[#1E293B] hover:text-violet-600 hover:border-violet-200'
            }`}
          >
            {menu}
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
      <div className="w-full mt-2">
        {renderContent()}
      </div>
    </div>
  );
}

// Inline Settings icon since we didn't import it top-level
function Settings(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}
