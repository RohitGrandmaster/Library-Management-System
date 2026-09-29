'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Building, Clock, CalendarDays, Users, ArrowRightLeft,
  Bookmark, DollarSign, Boxes, Barcode, Receipt, Bell, MapPin, Printer,
  Globe, Save, PlusCircle, CheckCircle, HelpCircle, XCircle
} from 'lucide-react';

const SIDEBAR_MENU = [
  { id: 'general', label: 'General Settings', icon: Settings },
  { id: 'library', label: 'Library Information', icon: Building },
  { id: 'hours', label: 'Working Hours', icon: Clock },
  { id: 'holidays', label: 'Holidays', icon: CalendarDays },
  { id: 'membership', label: 'Membership Settings', icon: Users },
  { id: 'circulation', label: 'Circulation Settings', icon: ArrowRightLeft },
  { id: 'reservation', label: 'Reservation Settings', icon: Bookmark },
  { id: 'fines', label: 'Fine Settings', icon: DollarSign },
  { id: 'inventory', label: 'Inventory Settings', icon: Boxes },
  { id: 'barcode', label: 'Barcode Settings', icon: Barcode },
  { id: 'receipt', label: 'Receipt Settings', icon: Receipt },
  { id: 'notifications', label: 'Notification Settings', icon: Bell },
  { id: 'branches', label: 'Branch Settings', icon: MapPin },
  { id: 'printing', label: 'Printing Settings', icon: Printer },
  { id: 'localization', label: 'Localization', icon: Globe },
];

