'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, ShieldAlert, Ban, Clock, Key,
  Activity, MoreVertical, Edit3, Eye, Shield, CheckCircle,
  AlertTriangle, Power, UploadCloud, RefreshCw, LogOut,
  MapPin, Phone, Mail, Search, Lock, UserCheck, KeySquare,
  FileText, History
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_MANAGERS = [
  { id: 'm1', name: 'John Doe', username: 'johndoe', email: 'john@library.com', phone: '+1 234 567 8900', branch: 'Central Main Library', status: 'Active', photo: 'https://i.pravatar.cc/150?u=johndoe' },
  { id: 'm2', name: 'Sarah Smith', username: 'sarah.s', email: 'sarah@library.com', phone: '+1 234 567 8901', branch: 'Northside Hub', status: 'Active', photo: 'https://i.pravatar.cc/150?u=sarah.s' },
  { id: 'm3', name: 'Mike Johnson', username: 'mikej', email: 'mike@library.com', phone: '+1 234 567 8902', branch: 'East Wing Branch', status: 'Suspended', photo: 'https://i.pravatar.cc/150?u=mikej' },
  { id: 'm4', name: 'Emma Davis', username: 'emmad', email: 'emma@library.com', phone: '+1 234 567 8903', branch: 'West End Archive', status: 'Deactivated', photo: 'https://i.pravatar.cc/150?u=emmad' },
];

const SIDEBAR_MENU = [
  { id: 'all', label: 'All Managers', icon: Users },
  { id: 'add', label: 'Add Manager', icon: UserPlus },
  { id: 'active', label: 'Active Managers', icon: CheckCircle },
  { id: 'suspended', label: 'Suspended', icon: AlertTriangle },
  { id: 'deactivated', label: 'Deactivated', icon: Ban },
  { id: 'sessions', label: 'Manager Sessions', icon: KeySquare },
  { id: 'history', label: 'Login History', icon: History },
  { id: 'activity', label: 'Manager Activity', icon: Activity },
];

const PERMISSION_GROUPS = [
  { name: 'Books', perms: ['View', 'Add', 'Edit'] },
  { name: 'Members', perms: ['View', 'Add'] },
  { name: 'Circulation', perms: ['Issue', 'Return'] },
  { name: 'Fine', perms: ['Collect', 'Waive'] },
  { name: 'Reports', perms: ['View', 'Export'] },
];

const MOCK_ACTIVITY = [
  { id: 1, manager: 'John Doe', action: 'Issued book "Sapiens" to member M-1042', time: '10 mins ago', type: 'circ' },
  { id: 2, manager: 'Sarah Smith', action: 'Added 5 new members', time: '1 hour ago', type: 'member' },
  { id: 3, manager: 'Mike Johnson', action: 'Failed login attempt from IP 192.168.1.5', time: '2 hours ago', type: 'sec' },
];

