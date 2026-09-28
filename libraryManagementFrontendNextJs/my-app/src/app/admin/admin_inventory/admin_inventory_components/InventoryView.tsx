'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Boxes, BarChart3, ArrowRightLeft, ArrowUpRight, ArrowDownRight,
  Settings2, ScanLine, AlertCircle, Ban, Wrench, Archive, History,
  DollarSign, MapPin, CheckCircle, Search, FileSignature, ArrowRight, Check
} from 'lucide-react';

const SIDEBAR_MENU = [
  { id: 'dashboard', label: 'Inventory Dashboard', icon: BarChart3 },
  { id: 'all_stock', label: 'All Stock', icon: Boxes },
  { id: 'stock_in', label: 'Stock In', icon: ArrowDownRight },
  { id: 'stock_out', label: 'Stock Out', icon: ArrowUpRight },
  { id: 'transfer', label: 'Stock Transfer', icon: ArrowRightLeft },
  { id: 'adjustment', label: 'Stock Adjustment', icon: Settings2 },
  { id: 'verification', label: 'Physical Verification', icon: ScanLine },
  { id: 'missing', label: 'Missing Books', icon: AlertCircle },
  { id: 'lost', label: 'Lost Books', icon: Ban },
  { id: 'damaged', label: 'Damaged Books', icon: AlertCircle },
  { id: 'repair', label: 'Repair Books', icon: Wrench },
  { id: 'archived', label: 'Archived Books', icon: Archive },
  { id: 'history', label: 'Inventory History', icon: History },
  { id: 'valuation', label: 'Stock Valuation', icon: DollarSign },
];

