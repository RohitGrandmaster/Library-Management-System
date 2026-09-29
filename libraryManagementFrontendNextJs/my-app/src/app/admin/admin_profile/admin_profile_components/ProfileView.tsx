'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Edit3, KeyRound, ShieldCheck, History, MonitorSmartphone,
  Settings, Camera, CheckCircle, Mail, Phone, LogOut, ShieldAlert,
  Save, Smartphone, Monitor, Globe, XCircle
} from 'lucide-react';

const SIDEBAR_MENU = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'edit', label: 'Edit Profile', icon: Edit3 },
  { id: 'password', label: 'Change Password', icon: KeyRound },
  { id: '2fa', label: 'Two-Factor Auth', icon: ShieldCheck },
  { id: 'history', label: 'Login History', icon: History },
  { id: 'sessions', label: 'Active Sessions', icon: MonitorSmartphone },
  { id: 'security', label: 'Security Settings', icon: Settings },
];

const MOCK_SESSIONS = [
  { id: 'SES-1', device: 'MacBook Pro 14"', browser: 'Chrome 116', ip: '192.168.1.15', lastActive: 'Current Session', isCurrent: true },
  { id: 'SES-2', device: 'iPhone 14 Pro', browser: 'Safari Mobile', ip: '10.0.0.45', lastActive: '2 hours ago', isCurrent: false },
];

const MOCK_HISTORY = [
  { date: '29 Sep 2026', time: '09:00 AM', ip: '192.168.1.15', device: 'MacBook Pro / Chrome', status: 'Success' },
  { date: '28 Sep 2026', time: '08:45 AM', ip: '192.168.1.15', device: 'MacBook Pro / Chrome', status: 'Success' },
  { date: '27 Sep 2026', time: '11:20 PM', ip: '10.0.0.45', device: 'iPhone 14 Pro / Safari', status: 'Failed (Wrong Password)' },
];

