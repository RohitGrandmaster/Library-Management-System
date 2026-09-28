'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import { 
  Scale, FileArchive, ShieldAlert, FileOutput, ShieldCheck, 
  Trash2, Database, Clock, Lock, CheckCircle, Save, AlertTriangle,
  FileText, DownloadCloud, Eye
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  { id: "Data Governance Policies", icon: Scale, color: "indigo", tabClass: "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800/50 dark:text-indigo-400", iconClass: "text-indigo-600 dark:text-indigo-400" },
  { id: "Privacy & Consent", icon: ShieldCheck, color: "emerald", tabClass: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400", iconClass: "text-emerald-600 dark:text-emerald-400" },
  { id: "Subject Access & Export", icon: DownloadCloud, color: "sky", tabClass: "bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-900/20 dark:border-sky-800/50 dark:text-sky-400", iconClass: "text-sky-600 dark:text-sky-400" },
  { id: "Data Deletion Requests", icon: Trash2, color: "rose", tabClass: "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-400", iconClass: "text-rose-600 dark:text-rose-400" },
  { id: "Compliance Audit Logs", icon: FileArchive, color: "amber", tabClass: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400", iconClass: "text-amber-600 dark:text-amber-400" }
];

const mockRequests = [
  { id: 'DEL-8812', target: 'Tenant: LibroHub Mumbai', type: 'Library Closure Data Removal', requestor: 'SuperAdmin', date: '2026-09-27', status: 'Pending Approval', risk: 'Critical' },
  { id: 'EXP-1092', target: 'User: rahul.v@readersden', type: 'GDPR Data Export', requestor: 'Rahul Verma', date: '2026-09-28', status: 'Processing', risk: 'Low' },
  { id: 'DEL-8813', target: 'Tenant: StudyNest Patna', type: 'Purge Old Audit Logs (2024)', requestor: 'System Script', date: '2026-09-28', status: 'Pending Approval', risk: 'High' },
  { id: 'ACC-5541', target: 'User: admin_rohit', type: 'Subject Access Request', requestor: 'Legal Dept', date: '2026-09-25', status: 'Completed', risk: 'Medium' },
];

export default function CompliancePage() {
  const [activeMenu, setActiveMenu] = useState("Data Governance Policies");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const gridRef = useRef<AgGridReact>(null);

  const requestColDefs = useMemo<any[]>(() => [
    { field: 'id', headerName: 'Request ID', flex: 1, minWidth: 120, cellClass: 'font-bold font-mono text-slate-600 dark:text-slate-400' },
    { field: 'type', headerName: 'Request Type', flex: 1.5, minWidth: 220, cellClass: 'font-bold text-gray-900 dark:text-white' },
    { field: 'target', headerName: 'Data Subject / Target', flex: 1.5, minWidth: 200, cellRenderer: (p: ICellRendererParams) => (
      <span className="text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-md shadow-sm">{p.value}</span>
    )},
    { field: 'date', headerName: 'Date Filed', flex: 1, minWidth: 120, cellClass: 'text-sm font-medium text-gray-600 dark:text-gray-400' },
    { field: 'risk', headerName: 'Risk / Impact', flex: 1, minWidth: 120, cellRenderer: (p: ICellRendererParams) => {
      let color = 'bg-gray-100 text-gray-700 border-gray-200';
      if(p.value === 'Critical') color = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50';
      if(p.value === 'High') color = 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50';
      if(p.value === 'Medium') color = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50';
      if(p.value === 'Low') color = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50';
      return <span className={`px-2.5 py-1 rounded-full border text-[10px] font-extrabold uppercase tracking-wider w-fit flex items-center ${color}`}>{p.value}</span>
    }},
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 140, cellRenderer: (p: ICellRendererParams) => {
      const isPending = p.value === 'Pending Approval';
      return (
        <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full border flex items-center gap-1.5 w-fit ${
          isPending ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/40' : 
          p.value === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/40' : 
          'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800/40'
        }`}>
          {isPending ? <Clock size={10}/> : p.value === 'Completed' ? <CheckCircle size={10}/> : <ShieldCheck size={10}/>}
          {p.value}
        </span>
      )
    }},
    { headerName: 'Actions', flex: 0.8, minWidth: 100, sortable: false, filter: false, cellRenderer: () => (
      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 rounded-lg transition-colors flex items-center justify-center h-full">
        <Eye size={18} />
      </button>
    )}
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
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-rose-50/50 dark:bg-rose-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <Trash2 size={24} /> Controlled Data Deletion Center
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Review GDPR/CCPA deletion requests. Permanent deletion is highly controlled.</p>
              </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col xl:flex-row gap-8">
              
              <div className="flex-1 space-y-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-gray-50 dark:bg-[#1E293B] p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                    <span className="font-mono text-sm font-extrabold text-slate-700 dark:text-slate-300">DEL-8812</span>
                    <span className="px-2.5 py-1 text-[10px] uppercase font-extrabold bg-amber-50 text-amber-700 rounded-full border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/40 dark:text-amber-400 flex items-center gap-1.5"><Clock size={12}/> Pending Approval</span>
                  </div>
                  <div className="p-6 bg-white dark:bg-[#0F172A] space-y-5">
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Target Subject</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2"><Database size={16} className="text-indigo-500"/> Tenant: LibroHub Mumbai</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Requested By</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">SuperAdmin (John Doe)</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Reason</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">Library Closure & Contract Termination</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Affected Records</span>
                      <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-3 py-1.5 rounded-lg border border-rose-100 dark:border-rose-800/40">~45,000 Rows (Books, Users, Logs)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="p-6 border border-rose-200 dark:border-rose-900/50 rounded-2xl bg-rose-50/30 dark:bg-rose-900/10 shadow-sm h-full flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-rose-700 dark:text-rose-400">Danger Zone: Permanent Purge</h3>
                      <p className="text-xs font-bold text-rose-600/70 dark:text-rose-400/70 mt-0.5">This action cannot be undone. Data will be wiped from all replicas.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Type <span className="font-mono bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded text-rose-600">CONFIRM-DEL-8812</span> to authorize purge:</p>
                    <input 
                      type="text" 
                      value={deleteConfirmation}
                      onChange={e => setDeleteConfirmation(e.target.value)}
                      placeholder="Type confirmation string here..." 
                      className="w-full p-3 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-rose-500 font-mono shadow-sm"
                    />
                    <div className="flex gap-3 pt-2">
                      <button className="flex-1 py-3 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        Reject Request
                      </button>
                      <button 
                        disabled={deleteConfirmation !== 'CONFIRM-DEL-8812'}
                        className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} /> Execute Data Purge
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        );
      
      case "Compliance Audit Logs":
      case "Subject Access & Export":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col min-h-[500px]">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-sky-50/50 dark:bg-sky-900/10 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-extrabold text-sky-600 dark:text-sky-400 flex items-center gap-2">
                  <FileOutput size={24} /> Data Subject Requests & Exports
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Manage all pending and historic GDPR/CCPA data requests from users and tenants.</p>
              </div>
              <button className="px-4 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 transition-colors">
                Export Log to CSV
              </button>
            </div>
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0">
                <AgGridReact
                  ref={gridRef}
                  theme={gridTheme}
                  rowData={mockRequests}
                  columnDefs={requestColDefs as any}
                  rowHeight={60}
                  headerHeight={48}
                  onGridReady={onGridReady}
                  pagination={true}
                  paginationPageSize={10}
                  suppressCellFocus={true}
                />
              </div>
            </div>
          </div>
        );

      case "Privacy & Consent":
        return (
          <form onSubmit={handleSavePolicy} className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-emerald-50/50 dark:bg-emerald-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <ShieldCheck size={24} /> Privacy & Consent Framework
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Configure mandatory consent banners, cookie tracking, and age restrictions globally.</p>
              </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Cookie Consent Model</label>
                  <select className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-emerald-500 font-bold shadow-sm">
                    <option>Strict (Explicit Opt-In Required - GDPR)</option>
                    <option>Implied (Banner + Continue)</option>
                    <option>Opt-Out Only (CCPA)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Age Verification Requirement</label>
                  <select className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-emerald-500 font-bold shadow-sm">
                    <option>None (All ages allowed)</option>
                    <option>13+ (COPPA Compliance)</option>
                    <option>18+ Only</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-[#0F172A] shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Consent Enforcement Actions</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Force Re-consent on Policy Update</p>
                        <p className="text-[10px] text-gray-500">Users must accept new terms to login.</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Collect Granular Consent</p>
                        <p className="text-[10px] text-gray-500">Separate checkboxes for Marketing, Analytics, etc.</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-[#0D1F3C] border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-4">
              {processed && (
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in slide-in-from-right-4">
                  <CheckCircle size={16} /> Preferences Saved
                </span>
              )}
              <button type="submit" disabled={isProcessing} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2">
                <Save size={16} /> {isProcessing ? "Saving..." : "Save Privacy Settings"}
              </button>
            </div>
          </form>
        );

      case "Data Governance Policies":
      default:
        return (
          <form onSubmit={handleSavePolicy} className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-indigo-50/50 dark:bg-indigo-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Scale size={24} /> Data Governance & Retention Policies
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Configure global rules for data lifespan, archival, and regulatory compliance constraints.</p>
              </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="space-y-6 lg:col-span-1">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
                  <FileArchive size={16} className="text-indigo-400" /> Data Retention Limits
                </h3>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Member Circulation History</label>
                  <select className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 font-bold shadow-sm">
                    <option>Indefinite (Until Deleted)</option>
                    <option>5 Years post-membership</option>
                    <option>3 Years post-membership</option>
                    <option>1 Year post-membership (Strict Privacy)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Financial Records (Fines/Fees)</label>
                  <select className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 font-bold shadow-sm">
                    <option>7 Years (Recommended for Tax)</option>
                    <option>5 Years</option>
                    <option>10 Years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Deleted Tenant Data Retention</label>
                  <select className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 font-bold shadow-sm">
                    <option>30 Days (Soft Delete)</option>
                    <option>90 Days (Soft Delete)</option>
                    <option>Immediate Hard Delete</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6 lg:col-span-2">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
                  <Lock size={16} className="text-indigo-400" /> Policy Documents & Links
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Global Privacy Policy URL</label>
                    <input type="url" defaultValue="https://nexus360.com/legal/privacy" className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 font-mono shadow-sm" />
                    <p className="text-[10px] text-gray-500 mt-1">This link is forced into all tenant footers.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Terms of Service URL</label>
                    <input type="url" defaultValue="https://nexus360.com/legal/terms" className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 font-mono shadow-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Data Processing Agreement (DPA) Content</label>
                    <textarea 
                      defaultValue="Standard Data Processing Clauses..."
                      className="w-full h-32 p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 font-mono shadow-sm resize-none custom-scrollbar" 
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-[#0D1F3C] border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-4">
              {processed && (
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in slide-in-from-right-4">
                  <CheckCircle size={16} /> Governance Saved
                </span>
              )}
              <button type="submit" disabled={isProcessing} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2">
                <Save size={16} /> {isProcessing ? "Saving..." : "Save Policies"}
              </button>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-0 h-full">
      {/* Page Header */}
      <div className="shrink-0">
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-slate-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Compliance</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center shadow-sm border border-indigo-100 dark:border-indigo-800/30">
                <Scale size={24} />
              </div>
              Data Governance & Compliance
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Manage regulatory frameworks, data retention policies, GDPR/CCPA subject requests, and privacy consent constraints globally.</p>
          </div>
        </div>
      </div>

      {/* Sub-menu Grid */}
      <div className="shrink-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
        {SUB_MENUS.map(menu => {
          const Icon = menu.icon;
          const isActive = activeMenu === menu.id;
          
          return (
            <button
              key={menu.id}
              onClick={() => setActiveMenu(menu.id)}
              className={`flex flex-col items-center justify-center p-4 gap-2 rounded-2xl border text-center transition-all ${
                isActive 
                  ? `${menu.tabClass} shadow-sm scale-[1.02]`
                  : 'bg-white dark:bg-[#0F172A] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? menu.iconClass : 'opacity-70'} />
              <span className="text-[11px] font-bold uppercase tracking-wider">{menu.id}</span>
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
