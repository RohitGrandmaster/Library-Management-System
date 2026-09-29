'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LifeBuoy, Ticket, PlusCircle, LayoutList, Server, Bell,
  BookOpen, Send, Paperclip, AlertCircle, CheckCircle, Search,
  MessageSquare, History, Clock, FileText, ChevronRight, X
} from 'lucide-react';

const SIDEBAR_MENU = [
  { id: 'center', label: 'Help Center', icon: LifeBuoy },
  { id: 'create_ticket', label: 'Create Ticket', icon: PlusCircle },
  { id: 'my_tickets', label: 'My Tickets', icon: LayoutList },
  { id: 'status', label: 'System Status', icon: Server },
  { id: 'announcements', label: 'Platform Announcements', icon: Bell },
  { id: 'docs', label: 'Documentation', icon: BookOpen },
];

const MOCK_TICKETS = [
  { id: 'TCK-2026-891', subject: 'Barcode scanner not syncing', category: 'Hardware/Hardware Sync', priority: 'High', status: 'Open', date: '29 Sep 2026' },
  { id: 'TCK-2026-884', subject: 'Need help bulk importing members', category: 'Data Import', priority: 'Medium', status: 'In Progress', date: '28 Sep 2026' },
  { id: 'TCK-2026-850', subject: 'Report generation timeout', category: 'Bug/Error', priority: 'Low', status: 'Resolved', date: '20 Sep 2026' },
];

