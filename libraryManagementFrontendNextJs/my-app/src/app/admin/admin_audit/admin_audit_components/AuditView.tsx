'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList, Activity, UserCog, BookOpen, Users, ArrowRightLeft,
  Boxes, Wallet, Settings, ShieldAlert, LifeBuoy, Search, Filter,
  Eye, FileText, CheckCircle, AlertTriangle, Monitor, Globe, Clock,
  ArrowRight, XCircle, Ban
} from 'lucide-react';

const SIDEBAR_MENU = [
  { id: 'all', label: 'All Activities', icon: ClipboardList },
  { id: 'user', label: 'User Activities', icon: Activity },
  { id: 'manager', label: 'Manager Activities', icon: UserCog },
  { id: 'book', label: 'Book Activities', icon: BookOpen },
  { id: 'member', label: 'Member Activities', icon: Users },
  { id: 'circulation', label: 'Circulation Activities', icon: ArrowRightLeft },
  { id: 'inventory', label: 'Inventory Activities', icon: Boxes },
  { id: 'payment', label: 'Payment Activities', icon: Wallet },
  { id: 'settings', label: 'Settings Changes', icon: Settings },
  { id: 'permissions', label: 'Permission Changes', icon: ShieldAlert },
  { id: 'support', label: 'Support Access History', icon: LifeBuoy },
];

const MOCK_AUDIT_LOGS = [
  { id: 'AUD-901', user: 'Admin (System)', role: 'Admin', action: 'Update Settings', module: 'Settings', record: 'Library Closing Hours', branch: 'Central Hub', date: '29 Sep 2026', time: '14:30', ip: '192.168.1.1', device: 'Windows 11 / Chrome', oldVal: '18:00', newVal: '19:00', result: 'Success', status: 'critical' },
  { id: 'AUD-902', user: 'Mike Johnson', role: 'Manager', action: 'Issue Book', module: 'Circulation', record: 'Clean Code (BC-102)', branch: 'Central Hub', date: '29 Sep 2026', time: '12:15', ip: '10.0.0.5', device: 'MacBook / Safari', oldVal: 'Available', newVal: 'Issued (MEM-045)', result: 'Success', status: 'normal' },
  { id: 'AUD-903', user: 'Sarah Smith', role: 'Manager', action: 'Delete Member', module: 'Members', record: 'MEM-099', branch: 'Northside', date: '28 Sep 2026', time: '09:45', ip: '192.168.1.45', device: 'iPad / App', oldVal: 'Active', newVal: 'Deleted', result: 'Denied (No Permission)', status: 'warning' },
  { id: 'AUD-904', user: 'SuperAdmin Support', role: 'SuperAdmin', action: 'Access Granted', module: 'Support', record: 'Ticket #4432', branch: 'Global', date: '27 Sep 2026', time: '16:00', ip: '203.0.113.42', device: 'Linux / Firefox', oldVal: '-', newVal: 'Session Active (2h)', result: 'Success', status: 'critical' },
];

