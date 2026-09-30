'use client';
import { useState } from 'react';
import { 
  Database, CloudUpload, CloudDownload, HardDrive, 
  Settings, AlertTriangle, RotateCcw, Clock, CheckCircle2
} from 'lucide-react';

export default function BackupRestorePage() {
  const [activeTab, setActiveTab] = useState('Create Backup');
  const [showRestoreWarning, setShowRestoreWarning] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState([
    { id: '1', name: 'db_backup_2026_04_11.sql', size: '200MB', type: 'Automatic', date: '11 Apr 2026' }
  ]);

  const handleStartBackup = () => {
    setIsBackingUp(true);
    setProgress(0);
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsBackingUp(false);
            setHistory(prev => [{
              id: Math.random().toString(),
              name: `manual_full_${new Date().toISOString().split('T')[0]}.sql`,
              size: '202MB',
              type: 'Manual',
              date: 'Just now'
            }, ...prev]);
            setActiveTab('Backup History'); // Switch to history tab to show the result
          }, 500);
          return 100;
        }
        return p + 15;
      });
    }, 400);
  };

  const tabs = [
    { name: 'Dashboard', icon: HardDrive },
    { name: 'Create Backup', icon: CloudUpload },
    { name: 'Backup History', icon: Clock }, // Changed from Automatic Backup to make sense for the demo
    { name: 'Restore Data', icon: RotateCcw },
    { name: 'Backup Settings', icon: Settings },
  ];

  return (
    <div className="sa-page-animate">
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Nexus 360</span><span>/</span><span>Super Admin</span><span>/</span><span>Backup & Restore</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title flex items-center gap-3">
            <Database className="text-emerald-500" size={28} /> Backup & Restore
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.name 
                ? 'bg-emerald-500/20 text-white border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon size={16} /> {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="sa-card p-6 h-[600px] overflow-y-auto">
        
        {activeTab === 'Create Backup' && (
          <div className="max-w-3xl space-y-8 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white mb-2">Create New Backup</h2>
              <p className="text-sm text-secondary mb-8">Manually trigger a backup of the platform database and assets.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-5 border border-emerald-500/30 bg-emerald-500/5 rounded-xl cursor-pointer relative overflow-hidden">
                  <div className="absolute top-3 right-3 text-emerald-400"><CheckCircle2 size={20} /></div>
                  <Database className="text-emerald-400 mb-3" size={32} />
                  <h3 className="font-bold text-white text-sm">Full Database</h3>
                  <p className="text-xs text-secondary mt-1">Complete dump of all tables.</p>
                </div>
                <div className="p-5 border border-white/10 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                  <HardDrive className="text-white/50 mb-3" size={32} />
                  <h3 className="font-bold text-white text-sm">Database + Files</h3>
                  <p className="text-xs text-secondary mt-1">Includes user uploads and logs.</p>
                </div>
                <div className="p-5 border border-white/10 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                  <Settings className="text-white/50 mb-3" size={32} />
                  <h3 className="font-bold text-white text-sm">Selected Data</h3>
                  <p className="text-xs text-secondary mt-1">Custom backup selection.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                {!isBackingUp ? (
                  <button onClick={handleStartBackup} className="sa-btn-primary bg-emerald-600 hover:bg-emerald-500 border-none shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                    Start Backup Now
                  </button>
                ) : (
                  <div className="w-full max-w-md">
                    <div className="flex justify-between text-xs text-emerald-400 mb-2">
                      <span>Compressing Database...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-emerald-950 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Restore Data' && (
          <div className="max-w-2xl space-y-8 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white mb-2">Restore from Backup</h2>
              <p className="text-sm text-secondary mb-6">Select a backup file to restore the database to a previous state.</p>
              
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Available Backups</label>
                  <select className="sa-select w-full">
                    <option>db_backup_2026_04_11.sql (Automatic - 200MB)</option>
                    <option>db_backup_2026_04_10.sql (Automatic - 198MB)</option>
                    <option>manual_full_2026_03_15.sql (Manual - 185MB)</option>
                  </select>
                </div>

                {!showRestoreWarning ? (
                  <button 
                    onClick={() => setShowRestoreWarning(true)}
                    className="sa-btn-primary bg-rose-600 hover:bg-rose-500 border-none shadow-[0_0_15px_rgba(225,29,72,0.4)] mt-4"
                  >
                    <CloudDownload size={16} /> Restore Selected Backup
                  </button>
                ) : (
                  <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-xl mt-6 animate-fade-in">
                    <div className="flex items-center gap-3 text-rose-500 mb-4">
                      <AlertTriangle size={24} />
                      <h3 className="font-bold text-lg">CRITICAL WARNING</h3>
                    </div>
                    <p className="text-sm text-rose-200/80 mb-6">
                      This action will <strong>OVERWRITE</strong> all current data in the database with the selected backup. 
                      Any changes made after the backup date will be permanently lost. This action cannot be undone.
                    </p>
                    <div className="flex gap-4">
                      <button className="sa-btn-primary bg-rose-600 hover:bg-rose-500 border-none">
                        Yes, I understand. Restore Data.
                      </button>
                      <button onClick={() => setShowRestoreWarning(false)} className="sa-btn-ghost">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Backup History' && (
          <div className="max-w-4xl space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-white mb-2">Backup History</h2>
            <p className="text-sm text-secondary mb-6">Recent database and file backups generated by the system.</p>
            
            <div className="space-y-3">
              {history.map(b => (
                <div key={b.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <Database className="text-emerald-400" size={24} />
                    <div>
                      <h3 className="text-sm font-bold text-white">{b.name}</h3>
                      <p className="text-xs text-secondary mt-1">{b.date} • {b.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs px-2 py-1 rounded bg-black/20 text-white/60">{b.type}</span>
                    <button className="sa-btn-ghost sa-btn-ghost--sm text-emerald-400 border-emerald-500/30">Download</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab !== 'Create Backup' && activeTab !== 'Restore Data' && activeTab !== 'Backup History' && (
          <div className="flex-1 h-full flex flex-col items-center justify-center text-white/40">
            <Database size={48} className="mb-4 opacity-30" />
            <p className="text-lg font-medium">{activeTab}</p>
            <p className="text-sm mt-1 text-center max-w-md">Configuration panel for AWS S3 automated retention and history tracking.</p>
          </div>
        )}
      </div>
    </div>
  );
}
