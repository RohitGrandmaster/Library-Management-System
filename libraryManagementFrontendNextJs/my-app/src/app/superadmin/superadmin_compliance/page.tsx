'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import { 
  Scale, FileArchive, ShieldAlert, FileOutput, ShieldCheck, 
  Trash2, Database, Clock, Lock, CheckCircle, Save, AlertTriangle
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  "Data Policies", "Data Retention", "Privacy Settings", "Data Access Requests", 
  "Data Export Requests", "Data Deletion Requests", "Data Archiving", 
  "Consent / Policy Records", "Compliance Logs"
];

const mockRequests = [
  { id: 'DEL-8812', target: 'Tenant: LibroHub Mumbai', type: 'Library Closure Data Removal', requestor: 'SuperAdmin', date: '2026-09-27', status: 'Pending Approval', risk: 'Critical' },
  { id: 'EXP-1092', target: 'User: rahul.v@readersden', type: 'GDPR Data Export', requestor: 'Rahul Verma', date: '2026-09-28', status: 'Processing', risk: 'Low' },
  { id: 'DEL-8813', target: 'Tenant: StudyNest Patna', type: 'Purge Old Audit Logs (2024)', requestor: 'System Script', date: '2026-09-28', status: 'Pending Approval', risk: 'High' },
  { id: 'ACC-5541', target: 'User: admin_rohit', type: 'Subject Access Request', requestor: 'Legal Dept', date: '2026-09-25', status: 'Completed', risk: 'Medium' },
];

