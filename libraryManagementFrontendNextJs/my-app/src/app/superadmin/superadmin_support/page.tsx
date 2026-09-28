'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import { 
  LifeBuoy, Wrench, ShieldAlert, FileText, CheckCircle, Clock, 
  MessageSquare, User, Flag, ArrowRight, Play, Save, Construction,
  Activity, ServerCrash, AlertTriangle, MessageCircle, BarChart3, AlertOctagon
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  { id: "Support Dashboard", icon: MessageSquare, color: "blue", tabClass: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400", iconClass: "text-blue-600 dark:text-blue-400" },
  { id: "Incident Management", icon: ShieldAlert, color: "red", tabClass: "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400", iconClass: "text-red-600 dark:text-red-400" },
  { id: "Platform Maintenance", icon: Construction, color: "amber", tabClass: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400", iconClass: "text-amber-600 dark:text-amber-400" },
  { id: "Service Status", icon: Activity, color: "emerald", tabClass: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400", iconClass: "text-emerald-600 dark:text-emerald-400" },
];

const mockTickets = [
  { id: 'TKT-1045', library: 'StudyNest Patna', user: 'admin_rohit', issue: 'Cannot generate overdue fine reports', priority: 'High', operator: 'Priya S.', status: 'Open', notes: 'Checked DB locks, issue replicated.' },
  { id: 'TKT-1044', library: 'LibroHub', user: 'lib_manager', issue: 'Barcode scanner integration failing', priority: 'Medium', operator: 'Alex M.', status: 'Pending', notes: 'Waiting for client hardware specs.' },
  { id: 'TKT-1043', library: 'Global Platform', user: 'System', issue: 'API Gateway returning 504 on sync', priority: 'Critical', operator: 'DevOps Team', status: 'In Progress', notes: 'Scaling up worker nodes.' },
  { id: 'TKT-1042', library: 'Readers Den', user: 'john_doe', issue: 'Account locked mistakenly', priority: 'Low', operator: 'Priya S.', status: 'Resolved', notes: 'Unlocked via admin panel.' },
];

const INCIDENT_STAGES = ['Detected', 'Investigating', 'Identified', 'Resolved', 'Closed'];

export default function SupportOperationsPage() {
  const [activeMenu, setActiveMenu] = useState("Support Dashboard");
  const [maintenanceScope, setMaintenanceScope] = useState('Global Maintenance');
  const [incidentStage, setIncidentStage] = useState(1); // 'Investigating'
  const gridRef = useRef<AgGridReact>(null);

  const ticketColDefs = useMemo<any[]>(() => [
    { field: 'id', headerName: 'Ticket ID', flex: 1, minWidth: 120, cellClass: 'font-bold font-mono text-blue-600 dark:text-blue-400' },
    { field: 'issue', headerName: 'Issue Subject', flex: 2, minWidth: 250, cellClass: 'font-bold text-gray-900 dark:text-white' },
    { field: 'library', headerName: 'Library & User', flex: 1.5, minWidth: 200, cellRenderer: (p: ICellRendererParams) => (
      <div className="flex flex-col justify-center h-full gap-0.5">
        <p className="text-sm font-extrabold text-gray-800 dark:text-gray-200">{p.data?.library}</p>
        <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1"><User size={10} /> {p.data?.user}</p>
      </div>
    )},
    { field: 'priority', headerName: 'Priority', flex: 1, minWidth: 120, cellRenderer: (p: ICellRendererParams) => {
      let color = 'bg-gray-100 text-gray-700 border-gray-200';
      if(p.value === 'Critical') color = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50';
      if(p.value === 'High') color = 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50';
      if(p.value === 'Medium') color = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50';
      if(p.value === 'Low') color = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50';
      return <span className={`px-2.5 py-1 rounded-full border text-[10px] font-extrabold flex items-center gap-1.5 uppercase tracking-wider w-fit ${color}`}><Flag size={10} /> {p.value}</span>
    }},
    { field: 'operator', headerName: 'Assigned To', flex: 1, minWidth: 140, cellClass: 'text-sm font-bold text-gray-700 dark:text-gray-300' },
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 120, cellRenderer: (p: ICellRendererParams) => {
      let color = 'bg-gray-50 text-gray-600 border-gray-200';
      if (p.value === 'Resolved') color = 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:text-emerald-400';
      if (p.value === 'Open') color = 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800/50 dark:text-amber-400';
      if (p.value === 'In Progress') color = 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800/50 dark:text-indigo-400';
      
      return (
        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border w-fit flex items-center gap-1.5 ${color}`}>
          {p.value === 'Resolved' ? <CheckCircle size={10}/> : p.value === 'Open' ? <AlertOctagon size={10}/> : <Clock size={10}/>}
          {p.value}
        </span>
      )
    }}
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  const renderContent = () => {
    switch (activeMenu) {
      case "Platform Maintenance":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-amber-50/50 dark:bg-amber-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Construction size={24} /> Platform Maintenance Mode
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Schedule downtime or immediately lock down the platform for upgrades.</p>
              </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Maintenance Scope</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {['Global Maintenance', 'Selected Library Maintenance'].map(scope => (
                      <label key={scope} className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${maintenanceScope === scope ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 shadow-sm' : 'border-gray-200 dark:border-gray-700 hover:border-amber-300 bg-white dark:bg-[#0F172A]'}`}>
                        <input type="radio" name="scope" value={scope} checked={maintenanceScope === scope} onChange={e => setMaintenanceScope(e.target.value)} className="hidden" />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${maintenanceScope === scope ? 'border-amber-500' : 'border-gray-300 dark:border-gray-600'}`}>
                          {maintenanceScope === scope && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />}
                        </div>
                        <span className="text-sm font-bold">{scope}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {maintenanceScope === 'Selected Library Maintenance' && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Target Library</label>
                    <select className="w-full p-3 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-amber-500 font-bold shadow-sm">
                      <option>StudyNest Patna (ID: SN-001)</option>
                      <option>LibroHub Mumbai (ID: LH-092)</option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Start Time</label>
                    <input type="datetime-local" className="w-full p-3 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-amber-500 font-bold shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">End Time (Estimated)</label>
                    <input type="datetime-local" className="w-full p-3 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-amber-500 font-bold shadow-sm" />
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <input type="checkbox" id="scheduled" className="w-4 h-4 text-amber-500 rounded border-gray-300 cursor-pointer" />
                  <label htmlFor="scheduled" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer w-full">This is a Scheduled Maintenance (Notify users in advance via banner)</label>
                </div>
              </div>

              <div className="lg:w-1/3 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Public Maintenance Message</label>
                  <textarea rows={6} className="w-full p-4 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:border-amber-500 resize-none shadow-sm" defaultValue={"Nexus 360 is currently undergoing scheduled maintenance. We expect to be back online shortly. Thank you for your patience."}></textarea>
                </div>
                <button className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]">
                  <Wrench size={18} /> Enable Maintenance Mode
                </button>
              </div>
            </div>
          </div>
        );

      case "Incident Management":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-red-50/50 dark:bg-red-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <ShieldAlert size={24} /> Active Incident Tracker
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Track, update, and resolve high-priority platform outages.</p>
              </div>
              <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 text-xs font-extrabold rounded-lg border border-red-200 dark:border-red-800 animate-pulse flex items-center gap-2">
                <ServerCrash size={14} /> INC-991: Database Replication Lag
              </span>
            </div>

            <div className="p-8">
              {/* Workflow Visualizer */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 dark:bg-gray-800 -translate-y-1/2 hidden md:block z-0 rounded-full"></div>
                <div className="absolute top-1/2 left-0 h-1.5 bg-red-500 -translate-y-1/2 hidden md:block z-0 transition-all duration-500 rounded-full" style={{ width: `${(incidentStage / (INCIDENT_STAGES.length - 1)) * 100}%` }}></div>

                {INCIDENT_STAGES.map((stage, idx) => {
                  const isCompleted = idx < incidentStage;
                  const isActive = idx === incidentStage;
                  return (
                    <div key={stage} className="relative z-10 flex flex-col items-center gap-3">
                      <button 
                        onClick={() => setIncidentStage(idx)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center border-4 font-bold transition-all shadow-md
                          ${isCompleted ? 'bg-red-500 border-white dark:border-[#0F172A] text-white' : 
                            isActive ? 'bg-white border-red-500 text-red-600 scale-110' : 
                            'bg-gray-50 border-white dark:bg-[#1E293B] dark:border-[#0F172A] text-gray-400'}
                        `}
                      >
                        {isCompleted ? <CheckCircle size={24} /> : isActive ? <Play size={24} className="ml-1" /> : <Clock size={24} />}
                      </button>
                      <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isActive ? 'text-red-600 dark:text-red-400' : isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                        {stage}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Action Area */}
              <div className="bg-gray-50 dark:bg-[#1E293B]/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col lg:flex-row gap-6 items-stretch shadow-sm">
                <div className="flex-1 flex flex-col">
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                    <MessageCircle size={16} className="text-red-500" /> Update Public Status Page
                  </h3>
                  <textarea rows={4} className="w-full p-4 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium outline-none focus:border-red-500 shadow-sm resize-none flex-1" placeholder="Describe the current situation for the public status page..."></textarea>
                  <div className="flex items-center gap-3 mt-4">
                    <button className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
                      <Save size={16} /> Publish Status Update
                    </button>
                    <button onClick={() => setIncidentStage(Math.min(INCIDENT_STAGES.length-1, incidentStage + 1))} className="flex-1 py-3 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                      Advance Stage <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="w-full lg:w-1/3 bg-white dark:bg-[#0F172A] p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                  <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <AlertTriangle size={14} /> Internal Operational Notes
                  </h4>
                  <ul className="space-y-4 flex-1">
                    <li className="text-xs flex gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400 shrink-0">10:15 AM</span>
                      <span className="text-gray-700 dark:text-gray-300">AWS RDS instances show high CPU. DB lock suspected.</span>
                    </li>
                    <li className="text-xs flex gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400 shrink-0">10:22 AM</span>
                      <span className="text-gray-700 dark:text-gray-300">Restarted read-replicas. Traffic re-routed to backup cluster.</span>
                    </li>
                  </ul>
                  <div className="mt-4 flex gap-2">
                    <input type="text" placeholder="Add secure internal note..." className="flex-1 p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-red-500 shadow-inner" />
                    <button className="px-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors">Add</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case "Service Status":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 p-8 flex flex-col items-center justify-center text-center min-h-[500px]">
             <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-200 dark:border-emerald-800">
               <Activity size={40} />
             </div>
             <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">All Systems Operational</h2>
             <p className="text-sm text-gray-500 max-w-md mx-auto mb-8">API Gateway, Database Clusters, and Background Workers are functioning normally with 99.99% uptime this month.</p>
             <div className="flex gap-4 w-full max-w-2xl">
               <div className="flex-1 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1E293B]">
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">API Latency</span>
                 <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">42ms</p>
               </div>
               <div className="flex-1 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1E293B]">
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">DB Load</span>
                 <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">12%</p>
               </div>
               <div className="flex-1 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1E293B]">
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Uptime</span>
                 <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">99.99%</p>
               </div>
             </div>
          </div>
        )

      case "Support Dashboard":
      default:
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col min-h-[600px]">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-blue-50/50 dark:bg-[#0D1F3C]/50 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-extrabold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <BarChart3 size={24} /> Support Queue Dashboard
                </h3>
                <p className="text-sm font-medium text-gray-500 mt-1">Manage operator assignments, resolve issues, and monitor SLA compliance.</p>
              </div>
              <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                <MessageSquare size={16} /> Open New Ticket
              </button>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0">
                <AgGridReact
                  ref={gridRef}
                  theme={gridTheme}
                  rowData={mockTickets}
                  columnDefs={ticketColDefs as any}
                  rowHeight={64}
                  headerHeight={48}
                  onGridReady={onGridReady}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-0 h-full">
      
      {/* Page Header */}
      <div className="shrink-0">
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-blue-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Support & Operations</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm border border-blue-200/50 dark:border-blue-800/50">
                <LifeBuoy size={24} />
              </div>
              Support & Operations Center
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Manage incoming platform support tickets, trigger emergency maintenance mode, and track active system incidents.</p>
          </div>
        </div>
      </div>

      {/* Sub-menu Grid */}
      <div className="shrink-0 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {SUB_MENUS.map(menu => {
          const Icon = menu.icon;
          const isActive = activeMenu === menu.id;
          
          return (
            <button
              key={menu.id}
              onClick={() => setActiveMenu(menu.id)}
              className={`flex flex-col items-center justify-center p-5 gap-3 rounded-2xl border text-center transition-all ${
                isActive 
                  ? `${menu.tabClass} shadow-md scale-[1.02]`
                  : 'bg-white dark:bg-[#0F172A] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-gray-900 dark:hover:text-white shadow-sm'
              }`}
            >
              <Icon size={24} className={isActive ? menu.iconClass : 'opacity-70'} />
              <span className="text-xs font-extrabold uppercase tracking-wider">{menu.id}</span>
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
