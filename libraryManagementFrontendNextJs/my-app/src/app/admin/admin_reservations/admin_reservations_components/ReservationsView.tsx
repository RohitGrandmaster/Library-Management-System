'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark, Clock, CalendarClock, PackageCheck, CheckCircle2,
  XCircle, Ban, ShieldCheck, Search, MoreVertical, Eye, MapPin,
  Bell, Check, X, CalendarPlus, History, User, BookOpen
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_RESERVATIONS = [
  { id: 'RES-1001', member: 'Alice Walker', book: 'Clean Code', branch: 'Central Main Library', queuePosition: 1, resDate: '28 Sep 2026', expDate: '05 Oct 2026', status: 'Ready for Pickup' },
  { id: 'RES-1002', member: 'Bob Smith', book: 'The Mythical Man-Month', branch: 'Northside Hub', queuePosition: 3, resDate: '29 Sep 2026', expDate: '06 Oct 2026', status: 'Queued' },
  { id: 'RES-1003', member: 'Charlie Davis', book: 'Python Crash Course', branch: 'East Wing Branch', queuePosition: 0, resDate: '29 Sep 2026', expDate: '06 Oct 2026', status: 'Pending' },
  { id: 'RES-1004', member: 'Diana Prince', book: 'Intro to Algorithms', branch: 'Central Main Library', queuePosition: 0, resDate: '20 Sep 2026', expDate: '27 Sep 2026', status: 'Completed' },
  { id: 'RES-1005', member: 'Eve Adams', book: 'Design Patterns', branch: 'Northside Hub', queuePosition: 0, resDate: '15 Sep 2026', expDate: '22 Sep 2026', status: 'Expired' },
];

const SIDEBAR_MENU = [
  { id: 'all', label: 'All Reservations', icon: Bookmark },
  { id: 'pending', label: 'Pending', icon: Clock },
  { id: 'queued', label: 'Queued', icon: CalendarClock },
  { id: 'ready', label: 'Ready for Pickup', icon: PackageCheck },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  { id: 'expired', label: 'Expired', icon: XCircle },
  { id: 'cancelled', label: 'Cancelled', icon: Ban },
  { id: 'rules', label: 'Reservation Rules', icon: ShieldCheck },
];

