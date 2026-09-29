'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightLeft, ArrowLeftRight, CheckCircle, Clock, Search, BookOpen,
  User, ShieldAlert, AlertTriangle, ShieldCheck, Printer, RefreshCw, 
  MapPin, XCircle, ArrowRight, CornerDownLeft, FileText, Ban, DollarSign,
  AlertCircle
} from 'lucide-react';

const SIDEBAR_MENU = [
  { id: 'issue', label: 'Issue Book', icon: ArrowRight },
  { id: 'return', label: 'Return Book', icon: CornerDownLeft },
  { id: 'renew', label: 'Renew Book', icon: RefreshCw },
  { id: 'transfer', label: 'Transfer Book', icon: ArrowLeftRight },
  { id: 'lost', label: 'Lost Book Entry', icon: Ban },
  { id: 'damaged', label: 'Damaged Book', icon: AlertTriangle },
  { id: 'history_issue', label: 'Issue History', icon: FileText },
  { id: 'history_return', label: 'Return History', icon: FileText },
  { id: 'history_renew', label: 'Renewal History', icon: FileText },
  { id: 'rules', label: 'Circulation Rules', icon: ShieldCheck },
];

export default function CirculationView() {
  const [activeMenu, setActiveMenu] = useState('issue');
  const [notice, setNotice] = useState('');
  const [renewBookId, setRenewBookId] = useState('');
  const [renewResult, setRenewResult] = useState('');
  const [exceptionId, setExceptionId] = useState('');
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(v => v === message ? '' : v), 2200); };
  
  // States for Issue Book Flow
  const [memberId, setMemberId] = useState('');
  const [bookId, setBookId] = useState('');
  const [isMemberScanned, setIsMemberScanned] = useState(false);
  const [isBookScanned, setIsBookScanned] = useState(false);

  // States for Return Book Flow
  const [returnBookId, setReturnBookId] = useState('');
  const [isReturnScanned, setIsReturnScanned] = useState(false);
  
  // Dummy Handlers
  const handleMemberScan = (e: React.FormEvent) => {
    e.preventDefault();
    if(memberId.length > 2) setIsMemberScanned(true);
  };
  
  const handleBookScan = (e: React.FormEvent) => {
    e.preventDefault();
    if(bookId.length > 2) setIsBookScanned(true);
  };

  const handleReturnScan = (e: React.FormEvent) => {
    e.preventDefault();
    if(returnBookId.length > 2) setIsReturnScanned(true);
  };

  const handleResetIssue = () => {
    setMemberId(''); setBookId('');
    setIsMemberScanned(false); setIsBookScanned(false);
  };

  return (
    <div className="w-full max-w-full space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-600 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
            <ArrowRightLeft size={28} className="text-cyan-600" /> Circulation Desk
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Core operations center for book issues, returns, renewals, and branch transfers.
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              
              {/* --- ISSUE BOOK FLOW --- */}
              {activeMenu === 'issue' && (
                <div className="flex flex-col h-full bg-background p-6">
                   <div className="flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-bold flex items-center gap-2">
                       <ArrowRight className="text-cyan-500" /> Issue Book
                     </h2>
                     <button onClick={handleResetIssue} className="px-4 py-2 bg-muted text-muted-foreground hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors">
                       Reset Session
                     </button>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                     {/* LEFT PANEL: Member Scanning */}
                     <div className="flex flex-col gap-4 border-r-0 lg:border-r border-border pr-0 lg:pr-8">
                        <div className="bg-cyan-50 dark:bg-cyan-950/20 p-4 rounded-xl border border-cyan-100 dark:border-cyan-900/50">
                           <h3 className="font-bold text-cyan-800 dark:text-cyan-400 mb-2">Step 1: Scan Member</h3>
                           <form onSubmit={handleMemberScan} className="flex gap-2">
                             <div className="relative flex-1">
                               <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                               <input type="text" value={memberId} onChange={(e)=>setMemberId(e.target.value)} disabled={isMemberScanned} placeholder="Scan Member Card or Enter ID..." className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50" />
                             </div>
                             <button type="submit" disabled={isMemberScanned} className="px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium disabled:opacity-50">Search</button>
                           </form>
                        </div>

                        {isMemberScanned && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 border border-border rounded-xl bg-card shadow-sm space-y-4">
                             <div className="flex items-start gap-4">
                               <img src="https://i.pravatar.cc/150?u=alice" className="w-16 h-16 rounded-xl border object-cover" />
                               <div className="flex-1">
                                 <h4 className="font-bold text-lg leading-tight">Alice Walker</h4>
                                 <p className="text-xs text-muted-foreground">MEM-001 • Premium Member</p>
                                 <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-bold rounded">ACTIVE</span>
                               </div>
                             </div>

                             {/* Eligibility Checks */}
                             <div className="grid grid-cols-2 gap-3 text-xs pt-4 border-t border-border">
                               <div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500"/> Membership Valid</div>
                               <div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500"/> Issue Limit (2/5)</div>
                               <div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500"/> No Overdue</div>
                               <div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500"/> No Pending Fines</div>
                             </div>
                             
                             <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                               <ShieldCheck size={18} /> Member Eligible for Issue
                             </div>
                          </motion.div>
                        )}
                     </div>

                     {/* RIGHT PANEL: Book Scanning (Disabled until Member is scanned) */}
                     <div className={`flex flex-col gap-4 transition-opacity duration-300 ${isMemberScanned ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
                           <h3 className="font-bold text-blue-800 dark:text-blue-400 mb-2">Step 2: Scan Book Barcode</h3>
                           <form onSubmit={handleBookScan} className="flex gap-2">
                             <div className="relative flex-1">
                               <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                               <input type="text" value={bookId} onChange={(e)=>setBookId(e.target.value)} disabled={isBookScanned} placeholder="Scan Barcode or Enter Book ID..." className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
                             </div>
                             <button type="submit" disabled={isBookScanned} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50">Search</button>
                           </form>
                        </div>

                        {isBookScanned && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 border border-border rounded-xl bg-card shadow-sm space-y-4">
                             <div className="flex items-start gap-4">
                               <div className="w-16 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded border border-indigo-200 flex items-center justify-center text-indigo-500">
                                 <BookOpen size={24} />
                               </div>
                               <div className="flex-1">
                                 <h4 className="font-bold text-lg leading-tight">Clean Code</h4>
                                 <p className="text-xs text-muted-foreground mt-0.5">Robert C. Martin • Programming</p>
                                 <p className="text-[10px] text-muted-foreground mt-1">ID: BK-1001 • ISBN: 978-0-13-235088-4</p>
                                 <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-bold rounded">AVAILABLE</span>
                               </div>
                             </div>

                             {/* Pre-Issue Summary */}
                             <div className="p-4 bg-muted/30 border border-border rounded-lg space-y-2 text-sm mt-2">
                               <div className="flex justify-between"><span className="text-muted-foreground">Issue Rule</span><span className="font-medium">14 Days Standard</span></div>
                               <div className="flex justify-between"><span className="text-muted-foreground">Today's Date</span><span className="font-medium">29 Sep 2026</span></div>
                               <div className="flex justify-between text-blue-600 dark:text-blue-400 font-bold border-t border-border pt-2"><span className="">Due Date</span><span className="">13 Oct 2026</span></div>
                             </div>

                             <button onClick={()=>{notify("Issue completed and receipt prepared.");handleResetIssue();}} className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]">
                               Confirm Issue & Print Receipt <Printer size={20} />
                             </button>
                          </motion.div>
                        )}
                     </div>
                   </div>
                </div>
              )}

              {/* --- RETURN BOOK FLOW --- */}
              {activeMenu === 'return' && (
                <div className="flex flex-col h-full bg-background p-6">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <CornerDownLeft className="text-emerald-500" /> Return Book
                   </h2>

                   <div className="max-w-xl mx-auto w-full space-y-6 mt-4">
                     <div className="bg-emerald-50 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 shadow-sm text-center">
                        <CornerDownLeft size={32} className="mx-auto text-emerald-500 mb-3" />
                        <h3 className="font-bold text-emerald-800 dark:text-emerald-400 mb-4 text-lg">Scan Book to Return</h3>
                        <form onSubmit={handleReturnScan} className="flex gap-2">
                          <div className="relative flex-1">
                            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/50" size={20} />
                            <input type="text" value={returnBookId} onChange={(e)=>setReturnBookId(e.target.value)} disabled={isReturnScanned} placeholder="Scan Barcode..." className="w-full pl-12 pr-4 py-3 bg-background border-2 border-emerald-200 dark:border-emerald-800 rounded-xl text-base focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50" />
                          </div>
                          <button type="submit" disabled={isReturnScanned} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-emerald-700">Enter</button>
                        </form>
                     </div>

                     {isReturnScanned && (
                       <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="border border-border rounded-2xl shadow-lg bg-card overflow-hidden">
                         <div className="p-5 border-b border-border flex justify-between items-start bg-muted/20">
                            <div>
                              <h4 className="font-bold text-xl">The Mythical Man-Month</h4>
                              <p className="text-sm text-muted-foreground mt-1">Book ID: BK-1002 • Issued to: Bob Smith (MEM-002)</p>
                            </div>
                            <button onClick={()=>setIsReturnScanned(false)} className="text-muted-foreground hover:text-foreground"><XCircle size={20}/></button>
                         </div>
                         
                         <div className="p-5 grid grid-cols-2 gap-4 text-sm">
                            <div className="p-3 bg-background border border-border rounded-lg">
                              <p className="text-xs text-muted-foreground uppercase mb-1">Issue Date</p><p className="font-bold">10 Sep 2026</p>
                            </div>
                            <div className="p-3 bg-background border border-border rounded-lg">
                              <p className="text-xs text-muted-foreground uppercase mb-1">Due Date</p><p className="font-bold text-orange-500">24 Sep 2026</p>
                            </div>
                            <div className="col-span-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg flex justify-between items-center text-red-700 dark:text-red-400">
                               <div className="flex items-center gap-2"><AlertCircle size={18}/> <span>Overdue by <b>5 days</b></span></div>
                               <div className="font-bold text-lg">Fine: ₹50</div>
                            </div>

                            <div className="col-span-2 space-y-2 mt-2">
                              <label className="text-xs font-bold uppercase text-muted-foreground">Book Condition on Return</label>
                              <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-emerald-500 outline-none">
                                <option>Good / Undamaged</option>
                                <option>Minor Wear</option>
                                <option>Damaged (Calculate Fine)</option>
                                <option>Lost (Calculate Fine)</option>
                              </select>
                            </div>
                         </div>

                         <div className="p-4 bg-muted/50 border-t border-border flex gap-3">
                           <button onClick={()=>{setIsReturnScanned(false);notify("Book return confirmed.");}} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-2">
                             <CheckCircle size={18} /> Confirm Return
                           </button>
                           <button onClick={()=>{setIsReturnScanned(false);notify("Fine collection and return completed.");}} className="flex-1 py-3 border border-border bg-background hover:bg-muted text-foreground rounded-xl font-bold flex items-center justify-center gap-2">
                             <DollarSign size={18} /> Collect Fine & Return
                           </button>
                         </div>
                       </motion.div>
                     )}
                   </div>
                </div>
              )}

              {/* --- RENEW BOOK FLOW --- */}
              {activeMenu === 'renew' && (
                <div className="flex flex-col h-full bg-background p-6 items-center justify-center">
                   <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6 text-purple-600">
                     <RefreshCw size={48} />
                   </div>
                   <h2 className="text-2xl font-bold mb-2">Renew Book</h2>
                   <p className="text-center text-muted-foreground max-w-sm mb-8">Scan a currently issued book to extend its due date based on circulation rules.</p>
                   
                   <form onSubmit={e=>{e.preventDefault(); if(!renewBookId.trim()) { notify('Enter a book barcode or ID.'); return; } setRenewResult('Renewed until 13 Oct 2026'); notify('Renewal completed for '+renewBookId+'.'); }} className="w-full max-w-md space-y-3">
                      <div className="relative">
                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <input value={renewBookId} onChange={e=>setRenewBookId(e.target.value)} placeholder="Scan Barcode to Renew..." className="w-full pl-12 pr-4 py-3 bg-card border-2 border-border rounded-xl text-base focus:outline-none focus:border-purple-500 transition-colors" />
                      </div>
                      <button type="submit" className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md">Renew Book</button>
                      {renewResult && <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold text-center">{renewResult}</div>}
                   </form>
                </div>
              )}

              {/* --- TRANSFER BOOK FLOW --- */}
              {activeMenu === 'transfer' && (
                <div className="p-6 h-full bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <ArrowLeftRight className="text-indigo-500" /> Transfer Inventory to Branch
                   </h2>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl bg-card border border-border p-6 rounded-2xl shadow-sm">
                      <div className="space-y-4 col-span-1 md:col-span-2">
                        <h3 className="font-bold flex items-center gap-2 text-lg"><BookOpen size={18} className="text-indigo-500"/> Select Book Copy</h3>
                        <input type="text" placeholder="Scan Barcode or Search Copy ID..." className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-indigo-500" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground uppercase">Current Branch</label>
                        <div className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-medium flex items-center gap-2">
                          <MapPin size={16} className="text-slate-500"/> Central Main Library
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground uppercase">Destination Branch</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-indigo-500 outline-none font-medium">
                          <option>Northside Hub</option>
                          <option>East Wing Branch</option>
                        </select>
                      </div>

                      <div className="space-y-2 col-span-1 md:col-span-2">
                        <label className="text-sm font-bold text-muted-foreground uppercase">Reason for Transfer</label>
                        <input type="text" placeholder="e.g. Stock Rebalancing, User Request..." className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-indigo-500" />
                      </div>

                      <div className="col-span-1 md:col-span-2 pt-4 flex justify-end">
                         <button onClick={()=>notify("Book transfer request created.")} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md flex items-center gap-2">
                           <ArrowLeftRight size={18} /> Initiate Transfer
                         </button>
                      </div>
                   </div>
                </div>
              )}

              {/* --- LOST / DAMAGED / HISTORY / RULES --- */}
              {['lost','damaged'].includes(activeMenu) && (
                <div className="p-6 bg-background space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2"><AlertCircle className="text-red-500"/> {SIDEBAR_MENU.find(m=>m.id===activeMenu)?.label}</h2>
                    <p className="text-sm text-muted-foreground mt-1">Record an exception and prepare the book for the next inventory action.</p>
                  </div>
                  <form onSubmit={e=>{e.preventDefault(); if(!exceptionId.trim()){notify('Enter a barcode or book ID.');return;} notify((activeMenu==='lost'?'Lost':'Damaged')+' entry recorded for '+exceptionId+'.');setExceptionId('');}} className="max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input value={exceptionId} onChange={e=>setExceptionId(e.target.value)} required placeholder="Barcode / Book ID *" className="admin-input w-full"/>
                    <input placeholder="Member / responsible person" className="admin-input w-full"/>
                    <select className="admin-input w-full"><option>Central Main Library</option><option>Northside Hub</option><option>East Wing Branch</option></select>
                    <select className="admin-input w-full"><option>{activeMenu==='lost'?'Replacement Required':'Needs Repair Review'}</option><option>Hold for Manager Review</option></select>
                    <textarea rows={3} placeholder="Notes / condition details" className="admin-input w-full md:col-span-2"/>
                    <div className="md:col-span-2 flex justify-end"><button type="submit" className="admin-btn admin-btn-primary inline-flex items-center gap-2"><CheckCircle size={16}/> Save Entry</button></div>
                  </form>
                </div>
              )}
              {['issue_history','return_history','renewal_history'].includes(activeMenu) && (
                <div className="p-6 bg-background space-y-6">
                  <h2 className="text-2xl font-bold">{SIDEBAR_MENU.find(m=>m.id===activeMenu)?.label}</h2>
                  <div className="overflow-x-auto border border-border rounded-xl">
                    <table className="w-full min-w-[720px] text-sm"><thead className="bg-muted/40 text-left"><tr><th className="p-3">Ref</th><th className="p-3">Member</th><th className="p-3">Book</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead><tbody>{[['TX-1001','Alice Walker','Clean Code','29 Sep 2026','Completed'],['TX-1002','Bob Smith','Sapiens','28 Sep 2026','Completed'],['TX-1003','Charlie Davis','Python Crash Course','27 Sep 2026','Review']].map(r=><tr key={r[0]} className="border-t border-border"><td className="p-3 font-semibold">{r[0]}</td><td className="p-3">{r[1]}</td><td className="p-3">{r[2]}</td><td className="p-3">{r[3]}</td><td className="p-3">{r[4]}</td><td className="p-3"><button onClick={()=>notify('Opened '+r[0]+'.')} className="text-primary font-semibold hover:underline">View</button></td></tr>)}</tbody></table>
                  </div>
                </div>
              )}
              {activeMenu === 'rules' && (
                <div className="p-6 bg-background space-y-6">
                  <div><h2 className="text-2xl font-bold">Circulation Rules</h2><p className="text-sm text-muted-foreground mt-1">Configure the frontend demo policy used by the circulation desk.</p></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
                    <label className="space-y-2 text-sm font-medium">Issue period (days)<input type="number" defaultValue={14} min={1} className="admin-input w-full"/></label>
                    <label className="space-y-2 text-sm font-medium">Maximum renewals<input type="number" defaultValue={2} min={0} className="admin-input w-full"/></label>
                    <label className="space-y-2 text-sm font-medium">Grace period (days)<input type="number" defaultValue={2} min={0} className="admin-input w-full"/></label>
                    <label className="space-y-2 text-sm font-medium">Fine per overdue day (₹)<input type="number" defaultValue={10} min={0} className="admin-input w-full"/></label>
                  </div>
                  <button onClick={()=>notify('Circulation rules saved.')} className="admin-btn admin-btn-primary">Save Rules</button>
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