export default function SupportView() {
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [activeMenu, setActiveMenu] = useState('center');
  const [notice, setNotice] = useState('');
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(v => v === message ? '' : v), 2200); };
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  const getPriorityColor = (priority: string) => {
    if(priority === 'High') return 'text-red-600 bg-red-100 dark:bg-red-900/30';
    if(priority === 'Medium') return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
    return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
  };

  const getStatusColor = (status: string) => {
    if(status === 'Open') return 'border-orange-500 text-orange-600 dark:text-orange-400';
    if(status === 'In Progress') return 'border-blue-500 text-blue-600 dark:text-blue-400';
    return 'border-emerald-500 text-emerald-600 dark:text-emerald-400';
  };

  return (
    <div className="w-full max-w-full space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent flex items-center gap-2">
            <LifeBuoy size={28} className="text-sky-600" /> Help & Support
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Communicate with the SuperAdmin/Platform Support team, raise tickets, and check system status.
          </p>
        </div>
        <div className="flex gap-2">
          {selectedTicket ? (
            <button onClick={() => setSelectedTicket(null)} className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 shadow-sm transition-colors">
               <LayoutList size={16} /> Back to Tickets
            </button>
          ) : (
            <button onClick={() => setActiveMenu('create_ticket')} className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 shadow-sm transition-colors">
               <PlusCircle size={16} /> New Support Ticket
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* SIDEBAR SUB-MENU */}
        <div className="w-full lg:w-64 flex flex-col gap-1 shrink-0 bg-card border border-border p-3 rounded-2xl shadow-sm h-[650px] overflow-y-auto custom-scrollbar">
          {SIDEBAR_MENU.map((menu) => {
             const isActive = !selectedTicket && activeMenu === menu.id;
             return (
              <button
                key={menu.id}
                onClick={() => { setActiveMenu(menu.id); setSelectedTicket(null); }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-sky-600 text-white shadow-md scale-[1.02]' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <menu.icon size={18} className={isActive ? 'text-white' : 'text-sky-500/70'} />
                <span className="font-medium text-sm">{menu.label}</span>
              </button>
             );
          })}
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 w-full bg-card border border-border rounded-2xl shadow-sm overflow-hidden min-h-[650px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTicket ? 'ticket_detail' : activeMenu}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              
              {/* --- HELP CENTER DASHBOARD --- */}
              {!selectedTicket && activeMenu === 'center' && (
                <div className="p-6 md:p-8 h-full flex flex-col bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-8">
                     <LifeBuoy className="text-sky-500" /> Welcome to Support Center
                   </h2>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div onClick={()=>setActiveMenu('create_ticket')} className="p-6 bg-card border border-border rounded-2xl hover:border-sky-500/50 hover:shadow-md transition-all cursor-pointer text-center group">
                         <div className="w-16 h-16 bg-sky-50 dark:bg-sky-900/20 text-sky-600 mx-auto rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                           <Ticket size={32}/>
                         </div>
                         <h3 className="font-bold text-lg">Raise a Ticket</h3>
                         <p className="text-sm text-muted-foreground mt-2">Report bugs or request technical assistance from platform admins.</p>
                      </div>
                      
                      <div onClick={()=>setActiveMenu('docs')} className="p-6 bg-card border border-border rounded-2xl hover:border-purple-500/50 hover:shadow-md transition-all cursor-pointer text-center group">
                         <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 text-purple-600 mx-auto rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                           <BookOpen size={32}/>
                         </div>
                         <h3 className="font-bold text-lg">Read Documentation</h3>
                         <p className="text-sm text-muted-foreground mt-2">Browse the user manual, tutorials, and configuration guides.</p>
                      </div>

                      <div onClick={()=>setActiveMenu('status')} className="p-6 bg-card border border-border rounded-2xl hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer text-center group">
                         <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 mx-auto rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                           <Server size={32}/>
                         </div>
                         <h3 className="font-bold text-lg">System Status</h3>
                         <p className="text-sm text-muted-foreground mt-2">Check cloud server uptime, database sync, and API health.</p>
                      </div>
                   </div>

                   <div className="bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/50 rounded-2xl p-6">
                      <h3 className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-2 mb-3"><Bell size={18}/> Latest Platform Announcement</h3>
                      <p className="text-sm text-sky-700 dark:text-sky-400">Scheduled maintenance on 02 Oct 2026 from 02:00 AM to 04:00 AM. Cloud sync services may be temporarily unavailable during this window.</p>
                   </div>
                </div>
              )}

              {/* --- CREATE TICKET FORM --- */}
              {!selectedTicket && activeMenu === 'create_ticket' && (
                <div className="p-6 md:p-8 h-full bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <PlusCircle className="text-sky-500" /> Create Support Ticket
                   </h2>
                   
                   <div className="max-w-3xl bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-1.5">
                           <label className="text-sm font-bold text-muted-foreground uppercase">Ticket Category <span className="text-red-500">*</span></label>
                           <select className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-sky-500 outline-none">
                             <option>Bug/Error Report</option>
                             <option>Feature Request</option>
                             <option>Hardware/Scanner Sync</option>
                             <option>Data Import/Export</option>
                             <option>Billing & Subscription</option>
                             <option>Other</option>
                           </select>
                         </div>
                         <div className="space-y-1.5">
                           <label className="text-sm font-bold text-muted-foreground uppercase">Priority Level</label>
                           <select className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-sky-500 outline-none">
                             <option>Low - General query</option>
                             <option>Medium - Minor issue</option>
                             <option>High - System blocking</option>
                           </select>
                         </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-muted-foreground uppercase">Subject <span className="text-red-500">*</span></label>
                        <input type="text" placeholder="Brief summary of the issue" className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-muted-foreground uppercase">Detailed Description <span className="text-red-500">*</span></label>
                        <textarea rows={6} placeholder="Please provide as much detail as possible to help our support team..." className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-muted-foreground uppercase">Attachments (Optional)</label>
                        <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors">
                           <Paperclip size={32} className="text-slate-400 mb-2" />
                           <p className="text-sm font-bold text-muted-foreground">Click to upload screenshots or error logs</p>
                           <p className="text-xs text-muted-foreground mt-1">Max file size: 10MB (JPG, PNG, PDF)</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-border flex justify-end gap-3">
                         <button onClick={()=>setActiveMenu('my_tickets')} className="px-6 py-3 border border-border bg-muted hover:bg-muted/80 rounded-xl font-medium">Cancel</button>
                         <button onClick={()=>{setTickets(items=>[{id:'TCK-2026-'+(891+items.length),subject:'New Admin Support Request',category:'General',priority:'Medium',status:'Open',date:'29 Sep 2026'},...items]); notify('Ticket created successfully.'); setActiveMenu('my_tickets');}} className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-md flex items-center gap-2"><Send size={18}/> Submit Ticket</button>
                      </div>
                   </div>
                </div>
              )}

              {/* --- MY TICKETS LIST --- */}
              {!selectedTicket && activeMenu === 'my_tickets' && (
                <div className="p-6 h-full flex flex-col bg-background">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-bold flex items-center gap-2">
                       <LayoutList className="text-sky-500" /> My Support Tickets
                     </h2>
                     <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                       <input type="text" placeholder="Search Ticket ID or Subject..." className="pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 w-64" />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 overflow-y-auto custom-scrollbar">
                    {tickets.map(ticket => (
                      <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="p-5 border border-border rounded-2xl bg-card hover:border-sky-500/50 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group">
                         
                         <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-900/20 text-sky-600 flex items-center justify-center border border-sky-100 dark:border-sky-900/50 shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                               <Ticket size={24} />
                            </div>
                            <div>
                               <h3 className="font-bold text-lg leading-tight">{ticket.subject}</h3>
                               <p className="text-sm text-muted-foreground mt-1">{ticket.id} • {ticket.category}</p>
                               <div className="flex gap-2 mt-2">
                                 <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={12}/> {ticket.date}</span>
                               </div>
                            </div>
                         </div>

                         <div className="flex flex-col items-end gap-3 min-w-[150px]">
                            <div className="flex gap-2">
                              <span className={`px-2 py-0.5 text-xs font-bold rounded ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                              <span className={`px-2 py-0.5 text-xs font-bold rounded-full border bg-background ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
                            </div>
                            <button onClick={()=>setSelectedTicket(ticket)} className="text-sm font-bold text-sky-600 hover:underline flex items-center gap-1 mt-2">View Thread <ChevronRight size={16}/></button>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* --- DETAILED TICKET THREAD (Reply History) --- */}
              {selectedTicket && (
                <div className="h-full flex flex-col bg-background">
                   
                   {/* Ticket Header */}
                   <div className="p-6 border-b border-border bg-card shadow-sm z-10 flex justify-between items-start">
                     <div>
                       <div className="flex items-center gap-3 mb-2">
                         <span className="font-mono text-sm font-bold text-sky-600 bg-sky-50 dark:bg-sky-900/30 px-2 py-0.5 rounded">{selectedTicket.id}</span>
                         <span className={`px-2 py-0.5 text-xs font-bold rounded ${getPriorityColor(selectedTicket.priority)}`}>{selectedTicket.priority} Priority</span>
                         <span className={`px-2 py-0.5 text-xs font-bold rounded-full border bg-background ${getStatusColor(selectedTicket.status)}`}>{selectedTicket.status}</span>
                       </div>
                       <h2 className="text-2xl font-bold">{selectedTicket.subject}</h2>
                       <p className="text-sm text-muted-foreground mt-1">Category: {selectedTicket.category} • Opened on {selectedTicket.date}</p>
                     </div>
                   </div>

                   {/* Thread View */}
                   <div className="p-6 flex-1 overflow-y-auto space-y-6">
                      
                      {/* User's Original Message */}
                      <div className="flex gap-4 max-w-3xl">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold shrink-0">ME</div>
                        <div className="flex-1 space-y-1">
                           <div className="flex items-center justify-between"><span className="font-bold text-sm">Me (Library Admin)</span><span className="text-xs text-muted-foreground">{selectedTicket.date} 10:30 AM</span></div>
                           <div className="p-4 bg-muted/40 border border-border rounded-2xl rounded-tl-sm text-sm">
                             I am trying to sync my new thermal barcode scanner but the system is not recognizing the input in the Circulation tab. It works fine in notepad.
                           </div>
                        </div>
                      </div>

                      {/* Support Reply */}
                      <div className="flex gap-4 max-w-3xl ml-auto flex-row-reverse">
                        <div className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0"><LifeBuoy size={20}/></div>
                        <div className="flex-1 space-y-1 text-right">
                           <div className="flex items-center justify-between flex-row-reverse"><span className="font-bold text-sm text-sky-600">Platform Support</span><span className="text-xs text-muted-foreground">{selectedTicket.date} 11:45 AM</span></div>
                           <div className="p-4 bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-900/50 rounded-2xl rounded-tr-sm text-sm text-left inline-block">
                             Hi there, please ensure that your scanner is programmed to append a "Carriage Return" (Enter key) after each scan. You can usually find the configuration barcode for this in the scanner's physical manual. Let us know if this fixes it!
                           </div>
                        </div>
                      </div>

                   </div>

                   {/* Reply Box */}
                   <div className="p-4 border-t border-border bg-card">
                      <div className="flex gap-3 max-w-4xl mx-auto">
                        <button onClick={()=>notify("Attachment picker opened.")} className="p-3 bg-muted hover:bg-muted/80 rounded-xl text-muted-foreground"><Paperclip size={20}/></button>
                        <input type="text" placeholder="Type your reply to Support..." className="flex-1 px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500" />
                        <button onClick={()=>notify("Reply sent to Support.")} className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold flex items-center gap-2"><Send size={18}/> Send</button>
                      </div>
                   </div>
                </div>
              )}


              {/* --- SYSTEM STATUS DASHBOARD --- */}
              {!selectedTicket && activeMenu === 'status' && (
                <div className="p-6 md:p-8 h-full flex flex-col bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <Server className="text-emerald-500" /> System & Server Status
                   </h2>

                   <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle size={32}/>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">All Systems Operational</h3>
                        <p className="text-emerald-700 dark:text-emerald-500 mt-1">Global platform servers are running normally.</p>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                      <div className="border border-border bg-card rounded-xl p-5 shadow-sm space-y-4">
                         <h3 className="font-bold flex items-center gap-2"><Server size={18} className="text-slate-500"/> Core Services</h3>
                         <div className="space-y-3 text-sm">
                           <div className="flex justify-between items-center pb-2 border-b border-border"><span className="text-muted-foreground">Database Sync</span><span className="font-bold text-emerald-600 flex items-center gap-1">100% Uptime</span></div>
                           <div className="flex justify-between items-center pb-2 border-b border-border"><span className="text-muted-foreground">Notification Engine</span><span className="font-bold text-emerald-600 flex items-center gap-1">100% Uptime</span></div>
                           <div className="flex justify-between items-center"><span className="text-muted-foreground">Cloud Storage (Media)</span><span className="font-bold text-emerald-600 flex items-center gap-1">100% Uptime</span></div>
                         </div>
                      </div>
                      <div className="border border-border bg-card rounded-xl p-5 shadow-sm space-y-4">
                         <h3 className="font-bold flex items-center gap-2"><Activity size={18} className="text-slate-500"/> Metrics (Last 30 Days)</h3>
                         <div className="space-y-3 text-sm">
                           <div className="flex justify-between items-center pb-2 border-b border-border"><span className="text-muted-foreground">Overall Uptime</span><span className="font-bold">99.98%</span></div>
                           <div className="flex justify-between items-center pb-2 border-b border-border"><span className="text-muted-foreground">Average API Latency</span><span className="font-bold">45ms</span></div>
                           <div className="flex justify-between items-center"><span className="text-muted-foreground">Last Maintenance</span><span className="font-bold">12 Sep 2026</span></div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {/* --- PLACEHOLDERS --- */}
              {!selectedTicket && !['center', 'create_ticket', 'my_tickets', 'status'].includes(activeMenu) && (
                 <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-10 bg-background flex-1">
                   <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 border border-border">
                     {SIDEBAR_MENU.find(m=>m.id === activeMenu)?.icon({size: 48, className: "opacity-30 text-sky-500"})}
                   </div>
                   <h3 className="text-2xl font-bold text-foreground mb-2 capitalize">{SIDEBAR_MENU.find(m=>m.id === activeMenu)?.label}</h3>
                   <p className="text-center max-w-md mb-6">Open the selected support resource and continue the workflow from this Admin workspace.</p>
                 </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