export default function AuditView() {
  const [activeMenu, setActiveMenu] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const PAGE_SIZE = 4;

  const getResultColor = (result: string) => {
    if (result.includes('Success')) return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400';
    if (result.includes('Denied')) return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/30 dark:text-red-400';
    return 'text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400';
  };

  const getActionIcon = (module: string) => {
    switch(module) {
      case 'Settings': return <Settings size={16} className="text-purple-500"/>;
      case 'Circulation': return <ArrowRightLeft size={16} className="text-blue-500"/>;
      case 'Members': return <Users size={16} className="text-orange-500"/>;
      case 'Support': return <LifeBuoy size={16} className="text-rose-500"/>;
      default: return <Activity size={16} className="text-slate-500"/>;
    }
  };

  const filteredLogs = MOCK_AUDIT_LOGS.filter(log => {
    const menuMatch = activeMenu === 'all' ||
      (activeMenu === 'user' && log.role === 'Admin') ||
      (activeMenu === 'manager' && log.role === 'Manager') ||
      (activeMenu === 'book' && log.module === 'Books') ||
      (activeMenu === 'member' && log.module === 'Members') ||
      (activeMenu === 'circulation' && log.module === 'Circulation') ||
      (activeMenu === 'inventory' && log.module === 'Inventory') ||
      (activeMenu === 'payment' && log.module === 'Payments') ||
      (activeMenu === 'settings' && log.module === 'Settings') ||
      (activeMenu === 'permissions' && log.module === 'Permissions') ||
      (activeMenu === 'support' && log.module === 'Support');
    const q = search.trim().toLowerCase();
    const searchMatch = !q || [log.user,log.action,log.module,log.record,log.ip,log.branch].some(v=>v.toLowerCase().includes(q));
    return menuMatch && searchMatch;
  });
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const visibleLogs = filteredLogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full max-w-full space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent flex items-center gap-2">
            <ClipboardList size={28} className="text-slate-600 dark:text-slate-300" /> Library Audit Logs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and monitor all library activities, manager actions, and system changes.
          </p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 rounded-lg text-xs font-bold shadow-sm">
             <ShieldAlert size={14} /> Immutable Records (View Only)
           </div>
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
                onClick={() => { setActiveMenu(menu.id); setSelectedRecord(null); setPage(1); }}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md scale-[1.02]' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <menu.icon size={18} className={isActive ? 'text-white dark:text-slate-900' : 'text-slate-500'} />
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
              key={selectedRecord ? 'detail' : activeMenu}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              
              {/* --- AUDIT LIST VIEW --- */}
              {!selectedRecord && (
                <div className="p-6 h-full flex flex-col bg-background">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                     <h2 className="text-2xl font-bold flex items-center gap-2 capitalize">
                       <ClipboardList className="text-slate-500" /> {activeMenu.replace('_', ' ')}
                     </h2>
                     <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                       <div className="relative w-full sm:w-auto">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                         <input type="text" placeholder="Search logs, IPs, Users..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 w-full sm:w-64" />
                       </div>
                       <button onClick={()=>setSearch("")} title="Clear filter" className="p-2 border border-border bg-muted/50 rounded-lg hover:bg-muted text-muted-foreground"><Filter size={18}/></button>
                     </div>
                  </div>

                  <div className="overflow-x-auto custom-scrollbar border border-border rounded-xl">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted text-muted-foreground uppercase text-xs font-bold">
                        <tr>
                          <th className="px-4 py-3">Timestamp</th>
                          <th className="px-4 py-3">User & Role</th>
                          <th className="px-4 py-3">Action & Module</th>
                          <th className="px-4 py-3">Result</th>
                          <th className="px-4 py-3 text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleLogs.map(log => (
                          <tr key={log.id} className={`border-b border-border bg-background hover:bg-muted/30 ${log.status === 'critical' ? 'border-l-4 border-l-purple-500' : ''} ${log.status === 'warning' ? 'border-l-4 border-l-red-500' : ''}`}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <p className="font-bold text-foreground">{log.date}</p>
                              <p className="text-xs text-muted-foreground">{log.time}</p>
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-bold">{log.user}</p>
                              <p className="text-xs text-muted-foreground">{log.role} • {log.branch}</p>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {getActionIcon(log.module)}
                                <div>
                                  <p className="font-bold">{log.action}</p>
                                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">{log.record}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getResultColor(log.result)}`}>
                                {log.result}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => setSelectedRecord(log)} className="px-3 py-1.5 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:opacity-90 flex items-center gap-1 ml-auto">
                                <Eye size={14}/> View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
                    <p>Showing {filteredLogs.length === 0 ? 0 : ((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filteredLogs.length)} of {filteredLogs.length} matching records.</p>
                    <div className="flex gap-1">
                      <button onClick={()=>setPage(v=>Math.max(1,v-1))} className="px-2 py-1 border rounded hover:bg-muted">Prev</button>
                      <button onClick={()=>setPage(1)} className={`px-2 py-1 border rounded ${page===1?"bg-slate-800 text-white":""}`}>1</button>
                      <button onClick={()=>setPage(2)} className={`px-2 py-1 border rounded ${page===2?"bg-slate-800 text-white":""}`}>2</button>
                      <button onClick={()=>setPage(v=>Math.min(2,v+1))} className="px-2 py-1 border rounded hover:bg-muted">Next</button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- DETAILED AUDIT RECORD VIEW --- */}
              {selectedRecord && (
                <div className="p-6 h-full flex flex-col bg-background overflow-y-auto">
                   
                   <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                     <h2 className="text-2xl font-bold flex items-center gap-2">
                       <FileText className="text-slate-500" /> Audit Record Details
                     </h2>
                     <button onClick={() => setSelectedRecord(null)} className="p-2 hover:bg-muted rounded-full transition-colors"><XCircle size={24} className="text-muted-foreground"/></button>
                   </div>

                   <div className="p-4 mb-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl flex items-start gap-3">
                     <Ban className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" size={20}/>
                     <div>
                       <h4 className="font-bold text-amber-800 dark:text-amber-300">Immutable Record</h4>
                       <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">This audit log is system-generated and cannot be modified or deleted by Library Admins. Only SuperAdmin can manage global audit retention policies.</p>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                     
                     {/* Identity & Context */}
                     <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
                        <h3 className="font-bold uppercase text-xs text-muted-foreground border-b border-border pb-2">User & Context</h3>
                        
                        <div className="flex items-start gap-3">
                          <UserCog className="text-indigo-500 mt-1" size={18}/>
                          <div>
                            <p className="text-sm text-muted-foreground">Performed By</p>
                            <p className="font-bold text-lg">{selectedRecord.user}</p>
                            <p className="text-sm font-medium text-indigo-600">{selectedRecord.role} • {selectedRecord.branch}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 pt-3">
                          <Clock className="text-orange-500 mt-1" size={18}/>
                          <div>
                            <p className="text-sm text-muted-foreground">Date & Time</p>
                            <p className="font-bold">{selectedRecord.date} at {selectedRecord.time}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-3">
                          <div className="flex flex-col gap-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1"><Globe size={12}/> IP Address</p>
                            <p className="font-mono text-sm">{selectedRecord.ip}</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1"><Monitor size={12}/> Device/Browser</p>
                            <p className="text-sm">{selectedRecord.device}</p>
                          </div>
                        </div>
                     </div>

                     {/* Action & Result */}
                     <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
                        <h3 className="font-bold uppercase text-xs text-muted-foreground border-b border-border pb-2">Action Details</h3>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Module & Action</p>
                          <p className="font-bold text-lg flex items-center gap-2">{getActionIcon(selectedRecord.module)} {selectedRecord.module} / {selectedRecord.action}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Target Record</p>
                          <p className="font-medium">{selectedRecord.record}</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Execution Result</p>
                          <span className={`px-3 py-1 text-sm font-bold rounded border inline-block ${getResultColor(selectedRecord.result)}`}>
                            {selectedRecord.result}
                          </span>
                        </div>
                     </div>

                     {/* Data Changes (Old vs New) */}
                     <div className="md:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm">
                        <h3 className="font-bold uppercase text-xs text-muted-foreground border-b border-border pb-2 mb-4 flex items-center gap-2"><ArrowRightLeft size={16}/> Value Changes</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                           
                           <div className="p-4 bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-xl">
                             <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase mb-2">Old Value</p>
                             <div className="font-mono text-sm break-words whitespace-pre-wrap">{selectedRecord.oldVal}</div>
                           </div>
                           
                           <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-background border border-border rounded-full items-center justify-center text-muted-foreground z-10">
                             <ArrowRight size={16} />
                           </div>

                           <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-xl">
                             <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2">New Value</p>
                             <div className="font-mono text-sm break-words whitespace-pre-wrap font-bold">{selectedRecord.newVal}</div>
                           </div>
                           
                        </div>
                     </div>

                   </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