export default function SettingsView() {
  const [activeMenu, setActiveMenu] = useState('library');
  const [holidays, setHolidays] = useState([{date:'15 Aug 2026',name:'Independence Day'},{date:'02 Oct 2026',name:'Gandhi Jayanti'},{date:'25 Dec 2026',name:'Christmas'}]);
  const [notice, setNotice] = useState('');
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(v => v === message ? '' : v), 2200); };

  const handleSave = () => {
    notify('Settings saved successfully.');
  };

  return (
    <div className="w-full max-w-full space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent flex items-center gap-2">
            <Settings size={28} className="text-slate-600 dark:text-slate-300" /> Library Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete configuration center for library rules, fines, circulation, and working hours.
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
              key={activeMenu}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              
              {/* --- LIBRARY INFORMATION --- */}
              {activeMenu === 'library' && (
                <div className="p-6 md:p-8 flex-1 overflow-y-auto bg-background">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <Building className="text-blue-500" /> Library Information
                   </h2>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                     <div className="space-y-1.5 md:col-span-2">
                       <label className="text-sm font-medium">Library Name <span className="text-red-500">*</span></label>
                       <input type="text" defaultValue="Central State Library" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-blue-500 outline-none" />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-sm font-medium">Primary Contact Number</label>
                       <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-blue-500 outline-none" />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-sm font-medium">Official Email</label>
                       <input type="email" defaultValue="admin@centrallibrary.com" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-blue-500 outline-none" />
                     </div>
                     <div className="space-y-1.5 md:col-span-2">
                       <label className="text-sm font-medium">Library Logo URL</label>
                       <input type="url" WORKSPACE="https://..." className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-blue-500 outline-none" />
                     </div>
                     <div className="space-y-1.5 md:col-span-2">
                       <label className="text-sm font-medium">Complete Address</label>
                       <textarea rows={3} defaultValue="123 Education Street, Knowledge Park, City" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-blue-500 outline-none" />
                     </div>
                   </div>
                </div>
              )}

              {/* --- WORKING HOURS & HOLIDAYS --- */}
              {['hours', 'holidays'].includes(activeMenu) && (
                <div className="p-6 md:p-8 flex-1 overflow-y-auto bg-background">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 capitalize">
                     {activeMenu === 'hours' ? <Clock className="text-orange-500" /> : <CalendarDays className="text-emerald-500"/>} {activeMenu}
                   </h2>
                   
                   {activeMenu === 'hours' && (
                     <div className="max-w-4xl space-y-4">
                       {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
                         <div key={day} className="flex items-center justify-between p-4 border border-border rounded-xl bg-card">
                            <span className="font-bold w-32">{day}</span>
                            <div className="flex gap-4 items-center">
                               {day === 'Sunday' ? (
                                 <span className="text-red-500 font-bold px-4">CLOSED</span>
                               ) : (
                                 <>
                                   <input type="time" defaultValue="09:00" className="px-3 py-1.5 border border-border rounded bg-background text-sm" />
                                   <span>to</span>
                                   <input type="time" defaultValue={day === 'Saturday' ? '14:00' : '18:00'} className="px-3 py-1.5 border border-border rounded bg-background text-sm" />
                                 </>
                               )}
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked={day !== 'Sunday'} />
                              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                            </label>
                         </div>
                       ))}
                     </div>
                   )}

                   {activeMenu === 'holidays' && (
                     <div className="max-w-4xl">
                       <button onClick={()=>{setHolidays(items=>[...items,{date:"01 Jan "+new Date().getFullYear(),name:"New Library Holiday"}]);notify("Holiday added.");}} className="mb-4 px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold flex items-center gap-2"><PlusCircle size={16}/> Add Holiday</button>
                       <table className="w-full text-sm text-left border border-border rounded-xl overflow-hidden bg-card">
                         <thead className="bg-muted text-muted-foreground uppercase text-xs font-bold">
                           <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Holiday Name</th><th className="px-4 py-3 text-center">Recurring?</th><th className="px-4 py-3 text-right">Actions</th></tr>
                         </thead>
                         <tbody>
                            {holidays.map((holiday, index) => (
                              <tr key={index} className="border-b border-border last:border-0">
                                <td className="px-4 py-3 font-medium">{holiday.date}</td>
                                <td className="px-4 py-3">{holiday.name}</td>
                                <td className="px-4 py-3 text-center">
                                  <CheckCircle size={16} className="text-emerald-500 mx-auto" />
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <button
                                    onClick={() => {
                                      setHolidays(items => items.filter((_, i) => i !== index));
                                      notify('Holiday deleted.');
                                    }}
                                    className="text-red-500 hover:underline"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                         </tbody>
                       </table>
                     </div>
                   )}
                </div>
              )}

              {/* --- CIRCULATION & FINES & RESERVATION --- */}
              {['circulation', 'fines', 'reservation'].includes(activeMenu) && (
                <div className="p-6 md:p-8 flex-1 overflow-y-auto bg-background">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 capitalize">
                     {activeMenu === 'circulation' && <ArrowRightLeft className="text-purple-500" />}
                     {activeMenu === 'fines' && <DollarSign className="text-red-500" />}
                     {activeMenu === 'reservation' && <Bookmark className="text-blue-500" />}
                     {activeMenu} Settings
                   </h2>
                   
                   <div className="max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
                     
                     {activeMenu === 'circulation' && (
                       <>
                         <div className="space-y-1.5"><label className="text-sm font-bold text-muted-foreground uppercase">Default Issue Period (Days)</label><input type="number" defaultValue="14" className="w-full px-4 py-3 rounded-xl border border-border bg-card font-bold" /></div>
                         <div className="space-y-1.5"><label className="text-sm font-bold text-muted-foreground uppercase">Max Issues per Member</label><input type="number" defaultValue="5" className="w-full px-4 py-3 rounded-xl border border-border bg-card font-bold" /></div>
                         <div className="space-y-1.5"><label className="text-sm font-bold text-muted-foreground uppercase">Max Renewals Allowed</label><input type="number" defaultValue="2" className="w-full px-4 py-3 rounded-xl border border-border bg-card font-bold" /></div>
                         <div className="space-y-1.5"><label className="text-sm font-bold text-muted-foreground uppercase">Grace Period (Days)</label><input type="number" defaultValue="1" className="w-full px-4 py-3 rounded-xl border border-border bg-card font-bold" /></div>
                       </>
                     )}

                     {activeMenu === 'fines' && (
                       <>
                         <div className="space-y-1.5"><label className="text-sm font-bold text-muted-foreground uppercase">Per-Day Fine Rate (₹)</label><input type="number" defaultValue="10" className="w-full px-4 py-3 rounded-xl border-red-200 border-2 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 font-extrabold text-xl outline-none focus:border-red-500" /></div>
                         <div className="space-y-1.5"><label className="text-sm font-bold text-muted-foreground uppercase">Maximum Fine Cap (₹)</label><input type="number" defaultValue="500" className="w-full px-4 py-3 rounded-xl border border-border bg-card font-bold" /></div>
                         <div className="space-y-1.5"><label className="text-sm font-bold text-muted-foreground uppercase">Lost Book Fine Multiplier</label><input type="number" step="0.5" defaultValue="1.5" className="w-full px-4 py-3 rounded-xl border border-border bg-card font-bold" /><p className="text-xs text-muted-foreground">e.g. 1.5x of original price</p></div>
                         <div className="space-y-1.5"><label className="text-sm font-bold text-muted-foreground uppercase">Damaged Book Fine (%)</label><input type="number" defaultValue="50" className="w-full px-4 py-3 rounded-xl border border-border bg-card font-bold" /></div>
                       </>
                     )}

                     {activeMenu === 'reservation' && (
                       <>
                         <div className="space-y-1.5"><label className="text-sm font-bold text-muted-foreground uppercase">Max Reservations per Member</label><input type="number" defaultValue="2" className="w-full px-4 py-3 rounded-xl border border-border bg-card font-bold" /></div>
                         <div className="space-y-1.5"><label className="text-sm font-bold text-muted-foreground uppercase">Queue Expiry (Days)</label><input type="number" defaultValue="3" className="w-full px-4 py-3 rounded-xl border border-border bg-card font-bold" /></div>
                         <div className="space-y-1.5"><label className="text-sm font-bold text-muted-foreground uppercase">Pickup Duration (Hours)</label><input type="number" defaultValue="48" className="w-full px-4 py-3 rounded-xl border border-border bg-card font-bold" /><p className="text-xs text-muted-foreground">Time member has to collect book once ready</p></div>
                       </>
                     )}

                   </div>
                </div>
              )}

              {/* --- INVENTORY & BARCODE --- */}
              {['inventory', 'barcode'].includes(activeMenu) && (
                <div className="p-6 md:p-8 flex-1 overflow-y-auto bg-background">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 capitalize">
                     {activeMenu === 'inventory' ? <Boxes className="text-teal-500" /> : <Barcode className="text-indigo-500" />} {activeMenu} Settings
                   </h2>
                   
                   <div className="max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
                     
                     {activeMenu === 'inventory' && (
                       <>
                         <div className="space-y-1.5"><label className="text-sm font-bold text-muted-foreground uppercase">Accession Number Format</label><input type="text" defaultValue="LIB-ACC-{00000}" className="w-full px-4 py-3 rounded-xl border border-border bg-card font-mono" /></div>
                         <div className="space-y-1.5"><label className="text-sm font-bold text-muted-foreground uppercase">Starting Sequence</label><input type="number" defaultValue="10001" className="w-full px-4 py-3 rounded-xl border border-border bg-card font-mono" /></div>
                         <div className="flex items-center justify-between p-4 border border-border bg-card rounded-xl md:col-span-2">
                            <div><h4 className="font-bold text-sm">Allow Intra-Branch Transfers</h4><p className="text-xs text-muted-foreground">Can books be transferred between branches?</p></div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                            </label>
                         </div>
                       </>
                     )}

                     {activeMenu === 'barcode' && (
                       <>
                         <div className="space-y-1.5"><label className="text-sm font-bold text-muted-foreground uppercase">Barcode Prefix</label><input type="text" defaultValue="BK-" className="w-full px-4 py-3 rounded-xl border border-border bg-card font-mono" /></div>
                         <div className="space-y-1.5"><label className="text-sm font-bold text-muted-foreground uppercase">Barcode Format Type</label><select className="w-full px-4 py-3 rounded-xl border border-border bg-card font-bold"><option>CODE128</option><option>EAN13</option><option>QR Code</option></select></div>
                         <div className="space-y-1.5 md:col-span-2"><label className="text-sm font-bold text-muted-foreground uppercase">Print Label Size (mm)</label>
                            <div className="flex gap-4">
                              <input type="number" WORKSPACE="Width" defaultValue="50" className="w-full px-4 py-3 rounded-xl border border-border bg-card font-mono" />
                              <span className="self-center">x</span>
                              <input type="number" WORKSPACE="Height" defaultValue="25" className="w-full px-4 py-3 rounded-xl border border-border bg-card font-mono" />
                            </div>
                         </div>
                       </>
                     )}

                   </div>
                </div>
              )}

              {/* --- RECEIPT SETTINGS --- */}
              {activeMenu === 'receipt' && (
                <div className="p-6 md:p-8 flex-1 overflow-y-auto bg-background">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <Receipt className="text-pink-500" /> Receipt & Print Settings
                   </h2>
                   
                   <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                         <div className="space-y-1.5"><label className="text-sm font-bold text-muted-foreground uppercase">Printer Paper Size</label><select className="w-full px-4 py-3 rounded-xl border border-border bg-card font-bold"><option>Thermal (80mm)</option><option>Thermal (58mm)</option><option>A4</option></select></div>
                         <div className="space-y-1.5"><label className="text-sm font-bold text-muted-foreground uppercase">Receipt Header Text</label><textarea rows={3} defaultValue="Central State Library\nKnowledge Park, City" className="w-full px-4 py-3 rounded-xl border border-border bg-card font-mono text-sm" /></div>
                         <div className="space-y-1.5"><label className="text-sm font-bold text-muted-foreground uppercase">Receipt Footer Text</label><textarea rows={2} defaultValue="Thank you for visiting!\nPlease return books on time." className="w-full px-4 py-3 rounded-xl border border-border bg-card font-mono text-sm" /></div>
                         
                         <div className="flex items-center justify-between p-4 border border-border bg-card rounded-xl">
                            <div><h4 className="font-bold text-sm">Include Library Logo</h4><p className="text-xs text-muted-foreground">Print logo at top of receipt</p></div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                            </label>
                         </div>
                      </div>

                      {/* Receipt Preview */}
                      <div className="border-2 border-dashed border-border rounded-2xl p-6 bg-muted/20 flex flex-col items-center justify-center">
                         <p className="text-xs font-bold text-muted-foreground uppercase mb-4">Receipt Preview</p>
                         <div className="w-[280px] bg-white text-black p-6 shadow-xl border border-gray-200 text-center font-mono">
                           <h3 className="font-bold text-lg mb-1">Central State Library</h3>
                           <p className="text-xs mb-4">Knowledge Park, City</p>
                           <p className="text-left text-xs mb-1">Date: 29/09/2026</p>
                           <p className="text-left text-xs mb-3 border-b border-gray-300 pb-2">Receipt: #RC-9981</p>
                           <div className="flex justify-between text-sm font-bold"><span>Total Paid</span><span>₹150</span></div>
                           <p className="text-xs mt-6 border-t border-gray-300 pt-3">Thank you for visiting!<br/>Please return books on time.</p>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {!['library', 'hours', 'holidays', 'circulation', 'fines', 'reservation', 'inventory', 'barcode', 'receipt'].includes(activeMenu) && (
                <div className="p-6 md:p-8 flex-1 overflow-y-auto bg-background">
                  <div className="max-w-4xl space-y-6">
                    <div><h2 className="text-2xl font-bold flex items-center gap-2"><Settings className="text-slate-500"/> {SIDEBAR_MENU.find(m=>m.id===activeMenu)?.label}</h2><p className="text-sm text-muted-foreground mt-1">Configure the selected Admin setting and save it from the footer.</p></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {[
                        ['general','Default dashboard','Admin'],
                        ['membership','Default membership duration','12 months'],
                        ['notifications','Email notifications','Enabled'],
                        ['branches','Default branch','Central State Library'],
                        ['printing','Default printer','Front Desk Printer'],
                        ['localization','Language','English (India)']
                      ].filter(x=>x[0]===activeMenu).map(([_,label,value])=>(
                        <div key={label} className="p-5 border border-border rounded-xl bg-card space-y-3">
                          <label className="text-sm font-bold">{label}</label>
                          <input defaultValue={value} className="w-full px-4 py-3 rounded-xl border border-border bg-background"/>
                          <p className="text-xs text-muted-foreground">Frontend demo configuration. Changes are reflected through the save notification.</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SAVE BUTTON FOOTER */}
              <div className="p-4 border-t border-border bg-card flex justify-end gap-3 mt-auto shrink-0">
                 <button onClick={()=>notify("Unsaved configuration changes discarded.")} className="px-6 py-2.5 rounded-xl border border-border bg-muted hover:bg-muted/80 font-medium">Cancel Changes</button>
                 <button onClick={handleSave} className="px-8 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-md flex items-center gap-2">
                   <Save size={18} /> Save Configurations
                 </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {notice && <div className="fixed right-5 bottom-5 z-50 rounded-xl border border-border bg-card shadow-xl px-4 py-3 text-sm font-semibold">{notice}</div>}
    </div>
  );
}
