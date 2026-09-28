"use client";
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import { 
  LifeBuoy, Wrench, ShieldAlert, FileText, CheckCircle, Clock, 
  MessageSquare, User, Flag, ArrowRight, Play, Save, Construction
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  "Support Dashboard", "Support Tickets", "Library Requests", "User Requests", 
  "System Announcements", "Maintenance Mode", "Incident Management", "Incident History", 
  "Service Status", "Support Access", "Operational Notes"
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
      <div className="flex flex-col justify-center h-full">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{p.data?.library}</p>
        <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1"><User size={10} /> {p.data?.user}</p>
      </div>
    )},
    { field: 'priority', headerName: 'Priority', flex: 1, minWidth: 120, cellRenderer: (p: ICellRendererParams) => {
      let color = 'bg-gray-100 text-gray-700';
      if(p.value === 'Critical') color = 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
      if(p.value === 'High') color = 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400';
      if(p.value === 'Medium') color = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400';
      if(p.value === 'Low') color = 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
      return <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1.5 w-fit ${color}`}><Flag size={12} /> {p.value}</span>
    }},
    { field: 'operator', headerName: 'Operator', flex: 1, minWidth: 140 },
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 120, cellRenderer: (p: ICellRendererParams) => (
      <span className={`text-xs font-bold px-2 py-1 rounded border ${p.value === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : p.value === 'Open' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
        {p.value}
      </span>
    )}
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  const renderContent = () => {
    switch (activeMenu) {
      case "Maintenance Mode":
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
                  <div className="flex gap-4">
                    {['Global Maintenance', 'Selected Library Maintenance'].map(scope => (
                      <label key={scope} className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${maintenanceScope === scope ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'border-gray-200 dark:border-gray-700 hover:border-amber-300'}`}>
                        <input type="radio" name="scope" value={scope} checked={maintenanceScope === scope} onChange={e => setMaintenanceScope(e.target.value)} className="hidden" />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${maintenanceScope === scope ? 'border-amber-500' : 'border-gray-300'}`}>
                          {maintenanceScope === scope && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />}
                        </div>
                        <span className="text-sm font-bold">{scope}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {maintenanceScope === 'Selected Library Maintenance' && (
                  <div className="animate-in fade-in">
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
                
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="scheduled" className="w-4 h-4 text-amber-500 rounded" />
                  <label htmlFor="scheduled" className="text-sm font-bold text-gray-700 dark:text-gray-300">This is a Scheduled Maintenance (Notify users in advance)</label>
                </div>
              </div>

              <div className="lg:w-1/3 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Public Maintenance Message</label>
                  <textarea rows={5} className="w-full p-4 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-amber-500 resize-none shadow-sm" defaultValue={"Nexus 360 is currently undergoing scheduled maintenance. We expect to be back online shortly. Thank you for your patience."}></textarea>
                </div>
                <button className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2">
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
                  <ShieldAlert size={24} /> Active Incident Management
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Track and resolve high-priority platform outages.</p>
              </div>
              <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 text-xs font-bold rounded-lg border border-red-200 dark:border-red-800 animate-pulse">INC-991: Database Replication Lag</span>
            </div>

            <div className="p-8">
              {/* Workflow Visualizer */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 hidden md:block z-0"></div>
                <div className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 hidden md:block z-0 transition-all duration-500" style={{ width: `${(incidentStage / (INCIDENT_STAGES.length - 1)) * 100}%` }}></div>

                {INCIDENT_STAGES.map((stage, idx) => {
                  const isCompleted = idx < incidentStage;
                  const isActive = idx === incidentStage;
                  return (
                    <div key={stage} className="relative z-10 flex flex-col items-center gap-3">
                      <button 
                        onClick={() => setIncidentStage(idx)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-4 font-bold transition-all shadow-md
                          ${isCompleted ? 'bg-blue-500 border-white dark:border-[#0F172A] text-white' : 
                            isActive ? 'bg-white border-blue-500 text-blue-600 scale-110' : 
                            'bg-gray-100 border-white dark:bg-gray-800 dark:border-[#0F172A] text-gray-400'}
                        `}
                      >
                        {isCompleted ? <CheckCircle size={20} /> : isActive ? <Play size={20} className="ml-1" /> : <Clock size={20} />}
                      </button>
                      <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-blue-600 dark:text-blue-400' : isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                        {stage}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Action Area */}
              <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 uppercase">Update Public Status Page</h3>
                  <textarea rows={3} className="w-full p-3 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-blue-500 shadow-sm resize-none" placeholder="Describe the current situation for the public status page..."></textarea>
                  <div className="flex items-center gap-3 mt-3">
                    <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5">
                      <Save size={14} /> Update Status
                    </button>
                    <button onClick={() => setIncidentStage(Math.min(INCIDENT_STAGES.length-1, incidentStage + 1))} className="px-5 py-2 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-gray-800">
                      Advance Stage <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
                <div className="w-full lg:w-1/3 bg-white dark:bg-[#0F172A] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Internal Operational Notes</h4>
                  <ul className="space-y-3">
                    <li className="text-xs">
                      <span className="font-bold text-gray-900 dark:text-white">10:15 AM:</span> AWS RDS instances show high CPU.
                    </li>
                    <li className="text-xs">
                      <span className="font-bold text-gray-900 dark:text-white">10:22 AM:</span> Restarted read-replicas.
                    </li>
                  </ul>
                  <input type="text" placeholder="Add internal note..." className="w-full mt-3 p-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>
          </div>
        );

      case "Support Dashboard":
      case "Support Tickets":
      case "Library Requests":
      default:
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1F3C] flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare size={20} className="text-blue-500" /> {activeMenu}
                </h3>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Manage operator assignments, internal notes, and resolutions.</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5">
                + Create Ticket
              </button>
            </div>
            
            <div className="h-[550px] w-full">
              <AgGridReact
                ref={gridRef}
                theme={gridTheme}
                rowData={mockTickets}
                columnDefs={ticketColDefs}
                rowHeight={64}
                headerHeight={48}
                onGridReady={onGridReady}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      
      {/* Page Header */}
      <div>
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-blue-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Support & Operations</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl shadow-sm border border-blue-200/50 dark:border-blue-800/50">
                <LifeBuoy size={28} className="text-blue-600 dark:text-blue-400" />
              </div>
              Support & Operations Center
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Manage incoming support tickets, trigger platform maintenance mode, and track active system incidents.</p>
          </div>
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
                ? 'bg-blue-600 text-white shadow-blue-600/20 scale-105' 
                : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-[#1E293B] hover:text-blue-600 hover:border-blue-200'
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