export default function InventoryView() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  // States for Physical Verification Flow
  const [verificationStep, setVerificationStep] = useState(1);
  const [scanInput, setScanInput] = useState('');
  const [scannedItems, setScannedItems] = useState<string[]>([]);
  
  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if(scanInput.trim()) {
      setScannedItems([...scannedItems, scanInput]);
      setScanInput('');
    }
  };

  return (
    <div className="w-full max-w-full space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
            <Boxes size={28} className="text-violet-600" /> Inventory Control
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Physical book stock management, verification, transfers, and valuation.
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
                onClick={() => { setActiveMenu(menu.id); if(menu.id === 'verification') setVerificationStep(1); }}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-violet-600 text-white shadow-md scale-[1.02]' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <menu.icon size={18} className={isActive ? 'text-white' : 'text-violet-500/70'} />
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
              
              {/* --- INVENTORY DASHBOARD --- */}
              {activeMenu === 'dashboard' && (
                <div className="p-6 h-full flex flex-col bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <BarChart3 className="text-violet-500" /> Inventory Dashboard
                   </h2>
                   
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <div className="p-5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl text-white shadow-lg">
                         <p className="text-white/80 font-medium text-sm uppercase tracking-wider mb-1">Total Units</p>
                         <h3 className="text-4xl font-extrabold">24,500</h3>
                         <div className="mt-4 pt-4 border-t border-white/20 text-xs flex justify-between">
                           <span>Total Valuation:</span><span className="font-bold">₹1.2 Cr</span>
                         </div>
                      </div>
                      <div className="p-5 bg-card border border-border rounded-2xl">
                         <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center mb-3"><CheckCircle size={20}/></div>
                         <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Available on Shelf</p>
                         <h3 className="text-2xl font-bold">18,200</h3>
                      </div>
                      <div className="p-5 bg-card border border-border rounded-2xl">
                         <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center mb-3"><ArrowUpRight size={20}/></div>
                         <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Issued to Members</p>
                         <h3 className="text-2xl font-bold">5,800</h3>
                      </div>
                      <div className="p-5 bg-card border border-border rounded-2xl">
                         <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center mb-3"><History size={20}/></div>
                         <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Reserved Items</p>
                         <h3 className="text-2xl font-bold">250</h3>
                      </div>
                   </div>

                   <h3 className="font-bold text-lg mb-4">Stock Discrepancies</h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 border border-border rounded-xl bg-red-50/50 dark:bg-red-950/10 flex items-center justify-between">
                         <div><p className="text-sm font-bold text-red-600 dark:text-red-400">Lost</p><h4 className="text-xl font-bold">42</h4></div>
                         <Ban size={24} className="text-red-500/30" />
                      </div>
                      <div className="p-4 border border-border rounded-xl bg-orange-50/50 dark:bg-orange-950/10 flex items-center justify-between">
                         <div><p className="text-sm font-bold text-orange-600 dark:text-orange-400">Damaged</p><h4 className="text-xl font-bold">85</h4></div>
                         <AlertCircle size={24} className="text-orange-500/30" />
                      </div>
                      <div className="p-4 border border-border rounded-xl bg-amber-50/50 dark:bg-amber-950/10 flex items-center justify-between">
                         <div><p className="text-sm font-bold text-amber-600 dark:text-amber-400">Repairing</p><h4 className="text-xl font-bold">18</h4></div>
                         <Wrench size={24} className="text-amber-500/30" />
                      </div>
                      <div className="p-4 border border-border rounded-xl bg-slate-100/50 dark:bg-slate-900/50 flex items-center justify-between">
                         <div><p className="text-sm font-bold text-slate-600 dark:text-slate-400">Missing</p><h4 className="text-xl font-bold">105</h4></div>
                         <Search size={24} className="text-slate-500/30" />
                      </div>
                   </div>
                </div>
              )}

              {/* --- STOCK TRANSFER --- */}
              {activeMenu === 'transfer' && (
                <div className="p-6 h-full bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <ArrowRightLeft className="text-violet-500" /> Stock Transfer Request
                   </h2>
                   
                   <div className="max-w-3xl border border-border bg-card rounded-2xl p-6 shadow-sm space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                         
                         <div className="space-y-4 md:col-span-2">
                           <label className="text-xs font-bold text-muted-foreground uppercase">Book / Copy Details</label>
                           <div className="relative">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                             <input type="text" placeholder="Scan Barcode or Search Book Title..." className="w-full pl-9 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500" />
                           </div>
                         </div>

                         <div className="space-y-2 p-4 bg-muted/40 rounded-xl border border-border">
                           <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2"><MapPin size={14}/> Source Branch</label>
                           <select className="w-full px-4 py-2 rounded-lg border border-border bg-background outline-none focus:border-violet-500"><option>Central Main Library</option></select>
                         </div>

                         {/* Arrow indicator in middle for large screens */}
                         <div className="hidden md:flex absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-background border border-border rounded-full items-center justify-center text-violet-500 z-10 shadow-sm">
                           <ArrowRight size={16} />
                         </div>

                         <div className="space-y-2 p-4 bg-violet-50 dark:bg-violet-900/10 rounded-xl border border-violet-100 dark:border-violet-900/30">
                           <label className="text-xs font-bold text-violet-700 dark:text-violet-400 uppercase flex items-center gap-2"><MapPin size={14}/> Destination Branch</label>
                           <select className="w-full px-4 py-2 rounded-lg border border-border bg-background outline-none focus:border-violet-500"><option>Northside Hub</option><option>East Wing Branch</option></select>
                         </div>

                         <div className="space-y-2 md:col-span-2">
                           <label className="text-xs font-bold text-muted-foreground uppercase">Transfer Reason</label>
                           <textarea rows={2} placeholder="Why is this book being transferred?" className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-violet-500" />
                         </div>
                      </div>
                      
                      <div className="pt-4 border-t border-border flex justify-end gap-3">
                         <button className="px-6 py-3 border border-border bg-muted hover:bg-muted/80 rounded-xl font-medium">Cancel</button>
                         <button className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold shadow-md flex items-center gap-2"><ArrowRightLeft size={18}/> Confirm Transfer</button>
                      </div>
                   </div>
                </div>
              )}

              {/* --- PHYSICAL VERIFICATION FLOW --- */}
              {activeMenu === 'verification' && (
                <div className="p-6 h-full flex flex-col bg-background">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                     <ScanLine className="text-indigo-500" /> Physical Stock Verification
                   </h2>
                   <p className="text-sm text-muted-foreground mb-6">Audit physical shelf inventory against digital records.</p>
                   
                   <div className="flex-1 max-w-4xl w-full mx-auto space-y-6">
                      
                      {verificationStep === 1 && (
                        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="bg-card border border-border rounded-2xl p-6 text-center space-y-6">
                           <div className="w-24 h-24 mx-auto bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-full flex items-center justify-center"><Boxes size={40}/></div>
                           <div>
                             <h3 className="text-xl font-bold">Start New Audit</h3>
                             <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">Select the section or rack you want to verify. The system will load the expected inventory for this location.</p>
                           </div>
                           <div className="max-w-sm mx-auto space-y-4">
                             <select className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-indigo-500 outline-none font-bold">
                               <option>Section A - Programming</option>
                               <option>Section B - Fiction</option>
                             </select>
                             <button onClick={()=>setVerificationStep(2)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md">Load Expected Stock</button>
                           </div>
                        </motion.div>
                      )}

                      {verificationStep === 2 && (
                        <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                           
                           {/* Left side Scanner */}
                           <div className="lg:col-span-2 space-y-4">
                              <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-md text-center">
                                 <h4 className="font-bold mb-4">Scan Barcodes</h4>
                                 <form onSubmit={handleScan} className="flex gap-2 max-w-md mx-auto">
                                   <input type="text" value={scanInput} onChange={(e)=>setScanInput(e.target.value)} autoFocus placeholder="Ready to scan..." className="flex-1 px-4 py-3 rounded-xl text-foreground bg-background border-none focus:ring-2 focus:ring-white outline-none font-mono" />
                                   <button type="submit" className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-100">Enter</button>
                                 </form>
                                 <p className="text-xs text-white/70 mt-3">Scanning automatically verifies against expected stock.</p>
                              </div>

                              <div className="bg-card border border-border rounded-2xl p-5 overflow-y-auto max-h-[300px]">
                                 <h4 className="font-bold flex items-center gap-2 mb-3"><CheckCircle size={16} className="text-emerald-500"/> Recently Scanned</h4>
                                 {scannedItems.length === 0 ? (
                                   <p className="text-center text-muted-foreground text-sm py-4">No items scanned yet.</p>
                                 ) : (
                                   <div className="space-y-2">
                                     {scannedItems.map((item, i) => (
                                       <div key={i} className="flex justify-between items-center p-3 bg-muted/40 border border-border rounded-lg text-sm">
                                         <span className="font-mono">{item}</span>
                                         <span className="text-emerald-600 font-bold flex items-center gap-1"><Check size={14}/> Matched</span>
                                       </div>
                                     ))}
                                   </div>
                                 )}
                              </div>
                           </div>

                           {/* Right side Stats */}
                           <div className="space-y-4">
                              <div className="bg-card border border-border rounded-2xl p-5">
                                 <h4 className="font-bold mb-4 uppercase text-xs text-muted-foreground">Audit Summary</h4>
                                 <div className="space-y-4">
                                   <div className="flex justify-between items-center"><span className="text-sm">Expected</span><span className="font-bold text-lg">150</span></div>
                                   <div className="flex justify-between items-center text-emerald-600"><span className="text-sm">Scanned & Matched</span><span className="font-bold text-lg">{scannedItems.length}</span></div>
                                   <div className="flex justify-between items-center text-red-500"><span className="text-sm">Missing</span><span className="font-bold text-lg">{150 - scannedItems.length}</span></div>
                                   <div className="flex justify-between items-center text-blue-500"><span className="text-sm">Extra (Found)</span><span className="font-bold text-lg">0</span></div>
                                 </div>
                              </div>
                              <button onClick={()=>setVerificationStep(3)} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-md">Finalize Audit</button>
                           </div>
                        </motion.div>
                      )}

                      {verificationStep === 3 && (
                        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="bg-card border border-border rounded-2xl p-8 text-center space-y-6">
                           <div className="w-24 h-24 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><CheckCircle size={48}/></div>
                           <div>
                             <h3 className="text-2xl font-bold">Verification Complete</h3>
                             <p className="text-muted-foreground mt-2 max-w-md mx-auto">The physical audit for Section A is finalized. Missing books have been automatically tagged.</p>
                           </div>
                           <button onClick={()=>{setVerificationStep(1); setScannedItems([])}} className="px-8 py-3 border border-border hover:bg-muted text-foreground font-bold rounded-xl">Start New Audit</button>
                        </motion.div>
                      )}

                   </div>
                </div>
              )}

              {/* --- STOCK ADJUSTMENT --- */}
              {activeMenu === 'adjustment' && (
                <div className="p-6 h-full bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <Settings2 className="text-slate-500" /> Stock Adjustment
                   </h2>

                   <div className="max-w-3xl border border-border bg-card rounded-2xl p-6 shadow-sm space-y-6">
                      <p className="text-sm text-muted-foreground border-b border-border pb-4">Adjust inventory manually due to loss, damage, or correction. Requires admin approval log.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2 md:col-span-2">
                           <label className="text-xs font-bold text-muted-foreground uppercase">Book Details</label>
                           <div className="relative">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                             <input type="text" placeholder="Search Book Title or ID..." className="w-full pl-9 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500" />
                           </div>
                         </div>

                         <div className="space-y-2">
                           <label className="text-xs font-bold text-muted-foreground uppercase">Adjustment Reason</label>
                           <select className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-slate-500 outline-none">
                             <option>Data Correction</option>
                             <option>Damaged Beyond Repair</option>
                             <option>Lost in Library</option>
                             <option>Found Extra Copy</option>
                           </select>
                         </div>

                         <div className="space-y-2">
                           <label className="text-xs font-bold text-muted-foreground uppercase">Quantity Change</label>
                           <div className="flex items-center gap-3">
                             <input type="number" placeholder="e.g. -1, +2" className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500" />
                             <span className="text-sm font-bold text-slate-400 whitespace-nowrap">Current: 10</span>
                           </div>
                         </div>

                         <div className="space-y-2 md:col-span-2">
                           <label className="text-xs font-bold text-muted-foreground uppercase">Audit Notes / Approval Reference</label>
                           <textarea rows={2} placeholder="Mandatory notes for this manual adjustment..." className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500" />
                         </div>
                      </div>

                      <div className="pt-4 border-t border-border flex justify-end">
                         <button className="px-8 py-3 bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:hover:bg-white text-white dark:text-black rounded-xl font-bold shadow-md flex items-center gap-2">
                           <FileSignature size={18} /> Record Adjustment
                         </button>
                      </div>
                   </div>
                </div>
              )}

              {/* --- PLACEHOLDERS --- */}
              {!['dashboard', 'transfer', 'verification', 'adjustment'].includes(activeMenu) && (
                 <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-10">
                   <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 border border-border">
                     {SIDEBAR_MENU.find(m=>m.id === activeMenu)?.icon({size: 48, className: "opacity-30 text-violet-500"})}
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
