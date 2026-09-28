'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Wallet, Receipt, DollarSign, History, AlertCircle,
  Clock, CheckCircle, HandCoins, ShieldCheck, XCircle, ChevronRight,
  Search, User, Banknote, Smartphone, CreditCard as CardIcon, Building2,
  FileText, CornerDownRight, Coins
} from 'lucide-react';

const SIDEBAR_MENU = [
  { id: 'dashboard', label: 'Fine Dashboard', icon: BarChart3Icon },
  { id: 'pending', label: 'Pending Fines', icon: Clock },
  { id: 'paid', label: 'Paid Fines', icon: CheckCircle },
  { id: 'partially_paid', label: 'Partially Paid', icon: HandCoins },
  { id: 'waived', label: 'Waived Fines', icon: ShieldCheck },
  { id: 'payments', label: 'Payments', icon: Wallet },
  { id: 'history', label: 'Payment History', icon: History },
  { id: 'refunds', label: 'Refunds', icon: CornerDownRight },
  { id: 'receipts', label: 'Receipts', icon: Receipt },
  { id: 'rules', label: 'Fine Rules', icon: FileText },
];

function BarChart3Icon(props: any) {
  return <DollarSign {...props} />;
}

const MOCK_FINES = [
  { id: 'FN-1001', member: 'Alice Walker', memberId: 'MEM-001', amount: 150, reason: 'Late Return (3 days) - Clean Code', status: 'Pending', date: '28 Sep 2026' },
  { id: 'FN-1002', member: 'Bob Smith', memberId: 'MEM-002', amount: 50, reason: 'Late Return (1 day) - Mythical Man-Month', status: 'Pending', date: '29 Sep 2026' },
  { id: 'FN-1003', member: 'Charlie Davis', memberId: 'MEM-003', amount: 500, reason: 'Book Damage - Python Crash Course', status: 'Partially Paid', paidAmount: 200, date: '20 Sep 2026' },
];