export default function ProfileView() {
  const [activeMenu, setActiveMenu] = useState('profile');
  const [notice, setNotice] = useState('');
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(v => v === message ? '' : v), 2200); };
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const handleAction = (action: string) => { notify(action + ' updated successfully.'); };

  return (
    <div className="w-full max-w-full space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent flex items-center gap-2">
            <User size={28} className="text-emerald-600" /> My Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your personal details, security settings, and active devices.
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
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-emerald-600 text-white shadow-md scale-[1.02]' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <menu.icon size={18} className={isActive ? 'text-white' : 'text-emerald-500/70'} />
                <span className="font-medium text-sm">{menu.label}</span>
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
              
              {/* --- PROFILE OVERVIEW --- */}
              {activeMenu === 'profile' && (
                <div className="p-6 md:p-8 h-full flex flex-col bg-background">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-8">
                     <User className="text-emerald-500" /> Account Details
                   </h2>
                   
                   <div className="flex flex-col md:flex-row gap-8 items-start max-w-4xl">
                      {/* Avatar Side */}
                      <div className="flex flex-col items-center gap-4 border border-border bg-card p-6 rounded-2xl shadow-sm w-full md:w-64 shrink-0">
                         <div className="relative">
                            <img src="https://i.pravatar.cc/300?u=admin_avatar" className="w-32 h-32 rounded-full border-4 border-emerald-100 dark:border-emerald-900/50 object-cover" />
                            <div className="absolute bottom-0 right-0 p-2 bg-emerald-500 text-white rounded-full shadow-lg border-2 border-card"><CheckCircle size={16}/></div>
                         </div>
                         <div className="text-center">
                            <h3 className="font-bold text-xl">Admin User</h3>
                            <p className="text-emerald-600 font-bold text-sm">Library Administrator</p>
                            <p className="text-xs text-muted-foreground mt-1">Joined 15 Aug 2025</p>
                         </div>
                      </div>

                      {/* Info Side */}
                      <div className="flex-1 w-full border border-border bg-card p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
                         <div>
                           <p className="text-xs font-bold text-muted-foreground uppercase mb-1 flex items-center gap-2"><Mail size={14}/> Email Address</p>
                           <p className="font-medium text-lg">admin.library@example.com</p>
                         </div>
                         <div className="border-t border-border pt-4">
                           <p className="text-xs font-bold text-muted-foreground uppercase mb-1 flex items-center gap-2"><Phone size={14}/> Contact Number</p>
                           <p className="font-medium text-lg">+91 98765 43210</p>
                         </div>
                         <div className="border-t border-border pt-4 flex gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Status</p>
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded font-bold text-sm">Active</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Branch</p>
                              <p className="font-medium">Central Hub</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {/* --- EDIT PROFILE --- */}
              {activeMenu === 'edit' && (
                <div className="p-6 md:p-8 h-full bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <Edit3 className="text-teal-500" /> Edit Profile
                   </h2>
                   
                   <div className="max-w-3xl border border-border bg-card rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                      
                      <div className="flex items-center gap-6 pb-6 border-b border-border">
                         <div className="relative group cursor-pointer">
                            <img src="https://i.pravatar.cc/300?u=admin_avatar" className="w-24 h-24 rounded-full object-cover border-2 border-border" />
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <Camera className="text-white" size={24} />
                            </div>
                         </div>
                         <div>
                            <h3 className="font-bold text-lg">Profile Photo</h3>
                            <p className="text-xs text-muted-foreground mt-1">Recommended size 400x400px. JPG or PNG.</p>
                            <label className="mt-2 text-sm font-bold text-teal-600 hover:underline cursor-pointer">Upload New Photo<input type="file" accept="image/*" className="hidden" onChange={e=>e.target.files?.[0] && handleAction("Profile photo")}/></label>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-1.5 md:col-span-2">
                           <label className="text-sm font-bold text-muted-foreground uppercase">Full Name</label>
                           <input type="text" defaultValue="Admin User" className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold" />
                         </div>
                         <div className="space-y-1.5">
                           <label className="text-sm font-bold text-muted-foreground uppercase">Email Address</label>
                           <input type="email" defaultValue="admin.library@example.com" className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
                         </div>
                         <div className="space-y-1.5">
                           <label className="text-sm font-bold text-muted-foreground uppercase">Phone Number</label>
                           <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
                         </div>
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                         <button onClick={()=>handleAction('Profile')} className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md flex items-center gap-2"><Save size={18}/> Save Changes</button>
                      </div>
                   </div>
                </div>
              )}

              {/* --- CHANGE PASSWORD --- */}
              {activeMenu === 'password' && (
                <div className="p-6 md:p-8 h-full bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <KeyRound className="text-blue-500" /> Change Password
                   </h2>
                   
                   <div className="max-w-2xl border border-border bg-card rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                      
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-muted-foreground uppercase">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-muted-foreground uppercase">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                        <p className="text-xs text-muted-foreground mt-1">Must be at least 8 characters long.</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-muted-foreground uppercase">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                         <button onClick={()=>handleAction('Password')} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md">Update Password</button>
                      </div>
                   </div>
                </div>
              )}

              {/* --- 2FA SETTINGS --- */}
              {activeMenu === '2fa' && (
                <div className="p-6 md:p-8 h-full bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <ShieldCheck className="text-purple-500" /> Two-Factor Authentication
                   </h2>
                   
                   <div className="max-w-2xl border border-border bg-card rounded-2xl p-6 shadow-sm space-y-6">
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                          <ShieldAlert size={24}/>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">Secure Your Account</h3>
                          <p className="text-sm text-muted-foreground mt-1">Two-factor authentication adds an extra layer of security. Once enabled, you'll need both your password and an authentication code to log in.</p>
                        </div>
                      </div>

                      <div className="p-4 bg-muted/30 border border-border rounded-xl flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <Smartphone size={20} className="text-purple-500"/>
                           <div>
                             <h4 className="font-bold text-sm">Authenticator App</h4>
                             <p className="text-xs text-muted-foreground">Google Authenticator or Authy</p>
                           </div>
                         </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" className="sr-only peer" checked={is2FAEnabled} onChange={()=>setIs2FAEnabled(!is2FAEnabled)} />
                           <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                         </label>
                      </div>

                      {is2FAEnabled && (
                        <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="p-4 border-2 border-dashed border-border rounded-xl flex flex-col items-center text-center space-y-4">
                           <h4 className="font-bold text-lg">Scan QR Code</h4>
                           <div className="w-40 h-40 bg-white border border-gray-300 p-2"><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=example_2fa_secret" alt="QR" className="w-full h-full opacity-80" /></div>
                           <p className="text-xs text-muted-foreground">Scan this code using your authenticator app and enter the generated 6-digit pin below to verify.</p>
                           <div className="flex gap-2 w-full max-w-xs">
                             <input type="text" placeholder="123456" maxLength={6} className="flex-1 px-4 py-2 border border-border rounded-lg text-center font-mono text-xl tracking-widest focus:ring-2 focus:ring-purple-500 outline-none" />
                             <button onClick={()=>handleAction("Email verification")} className="px-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700">Verify</button>
                           </div>
                        </motion.div>
                      )}

                   </div>
                </div>
              )}

              {/* --- ACTIVE SESSIONS --- */}
              {activeMenu === 'sessions' && (
                <div className="p-6 h-full flex flex-col bg-background">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-bold flex items-center gap-2">
                       <MonitorSmartphone className="text-orange-500" /> Active Sessions
                     </h2>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">View and manage devices that are currently logged into your account.</p>

                  <div className="grid grid-cols-1 gap-4 overflow-y-auto custom-scrollbar">
                    {MOCK_SESSIONS.map(session => (
                      <div key={session.id} className={`p-5 border rounded-2xl bg-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${session.isCurrent ? 'border-orange-400 bg-orange-50/20' : 'border-border hover:border-orange-500/30'}`}>
                         
                         <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center shrink-0">
                               {session.device.includes('Mac') || session.device.includes('Win') ? <Monitor size={24} /> : <Smartphone size={24}/>}
                            </div>
                            <div>
                               <h3 className="font-bold text-lg leading-tight flex items-center gap-2">
                                 {session.device}
                                 {session.isCurrent && <span className="text-xs font-bold px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">Current Device</span>}
                               </h3>
                               <p className="text-sm text-muted-foreground mt-1">IP: {session.ip} • {session.browser}</p>
                               <div className="flex gap-2 mt-2 items-center">
                                 <span className="text-xs text-muted-foreground font-bold">Last Active: {session.lastActive}</span>
                               </div>
                            </div>
                         </div>

                         {!session.isCurrent && (
                           <div className="flex flex-col items-end gap-3">
                              <button onClick={() => notify('Selected session logged out.')} className="px-4 py-2 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                                <LogOut size={16}/> Revoke Session
                              </button>
                           </div>
                         )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- LOGIN HISTORY --- */}
              {activeMenu === 'history' && (
                <div className="p-6 h-full flex flex-col bg-background">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-bold flex items-center gap-2">
                       <History className="text-slate-500" /> Login History
                     </h2>
                  </div>

                  <div className="overflow-x-auto custom-scrollbar border border-border rounded-xl">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted text-muted-foreground uppercase text-xs font-bold">
                        <tr>
                          <th className="px-4 py-3">Date & Time</th>
                          <th className="px-4 py-3">Device / Browser</th>
                          <th className="px-4 py-3">IP Address</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_HISTORY.map((log, i) => (
                          <tr key={i} className={`border-b border-border bg-background hover:bg-muted/30 ${log.status.includes('Failed') ? 'border-l-4 border-l-red-500' : ''}`}>
                            <td className="px-4 py-3 whitespace-nowrap"><p className="font-bold text-foreground">{log.date}</p><p className="text-xs text-muted-foreground">{log.time}</p></td>
                            <td className="px-4 py-3 font-medium">{log.device}</td>
                            <td className="px-4 py-3 font-mono text-xs">{log.ip}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${log.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}


              {/* --- PLACEHOLDERS --- */}
              {!['profile', 'edit', 'password', '2fa', 'sessions', 'history'].includes(activeMenu) && (
                 <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-10 bg-background flex-1">
                   <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 border border-border">
                     {SIDEBAR_MENU.find(m=>m.id === activeMenu)?.icon({size: 48, className: "opacity-30 text-emerald-500"})}
                   </div>
                   <h3 className="text-2xl font-bold text-foreground mb-2 capitalize">{SIDEBAR_MENU.find(m=>m.id === activeMenu)?.label}</h3>
                   <p className="text-center max-w-md mb-6">Manage the selected Admin account control and save changes from this workspace.</p>
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
