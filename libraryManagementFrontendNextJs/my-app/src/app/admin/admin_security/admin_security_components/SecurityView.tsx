'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, ShieldCheck, KeyRound, MonitorSmartphone, Activity,
  Ban, Lock, Unlock, LogOut, Search, Clock, ServerCrash, Smartphone,
  Monitor, AlertTriangle, Fingerprint, Eye, Settings
} from 'lucide-react';

const SIDEBAR_MENU = [
  { id: 'dashboard', label: 'Security Dashboard', icon: ShieldCheck },
  { id: 'login', label: 'Login Security', icon: KeyRound },
  { id: 'password', label: 'Password Policy', icon: Settings },
  { id: 'sessions', label: 'Session Management', icon: MonitorSmartphone },
  { id: 'active', label: 'Active Sessions', icon: Activity },
  { id: 'failed', label: 'Failed Logins', icon: ServerCrash },
  { id: 'blocked', label: 'Blocked Users', icon: Ban },
  { id: 'devices', label: 'Device Sessions', icon: Smartphone },
  { id: 'events', label: 'Security Events', icon: ShieldAlert },
];

const MOCK_ACTIVE_SESSIONS = [
  { id: 'SES-001', user: 'Mike Johnson', role: 'Manager', branch: 'Central Hub', ip: '192.168.1.15', device: 'Windows 11 / Chrome', started: '09:00 AM Today', status: 'Active' },
  { id: 'SES-002', user: 'Sarah Smith', role: 'Manager', branch: 'Northside', ip: '10.0.0.45', device: 'MacBook Pro / Safari', started: '10:30 AM Today', status: 'Active' },
];

const MOCK_FAILED_LOGINS = [
  { id: 'FL-001', user: 'robert_lee (Attempt)', ip: '203.0.113.42', device: 'Linux / Firefox', time: '11:45 AM Today', reason: 'Invalid Password (x3)', status: 'Warning' },
  { id: 'FL-002', user: 'admin_hack_try', ip: '185.15.22.99', device: 'Unknown / Python-Requests', time: '02:15 AM Today', reason: 'Account Locked (x10)', status: 'Blocked' },
];

const MOCK_BLOCKED_USERS = [
  { id: 'USR-B01', user: 'Robert Lee', role: 'Manager', branch: 'East Wing', lockDate: '28 Sep 2026', reason: 'Multiple failed logins', status: 'Locked' },
];