export default function FinesView() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedFine, setSelectedFine] = useState<any | null>(null);
  const [actionType, setActionType] = useState<'pay' | 'waive' | null>(null);

  // States for forms
  const [payAmount, setPayAmount] = useState('');
  const [payMode, setPayMode] = useState('Cash');
  const [waiveAmount, setWaiveAmount] = useState('');
  const [waiveReason, setWaiveReason] = useState('');

  const getStatusColor = (status: string) => {
    if (status === 'Pending') return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200';
    if (status === 'Partially Paid') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200';
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200';
  };

  const handleProcessAction = () => {
    alert(`${actionType === 'pay' ? 'Payment' : 'Waiver'} processed successfully!`);
    setSelectedFine(null);
    setActionType(null);
    setPayAmount('');
    setWaiveAmount('');
  };

  return (
    <div className="w-full max-w-full space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent flex items-center gap-2">
            <Coins size={28} className="text-red-600" /> Fines & Payments
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage library fines, collect payments, issue waivers, and generate receipts.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* SIDEBAR SUB-MENU */}
        <div className="w-full lg:w-64 flex flex-col gap-1 shrink-0 bg-card border border-border p-3 rounded-2xl shadow-sm h-[650px] overflow-y-auto custom-scrollbar">
          {SIDEBAR_MENU.map((menu) => {
             const isActive = !selectedFine && activeMenu === menu.id;
             return (
              <button
                key={menu.id}
                onClick={() => { setActiveMenu(menu.id); setSelectedFine(null); setActionType(null); }}
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
              key={selectedFine ? `action-${actionType}` : activeMenu}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              
              {/* --- FINE DASHBOARD --- */}
              {!selectedFine && activeMenu === 'dashboard' && (
                <div className="p-6 h-full flex flex-col bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <DollarSign className="text-red-500" /> Financial Overview
                   </h2>
                   
                   <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      <div className="p-5 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl text-white shadow-lg col-span-2 lg:col-span-1">
                         <p className="text-white/80 font-medium text-sm uppercase tracking-wider mb-1">Total Generated</p>
                         <h3 className="text-4xl font-extrabold">₹45,200</h3>
                         <div className="mt-4 pt-4 border-t border-white/20 text-xs flex justify-between">
                           <span>This Month:</span><span className="font-bold">+₹4,500</span>
                         </div>
                      </div>
                      <div className="p-5 bg-card border border-border rounded-2xl flex flex-col justify-between">
                         <div>
                           <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Collected (Paid)</p>
                           <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">₹32,500</h3>
                         </div>
                         <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center self-end"><CheckCircle size={20}/></div>
                      </div>
                      <div className="p-5 bg-card border border-border rounded-2xl flex flex-col justify-between">
                         <div>
                           <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Pending & Outstanding</p>
                           <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400">₹10,500</h3>
                         </div>
                         <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center self-end"><Clock size={20}/></div>
                      </div>
                      <div className="p-5 bg-card border border-border rounded-2xl flex flex-col justify-between">
                         <div>
                           <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Waived Off</p>
                           <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-400">₹2,200</h3>
                         </div>
                         <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900/30 text-slate-500 flex items-center justify-center self-end"><ShieldCheck size={20}/></div>
                      </div>
                   </div>

                   <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                   <div className="bg-card border border-border rounded-xl overflow-hidden">
                      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                        <div className="flex items-center gap-3"><Wallet size={16} className="text-emerald-500"/> <div><p className="text-sm font-bold">Payment Received: ₹150</p><p className="text-xs text-muted-foreground">From Alice Walker via UPI</p></div></div>
                        <span className="text-xs text-muted-foreground">2 hrs ago</span>
                      </div>
                      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                        <div className="flex items-center gap-3"><AlertCircle size={16} className="text-red-500"/> <div><p className="text-sm font-bold">New Fine Generated: ₹50</p><p className="text-xs text-muted-foreground">Late return (1 day) - Bob Smith</p></div></div>
                        <span className="text-xs text-muted-foreground">5 hrs ago</span>
                      </div>
                      <div className="p-4 flex justify-between items-center bg-muted/20">
                        <div className="flex items-center gap-3"><ShieldCheck size={16} className="text-slate-500"/> <div><p className="text-sm font-bold">Fine Waived: ₹100</p><p className="text-xs text-muted-foreground">Approved by Admin for Charlie Davis</p></div></div>
                        <span className="text-xs text-muted-foreground">1 day ago</span>
                      </div>
                   </div>
                </div>
              )}

              {/* --- PENDING FINES LIST --- */}
              {!selectedFine && ['pending', 'partially_paid'].includes(activeMenu) && (
                <div className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-bold flex items-center gap-2 capitalize">
                       <Clock className="text-orange-500" /> {activeMenu.replace('_', ' ')} Fines
                     </h2>
                     <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                       <input type="text" placeholder="Search Member or Fine ID..." className="pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-64" />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 overflow-y-auto custom-scrollbar pr-2">
                    {MOCK_FINES.filter(f => f.status.toLowerCase().replace(' ', '_') === activeMenu).map(fine => (
                      <div key={fine.id} className="p-5 border border-border rounded-2xl bg-background hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                         
                         <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center border border-red-100 dark:border-red-900/50 shrink-0">
                               <AlertCircle size={24} />
                            </div>
                            <div>
                               <h3 className="font-bold text-lg leading-tight flex items-center gap-2">{fine.member} <span className="text-xs font-normal text-muted-foreground">({fine.memberId})</span></h3>
                               <p className="text-sm text-muted-foreground mt-1">{fine.reason}</p>
                               <div className="flex gap-2 mt-2">
                                 <span className="text-xs text-muted-foreground">Generated: {fine.date}</span>
                                 <span className="text-xs text-muted-foreground">•</span>
                                 <span className="text-xs font-mono">{fine.id}</span>
                               </div>
                            </div>
                         </div>

                         <div className="flex flex-col items-end gap-3 min-w-[200px]">
                            <div className="text-right">
                               <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Total Fine</p>
                               <h4 className="text-2xl font-extrabold text-red-600 dark:text-red-400">₹{fine.amount}</h4>
                               {fine.paidAmount && (
                                 <p className="text-xs text-emerald-600 font-bold mt-1">Paid: ₹{fine.paidAmount} | Bal: ₹{fine.amount - fine.paidAmount}</p>
                               )}
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                               <button onClick={() => {setSelectedFine(fine); setActionType('waive')}} className="flex-1 md:flex-none px-4 py-2 border border-border bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors">
                                 Waive
                               </button>
                               <button onClick={() => {setSelectedFine(fine); setActionType('pay')}} className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2">
                                 <Wallet size={16}/> Collect
                               </button>
                            </div>
                         </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* --- ACTION PANELS (PAY OR WAIVE) --- */}
              {selectedFine && actionType && (
                <div className="p-6 h-full flex flex-col bg-background overflow-y-auto">
                   
                   <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                     <h2 className="text-2xl font-bold flex items-center gap-2">
                       {actionType === 'pay' ? <Wallet className="text-emerald-500" /> : <ShieldCheck className="text-blue-500" />}
                       {actionType === 'pay' ? 'Collect Fine Payment' : 'Process Fine Waiver'}
                     </h2>
                     <button onClick={() => {setSelectedFine(null); setActionType(null)}} className="p-2 hover:bg-muted rounded-full transition-colors"><XCircle size={24} className="text-muted-foreground"/></button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                     
                     {/* Fine Summary Panel */}
                     <div className="p-6 bg-card border border-border rounded-2xl shadow-sm h-fit">
                        <h3 className="font-bold uppercase text-xs text-muted-foreground mb-4">Fine Summary</h3>
                        <div className="space-y-4">
                           <div><p className="text-sm text-muted-foreground">Member Name</p><p className="font-bold text-lg">{selectedFine.member} ({selectedFine.memberId})</p></div>
                           <div><p className="text-sm text-muted-foreground">Fine Reason</p><p className="font-medium text-orange-600 dark:text-orange-400">{selectedFine.reason}</p></div>
                           <div className="flex justify-between items-center border-t border-border pt-4">
                              <span className="font-bold">Original Fine:</span><span className="font-bold">₹{selectedFine.amount}</span>
                           </div>
                           {selectedFine.paidAmount && (
                             <div className="flex justify-between items-center text-emerald-600">
                                <span className="font-bold">Already Paid:</span><span className="font-bold">-₹{selectedFine.paidAmount}</span>
                             </div>
                           )}
                           <div className="flex justify-between items-center border-t border-border pt-4 text-xl">
                              <span className="font-bold text-red-600 dark:text-red-400">Total Outstanding:</span>
                              <span className="font-extrabold text-red-600 dark:text-red-400">₹{selectedFine.amount - (selectedFine.paidAmount || 0)}</span>
                           </div>
                        </div>
                     </div>

                     {/* Action Form Panel */}
                     {actionType === 'pay' && (
                       <div className="space-y-5">
                          <div className="space-y-2">
                             <label className="text-sm font-bold uppercase text-muted-foreground">Paying Amount (₹)</label>
                             <input type="number" value={payAmount} onChange={(e)=>setPayAmount(e.target.value)} placeholder={`Max ₹${selectedFine.amount - (selectedFine.paidAmount || 0)}`} className="w-full px-4 py-3 bg-card border-2 border-emerald-200 dark:border-emerald-800/50 rounded-xl focus:border-emerald-500 outline-none font-bold text-lg" />
                          </div>
                          
                          <div className="space-y-2">
                             <label className="text-sm font-bold uppercase text-muted-foreground">Payment Mode</label>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                               {['Cash', 'UPI', 'Card', 'Bank', 'Other'].map(mode => (
                                 <button key={mode} onClick={()=>setPayMode(mode)} className={`py-2 px-3 rounded-lg border text-sm font-bold transition-colors ${payMode === mode ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-500 dark:text-emerald-400' : 'bg-background border-border text-muted-foreground hover:bg-muted'}`}>
                                   {mode === 'Cash' && <Banknote size={14} className="inline mr-1"/>}
                                   {mode === 'UPI' && <Smartphone size={14} className="inline mr-1"/>}
                                   {mode === 'Card' && <CardIcon size={14} className="inline mr-1"/>}
                                   {mode === 'Bank' && <Building2 size={14} className="inline mr-1"/>}
                                   {mode}
                                 </button>
                               ))}
                             </div>
                          </div>

                          {payMode !== 'Cash' && (
                            <div className="space-y-2">
                              <label className="text-sm font-bold uppercase text-muted-foreground">Transaction ID / Reference</label>
                              <input type="text" placeholder="Enter Ref ID..." className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-emerald-500 outline-none" />
                            </div>
                          )}
                          
                          <div className="p-4 bg-muted/40 border border-border rounded-xl mt-4">
                            <p className="text-xs text-muted-foreground">Receiver: Admin User</p>
                            <p className="text-xs text-muted-foreground mt-1">Date: {new Date().toLocaleDateString()}</p>
                          </div>

                          <button onClick={handleProcessAction} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md text-lg flex items-center justify-center gap-2 mt-4">
                            Confirm Payment & Print Receipt <Receipt size={20}/>
                          </button>
                       </div>
                     )}

                     {actionType === 'waive' && (
                       <div className="space-y-5">
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-xl mb-4">
                            <p className="text-sm font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2"><ShieldCheck size={16}/> SuperAdmin Policy Alert</p>
                            <p className="text-xs mt-1 text-blue-700 dark:text-blue-400">Your maximum waiver limit per transaction is ₹500. All waivers are logged for audit.</p>
                          </div>

                          <div className="space-y-2">
                             <label className="text-sm font-bold uppercase text-muted-foreground">Waive Amount (₹)</label>
                             <input type="number" value={waiveAmount} onChange={(e)=>setWaiveAmount(e.target.value)} placeholder={`Max ₹${selectedFine.amount - (selectedFine.paidAmount || 0)}`} className="w-full px-4 py-3 bg-card border-2 border-blue-200 dark:border-blue-800/50 rounded-xl focus:border-blue-500 outline-none font-bold text-lg" />
                             {waiveAmount && (
                               <p className="text-xs font-bold text-emerald-600 mt-1">Remaining Fine will be: ₹{(selectedFine.amount - (selectedFine.paidAmount || 0)) - Number(waiveAmount)}</p>
                             )}
                          </div>
                          
                          <div className="space-y-2">
                             <label className="text-sm font-bold uppercase text-muted-foreground">Reason for Waiver <span className="text-red-500">*</span></label>
                             <textarea rows={3} value={waiveReason} onChange={(e)=>setWaiveReason(e.target.value)} placeholder="Mandatory explanation..." className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-blue-500 outline-none" />
                          </div>

                          <button onClick={handleProcessAction} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md text-lg flex items-center justify-center gap-2 mt-4">
                            Approve Fine Waiver <CheckCircle size={20}/>
                          </button>
                       </div>
                     )}

                   </div>
                </div>
              )}


              {/* --- PLACEHOLDERS --- */}
              {!selectedFine && !['dashboard', 'pending', 'partially_paid'].includes(activeMenu) && (
                 <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-10">
                   <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 border border-border">
                     {SIDEBAR_MENU.find(m=>m.id === activeMenu)?.icon({size: 48, className: "opacity-30 text-red-500"})}
                   </div>
                   <h3 className="text-2xl font-bold text-foreground mb-2 capitalize">{SIDEBAR_MENU.find(m=>m.id === activeMenu)?.label}</h3>
                   <p className="text-center max-w-md mb-6">Manage tracking and lists for {SIDEBAR_MENU.find(m=>m.id === activeMenu)?.label.toLowerCase()}.</p>
                 </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
