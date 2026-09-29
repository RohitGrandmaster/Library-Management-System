'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, BookOpen, Users, ArrowRightLeft, Bookmark,
  Boxes, DollarSign, Wallet, ShoppingCart, Building2,
  MapPin, UserCog, Activity, Settings2, Download, Printer,
  FileText, TableProperties, FileDown, Eye
} from 'lucide-react';

const SIDEBAR_MENU = [
  { id: 'dashboard', label: 'Dashboard Reports', icon: BarChart },
  { id: 'books', label: 'Book Reports', icon: BookOpen },
  { id: 'members', label: 'Member Reports', icon: Users },
  { id: 'circulation', label: 'Circulation Reports', icon: ArrowRightLeft },
  { id: 'reservation', label: 'Reservation Reports', icon: Bookmark },
  { id: 'inventory', label: 'Inventory Reports', icon: Boxes },
  { id: 'fines', label: 'Fine Reports', icon: DollarSign },
  { id: 'payments', label: 'Payment Reports', icon: Wallet },
  { id: 'acquisition', label: 'Acquisition Reports', icon: ShoppingCart },
  { id: 'vendors', label: 'Vendor Reports', icon: Building2 },
  { id: 'branches', label: 'Branch Reports', icon: MapPin },
  { id: 'managers', label: 'Manager Reports', icon: UserCog },
  { id: 'usage', label: 'Usage Reports', icon: Activity },
  { id: 'custom', label: 'Custom Reports', icon: Settings2 },
];

