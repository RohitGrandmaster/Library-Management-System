'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellRing, Megaphone, Mail, MessageSquare, Smartphone, Globe,
  LayoutTemplate, CalendarClock, ListOrdered, History, AlertTriangle,
  Send, Users, MapPin, Building2, ShieldCheck, CheckCircle2, RefreshCw
} from 'lucide-react';

const SIDEBAR_MENU = [
  { id: 'dashboard', label: 'Notification Dashboard', icon: BellRing },
  { id: 'announcements', label: 'Announcements (New)', icon: Megaphone },
  { id: 'triggers', label: 'Notification Automations', icon: RefreshCw },
  { id: 'email', label: 'Email Campaigns', icon: Mail },
  { id: 'sms', label: 'SMS Campaigns', icon: MessageSquare },
  { id: 'whatsapp', label: 'WhatsApp', icon: Smartphone },
  { id: 'push', label: 'Push Notifications', icon: Globe },
  { id: 'templates', label: 'Message Templates', icon: LayoutTemplate },
  { id: 'scheduled', label: 'Scheduled', icon: CalendarClock },
  { id: 'queue', label: 'Notification Queue', icon: ListOrdered },
  { id: 'history', label: 'Delivery History', icon: History },
  { id: 'failed', label: 'Failed Notifications', icon: AlertTriangle },
];

const AUTOMATION_TRIGGERS = [
  { id: 't1', label: 'Book Issued', desc: 'Sent when a book is successfully issued to a member.', status: true },
  { id: 't2', label: 'Book Returned', desc: 'Sent when a member returns a book.', status: true },
  { id: 't3', label: 'Due Soon', desc: 'Reminder sent 2 days before due date.', status: true },
  { id: 't4', label: 'Overdue', desc: 'Alert sent daily when book crosses due date.', status: true },
  { id: 't5', label: 'Fine Generated', desc: 'Sent when a new fine is applied to member account.', status: true },
  { id: 't6', label: 'Fine Paid', desc: 'Receipt sent upon successful fine payment.', status: false },
  { id: 't7', label: 'Reservation Ready', desc: 'Alert sent when a reserved book is available for pickup.', status: true },
  { id: 't8', label: 'Membership Expiry', desc: 'Reminder sent 7 days before membership expires.', status: true },
  { id: 't9', label: 'Membership Expired', desc: 'Alert sent immediately upon expiration.', status: false },
  { id: 't10', label: 'Account Activation', desc: 'Welcome message sent on new registration.', status: true },
];