export default function StaffManagersView() {
  const [managers, setManagers] = useState(MOCK_MANAGERS);
  const [activeMenu, setActiveMenu] = useState('all');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [selectedManager, setSelectedManager] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'permissions'>('list');
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Filter managers
  const displayManagers = managers.filter(m => {
    if (activeMenu === 'all') return true;
    if (activeMenu === 'active') return m.status === 'Active';
    if (activeMenu === 'suspended') return m.status === 'Suspended';
    if (activeMenu === 'deactivated') return m.status === 'Deactivated';
    return true;
  });

  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(v => v === message ? '' : v), 2200); };

  const getStatusStyle = (status: string) => {
    if (status === 'Active') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    if (status === 'Suspended') return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
  };

  const handleAction = (action: string, manager: any) => {
    setActionMenuOpen(null);
    if (action === 'view') {
      setSelectedManager(manager);
      setViewMode('detail');
    } else if (action === 'permissions') {
      setSelectedManager(manager);
      setViewMode('permissions');
    } else {
      if (['activate','suspend','deactivate'].includes(action)) { const status = action === 'activate' ? 'Active' : action === 'suspend' ? 'Suspended' : 'Deactivated'; setManagers(items => items.map(m => m.id === manager.id ? { ...m, status } : m)); notify(manager.name + ' marked ' + status + '.'); return; } notify(action.replace('_',' ') + ' action completed for ' + manager.name + '.');
    }
  };

  const closeDetail = () => {
    setSelectedManager(null);
    setViewMode('list');
  };

  return (
    <div className="w-full max-w-full space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            {selectedManager 
              ? `${selectedManager.name} - ${viewMode === 'permissions' ? 'Permissions' : 'Profile'}` 
              : 'Staff & Managers'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedManager 
              ? 'Manage specific details, access, and permissions for this user.'
              : 'Manage library staff, branch assignments, and access permissions.'}
          </p>
        </div>
        {selectedManager && (
          <button 
            onClick={closeDetail}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-all shadow-sm"
          >
            <Users size={16} /> Back to Managers
          </button>
        )}
      </div>

      <div className="w-full bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="border-b border-border bg-muted/20 p-2 sm:p-3 overflow-x-auto">
          <div className="flex min-w-max sm:min-w-0 gap-2 flex-wrap">
            {SIDEBAR_MENU.map((menu) => {
              const isActive = activeMenu === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => setActiveMenu(menu.id)}
                  className={"group flex items-center justify-center gap-2 min-w-[130px] px-4 py-3 rounded-xl text-sm font-semibold transition-all " +
                                (isActive ? "bg-primary text-primary-foreground shadow-sm" : "bg-transparent text-muted-foreground hover:bg-background hover:text-foreground")}
                >
                  <menu.icon size={16} className={isActive ? "text-primary-foreground" : "text-primary/70 group-hover:text-primary"} />
                  <span className="whitespace-nowrap">{menu.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-[500px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode === 'list' ? activeMenu : `${viewMode}-${selectedManager?.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-8"
            >
              
              {/* --- LIST MODE --- */}
              {viewMode === 'list' && (
                <>
                  {/* LISTING CARDS */}
                  {['all', 'active', 'suspended', 'deactivated'].includes(activeMenu) && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                         <h2 className="text-2xl font-bold flex items-center gap-2 capitalize">
                           <Users className="text-blue-500" /> {activeMenu} Managers
                         </h2>
                         <div className="relative w-full sm:w-auto">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                           <input type="text" placeholder="Search managers..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64" />
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                        {displayManagers.map(manager => (
                          <div key={manager.id} className="relative bg-background border border-border rounded-2xl p-5 flex flex-col hover:shadow-lg transition-all hover:border-primary/40">
                            
                            <div className="flex justify-between items-start">
                              <div className="flex gap-4 items-center">
                                <img src={manager.photo} alt={manager.name} className="w-14 h-14 rounded-full border-2 border-background shadow-md object-cover" />
                                <div>
                                  <h3 className="font-bold text-lg">{manager.name}</h3>
                                  <p className="text-xs text-muted-foreground">@{manager.username}</p>
                                </div>
                              </div>
                              <div className="relative">
                                <button 
                                  onClick={() => setActionMenuOpen(actionMenuOpen === manager.id ? null : manager.id)}
                                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                                >
                                  <MoreVertical size={18} />
                                </button>
                                {/* DROPDOWN ACTIONS */}
                                {actionMenuOpen === manager.id && (
                                  <div className="absolute right-0 top-full mt-1 w-52 bg-card border border-border rounded-xl shadow-xl z-50 py-2">
                                    <button onClick={() => handleAction('view', manager)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Eye size={14} className="text-blue-500"/> View Profile</button>
                                    <button onClick={() => handleAction('edit', manager)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Edit3 size={14} className="text-amber-500"/> Edit Info</button>
                                    <button onClick={() => handleAction('permissions', manager)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Shield size={14} className="text-indigo-500"/> Permissions</button>
                                    <div className="h-px bg-border my-1"></div>
                                    <button onClick={() => handleAction('activate', manager)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500"/> Activate</button>
                                    <button onClick={() => handleAction('suspend', manager)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><AlertTriangle size={14} className="text-orange-500"/> Suspend</button>
                                    <button onClick={() => handleAction('deactivate', manager)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Ban size={14} className="text-red-500"/> Deactivate</button>
                                    <div className="h-px bg-border my-1"></div>
                                    <button onClick={() => handleAction('reset_pwd', manager)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Key size={14} className="text-slate-500"/> Reset Password</button>
                                    <button onClick={() => handleAction('force_logout', manager)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2 text-red-600 dark:text-red-400"><LogOut size={14}/> Force Logout</button>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-5 space-y-2 mb-4 flex-1">
                              <p className="text-sm flex items-center gap-2 text-muted-foreground"><Mail size={14}/> {manager.email}</p>
                              <p className="text-sm flex items-center gap-2 text-muted-foreground"><Phone size={14}/> {manager.phone}</p>
                              <p className="text-sm flex items-center gap-2 text-muted-foreground"><MapPin size={14} className="text-teal-500"/> {manager.branch}</p>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-border">
                              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusStyle(manager.status)}`}>
                                {manager.status}
                              </span>
                              <div className="flex gap-2">
                                 <button onClick={() => handleAction('permissions', manager)} className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 transition-colors" title="Permissions">
                                   <Shield size={16} />
                                 </button>
                                 <button onClick={() => handleAction('view', manager)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-colors" title="View Profile">
                                   <Eye size={16} />
                                 </button>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ADD MANAGER FORM */}
                  {activeMenu === 'add' && (
                    <div className="space-y-6 max-w-4xl">
                      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                        <UserPlus className="text-emerald-500" /> Add New Manager
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name <span className="text-red-500">*</span></label>
                            <input type="text" placeholder="John Doe" className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Username <span className="text-red-500">*</span></label>
                            <input type="text" placeholder="johndoe123" className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Email <span className="text-red-500">*</span></label>
                            <input type="email" placeholder="john@example.com" className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Phone</label>
                            <input type="tel" placeholder="+1..." className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Password / Reset Setup <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                              <input type="password" placeholder="Auto-generate or type" className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <p className="text-xs text-muted-foreground">User will be forced to change password on first login.</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Branch Assignment <span className="text-red-500">*</span></label>
                            <select className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none">
                              <option>Central Main Library</option>
                              <option>Northside Hub</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Initial Status</label>
                            <select className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none">
                              <option>Active</option>
                              <option>Suspended</option>
                            </select>
                          </div>
                        </div>

                        {/* Photo Upload Area */}
                        <div className="space-y-2">
                           <label className="text-sm font-medium">Profile Photo</label>
                           <label className="w-full h-48 border-2 border-dashed border-border rounded-2xl bg-muted/30 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer">
                             <UploadCloud size={40} className="mb-2 text-primary/50" />
                             <span className="text-sm font-medium text-foreground">Click to upload</span>
                             <span className="text-xs mt-1">JPG, PNG (Max 2MB)</span>
                             <input type="file" accept="image/jpeg,image/png" className="sr-only" onChange={e => e.target.files?.[0] && notify(`Photo selected: ${e.target.files[0].name}`)} />
                           </label>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-border flex justify-end gap-3">
                        <button type="button" onClick={()=>{setActiveMenu('all');notify('Create manager form closed.')}} className="px-6 py-2 rounded-xl border border-border bg-muted hover:bg-muted/80 font-medium">Cancel</button>
                        <button type="button" onClick={()=>{ const id="m-"+Date.now(); const name="New Manager "+(managers.length+1); setManagers(items=>[...items,{id,name,username:name.toLowerCase().replace(/ /g,""),email:"newmanager@library.com",phone:"+91 9000000000",branch:"Central Main Library",status:"Active",photo:"https://i.pravatar.cc/150?u="+id}]); notify("Manager created successfully."); setActiveMenu("all"); }} className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-2 shadow-md"><CheckCircle size={18}/> Create Manager</button>
                      </div>
                    </div>
                  )}

                  {/* SESSIONS / HISTORY / ACTIVITY WORKSPACES */}
                  {['sessions', 'history', 'activity'].includes(activeMenu) && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 capitalize">
                        {activeMenu === 'sessions' && <KeySquare className="text-blue-500" />}
                        {activeMenu === 'history' && <History className="text-purple-500" />}
                        {activeMenu === 'activity' && <Activity className="text-orange-500" />}
                        Manager {activeMenu}
                      </h2>
                      
                      <div className="bg-background border border-border rounded-xl overflow-hidden">
                        {MOCK_ACTIVITY.map((act, i) => (
                           <div key={i} className="flex gap-4 p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                                {act.type === 'circ' && <ArrowRightLeft size={16} className="text-blue-500" />}
                                {act.type === 'member' && <UserPlus size={16} className="text-emerald-500" />}
                                {act.type === 'sec' && <ShieldAlert size={16} className="text-red-500" />}
                              </div>
                              <div>
                                <p className="text-sm font-semibold">{act.manager}</p>
                                <p className="text-sm mt-0.5">{act.action}</p>
                                <p className="text-xs text-muted-foreground mt-1">{act.time}</p>
                              </div>
                           </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}


              {/* --- DETAIL MODE (Profile View) --- */}
              {viewMode === 'detail' && selectedManager && (
                <div className="space-y-8">
                   <div className="flex flex-col md:flex-row gap-6 items-center md:items-start bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                     <img src={selectedManager.photo} alt={selectedManager.name} className="w-32 h-32 rounded-full border-4 border-white dark:border-card shadow-lg object-cover" />
                     <div className="flex-1 text-center md:text-left">
                       <h2 className="text-3xl font-bold">{selectedManager.name}</h2>
                       <p className="text-muted-foreground font-medium mt-1">@{selectedManager.username}</p>
                       <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm">
                         <span className="flex items-center gap-1"><Mail size={16} className="text-muted-foreground" /> {selectedManager.email}</span>
                         <span className="flex items-center gap-1"><Phone size={16} className="text-muted-foreground" /> {selectedManager.phone}</span>
                         <span className="flex items-center gap-1"><MapPin size={16} className="text-teal-500" /> {selectedManager.branch}</span>
                         <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusStyle(selectedManager.status)}`}>{selectedManager.status}</span>
                       </div>
                     </div>
                     <div className="flex gap-2">
                       <button onClick={() => setViewMode('permissions')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm flex items-center gap-2">
                         <Shield size={16} /> Edit Permissions
                       </button>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 border border-border rounded-xl bg-background">
                         <h3 className="font-bold mb-4 flex items-center gap-2"><KeySquare size={18} className="text-blue-500"/> Security Details</h3>
                         <div className="space-y-3 text-sm">
                           <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Last Login</span><span className="font-medium">Today, 09:30 AM</span></div>
                           <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">IP Address</span><span className="font-medium">192.168.1.45</span></div>
                           <div className="flex justify-between pb-2"><span className="text-muted-foreground">Password Last Changed</span><span className="font-medium">45 Days Ago</span></div>
                         </div>
                         <button onClick={()=>notify("Password reset initiated for "+selectedManager.name+".")} className="mt-4 w-full py-2 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg text-sm transition-colors border border-border">Reset Password</button>
                      </div>
                      
                      <div className="p-6 border border-border rounded-xl bg-background">
                         <h3 className="font-bold mb-4 flex items-center gap-2"><Activity size={18} className="text-orange-500"/> Recent Activity</h3>
                         <div className="space-y-4">
                           {MOCK_ACTIVITY.slice(0,2).map((act, i) => (
                             <div key={i} className="flex gap-3">
                               <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
                               <div>
                                 <p className="text-sm">{act.action}</p>
                                 <p className="text-xs text-muted-foreground">{act.time}</p>
                               </div>
                             </div>
                           ))}
                         </div>
                         <button onClick={()=>{setActiveMenu("activity");closeDetail();}} className="mt-4 w-full py-2 text-primary font-medium text-sm hover:underline">View Full Activity Log</button>
                      </div>
                   </div>
                </div>
              )}


              {/* --- PERMISSIONS MODE --- */}
              {viewMode === 'permissions' && selectedManager && (
                <div className="space-y-6">
                   <div className="flex items-center gap-4 p-4 bg-muted/30 border border-border rounded-xl">
                      <Shield className="text-indigo-500" size={32} />
                      <div>
                        <h2 className="text-xl font-bold">Access Permissions</h2>
                        <p className="text-sm text-muted-foreground">Define what {selectedManager.name} can view or edit across the library.</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                     {PERMISSION_GROUPS.map((group, i) => (
                       <div key={i} className="border border-border rounded-xl bg-background overflow-hidden">
                         <div className="bg-muted/50 px-4 py-3 font-semibold border-b border-border flex justify-between items-center">
                           {group.name}
                           <label className="flex items-center gap-2 text-xs font-normal cursor-pointer text-muted-foreground">
                             <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4" defaultChecked /> Select All
                           </label>
                         </div>
                         <div className="p-4 space-y-3">
                           {group.perms.map((perm, j) => (
                             <div key={j} className="flex items-center justify-between">
                               <span className="text-sm font-medium">{perm}</span>
                               {/* Modern Toggle Switch Mockup */}
                               <label className="relative inline-flex items-center cursor-pointer">
                                 <input type="checkbox" className="sr-only peer" defaultChecked={j === 0 || j === 1} />
                                 <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                               </label>
                             </div>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>
                   
                   <div className="pt-6 border-t border-border flex justify-end gap-3">
                      <button onClick={closeDetail} className="px-6 py-2 rounded-xl border border-border bg-muted hover:bg-muted/80 font-medium">Cancel</button>
                      <button onClick={()=>notify("Permissions saved for "+selectedManager.name+".")} className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-2 shadow-md"><CheckCircle size={18}/> Save Permissions</button>
                   </div>
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
