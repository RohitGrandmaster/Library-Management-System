'use client';
import { useState } from 'react';
import { 
  ShieldAlert, Lock, Fingerprint, Activity, ListOrdered, 
  Ban, ShieldX, Network, FileWarning, AlertCircle, CheckCircle, Smartphone, Trash2
} from 'lucide-react';

export default function SecurityCenterPage() {
  const [activeTab, setActiveTab] = useState('Login Security');
  const [saved, setSaved] = useState(false);

  // States
  const [loginSec, setLoginSec] = useState({ maxFailed: 5, lockDuration: 30, sessionTimeout: 60, forceLogout: false });
  const [passPol, setPassPol] = useState({ upper: true, symbol: true, length: 12, expiry: 90 });
  const [twoFA, setTwoFA] = useState({ enabled: true, method: 'Authenticator App' });
  
  const [sessions, setSessions] = useState([
    { id: 1, ip: '192.168.1.45', device: 'MacBook Pro - Chrome', time: 'Active Now', location: 'Mumbai, IN' },
    { id: 2, ip: '10.0.0.12', device: 'iPhone 13 - Safari', time: '2 hours ago', location: 'Pune, IN' },
  ]);

  const [failedLogins, setFailedLogins] = useState([
    { id: 1, ip: '45.33.22.11', user: 'admin@library.com', time: '10 mins ago', reason: 'Invalid Password' },
    { id: 2, ip: '194.22.11.9', user: 'unknown', time: '1 hour ago', reason: 'User not found' },
  ]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleForceLogout = (id: number) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const tabs = [
    { name: 'Login Security', icon: Lock },
    { name: 'Password Policy', icon: ListOrdered },
    { name: '2FA', icon: Fingerprint },
    { name: 'Active Sessions', icon: Network },
    { name: 'Failed Logins', icon: ShieldX },
  ];

  return (
    <div className="sa-page-animate relative">
      {saved && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-rose-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <CheckCircle size={16} /> Security settings updated successfully!
        </div>
      )}

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
          <div className="max-w-2xl space-y-6 animate-fade-in">
            <h2 className="text-lg font-bold text-white mb-2">Login Security Settings</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white/80">Max Failed Attempts</label>
                <input type="number" className="sa-input" value={loginSec.maxFailed} onChange={e => setLoginSec(p => ({...p, maxFailed: Number(e.target.value)}))} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white/80">Lockout Duration (Mins)</label>
                <input type="number" className="sa-input" value={loginSec.lockDuration} onChange={e => setLoginSec(p => ({...p, lockDuration: Number(e.target.value)}))} />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-sm font-semibold text-white/80">Session Timeout (Mins of inactivity)</label>
                <input type="number" className="sa-input max-w-xs" value={loginSec.sessionTimeout} onChange={e => setLoginSec(p => ({...p, sessionTimeout: Number(e.target.value)}))} />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl mt-6">
              <div>
                <h3 className="text-sm font-bold text-white">Force Logout on Password Reset</h3>
                <p className="text-xs text-secondary mt-1">Automatically logs out all other sessions if password changes.</p>
              </div>
              <button 
                onClick={() => setLoginSec(p => ({...p, forceLogout: !p.forceLogout}))}
                className={`w-12 h-6 rounded-full relative transition-colors ${loginSec.forceLogout ? 'bg-rose-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${loginSec.forceLogout ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="pt-4 border-t border-white/5">
              <button onClick={handleSave} className="sa-btn-primary bg-rose-600 hover:bg-rose-500 border-none">Save Security Rules</button>
            </div>
          </div>
        )}

        {activeTab === 'Password Policy' && (
          <div className="max-w-2xl space-y-6 animate-fade-in">
            <h2 className="text-lg font-bold text-white mb-2">Password Policy</h2>
            
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div>
                <h3 className="text-sm font-bold text-white">Require Uppercase Letter</h3>
                <p className="text-xs text-secondary mt-1">Passwords must contain at least one uppercase letter (A-Z).</p>
              </div>
              <button 
                onClick={() => setPassPol(p => ({...p, upper: !p.upper}))}
                className={`w-12 h-6 rounded-full relative transition-colors ${passPol.upper ? 'bg-rose-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${passPol.upper ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div>
                <h3 className="text-sm font-bold text-white">Require Special Character</h3>
                <p className="text-xs text-secondary mt-1">Passwords must contain at least one symbol (!@#$%^&*).</p>
              </div>
              <button 
                onClick={() => setPassPol(p => ({...p, symbol: !p.symbol}))}
                className={`w-12 h-6 rounded-full relative transition-colors ${passPol.symbol ? 'bg-rose-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${passPol.symbol ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white/80">Minimum Password Length</label>
                <input type="number" className="sa-input" value={passPol.length} onChange={e => setPassPol(p => ({...p, length: Number(e.target.value)}))} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white/80">Password Expiry (Days)</label>
                <input type="number" className="sa-input" value={passPol.expiry} onChange={e => setPassPol(p => ({...p, expiry: Number(e.target.value)}))} />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <button onClick={handleSave} className="sa-btn-primary bg-rose-600 hover:bg-rose-500 border-none">Enforce Policy</button>
            </div>
          </div>
        )}

        {activeTab === '2FA' && (
          <div className="max-w-2xl space-y-6 animate-fade-in">
            <h2 className="text-lg font-bold text-white mb-2">Two-Factor Authentication</h2>
            
            <div className="flex items-center justify-between p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
              <div>
                <h3 className="text-sm font-bold text-rose-400">Enforce 2FA System-Wide</h3>
                <p className="text-xs text-rose-200 mt-1">Force all Admins and Managers to use 2FA.</p>
              </div>
              <button 
                onClick={() => setTwoFA(p => ({...p, enabled: !p.enabled}))}
                className={`w-12 h-6 rounded-full relative transition-colors ${twoFA.enabled ? 'bg-rose-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${twoFA.enabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {twoFA.enabled && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white/80">Allowed 2FA Method</label>
                <select className="sa-input bg-black/20" value={twoFA.method} onChange={e => setTwoFA(p => ({...p, method: e.target.value}))}>
                  <option>Authenticator App (Google/Authy)</option>
                  <option>Email OTP</option>
                  <option>SMS OTP</option>
                </select>
              </div>
            )}
            
            <div className="pt-4 border-t border-white/5">
              <button onClick={handleSave} className="sa-btn-primary bg-rose-600 hover:bg-rose-500 border-none">Update 2FA Settings</button>
            </div>
          </div>
        )}

        {activeTab === 'Active Sessions' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-white mb-2">Global Active Sessions</h2>
            <div className="grid gap-3">
              {sessions.map(s => (
                <div key={s.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Smartphone className="text-indigo-400" size={24} />
                    <div>
                      <h4 className="text-sm font-bold text-white">{s.ip}</h4>
                      <p className="text-xs text-secondary mt-1">{s.device} • {s.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-emerald-400 font-bold">{s.time}</span>
                    <button onClick={() => handleForceLogout(s.id)} className="sa-btn-ghost sa-btn-ghost--danger text-xs px-3">Force Logout</button>
                  </div>
                </div>
              ))}
              {sessions.length === 0 && <p className="text-secondary text-sm">No active sessions.</p>}
            </div>
          </div>
        )}

        {activeTab === 'Failed Logins' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-rose-400 mb-2">Failed Login Attempts</h2>
            <div className="grid gap-3">
              {failedLogins.map(f => (
                <div key={f.id} className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <ShieldX className="text-rose-500" size={24} />
                    <div>
                      <h4 className="text-sm font-bold text-rose-300">IP: {f.ip}</h4>
                      <p className="text-xs text-rose-200/50 mt-1">Tried user: {f.user}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-rose-500 font-bold">{f.reason}</span>
                    <span className="text-xs text-secondary mt-1">{f.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