export default function SecurityView() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [notice, setNotice] = useState('');
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(v => v === message ? '' : v), 2200); };
  
  // Password Policy States
  const [minLen, setMinLen] = useState('8');
  const [reqNum, setReqNum] = useState(true);
  const [reqSpecial, setReqSpecial] = useState(true);
  const [req2FA, setReq2FA] = useState(true);

  const handleAction = (action: string, target: string) => {
    notify(action + ' successfully executed for ' + target + '.');
  };

  return (
    <div className="w-full max-w-full space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
            <ShieldAlert size={28} className="text-red-600" /> Library Security
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor manager sessions, failed logins, and enforce library-level access policies.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* SIDEBAR SUB-MENU */}
        <div className="w-full lg:w-64 flex flex-col gap-1 shrink-0 bg-card border border-border p-3 rounded-2xl shadow-sm h-[650px] overflow-y-auto custom-scrollbar">
          {SIDEBAR_MENU.map((menu) => {
             const isActive = activeMenu === menu.id;
             return (
              <button
                key={menu.id}
                onClick={() => setActiveMenu(menu.id)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-red-600 text-white shadow-md scale-[1.02]' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <menu.icon size={18} className={isActive ? 'text-white' : 'text-red-500/70'} />
                  <span className="font-medium text-sm">{menu.label}</span>
                </div>
              </button>
             );
          })}
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 w-full bg-card border border-border rounded-2xl shadow-sm overflow-hidden min-h-[650px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              
              {/* --- SECURITY DASHBOARD --- */}
              {activeMenu === 'dashboard' && (
                <div className="p-6 h-full flex flex-col bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <ShieldCheck className="text-red-500" /> Security Overview
                   </h2>
                   
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <div className="p-5 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl text-white shadow-lg">
                         <p className="text-white/80 font-medium text-sm uppercase tracking-wider mb-1">Failed Logins (24h)</p>
                         <h3 className="text-4xl font-extrabold">24</h3>
                         <div className="mt-4 pt-4 border-t border-white/20 text-xs flex justify-between font-bold">
                           <span>Blocked IPs:</span><span>3</span>
                         </div>
                      </div>
                      <div className="p-5 bg-card border border-border rounded-2xl">
                         <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center mb-3"><Activity size={20}/></div>
                         <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Active Sessions</p>
                         <h3 className="text-2xl font-bold text-foreground">15</h3>
                      </div>
                      <div className="p-5 bg-card border border-border rounded-2xl">
                         <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center mb-3"><Ban size={20}/></div>
                         <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Locked Accounts</p>
                         <h3 className="text-2xl font-bold text-foreground">2</h3>
                      </div>
                      <div className="p-5 bg-card border border-border rounded-2xl">
                         <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center mb-3"><Fingerprint size={20}/></div>
                         <p className="text-muted-foreground text-xs uppercase font-bold mb-1">2FA Compliance</p>
                         <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">100%</h3>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="border border-border bg-card rounded-xl p-5 shadow-sm">
                         <h3 className="font-bold mb-4 flex items-center gap-2"><ServerCrash size={18} className="text-red-500"/> Recent Security Events</h3>
                         <div className="space-y-4">
                           {MOCK_FAILED_LOGINS.map((log, i) => (
                             <div key={i} className="flex gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                               <div className="mt-1"><AlertTriangle size={16} className={log.status === 'Blocked' ? 'text-red-500' : 'text-orange-500'}/></div>
                               <div>
                                 <p className="text-sm font-bold">{log.reason} - {log.user}</p>
                                 <p className="text-xs text-muted-foreground mt-0.5">IP: {log.ip} • {log.time}</p>
                               </div>
                             </div>
                           ))}
                         </div>
                      </div>
                      
                      <div className="border border-border bg-card rounded-xl p-5 shadow-sm">
                         <h3 className="font-bold mb-4 flex items-center gap-2"><Settings size={18} className="text-slate-500"/> Policy Status</h3>
                         <div className="space-y-4 text-sm">
                           <div className="flex justify-between items-center"><span className="text-muted-foreground">Manager 2FA Required</span><span className="font-bold text-emerald-600 flex items-center gap-1"><ShieldCheck size={14}/> Enforced</span></div>
                           <div className="flex justify-between items-center"><span className="text-muted-foreground">Session Timeout</span><span className="font-bold">30 Minutes</span></div>
                           <div className="flex justify-between items-center"><span className="text-muted-foreground">Max Login Attempts</span><span className="font-bold">5 Attempts</span></div>
                           <div className="flex justify-between items-center"><span className="text-muted-foreground">Password Expiry</span><span className="font-bold">90 Days</span></div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {/* --- ACTIVE SESSIONS & FORCE LOGOUT --- */}
              {['sessions', 'active'].includes(activeMenu) && (
                <div className="p-6 h-full flex flex-col bg-background">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                     <h2 className="text-2xl font-bold flex items-center gap-2">
                       <MonitorSmartphone className="text-blue-500" /> Manager Sessions
                     </h2>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">View currently active manager sessions across all branches. You can forcefully terminate any suspicious session.</p>

                  <div className="grid grid-cols-1 gap-4 overflow-y-auto custom-scrollbar">
                    {MOCK_ACTIVE_SESSIONS.map(session => (
                      <div key={session.id} className="p-5 border border-border rounded-2xl bg-card hover:border-blue-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                         
                         <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center border border-blue-100 dark:border-blue-900/50 shrink-0">
                               {session.device.includes('Mac') || session.device.includes('Win') ? <Monitor size={24} /> : <Smartphone size={24}/>}
                            </div>
                            <div>
                               <h3 className="font-bold text-lg leading-tight">{session.user} <span className="text-xs font-normal text-muted-foreground">({session.role})</span></h3>
                               <p className="text-sm text-muted-foreground mt-1">IP: {session.ip} • {session.device}</p>
                               <div className="flex gap-2 mt-2 items-center">
                                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                 <span className="text-xs text-muted-foreground font-bold">Started: {session.started}</span>
                                 <span className="text-xs text-muted-foreground">• {session.branch}</span>
                               </div>
                            </div>
                         </div>

                         <div className="flex flex-col items-end gap-3">
                            <button onClick={() => handleAction('Force Logout', session.user)} className="px-4 py-2 border border-red-200 dark:border-red-900/50 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                              <LogOut size={16}/> Force Logout
                            </button>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- BLOCKED USERS & UNLOCK --- */}
              {activeMenu === 'blocked' && (
                <div className="p-6 h-full flex flex-col bg-background">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-bold flex items-center gap-2">
                       <Ban className="text-orange-500" /> Locked Accounts
                     </h2>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">Accounts locked due to security policy violations (e.g., too many failed logins).</p>

                  <div className="grid grid-cols-1 gap-4 overflow-y-auto custom-scrollbar">
                    {MOCK_BLOCKED_USERS.map(user => (
                      <div key={user.id} className="p-5 border border-border rounded-2xl bg-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border-l-4 border-l-orange-500">
                         
                         <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center shrink-0">
                               <Lock size={24} />
                            </div>
                            <div>
                               <h3 className="font-bold text-lg leading-tight">{user.user} <span className="text-xs font-normal text-muted-foreground">({user.role})</span></h3>
                               <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-1">Reason: {user.reason}</p>
                               <p className="text-xs text-muted-foreground mt-2">Locked since: {user.lockDate}</p>
                            </div>
                         </div>

                         <div className="flex flex-col items-end gap-3">
                            <button onClick={() => handleAction('Account Unlock', user.user)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-md">
                              <Unlock size={16}/> Unlock Account
                            </button>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- PASSWORD POLICY --- */}
              {activeMenu === 'password' && (
                <div className="p-6 h-full flex flex-col bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <KeyRound className="text-purple-500" /> Library Password Policy
                   </h2>
                   
                   <div className="max-w-3xl border border-border bg-card rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-xl mb-4">
                        <p className="text-sm font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2"><ShieldCheck size={16}/> Policy Enforcement</p>
                        <p className="text-xs mt-1 text-blue-700 dark:text-blue-400">Settings applied here affect all Staff and Managers within this library. Global policies set by SuperAdmin cannot be overridden to a weaker standard.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <label className="text-sm font-bold uppercase text-muted-foreground">Minimum Password Length</label>
                           <select value={minLen} onChange={(e)=>setMinLen(e.target.value)} className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold">
                             <option value="6">6 Characters</option>
                             <option value="8">8 Characters (Recommended)</option>
                             <option value="12">12 Characters (High Security)</option>
                           </select>
                         </div>

                         <div className="flex items-center justify-between p-4 border border-border bg-background rounded-xl">
                            <div>
                               <h4 className="font-bold text-sm">Require Numbers</h4>
                               <p className="text-xs text-muted-foreground">Must contain at least 1 number</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={reqNum} onChange={()=>setReqNum(!reqNum)} />
                              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                         </div>

                         <div className="flex items-center justify-between p-4 border border-border bg-background rounded-xl">
                            <div>
                               <h4 className="font-bold text-sm">Require Special Characters</h4>
                               <p className="text-xs text-muted-foreground">Must contain @, #, $, etc.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={reqSpecial} onChange={()=>setReqSpecial(!reqSpecial)} />
                              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                         </div>

                         <div className="flex items-center justify-between p-4 border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-900/30 rounded-xl md:col-span-2">
                            <div className="flex gap-3">
                               <Fingerprint size={24} className="text-emerald-600 mt-1"/>
                               <div>
                                 <h4 className="font-bold text-emerald-800 dark:text-emerald-400">Two-Factor Auth (2FA) for Managers</h4>
                                 <p className="text-xs text-emerald-700 dark:text-emerald-500 max-w-md">Require all library managers to set up 2FA via authenticator app. (Mandated by SuperAdmin Policy).</p>
                               </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={req2FA} disabled />
                              <div className="w-11 h-6 bg-emerald-600 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:translate-x-full after:border-white opacity-80 cursor-not-allowed"></div>
                            </label>
                         </div>
                      </div>
                      
                      <div className="pt-6 border-t border-border flex justify-end">
                         <button onClick={() => handleAction('Policy Update', 'Library')} className="px-8 py-3 bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-md">
                           Save Policy Settings
                         </button>
                      </div>
                   </div>
                </div>
              )}


              {!['dashboard', 'active', 'sessions', 'blocked', 'password'].includes(activeMenu) && (
                <div className="p-6 bg-background space-y-6 h-full overflow-y-auto">
                  <div><h2 className="text-2xl font-bold flex items-center gap-2"><ShieldAlert className="text-red-500"/> {SIDEBAR_MENU.find(m=>m.id===activeMenu)?.label}</h2><p className="text-sm text-muted-foreground mt-1">Review security events and apply Admin-side controls.</p></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(activeMenu==='login' ? [
                      ['Login Attempts','5 per account','Policy'],['Lockout Window','30 minutes','Policy'],['Captcha','After 3 failures','Enabled'],['IP Protection','Auto block','Enabled']
                    ] : activeMenu==='failed' ? MOCK_FAILED_LOGINS.map(x=>[x.user,x.ip,x.reason]) : activeMenu==='devices' ? MOCK_ACTIVE_SESSIONS.map(x=>[x.user,x.device,x.ip]) : [
                      ['Event Monitoring','Enabled','Live'],['Security Alerts','2 critical','Attention'],['Audit Retention','365 days','Policy'],['Last Review','29 Sep 2026','Admin']
                    ]).map(([a,b,c],i)=><div key={i} className="p-5 rounded-xl border border-border bg-card"><p className="font-bold">{a}</p><p className="text-sm text-muted-foreground mt-1">{b}</p><p className="text-xs mt-3 font-semibold text-red-500">{c}</p></div>)}
                  </div>
                  <button onClick={()=>handleAction(activeMenu.replace('_',' ')+' configuration update','Library Security')} className="px-6 py-2.5 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-bold shadow-sm">Save Security Settings</button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {notice && <div className="fixed right-5 bottom-5 z-50 rounded-xl border border-border bg-card shadow-xl px-4 py-3 text-sm font-semibold">{notice}</div>}
    </div>
  );
}