export default function CompliancePage() {
  const [activeMenu, setActiveMenu] = useState("Data Policies");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const gridRef = useRef<AgGridReact>(null);

  const requestColDefs = useMemo<any[]>(() => [
    { field: 'id', headerName: 'Request ID', flex: 1, minWidth: 120, cellClass: 'font-bold font-mono text-indigo-600 dark:text-indigo-400' },
    { field: 'type', headerName: 'Request Type', flex: 1.5, minWidth: 220, cellClass: 'font-bold text-gray-900 dark:text-white' },
    { field: 'target', headerName: 'Data Subject / Target', flex: 1.5, minWidth: 200, cellRenderer: (p: ICellRendererParams) => (
      <span className="text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">{p.value}</span>
    )},
    { field: 'date', headerName: 'Date Filed', flex: 1, minWidth: 120 },
    { field: 'risk', headerName: 'Risk / Impact', flex: 1, minWidth: 120, cellRenderer: (p: ICellRendererParams) => {
      let color = 'bg-gray-100 text-gray-700';
      if(p.value === 'Critical') color = 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
      if(p.value === 'High') color = 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400';
      if(p.value === 'Medium') color = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400';
      if(p.value === 'Low') color = 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
      return <span className={`px-2 py-1 rounded text-xs font-bold w-fit ${color}`}>{p.value}</span>
    }},
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 140, cellRenderer: (p: ICellRendererParams) => {
      const isPending = p.value === 'Pending Approval';
      return (
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded border ${
          isPending ? 'bg-amber-50 text-amber-600 border-amber-200' : 
          p.value === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-blue-50 text-blue-600 border-blue-200'
        }`}>
          {p.value}
        </span>
      )
    }}
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setProcessed(true);
      setTimeout(() => setProcessed(false), 3000);
    }, 1200);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "Data Deletion Requests":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-red-50/50 dark:bg-red-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Trash2 size={24} /> Controlled Data Deletion Center
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Review GDPR/CCPA deletion requests. Permanent deletion is highly controlled.</p>
              </div>
            </div>

            <div className="p-8 flex flex-col xl:flex-row gap-8">
              
              <div className="flex-1 space-y-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-gray-50 dark:bg-[#1E293B] p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                    <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">DEL-8812</span>
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-amber-100 text-amber-700 rounded border border-amber-200">Pending Approval</span>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#0F172A] space-y-4">
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase">Target Subject</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">Tenant: LibroHub Mumbai</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase">Request Type</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">Library Closure Data Removal</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-gray-500 uppercase">Impact Analysis</span>
                      <ul className="text-xs font-bold text-gray-700 dark:text-gray-300 text-right space-y-1">
                        <li>Deletes 12,500 Book Records</li>
                        <li>Deletes 45 User Accounts</li>
                        <li>Anonymizes 850 Circulation Logs</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="xl:w-1/3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-red-800 dark:text-red-400 uppercase mb-4 flex items-center gap-2"><ShieldAlert size={16} /> Irreversible Action</h3>
                  <p className="text-xs text-red-700 dark:text-red-300 font-medium mb-4 leading-relaxed">
                    Executing this deletion will permanently purge all associated data from the active databases. Backups will retain data for 30 days based on retention policies.
                  </p>
                  
                  <label className="block text-xs font-bold text-red-800 dark:text-red-400 mb-2">Type "PERMANENTLY DELETE" to confirm</label>
                  <input 
                    type="text" 
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="Type confirmation here..." 
                    className="w-full p-3 bg-white dark:bg-[#0F172A] border border-red-300 dark:border-red-700 rounded-xl text-sm outline-none focus:border-red-500 font-bold shadow-sm"
                  />
                </div>
                
                <div className="pt-6 mt-6 border-t border-red-200 dark:border-red-800/50 flex gap-3">
                  <button className="flex-1 py-3 bg-white dark:bg-[#1E293B] border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                    Reject Request
                  </button>
                  <button 
                    disabled={deleteConfirmation !== "PERMANENTLY DELETE"}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Trash2 size={16} /> Execute Delete
                  </button>
                </div>
              </div>

            </div>
          </div>
        );

      case "Data Access Requests":
      case "Data Export Requests":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1F3C] flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileOutput size={20} className="text-indigo-500" /> Subject Rights Requests (GDPR/CCPA)
                </h3>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Manage user or library data export and access requests.</p>
              </div>
            </div>
            
            <div className="h-[500px] w-full">
              <AgGridReact
                ref={gridRef}
                theme={gridTheme}
                rowData={mockRequests}
                columnDefs={requestColDefs}
                rowHeight={64}
                headerHeight={48}
                onGridReady={onGridReady}
              />
            </div>
          </div>
        );

      case "Data Retention":
      case "Data Policies":
      default:
        return (
          <form onSubmit={handleSavePolicy} className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col xl:flex-row">
            {/* Form Left Side */}
            <div className="flex-1 p-8">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
                <Clock className="text-indigo-600" size={24} /> Data Lifecycle & Retention
              </h2>

              <div className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Platform Audit Log Retention</label>
                    <select className="w-full p-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 shadow-sm">
                      <option>1 Year</option>
                      <option>3 Years</option>
                      <option defaultValue="5 Years">5 Years (Recommended)</option>
                      <option>Indefinite</option>
                    </select>
                  </div>
                  <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Automated Archiving Rule</label>
                    <select className="w-full p-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 shadow-sm">
                      <option>Archive inactive libraries after 90 days</option>
                      <option>Archive inactive libraries after 180 days</option>
                      <option>Do not auto-archive</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Library Closure Data Handling Policy</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer">
                      <input type="radio" name="closure_policy" className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Soft Delete (Retain indefinitely in suspended state)</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white dark:bg-[#0F172A] border border-indigo-300 dark:border-indigo-700/50 shadow-sm rounded-xl cursor-pointer">
                      <input type="radio" name="closure_policy" defaultChecked className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-bold text-indigo-800 dark:text-indigo-400">Archive for 90 days, then Purge permanently</span>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <label className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <span>User Data Removal (Right to be Forgotten)</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded" />
                  </label>
                  <p className="text-xs text-gray-500 font-medium mb-3">Allow tenant admins to permanently purge individual member data upon user request.</p>
                  <select className="w-full p-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 shadow-sm">
                    <option>Immediate Purge</option>
                    <option>Delay 30 Days (Soft Delete)</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Form Right Side */}
            <div className="xl:w-1/3 bg-indigo-50/50 dark:bg-indigo-900/10 border-l border-indigo-100 dark:border-indigo-900/20 p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <ShieldCheck className="text-indigo-600" size={18} /> Compliance & Legal
                </h3>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  These retention policies apply platform-wide across all tenant databases. Any modifications are permanently logged in the Global Audit Center.
                </p>
                <div className="p-4 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-800 rounded-xl flex items-start gap-3 mb-6">
                  <Lock size={18} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">GDPR & CCPA Compliant</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Platform currently enforces strict isolation and controlled purging logic.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-indigo-200/50 dark:border-indigo-800/30 flex flex-col gap-3">
                {processed && (
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5 animate-in slide-in-from-bottom-2">
                    <CheckCircle size={16} /> Policies Updated
                  </span>
                )}
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isProcessing ? "Saving Policy..." : <><Save size={18} /> Update Data Policies</>}
                </button>
              </div>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Page Header */}
      <div>
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-indigo-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Data Governance</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl shadow-sm border border-indigo-200/50 dark:border-indigo-800/50">
                <Scale size={28} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              Data Governance & Compliance
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Manage data retention rules, control permanent deletion requests, and enforce privacy policies across all tenant libraries.</p>
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
                ? 'bg-indigo-600 text-white shadow-indigo-600/20 scale-105' 
                : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-indigo-50 dark:hover:bg-[#1E293B] hover:text-indigo-600 hover:border-indigo-200'
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
