'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import { 
  DatabaseBackup, ShieldAlert, Cloud, HardDrive, RefreshCw, 
  Settings, Clock, FileArchive, DownloadCloud, Save, CheckCircle,
  RotateCcw, History, AlertTriangle, Play
} from 'lucide-react';

import DisasterRecoveryView from './DisasterRecoveryView';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  { id: "Backup Dashboard", icon: DatabaseBackup, color: "blue", tabClass: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400", iconClass: "text-blue-600 dark:text-blue-400" },
  { id: "Backup Rules & Schedules", icon: Clock, color: "indigo", tabClass: "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800/50 dark:text-indigo-400", iconClass: "text-indigo-600 dark:text-indigo-400" },
  { id: "Restore Center", icon: RotateCcw, color: "emerald", tabClass: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400", iconClass: "text-emerald-600 dark:text-emerald-400" },
  { id: "Disaster Recovery", icon: ShieldAlert, color: "orange", tabClass: "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800/50 dark:text-orange-400", iconClass: "text-orange-600 dark:text-orange-400" }
];

const mockBackupHistory = [
  { id: 'BKP-7721', type: 'Full Platform Backup', size: '145.2 GB', duration: '45m 12s', status: 'Success', date: '2026-09-28 02:00 AM' },
  { id: 'BKP-7720', type: 'Incremental DB Snapshot', size: '2.4 GB', duration: '2m 14s', status: 'Success', date: '2026-09-28 08:00 AM' },
  { id: 'BKP-7719', type: 'Tenant Isolated (StudyNest)', size: '4.1 GB', duration: '5m 01s', status: 'Failed', date: '2026-09-28 09:00 AM' },
  { id: 'BKP-7718', type: 'User Media & Assets', size: '12.8 GB', duration: '18m 42s', status: 'Success', date: '2026-09-27 11:30 PM' },
  { id: 'BKP-7717', type: 'Incremental DB Snapshot', size: '2.1 GB', duration: '1m 58s', status: 'Success', date: '2026-09-27 08:00 PM' },
];

export default function BackupRecoveryPage() {
  const [activeMenu, setActiveMenu] = useState("Backup Dashboard");
  const [targetType, setTargetType] = useState('Full Platform');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const gridRef = useRef<AgGridReact>(null);

  const colDefs = useMemo<any[]>(() => [
    { field: 'id', headerName: 'Job ID', flex: 1, minWidth: 120, cellClass: 'font-bold font-mono text-gray-700 dark:text-gray-300' },
    { field: 'type', headerName: 'Backup Type', flex: 2, minWidth: 220, cellClass: 'font-extrabold text-gray-900 dark:text-white' },
    { field: 'size', headerName: 'Size', flex: 1, minWidth: 120, cellClass: 'font-bold' },
    { field: 'duration', headerName: 'Duration', flex: 1, minWidth: 120 },
    { field: 'date', headerName: 'Timestamp', flex: 1.5, minWidth: 160 },
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 120, cellRenderer: (p: ICellRendererParams) => {
      if (p.value === 'Success') return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800/40 dark:text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 w-fit"><CheckCircle size={10}/> Success</span>;
      return <span className="bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:border-rose-800/40 dark:text-rose-400 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 w-fit"><AlertTriangle size={10}/> Failed</span>;
    }},
    { headerName: 'Action', flex: 1, minWidth: 120, cellRenderer: () => (
      <button className="text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1">
        <DownloadCloud size={14} /> Download
      </button>
    )}
  ], []);

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setProcessed(true);
      setTimeout(() => setProcessed(false), 3000);
    }, 1500);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "Disaster Recovery":
        return <DisasterRecoveryView />;

      case "Backup Rules & Schedules":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 p-8 flex flex-col items-center justify-center min-h-[500px]">
             <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6 shadow-sm border border-indigo-200 dark:border-indigo-800">
               <Clock size={40} />
             </div>
             <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Automated Backup Schedules</h2>
             <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 text-center font-medium">Configure CRON jobs for daily full backups and hourly incremental snapshots.</p>
             <div className="w-full max-w-2xl bg-gray-50 dark:bg-[#1E293B] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-8 text-center">
               <Settings size={32} className="text-gray-400 mx-auto mb-4" />
               <p className="text-gray-500 font-bold">Policy Editor UI Component</p>
               <button className="mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700 transition-colors">Configure New Policy</button>
             </div>
          </div>
        )

      case "Restore Center":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-emerald-50/50 dark:bg-emerald-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <RotateCcw size={24} /> System Restoration Center
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Rollback databases or specific library files to a previous point in time.</p>
              </div>
            </div>

            <form onSubmit={handleAction} className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Select Restore Target</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Full Platform', 'Database Only', 'File Storage', 'Library Isolate'].map(type => (
                      <label key={type} className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center flex flex-col items-center justify-center gap-2 ${targetType === type ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 bg-white dark:bg-[#0F172A]'}`}>
                        <input type="radio" name="restore_type" value={type} checked={targetType === type} onChange={e => setTargetType(e.target.value)} className="hidden" />
                        {type === 'Full Platform' && <DatabaseBackup size={20}/>}
                        {type === 'Database Only' && <DatabaseBackup size={20}/>}
                        {type === 'File Storage' && <HardDrive size={20}/>}
                        {type === 'Library Isolate' && <FileArchive size={20}/>}
                        <span className="text-[11px] font-extrabold uppercase">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {targetType === 'Library Isolate' && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Target Tenant Library</label>
                    <select className="w-full p-4 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-emerald-500 font-bold shadow-inner">
                      <option>StudyNest Patna (ID: SN-001)</option>
                      <option>Readers Den Delhi (ID: RD-092)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Select Restore Point</label>
                  <select className="w-full p-4 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-emerald-500 font-mono shadow-inner font-bold">
                    <option>v4.2.1-db-snapshot-20260927-0200.sql (24.1 GB)</option>
                    <option>v4.2.1-db-snapshot-20260926-0200.sql (23.9 GB)</option>
                    <option>v4.2.0-full-backup-20260925.tar.gz (145.2 GB)</option>
                  </select>
                </div>
              </div>

              <div className="lg:w-1/3 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/30 p-8 rounded-2xl flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="text-sm font-extrabold text-rose-800 dark:text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2"><ShieldAlert size={18} /> Danger Zone</h3>
                  <p className="text-xs text-rose-700 dark:text-rose-300 font-medium leading-relaxed">Executing a restore will <strong className="font-extrabold">OVERWRITE</strong> current live data. All changes made after the selected restore point will be permanently lost and cannot be undone.</p>
                  <div className="mt-4 flex items-start gap-3">
                    <input type="checkbox" required className="mt-1 w-4 h-4 text-rose-600 rounded border-rose-300" />
                    <label className="text-xs text-rose-800 dark:text-rose-300 font-bold">I acknowledge the risks and confirm I want to overwrite the current active data.</label>
                  </div>
                </div>
                <div className="pt-6 mt-6 border-t border-rose-200 dark:border-rose-800/50">
                  <button type="submit" disabled={isProcessing} className="w-full py-4 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                    {isProcessing ? <RefreshCw size={18} className="animate-spin" /> : <Play size={18} />}
                    {isProcessing ? 'Initializing Environment...' : 'Commence Restore Operation'}
                  </button>
                  {processed && <p className="text-emerald-600 text-xs font-bold mt-4 text-center flex items-center justify-center gap-1.5"><CheckCircle size={14} /> Restore Sequence Initiated</p>}
                </div>
              </div>
            </form>
          </div>
        );

      case "Backup Dashboard":
      default:
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col min-h-[600px]">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-blue-50/50 dark:bg-[#0D1F3C]/50 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-extrabold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <History size={24} /> Backup Job History
                </h3>
                <p className="text-sm font-medium text-gray-500 mt-1">Monitor automated jobs and manual backups across the platform.</p>
              </div>
              <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                <DatabaseBackup size={16} /> Run Manual Backup
              </button>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0">
                <AgGridReact
                  ref={gridRef}
                  theme={gridTheme}
                  rowData={mockBackupHistory}
                  columnDefs={colDefs}
                  rowHeight={56}
                  headerHeight={48}
                  onGridReady={(e) => e.api.sizeColumnsToFit()}
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
          <span>Nexus 360</span><span>/</span><span className="text-blue-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Backup & Recovery</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm border border-blue-200/50 dark:border-blue-800/50">
                <DatabaseBackup size={24} />
              </div>
              Global Backup & Disaster Recovery
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Manage automated snapshots, execute database restorations, and oversee multi-region disaster recovery failovers.</p>
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