export default function ReservationsView() {
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);
  const [activeMenu, setActiveMenu] = useState('all');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Filter reservations based on menu
  const displayReservations = reservations.filter(res => {
    const menuMatch = activeMenu === 'all'
      ? true
      : activeMenu === 'ready'
        ? res.status === 'Ready for Pickup'
        : res.status.toLowerCase() === activeMenu;
    const q = search.trim().toLowerCase();
    const searchMatch = !q || [res.id, res.member, res.book, res.branch, res.status].some(v => v.toLowerCase().includes(q));
    return menuMatch && searchMatch;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Ready for Pickup': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
      case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800';
      case 'Queued': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'Completed': return 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800';
      case 'Expired': return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(v => v === message ? '' : v), 2200); };

  const handleAction = (action: string, res: any) => {
    setActionMenuOpen(null);
    if (action === 'Cancel Reservation') setReservations(items=>items.map(r=>r.id===res.id?{...r,status:'Cancelled'}:r));
    if (action === 'Fulfill Reservation') setReservations(items=>items.map(r=>r.id===res.id?{...r,status:'Completed'}:r));
    notify(action + ' completed for ' + res.id + '.');
  };

  return (
    <div className="w-full max-w-full space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent flex items-center gap-2">
            <Bookmark size={28} className="text-pink-600" /> Reservations
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage member book holds, queues, and pickup schedules.
          </p>
        </div>
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
              key={activeMenu}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-8 h-full"
            >
              
              {/* --- LISTING LAYOUT --- */}
              {['all', 'pending', 'queued', 'ready', 'completed', 'expired', 'cancelled'].includes(activeMenu) && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                     <h2 className="text-2xl font-bold flex items-center gap-2 capitalize">
                       <Bookmark className="text-pink-500" /> {activeMenu === 'ready' ? 'Ready for Pickup' : activeMenu} Reservations
                     </h2>
                     <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                       <input type="text" placeholder="Search Member or Book..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 w-full sm:w-64" />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayReservations.map(res => (
                      <div key={res.id} className="relative bg-background border border-border rounded-2xl p-5 hover:shadow-lg transition-all hover:border-pink-500/40">
                         
                         <div className="flex justify-between items-start mb-4">
                            <div>
                               <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">{res.id}</p>
                               <h3 className="font-bold text-lg leading-tight flex items-center gap-2"><BookOpen size={16} className="text-blue-500"/> {res.book}</h3>
                               <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2"><User size={14} className="text-emerald-500"/> {res.member}</p>
                            </div>

                            {/* MEGA ACTION MENU */}
                            <div className="relative">
                              <button onClick={() => setActionMenuOpen(actionMenuOpen === res.id ? null : res.id)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                                <MoreVertical size={20} />
                              </button>
                              {actionMenuOpen === res.id && (
                                <div className="absolute right-0 top-full mt-1 w-52 bg-card border border-border rounded-xl shadow-xl z-50 py-2">
                                  <button onClick={() => handleAction('Fulfill Reservation', res)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Check size={16} className="text-emerald-500"/> Fulfill (Issue Book)</button>
                                  <button onClick={() => handleAction('Notify Member', res)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Bell size={16} className="text-blue-500"/> Notify Member</button>
                                  <button onClick={() => handleAction('Extend Pickup Time', res)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><CalendarPlus size={16} className="text-purple-500"/> Extend Pickup Time</button>
                                  <div className="h-px bg-border my-1"></div>
                                  <button onClick={() => handleAction('View History', res)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><History size={16} className="text-slate-500"/> View History</button>
                                  <div className="h-px bg-border my-1"></div>
                                  <button onClick={() => handleAction('Cancel Reservation', res)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2 text-red-500"><X size={16}/> Cancel Reservation</button>
                                </div>
                              )}
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-3 text-sm bg-muted/30 p-3 rounded-xl border border-border mb-4">
                            <div><p className="text-xs text-muted-foreground">Reserved On</p><p className="font-medium">{res.resDate}</p></div>
                            <div><p className="text-xs text-muted-foreground">Expires On</p><p className="font-medium text-orange-600 dark:text-orange-400">{res.expDate}</p></div>
                            <div className="col-span-2"><p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={12}/> Branch</p><p className="font-medium">{res.branch}</p></div>
                         </div>

                         <div className="flex justify-between items-center pt-2">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getStatusStyle(res.status)}`}>
                              {res.status}
                            </span>
                            {res.queuePosition > 0 && (
                              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                                Queue Position: #{res.queuePosition}
                              </span>
                            )}
                         </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- RESERVATION RULES --- */}
              {activeMenu === 'rules' && (
                 <div className="p-6 bg-background space-y-6">
                   <div><h2 className="text-2xl font-bold flex items-center gap-2"><ShieldCheck className="text-pink-500"/> Reservation Rules</h2><p className="text-sm text-muted-foreground mt-1">Configure reservation limits and pickup timing for the frontend demo.</p></div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
                     <label className="space-y-2 text-sm font-medium">Maximum reservations<input type="number" defaultValue={2} min={1} className="w-full px-4 py-3 bg-card border border-border rounded-xl"/></label>
                     <label className="space-y-2 text-sm font-medium">Hold duration (days)<input type="number" defaultValue={7} min={1} className="w-full px-4 py-3 bg-card border border-border rounded-xl"/></label>
                     <label className="space-y-2 text-sm font-medium">Pickup window (hours)<input type="number" defaultValue={48} min={1} className="w-full px-4 py-3 bg-card border border-border rounded-xl"/></label>
                     <label className="space-y-2 text-sm font-medium">Queue limit<input type="number" defaultValue={5} min={1} className="w-full px-4 py-3 bg-card border border-border rounded-xl"/></label>
                   </div>
                   <button onClick={()=>notify('Reservation rules saved.')} className="px-6 py-2 bg-pink-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-pink-700">Save Rules</button>
                 </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