export default function CommunicationView() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [notice, setNotice] = useState('');
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(v => v === message ? '' : v), 2200); };

  // Form states for Announcement
  const [targetAudience, setTargetAudience] = useState('entire_library');
  const [selectedChannels, setSelectedChannels] = useState(['email']);
  const [announcementSubject, setAnnouncementSubject] = useState('');
  const [announcementBody, setAnnouncementBody] = useState('');
  const [automationStatus, setAutomationStatus] = useState<Record<string, boolean>>(() => Object.fromEntries(AUTOMATION_TRIGGERS.map(t => [t.id, t.status])));

  const toggleChannel = (channel: string) => {
    if(selectedChannels.includes(channel)) {
      setSelectedChannels(selectedChannels.filter(c => c !== channel));
    } else {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  return (
    <div className="w-full max-w-full space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
            <Megaphone size={28} className="text-indigo-600" /> Notifications & Communication
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Broadcast announcements, manage automated triggers, and monitor delivery history.
          </p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setActiveMenu('announcements')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors">
             <Send size={16} /> New Announcement
           </button>
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
                  ? 'bg-indigo-600 text-white shadow-md scale-[1.02]' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <menu.icon size={18} className={isActive ? 'text-white' : 'text-indigo-500/70'} />
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
              
              {/* --- NOTIFICATION DASHBOARD --- */}
              {activeMenu === 'dashboard' && (
                <div className="p-6 h-full flex flex-col bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <BellRing className="text-indigo-500" /> Communication Overview
                   </h2>
                   
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <div className="p-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg">
                         <p className="text-white/80 font-medium text-sm uppercase tracking-wider mb-1">Sent This Month</p>
                         <h3 className="text-4xl font-extrabold">12.5K</h3>
                         <div className="mt-4 pt-4 border-t border-white/20 text-xs flex justify-between">
                           <span>Delivery Rate:</span><span className="font-bold">98.5%</span>
                         </div>
                      </div>
                      <div className="p-5 bg-card border border-border rounded-2xl">
                         <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center mb-3"><CheckCircle2 size={20}/></div>
                         <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Delivered</p>
                         <h3 className="text-2xl font-bold">12,312</h3>
                      </div>
                      <div className="p-5 bg-card border border-border rounded-2xl">
                         <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center mb-3"><ListOrdered size={20}/></div>
                         <p className="text-muted-foreground text-xs uppercase font-bold mb-1">In Queue</p>
                         <h3 className="text-2xl font-bold">45</h3>
                      </div>
                      <div className="p-5 bg-card border border-border rounded-2xl">
                         <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center mb-3"><AlertTriangle size={20}/></div>
                         <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Failed</p>
                         <h3 className="text-2xl font-bold text-red-500">143</h3>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-border rounded-xl p-5 bg-card">
                         <h3 className="font-bold mb-4">Channel Usage</h3>
                         <div className="space-y-4">
                           <div>
                             <div className="flex justify-between text-sm mb-1"><span>Email</span><span className="font-bold">60%</span></div>
                             <div className="w-full bg-muted rounded-full h-2"><div className="bg-indigo-500 h-2 rounded-full" style={{width: '60%'}}></div></div>
                           </div>
                           <div>
                             <div className="flex justify-between text-sm mb-1"><span>WhatsApp</span><span className="font-bold">25%</span></div>
                             <div className="w-full bg-muted rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{width: '25%'}}></div></div>
                           </div>
                           <div>
                             <div className="flex justify-between text-sm mb-1"><span>SMS</span><span className="font-bold">10%</span></div>
                             <div className="w-full bg-muted rounded-full h-2"><div className="bg-orange-500 h-2 rounded-full" style={{width: '10%'}}></div></div>
                           </div>
                           <div>
                             <div className="flex justify-between text-sm mb-1"><span>Push (App)</span><span className="font-bold">5%</span></div>
                             <div className="w-full bg-muted rounded-full h-2"><div className="bg-pink-500 h-2 rounded-full" style={{width: '5%'}}></div></div>
                           </div>
                         </div>
                      </div>
                      
                      <div className="border border-border rounded-xl p-5 bg-card overflow-y-auto">
                         <h3 className="font-bold mb-4">Live Queue Status</h3>
                         <div className="space-y-3">
                           <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
                             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                             <div className="flex-1"><p className="text-sm font-medium">Overdue Reminders (15 msgs)</p><p className="text-xs text-muted-foreground">Processing via WhatsApp</p></div>
                           </div>
                           <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
                             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                             <div className="flex-1"><p className="text-sm font-medium">Holiday Announcement (800 msgs)</p><p className="text-xs text-muted-foreground">Processing via Email</p></div>
                           </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {/* --- NEW ANNOUNCEMENT FORM --- */}
              {activeMenu === 'announcements' && (
                <div className="p-6 h-full bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <Megaphone className="text-purple-500" /> Create Announcement
                   </h2>
                   
                   <div className="max-w-4xl border border-border bg-card rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
                      
                      {/* Audience Selection */}
                      <div className="space-y-4">
                         <h3 className="font-bold flex items-center gap-2 border-b border-border pb-2"><Users size={18} className="text-indigo-500"/> 1. Target Audience</h3>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <label className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${targetAudience === 'entire_library' ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500' : 'bg-background hover:bg-muted/50 border-border'}`}>
                              <input type="radio" name="target" checked={targetAudience === 'entire_library'} onChange={()=>setTargetAudience('entire_library')} className="sr-only" />
                              <Globe size={24} className={`mb-2 ${targetAudience === 'entire_library' ? 'text-indigo-600' : 'text-muted-foreground'}`}/>
                              <span className="font-bold text-sm">Entire Library</span>
                              <span className="text-xs text-muted-foreground mt-1">All active members</span>
                            </label>
                            
                            <label className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${targetAudience === 'branch' ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500' : 'bg-background hover:bg-muted/50 border-border'}`}>
                              <input type="radio" name="target" checked={targetAudience === 'branch'} onChange={()=>setTargetAudience('branch')} className="sr-only" />
                              <MapPin size={24} className={`mb-2 ${targetAudience === 'branch' ? 'text-indigo-600' : 'text-muted-foreground'}`}/>
                              <span className="font-bold text-sm">Specific Branch</span>
                              <span className="text-xs text-muted-foreground mt-1">E.g., Central Hub</span>
                            </label>
                            
                            <label className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${targetAudience === 'managers' ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500' : 'bg-background hover:bg-muted/50 border-border'}`}>
                              <input type="radio" name="target" checked={targetAudience === 'managers'} onChange={()=>setTargetAudience('managers')} className="sr-only" />
                              <Building2 size={24} className={`mb-2 ${targetAudience === 'managers' ? 'text-indigo-600' : 'text-muted-foreground'}`}/>
                              <span className="font-bold text-sm">Managers Only</span>
                              <span className="text-xs text-muted-foreground mt-1">Staff accounts</span>
                            </label>
                            
                            <label className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${targetAudience === 'selected' ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500' : 'bg-background hover:bg-muted/50 border-border'}`}>
                              <input type="radio" name="target" checked={targetAudience === 'selected'} onChange={()=>setTargetAudience('selected')} className="sr-only" />
                              <Users size={24} className={`mb-2 ${targetAudience === 'selected' ? 'text-indigo-600' : 'text-muted-foreground'}`}/>
                              <span className="font-bold text-sm">Selected Members</span>
                              <span className="text-xs text-muted-foreground mt-1">Manual selection</span>
                            </label>
                         </div>
                         
                         {targetAudience === 'branch' && (
                           <div className="mt-4 max-w-sm"><select className="w-full px-4 py-2 rounded-lg border border-border bg-background outline-none"><option>Select Branch...</option></select></div>
                         )}
                      </div>

                      {/* Channel Selection */}
                      <div className="space-y-4">
                         <h3 className="font-bold flex items-center gap-2 border-b border-border pb-2"><Send size={18} className="text-emerald-500"/> 2. Select Channels</h3>
                         <div className="flex flex-wrap gap-3">
                            <button onClick={()=>toggleChannel('email')} className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-bold transition-colors ${selectedChannels.includes('email') ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-background text-muted-foreground hover:bg-muted'}`}><Mail size={16}/> Email</button>
                            <button onClick={()=>toggleChannel('sms')} className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-bold transition-colors ${selectedChannels.includes('sms') ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-background text-muted-foreground hover:bg-muted'}`}><MessageSquare size={16}/> SMS</button>
                            <button onClick={()=>toggleChannel('whatsapp')} className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-bold transition-colors ${selectedChannels.includes('whatsapp') ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-background text-muted-foreground hover:bg-muted'}`}><Smartphone size={16}/> WhatsApp</button>
                            <button onClick={()=>toggleChannel('push')} className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-bold transition-colors ${selectedChannels.includes('push') ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-background text-muted-foreground hover:bg-muted'}`}><Globe size={16}/> Push App</button>
                         </div>
                      </div>

                      {/* Message Content */}
                      <div className="space-y-4">
                         <h3 className="font-bold flex items-center gap-2 border-b border-border pb-2"><LayoutTemplate size={18} className="text-pink-500"/> 3. Message Content</h3>
                         <div className="space-y-3">
                           <input type="text" value={announcementSubject} onChange={e=>setAnnouncementSubject(e.target.value)} placeholder="Announcement Subject / Title" className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                           <textarea rows={5} value={announcementBody} onChange={e=>setAnnouncementBody(e.target.value)} placeholder="Write your message here... Use {name} for member name." className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                         </div>
                      </div>

                      <div className="pt-4 flex justify-between items-center border-t border-border">
                         <div className="text-sm font-medium text-muted-foreground">Estimated Audience: <span className="font-bold text-foreground">1,240 Members</span></div>
                         <button onClick={()=>{if(!announcementSubject.trim() || !announcementBody.trim()){notify('Subject and message are required.');return;} if(!selectedChannels.length){notify('Select at least one channel.');return;} notify('Announcement queued for '+targetAudience.replace('_',' ')+'.');}} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md flex items-center gap-2">
                           <Send size={18} /> Send Announcement
                         </button>
                      </div>

                   </div>
                </div>
              )}

              {/* --- AUTOMATION TRIGGERS --- */}
              {activeMenu === 'triggers' && (
                <div className="p-6 h-full bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <RefreshCw className="text-teal-500" /> Automated Notification Triggers
                   </h2>
                   <p className="text-sm text-muted-foreground mb-6 max-w-3xl">Enable or disable system-generated notifications. These messages are sent automatically when specific events occur in the library system.</p>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
                      {AUTOMATION_TRIGGERS.map(trigger => (
                         <div key={trigger.id} className="p-4 border border-border bg-card rounded-xl flex items-start justify-between gap-4 shadow-sm hover:border-teal-500/30 transition-colors">
                            <div>
                               <h3 className="font-bold text-base flex items-center gap-2">
                                 {trigger.status ? <CheckCircle2 size={16} className="text-emerald-500"/> : <Ban size={16} className="text-slate-400"/>}
                                 {trigger.label}
                               </h3>
                               <p className="text-xs text-muted-foreground mt-1">{trigger.desc}</p>
                               <div className="mt-3 flex gap-2">
                                 <button onClick={()=>notify("Email template editor opened.")} className="text-xs font-bold text-indigo-600 hover:underline">Edit Email Template</button>
                                 <span className="text-muted-foreground text-xs">•</span>
                                 <button onClick={()=>notify("SMS template editor opened.")} className="text-xs font-bold text-emerald-600 hover:underline">Edit SMS Template</button>
                               </div>
                            </div>
                            
                            {/* Toggle Switch */}
                            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                              <input type="checkbox" className="sr-only peer" checked={automationStatus[trigger.id]} onChange={()=>setAutomationStatus(items=>({...items,[trigger.id]:!items[trigger.id]}))} />
                              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                            </label>
                         </div>
                      ))}
                   </div>
                </div>
              )}

              {/* --- COMMUNICATIONS --- */}
              {!['dashboard', 'announcements', 'triggers'].includes(activeMenu) && (
                 <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-10">
                   <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 border border-border">
                     {SIDEBAR_MENU.find(m=>m.id === activeMenu)?.icon({size: 48, className: "opacity-30 text-indigo-500"})}
                   </div>
                   <h3 className="text-2xl font-bold text-foreground mb-2 capitalize">{SIDEBAR_MENU.find(m=>m.id === activeMenu)?.label}</h3>
                   <p className="text-center max-w-md mb-6">Configure settings, view logs, and manage {SIDEBAR_MENU.find(m=>m.id === activeMenu)?.label.toLowerCase()} from here.</p>
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