export default function ReportsView() {
  const [activeMenu, setActiveMenu] = useState('books');
  const [notice, setNotice] = useState('');
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(v => v === message ? '' : v), 2200); };
  const [exportOpen, setExportOpen] = useState(false);

  const handleExport = (type: string) => { if (type === 'print') window.print(); else { const blob = new Blob(['Library OS report: ' + activeMenu], {type:'text/plain'}); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href=url; link.download='admin-'+activeMenu+'-report.'+(type==='excel'?'xls':type); document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url); } notify(type.toUpperCase() + ' report generated.'); setExportOpen(false); };

  return (
    <div className="w-full max-w-full space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
            <BarChart size={28} className="text-blue-600" /> Reports & Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Library-level data visualization, statistical reports, and export tools.
          </p>
        </div>
        
        {/* GLOBAL EXPORT BUTTON */}
        <div className="relative w-full md:w-auto">
          <button 
            onClick={() => setExportOpen(!exportOpen)} 
            className="flex w-full md:w-auto items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <Download size={16} /> Export Current Report
          </button>
          {exportOpen && (
            <div className="absolute left-0 md:left-auto md:right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-50 py-2">
              <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><FileText size={16} className="text-red-500"/> Export as PDF</button>
              <button onClick={() => handleExport('excel')} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><TableProperties size={16} className="text-emerald-500"/> Export as Excel</button>
              <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><FileDown size={16} className="text-slate-500"/> Export as CSV</button>
              <div className="h-px bg-border my-1"></div>
              <button onClick={() => handleExport('print')} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Printer size={16} className="text-blue-500"/> Print Report</button>
            </div>
          )}
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
              className="h-full"
            >
              
              {/* --- BOOK REPORTS --- */}
              {activeMenu === 'books' && (
                <div className="p-6 h-full flex flex-col bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <BookOpen className="text-blue-500" /> Book & Catalog Reports
                   </h2>
                   
                   {/* Main Metric Cards */}
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                     <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-xl">
                       <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">Total Books</p>
                       <h3 className="text-3xl font-extrabold text-foreground mt-1">12,450</h3>
                     </div>
                     <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl">
                       <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Available Copies</p>
                       <h3 className="text-3xl font-extrabold text-foreground mt-1">9,200</h3>
                     </div>
                     <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 rounded-xl">
                       <p className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wide">Currently Issued</p>
                       <h3 className="text-3xl font-extrabold text-foreground mt-1">3,100</h3>
                     </div>
                     <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl">
                       <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wide">Lost/Damaged</p>
                       <h3 className="text-3xl font-extrabold text-foreground mt-1">150</h3>
                     </div>
                   </div>

                   {/* Sub-Reports Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      <div className="border border-border bg-card rounded-xl p-4 shadow-sm">
                        <h4 className="font-bold flex justify-between items-center mb-3">Category-wise <Eye size={16} className="text-blue-500 cursor-pointer"/></h4>
                        <div className="space-y-2 text-sm">
                           <div className="flex justify-between"><span className="text-muted-foreground">Programming</span><span className="font-bold">4,500</span></div>
                           <div className="flex justify-between"><span className="text-muted-foreground">Science Fiction</span><span className="font-bold">2,100</span></div>
                           <div className="flex justify-between"><span className="text-muted-foreground">Mathematics</span><span className="font-bold">1,800</span></div>
                        </div>
                      </div>
                      <div className="border border-border bg-card rounded-xl p-4 shadow-sm">
                        <h4 className="font-bold flex justify-between items-center mb-3">Author-wise <Eye size={16} className="text-blue-500 cursor-pointer"/></h4>
                        <div className="space-y-2 text-sm">
                           <div className="flex justify-between"><span className="text-muted-foreground">Robert C. Martin</span><span className="font-bold">120</span></div>
                           <div className="flex justify-between"><span className="text-muted-foreground">Stephen King</span><span className="font-bold">85</span></div>
                           <div className="flex justify-between"><span className="text-muted-foreground">Isaac Asimov</span><span className="font-bold">60</span></div>
                        </div>
                      </div>
                      <div className="border border-border bg-card rounded-xl p-4 shadow-sm">
                        <h4 className="font-bold flex justify-between items-center mb-3">Publisher-wise <Eye size={16} className="text-blue-500 cursor-pointer"/></h4>
                        <div className="space-y-2 text-sm">
                           <div className="flex justify-between"><span className="text-muted-foreground">Prentice Hall</span><span className="font-bold">2,500</span></div>
                           <div className="flex justify-between"><span className="text-muted-foreground">O'Reilly Media</span><span className="font-bold">1,900</span></div>
                           <div className="flex justify-between"><span className="text-muted-foreground">Penguin Books</span><span className="font-bold">1,200</span></div>
                        </div>
                      </div>
                      
                      <div className="border border-border bg-card rounded-xl p-4 shadow-sm xl:col-span-3">
                        <h4 className="font-bold flex justify-between items-center mb-3">Most Issued Books (Top 3) <Eye size={16} className="text-blue-500 cursor-pointer"/></h4>
                        <table className="w-full text-sm text-left">
                          <thead className="bg-muted text-muted-foreground"><tr><th className="px-3 py-2">Title</th><th className="px-3 py-2 text-center">Issue Count</th></tr></thead>
                          <tbody>
                            <tr className="border-b border-border"><td className="px-3 py-2 font-medium">Clean Code</td><td className="px-3 py-2 text-center font-bold text-emerald-600">842</td></tr>
                            <tr className="border-b border-border"><td className="px-3 py-2 font-medium">Introduction to Algorithms</td><td className="px-3 py-2 text-center font-bold text-emerald-600">756</td></tr>
                            <tr className=""><td className="px-3 py-2 font-medium">The Pragmatic Programmer</td><td className="px-3 py-2 text-center font-bold text-emerald-600">690</td></tr>
                          </tbody>
                        </table>
                      </div>
                   </div>
                </div>
              )}

              {/* --- MEMBER REPORTS --- */}
              {activeMenu === 'members' && (
                <div className="p-6 h-full flex flex-col bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <Users className="text-teal-500" /> Member Analytics
                   </h2>
                   
                   <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                     <div className="p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-900/50 rounded-xl col-span-2">
                       <p className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wide">Total Registered Members</p>
                       <h3 className="text-3xl font-extrabold text-foreground mt-1">4,250</h3>
                     </div>
                     <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl">
                       <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Active</p>
                       <h3 className="text-2xl font-extrabold text-foreground mt-1">3,800</h3>
                     </div>
                     <div className="p-4 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-xl">
                       <p className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide">Expired</p>
                       <h3 className="text-2xl font-extrabold text-foreground mt-1">350</h3>
                     </div>
                     <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl">
                       <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wide">Suspended</p>
                       <h3 className="text-2xl font-extrabold text-foreground mt-1">100</h3>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-border bg-card rounded-xl p-5 shadow-sm">
                         <h4 className="font-bold flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">New Members (This Month)</h4>
                         <div className="flex items-center gap-4">
                           <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-2xl">+145</div>
                           <p className="text-sm text-muted-foreground flex-1">A 12% increase compared to last month. Bulk registrations from Computer Science dept.</p>
                         </div>
                      </div>
                      <div className="border border-border bg-card rounded-xl p-5 shadow-sm">
                         <h4 className="font-bold flex justify-between items-center mb-4">Most Active Members <Eye size={16} className="text-teal-500 cursor-pointer"/></h4>
                         <div className="space-y-3">
                           <div className="flex items-center justify-between text-sm">
                             <div className="flex items-center gap-2"><img src="https://i.pravatar.cc/150?u=alice" className="w-6 h-6 rounded-full"/> <span className="font-medium">Alice Walker</span></div>
                             <span className="font-bold text-teal-600">45 Issues</span>
                           </div>
                           <div className="flex items-center justify-between text-sm">
                             <div className="flex items-center gap-2"><img src="https://i.pravatar.cc/150?u=bob" className="w-6 h-6 rounded-full"/> <span className="font-medium">Bob Smith</span></div>
                             <span className="font-bold text-teal-600">38 Issues</span>
                           </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {/* --- CIRCULATION REPORTS --- */}
              {activeMenu === 'circulation' && (
                <div className="p-6 h-full flex flex-col bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <ArrowRightLeft className="text-purple-500" /> Circulation Reports
                   </h2>
                   
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                     <div className="p-4 border border-border bg-card rounded-xl text-center shadow-sm">
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Daily Issue</p>
                       <h3 className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-2">124</h3>
                     </div>
                     <div className="p-4 border border-border bg-card rounded-xl text-center shadow-sm">
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Daily Return</p>
                       <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">98</h3>
                     </div>
                     <div className="p-4 border border-border bg-card rounded-xl text-center shadow-sm">
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Monthly Issue</p>
                       <h3 className="text-3xl font-extrabold text-foreground mt-2">3,450</h3>
                     </div>
                     <div className="p-4 border border-border bg-card rounded-xl text-center shadow-sm">
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Monthly Return</p>
                       <h3 className="text-3xl font-extrabold text-foreground mt-2">3,120</h3>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="border border-border bg-card rounded-xl p-4 shadow-sm space-y-4">
                        <div className="flex justify-between items-center"><h4 className="font-bold">Renewals (Monthly)</h4><h3 className="text-2xl font-bold text-blue-500">450</h3></div>
                        <p className="text-xs text-muted-foreground">Total books renewed digitally or at counter.</p>
                      </div>
                      <div className="border border-border bg-card rounded-xl p-4 shadow-sm space-y-4 bg-red-50/30 dark:bg-red-900/10">
                        <div className="flex justify-between items-center"><h4 className="font-bold">Overdue Books</h4><h3 className="text-2xl font-bold text-red-500">85</h3></div>
                        <p className="text-xs text-muted-foreground">Currently unreturned books past their due date.</p>
                      </div>
                      <div className="border border-border bg-card rounded-xl p-4 shadow-sm space-y-4">
                        <h4 className="font-bold flex justify-between items-center">Branch-wise Circ. <Eye size={16} className="text-purple-500 cursor-pointer"/></h4>
                        <div className="space-y-2 text-sm">
                           <div className="flex justify-between"><span className="text-muted-foreground">Central Hub</span><span className="font-bold">2,100</span></div>
                           <div className="flex justify-between"><span className="text-muted-foreground">Northside</span><span className="font-bold">1,350</span></div>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {/* --- FINE REPORTS --- */}
              {activeMenu === 'fines' && (
                <div className="p-6 h-full flex flex-col bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <DollarSign className="text-rose-500" /> Financial & Fine Reports
                   </h2>
                   
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                     <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/50 rounded-xl text-center">
                       <p className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wide">Generated</p>
                       <h3 className="text-2xl font-extrabold text-foreground mt-2">₹45,200</h3>
                     </div>
                     <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-center">
                       <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Collected</p>
                       <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">₹32,500</h3>
                     </div>
                     <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 rounded-xl text-center">
                       <p className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wide">Pending</p>
                       <h3 className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 mt-2">₹10,500</h3>
                     </div>
                     <div className="p-4 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
                       <p className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide">Waived</p>
                       <h3 className="text-2xl font-extrabold text-slate-600 dark:text-slate-400 mt-2">₹2,200</h3>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="border border-border bg-card rounded-xl p-5 shadow-sm">
                         <h4 className="font-bold flex justify-between items-center mb-4">Branch-wise Fine Collection <Eye size={16} className="text-rose-500 cursor-pointer"/></h4>
                         <table className="w-full text-sm text-left">
                           <thead className="bg-muted text-muted-foreground"><tr><th className="px-3 py-2">Branch Name</th><th className="px-3 py-2 text-right">Amount Collected</th></tr></thead>
                           <tbody>
                             <tr className="border-b border-border"><td className="px-3 py-2 font-medium">Central Main Library</td><td className="px-3 py-2 text-right font-bold text-emerald-600">₹22,000</td></tr>
                             <tr className="border-b border-border"><td className="px-3 py-2 font-medium">Northside Hub</td><td className="px-3 py-2 text-right font-bold text-emerald-600">₹7,500</td></tr>
                             <tr className=""><td className="px-3 py-2 font-medium">East Wing Branch</td><td className="px-3 py-2 text-right font-bold text-emerald-600">₹3,000</td></tr>
                           </tbody>
                         </table>
                      </div>
                      
                      <div className="border border-border bg-card rounded-xl p-5 shadow-sm">
                         <h4 className="font-bold flex justify-between items-center mb-4">Members with Highest Pending Fines <Eye size={16} className="text-rose-500 cursor-pointer"/></h4>
                         <div className="space-y-3">
                           <div className="flex items-center justify-between text-sm p-3 bg-red-50/50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/50">
                             <div className="font-medium">Charlie Davis (MEM-003)</div>
                             <span className="font-bold text-red-600 dark:text-red-400">₹500</span>
                           </div>
                           <div className="flex items-center justify-between text-sm p-3 bg-red-50/50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/50">
                             <div className="font-medium">Eve Adams (MEM-005)</div>
                             <span className="font-bold text-red-600 dark:text-red-400">₹250</span>
                           </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {!['books', 'members', 'circulation', 'fines'].includes(activeMenu) && (
                <div className="p-6 h-full bg-background space-y-6 overflow-y-auto">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2"><BarChart className="text-blue-500"/> {SIDEBAR_MENU.find(m=>m.id===activeMenu)?.label}</h2>
                    <p className="text-sm text-muted-foreground mt-1">Review the selected report category and export the current mock dataset.</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      ['Total Records','1,240'],['This Month','186'],['Active','1,102'],['Attention','38']
                    ].map(([label,value])=><div key={label} className="p-4 rounded-xl border border-border bg-card"><p className="text-xs uppercase font-bold text-muted-foreground">{label}</p><p className="text-2xl font-extrabold mt-1">{value}</p></div>)}
                  </div>
                  <div className="border border-border rounded-xl overflow-x-auto bg-card">
                    <table className="w-full min-w-[760px] text-sm"><thead className="bg-muted/40 text-left"><tr><th className="p-3">Reference</th><th className="p-3">Category</th><th className="p-3">Date</th><th className="p-3">Value</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead><tbody>
                      {[1,2,3,4].map(i=><tr key={i} className="border-t border-border"><td className="p-3 font-semibold">{activeMenu.toUpperCase()}-{String(i).padStart(3,'0')}</td><td className="p-3">{SIDEBAR_MENU.find(m=>m.id===activeMenu)?.label}</td><td className="p-3">29 Sep 2026</td><td className="p-3 font-bold">₹{(i*1250).toLocaleString()}</td><td className="p-3">{i===4?'Review':'Completed'}</td><td className="p-3"><button onClick={()=>notify('Report record opened.')} className="text-blue-600 font-semibold hover:underline">View</button></td></tr>)}
                    </tbody></table>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2"><button onClick={()=>handleExport('csv')} className="px-4 py-2 border border-border rounded-lg text-sm font-semibold">Export CSV</button><button onClick={()=>handleExport('pdf')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">Generate PDF</button></div>
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
