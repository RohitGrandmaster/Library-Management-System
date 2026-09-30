'use client';
import { useState } from 'react';
import { 
  ShieldAlert, Lock, Fingerprint, Activity, ListOrdered, 
  Ban, ShieldX, Network, FileWarning, Eye, AlertCircle
} from 'lucide-react';

export default function SecurityCenterPage() {
  const [activeTab, setActiveTab] = useState('Login Security');

  const tabs = [
    { name: 'Dashboard', icon: Activity },
    { name: 'Login Security', icon: Lock },
    { name: 'Password Policy', icon: ListOrdered },
    { name: '2FA', icon: Fingerprint },
    { name: 'Active Sessions', icon: Network },
    { name: 'Failed Logins', icon: ShieldX },
    { name: 'IP Restrictions', icon: Ban },
    { name: 'Security Logs', icon: FileWarning },
  ];

  return (
    <div className="sa-page-animate">
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Nexus 360</span><span>/</span><span>Super Admin</span><span>/</span><span>Security Center</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title flex items-center gap-3">
            <ShieldAlert className="text-rose-500" size={28} /> Security Center
          </h1>
          <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
            <AlertCircle size={14} /> Restricted: SuperAdmin Only
          </span>
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
                ? 'bg-rose-500/20 text-white border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon size={16} /> {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="sa-card p-6 h-[600px] overflow-y-auto">
        {activeTab === 'Login Security' && (
          <div className="max-w-2xl space-y-8 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white mb-2">Login Security Settings</h2>
              <p className="text-sm text-secondary mb-6">Configure brute force protection and timeout settings across the platform.</p>
              
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Max Failed Attempts</label>
                  <input type="number" defaultValue={5} className="sa-input w-full max-w-xs" />
                  <span className="text-xs text-secondary">Number of consecutive failed logins before temporary lockout.</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Lock Duration (Minutes)</label>
                  <input type="number" defaultValue={30} className="sa-input w-full max-w-xs" />
                  <span className="text-xs text-secondary">How long an account stays locked after reaching max failed attempts.</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Session Timeout (Minutes)</label>
                  <input type="number" defaultValue={60} className="sa-input w-full max-w-xs" />
                  <span className="text-xs text-secondary">Automatically log out inactive users after this duration.</span>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button className="sa-btn-primary bg-rose-600 hover:bg-rose-500 border-none shadow-[0_0_15px_rgba(225,29,72,0.4)]">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Password Policy' && (
          <div className="max-w-2xl space-y-8 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white mb-2">Password Policy</h2>
              <p className="text-sm text-secondary mb-6">Enforce strong password rules for all Admins and Managers.</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div>
                    <h3 className="text-sm font-bold text-white">Require Uppercase Letter</h3>
                    <p className="text-xs text-secondary mt-1">Passwords must contain at least one uppercase letter (A-Z).</p>
                  </div>
                  <div className="sa-toggle-track sa-toggle-track--on"><div className="sa-toggle-thumb sa-toggle-thumb--on"></div></div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div>
                    <h3 className="text-sm font-bold text-white">Require Special Character</h3>
                    <p className="text-xs text-secondary mt-1">Passwords must contain at least one symbol (!@#$%^&*).</p>
                  </div>
                  <div className="sa-toggle-track sa-toggle-track--on"><div className="sa-toggle-thumb sa-toggle-thumb--on"></div></div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <label className="text-sm font-semibold text-white/80">Minimum Password Length</label>
                  <input type="number" defaultValue={12} className="sa-input w-full max-w-xs" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Password Expiry (Days)</label>
                  <input type="number" defaultValue={90} className="sa-input w-full max-w-xs" />
                  <span className="text-xs text-secondary">Set to 0 to disable password expiry.</span>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button className="sa-btn-primary bg-rose-600 hover:bg-rose-500 border-none shadow-[0_0_15px_rgba(225,29,72,0.4)]">
                    Enforce Policy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'Login Security' && activeTab !== 'Password Policy' && (
          <div className="flex-1 h-full flex flex-col items-center justify-center text-white/40">
            <Lock size={48} className="mb-4 opacity-30" />
            <p className="text-lg font-medium">{activeTab} Data</p>
            <p className="text-sm mt-1 text-center max-w-md">This high-security module restricts data access. Audit trails, 2FA, and Session logs are currently locked under SuperAdmin RBAC.</p>
          </div>
        )}
      </div>
    </div>
  );
}
