'use client';
import { useState } from 'react';
import { 
  DatabaseBackup, ShieldAlert, Cloud, HardDrive, RefreshCw, 
  Settings, Clock, FileArchive, DownloadCloud, Save, CheckCircle
} from 'lucide-react';

import DisasterRecoveryView from './DisasterRecoveryView';

const SUB_MENUS = [
  "Backup Dashboard", "Global Backup", "Library Backup", "Database Backup", 
  "File Backup", "Automatic Backup", "Backup Schedule", "Backup History", 
  "Backup Storage", "Restore", "Restore History", "Disaster Recovery", "Recovery Testing"
];

export default function BackupRecoveryPage() {
  const [activeMenu, setActiveMenu] = useState("Backup Dashboard");
  const [targetType, setTargetType] = useState('Full Platform');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

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
      case "Recovery Testing":
        return <DisasterRecoveryView />;

      case "Restore":
      case "Restore History":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-teal-50/50 dark:bg-teal-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-teal-600 dark:text-teal-400 flex items-center gap-2">
                  <DownloadCloud size={24} /> System Restoration
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Rollback databases or files to a specific point in time.</p>
              </div>
            </div>

            <form onSubmit={handleAction} className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Select Restore Target</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Full Restore', 'Database Restore', 'File Restore', 'Library Restore'].map(type => (
                      <label key={type} className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${targetType === type ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'}`}>
                        <input type="radio" name="restore_type" value={type} checked={targetType === type} onChange={e => setTargetType(e.target.value)} className="hidden" />
                        <span className="text-xs font-bold">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {targetType === 'Library Restore' && (
                  <div className="animate-in fade-in">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Target Tenant Library</label>
                    <select className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-teal-500 font-bold">
                      <option>StudyNest Patna (ID: SN-001)</option>
                      <option>Readers Den Delhi (ID: RD-092)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Select Restore Point</label>
                  <select className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-teal-500 font-mono">
                    <option>v4.2.1-db-snapshot-20260927-0200.sql (24.1 GB)</option>
                    <option>v4.2.1-db-snapshot-20260926-0200.sql (23.9 GB)</option>
                    <option>v4.2.0-full-backup-20260925.tar.gz (145.2 GB)</option>
                  </select>
                </div>
              </div>

              <div className="lg:w-1/3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-red-800 dark:text-red-400 uppercase mb-2 flex items-center gap-2"><ShieldAlert size={16} /> Danger Zone</h3>
                  <p className="text-xs text-red-700 dark:text-red-300 font-medium">Executing a restore will overwrite current live data. All changes made after the selected restore point will be permanently lost.</p>
                </div>
                <div className="pt-6 mt-6 border-t border-red-200 dark:border-red-800/50">
                  <button type="submit" disabled={isProcessing} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                    {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <RotateCcw size={16} />}
                    {isProcessing ? 'Initializing Restore...' : 'Confirm Restore'}
                  </button>
                  {processed && <p className="text-emerald-600 text-xs font-bold mt-2 text-center flex items-center justify-center gap-1"><CheckCircle size={12} /> Restore Queued</p>}
                </div>
              </div>
            </form>
          </div>
        );

      case "Backup Dashboard":
      case "Global Backup":
      case "Library Backup":
      case "Automatic Backup":
      default:
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-teal-50/50 dark:bg-teal-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-teal-600 dark:text-teal-400 flex items-center gap-2">
                  <DatabaseBackup size={24} /> Backup Management
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Configure automated snapshots or trigger manual backups instantly.</p>
              </div>
            </div>

            <form onSubmit={handleAction} className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Execution Mode</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="backup_mode" value="Manual" defaultChecked className="w-4 h-4 text-teal-600" />
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Manual Backup (Run Now)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="backup_mode" value="Auto" className="w-4 h-4 text-teal-600" />
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Update Auto-Schedule</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Scope Target</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Full Platform', 'Database Only', 'Files Only', 'Selected Library'].map(type => (
                      <label key={type} className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${targetType === type ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'}`}>
                        <input type="radio" name="target_type" value={type} checked={targetType === type} onChange={e => setTargetType(e.target.value)} className="hidden" />
                        <span className="text-xs font-bold">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {targetType === 'Selected Library' && (
                  <div className="animate-in fade-in">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Target Tenant Library</label>
                    <select className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-teal-500 font-bold">
                      <option>StudyNest Patna (ID: SN-001)</option>
                      <option>Readers Den Delhi (ID: RD-092)</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="lg:w-1/3 bg-gray-50 dark:bg-[#0D1F3C] border border-gray-100 dark:border-gray-800 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase mb-4 flex items-center gap-2"><HardDrive size={16} /> Storage Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs border-b border-gray-200 dark:border-gray-700 pb-2">
                      <span className="text-gray-500">Destination</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1"><Cloud size={12} /> AWS S3 (MUM-1)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-b border-gray-200 dark:border-gray-700 pb-2">
                      <span className="text-gray-500">Estimated Size</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">~ 25 GB</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-b border-gray-200 dark:border-gray-700 pb-2">
                      <span className="text-gray-500">Encryption</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">AES-256 Enabled</span>
                    </div>
                  </div>
                </div>
                <div className="pt-6 mt-6">
                  <button type="submit" disabled={isProcessing} className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                    {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                    {isProcessing ? 'Triggering Job...' : 'Start Backup'}
                  </button>
                  {processed && <p className="text-emerald-600 text-xs font-bold mt-2 text-center flex items-center justify-center gap-1"><CheckCircle size={12} /> Backup Job Started</p>}
                </div>
              </div>
            </form>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Page Header */}
      <div>
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-teal-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Backups & DR</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl shadow-sm border border-teal-200/50 dark:border-teal-800/50">
                <DatabaseBackup size={28} className="text-teal-600 dark:text-teal-400" />
              </div>
              Backup & Disaster Recovery
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Manage automated snapshots, execute point-in-time restorations, and configure platform failover strategies.</p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 rounded-lg text-sm font-bold shadow-sm">
            <CheckCircle size={16} /> Last Auto-Backup: 4 Hrs Ago
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
                ? 'bg-teal-600 text-white shadow-teal-600/20 scale-105' 
                : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-teal-50 dark:hover:bg-[#1E293B] hover:text-teal-600 hover:border-teal-200'
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
