'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, FileText, PackagePlus, FileCheck, PackageX,
  Receipt, History, BarChart3, PlusCircle, Search, Edit3,
  CheckCircle, ArrowRight, CornerDownRight, Box, Check, 
  MapPin, Tag, Truck, DollarSign, XCircle
} from 'lucide-react';

const SIDEBAR_MENU = [
  { id: 'dashboard', label: 'Acquisition Dashboard', icon: BarChart3 },
  { id: 'requests', label: 'Purchase Requests', icon: FileText },
  { id: 'orders', label: 'Purchase Orders', icon: ShoppingCart },
  { id: 'pending', label: 'Pending Orders', icon: Truck },
  { id: 'received', label: 'Received Orders', icon: FileCheck },
  { id: 'cancelled', label: 'Cancelled Orders', icon: PackageX },
  { id: 'receive_flow', label: 'Receive Books Flow', icon: PackagePlus },
  { id: 'invoices', label: 'Invoices', icon: Receipt },
  { id: 'history', label: 'Acquisition History', icon: History },
];

const MOCK_REQUESTS = [
  { id: 'PR-201', book: 'System Design Interview', requestedBy: 'Mike Johnson', qty: 5, estPrice: 2000, priority: 'High', status: 'Approved' },
  { id: 'PR-202', book: 'Designing Data-Intensive Apps', requestedBy: 'Sarah Smith', qty: 10, estPrice: 5000, priority: 'Medium', status: 'Pending' },
];

const MOCK_ORDERS = [
  { id: 'PO-9001', vendor: 'Tech Books Distributor', date: '25 Sep 2026', items: 3, qty: 15, total: 12000, expected: '02 Oct 2026', status: 'Pending Delivery' },
  { id: 'PO-9002', vendor: 'Global Publishers', date: '10 Sep 2026', items: 1, qty: 5, total: 3500, expected: '15 Sep 2026', status: 'Received' },
];

export default function AcquisitionView() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // Receive Book Flow States
  const [receiveStep, setReceiveStep] = useState(1);
  const [selectedPO, setSelectedPO] = useState('');

  const getStatusColor = (status: string) => {
    if (status.includes('Approved') || status.includes('Received')) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    if (status.includes('Pending')) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    if (status.includes('Cancelled')) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
  };

  return (
    <div className="w-full max-w-full space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent flex items-center gap-2">
            <ShoppingCart size={28} className="text-emerald-600" /> Book Acquisition
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage purchase requests, vendor orders, inventory receiving, and invoices.
          </p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setActiveMenu('requests')} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm transition-colors">
             <PlusCircle size={16} /> New Request
           </button>
           <button onClick={() => {setActiveMenu('receive_flow'); setReceiveStep(1);}} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 shadow-sm transition-colors">
             <PackagePlus size={16} /> Receive Books
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
                onClick={() => { setActiveMenu(menu.id); if(menu.id === 'receive_flow') setReceiveStep(1); }}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-emerald-600 text-white shadow-md scale-[1.02]' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <menu.icon size={18} className={isActive ? 'text-white' : 'text-emerald-500/70'} />
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
              
              {/* --- PURCHASE REQUESTS --- */}
              {activeMenu === 'requests' && (
                <div className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-bold flex items-center gap-2">
                       <FileText className="text-emerald-500" /> Purchase Requests
                     </h2>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {MOCK_REQUESTS.map(req => (
                      <div key={req.id} className="p-5 border border-border rounded-2xl bg-background hover:shadow-lg transition-all">
                         <div className="flex justify-between items-start mb-3">
                           <div>
                             <p className="text-xs font-bold text-muted-foreground mb-1">{req.id}</p>
                             <h3 className="font-bold text-lg">{req.book}</h3>
                           </div>
                           <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getStatusColor(req.status)}`}>{req.status}</span>
                         </div>
                         <div className="grid grid-cols-2 gap-3 text-sm bg-muted/30 p-3 rounded-xl border border-border">
                           <div><p className="text-xs text-muted-foreground">Requested By</p><p className="font-medium">{req.requestedBy}</p></div>
                           <div><p className="text-xs text-muted-foreground">Priority</p><p className={`font-bold ${req.priority === 'High' ? 'text-red-500' : 'text-blue-500'}`}>{req.priority}</p></div>
                           <div><p className="text-xs text-muted-foreground">Quantity</p><p className="font-medium">{req.qty} copies</p></div>
                           <div><p className="text-xs text-muted-foreground">Est. Total</p><p className="font-medium">₹{req.estPrice}</p></div>
                         </div>
                         <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                            <button className="flex-1 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 rounded-lg font-bold text-sm transition-colors">Create Order (PO)</button>
                            <button className="px-4 py-2 bg-muted text-foreground hover:bg-muted/80 rounded-lg font-medium text-sm transition-colors"><Edit3 size={16}/></button>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- PURCHASE ORDERS --- */}
              {['orders', 'pending', 'received'].includes(activeMenu) && (
                <div className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-bold flex items-center gap-2 capitalize">
                       <ShoppingCart className="text-emerald-500" /> {activeMenu} Orders
                     </h2>
                  </div>

                  <div className="overflow-x-auto custom-scrollbar border border-border rounded-xl">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted text-muted-foreground uppercase text-xs font-bold">
                        <tr>
                          <th className="px-4 py-3">PO Number</th>
                          <th className="px-4 py-3">Vendor</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3 text-center">Items (Qty)</th>
                          <th className="px-4 py-3 text-right">Total Amount</th>
                          <th className="px-4 py-3">Expected</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_ORDERS.map(order => (
                          <tr key={order.id} className="border-b border-border bg-background hover:bg-muted/30">
                            <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">{order.id}</td>
                            <td className="px-4 py-3 font-medium">{order.vendor}</td>
                            <td className="px-4 py-3 text-muted-foreground">{order.date}</td>
                            <td className="px-4 py-3 text-center"><span className="px-2 py-0.5 bg-muted rounded font-medium">{order.items} books ({order.qty})</span></td>
                            <td className="px-4 py-3 text-right font-bold">₹{order.total}</td>
                            <td className="px-4 py-3 text-muted-foreground">{order.expected}</td>
                            <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusColor(order.status)}`}>{order.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* --- RECEIVE BOOKS FLOW (Multi-step) --- */}
              {activeMenu === 'receive_flow' && (
                <div className="p-6 h-full flex flex-col bg-background">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                     <PackagePlus className="text-teal-500" /> Receive Books & Accession
                   </h2>
                   <p className="text-sm text-muted-foreground mb-6">Process incoming inventory, verify conditions, generate barcodes, and place on shelves.</p>
                   
                   {/* Progress Indicator */}
                   <div className="flex items-center justify-between mb-8 max-w-3xl mx-auto w-full relative">
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 z-0"></div>
                      <div className="absolute top-1/2 left-0 h-1 bg-teal-500 -translate-y-1/2 z-0 transition-all duration-500" style={{width: `${((receiveStep - 1) / 3) * 100}%`}}></div>
                      
                      {[1,2,3,4].map(step => (
                        <div key={step} className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${receiveStep >= step ? 'bg-teal-600 text-white shadow-md shadow-teal-500/30' : 'bg-muted border border-border text-muted-foreground'}`}>
                          {receiveStep > step ? <Check size={16} /> : step}
                        </div>
                      ))}
                   </div>

                   <div className="flex-1 overflow-y-auto max-w-3xl mx-auto w-full">
                     {/* Step 1: Select PO */}
                     {receiveStep === 1 && (
                       <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="space-y-6">
                          <h3 className="text-xl font-bold flex items-center gap-2"><ShoppingCart size={20} className="text-teal-500"/> Select Purchase Order</h3>
                          <div className="bg-card border border-border p-5 rounded-2xl">
                             <label className="text-sm font-bold text-muted-foreground uppercase mb-2 block">Pending Orders</label>
                             <div className="space-y-3">
                                {MOCK_ORDERS.filter(o=>o.status==='Pending Delivery').map(o => (
                                  <label key={o.id} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${selectedPO === o.id ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-500' : 'bg-background border-border hover:bg-muted/50'}`}>
                                    <div className="flex items-center gap-3">
                                      <input type="radio" name="po" checked={selectedPO === o.id} onChange={() => setSelectedPO(o.id)} className="w-5 h-5 text-teal-600 focus:ring-teal-500" />
                                      <div>
                                        <p className="font-bold text-lg">{o.id}</p>
                                        <p className="text-sm text-muted-foreground">{o.vendor} • {o.items} Items ({o.qty} copies)</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-teal-600 dark:text-teal-400">₹{o.total}</p>
                                    </div>
                                  </label>
                                ))}
                             </div>
                             <div className="mt-6 flex justify-end">
                                <button disabled={!selectedPO} onClick={() => setReceiveStep(2)} className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">Continue <ArrowRight size={18}/></button>
                             </div>
                          </div>
                       </motion.div>
                     )}

                     {/* Step 2: Receive & Verify */}
                     {receiveStep === 2 && (
                       <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="space-y-6">
                          <h3 className="text-xl font-bold flex items-center gap-2"><CheckCircle size={20} className="text-teal-500"/> Receive & Verify Quantity</h3>
                          <div className="bg-card border border-border p-5 rounded-2xl space-y-4">
                             <div className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg">
                               <div><p className="font-bold text-lg">System Design Interview</p><p className="text-xs text-muted-foreground">Ordered: 5 Copies</p></div>
                               <div className="flex items-center gap-2">
                                 <label className="text-sm font-bold">Received:</label>
                                 <input type="number" defaultValue={5} className="w-20 px-3 py-2 bg-background border border-border rounded-lg text-center font-bold focus:ring-2 focus:ring-teal-500 outline-none" />
                               </div>
                             </div>
                             <div className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg">
                               <div><p className="font-bold text-lg">Designing Data-Intensive Apps</p><p className="text-xs text-muted-foreground">Ordered: 10 Copies</p></div>
                               <div className="flex items-center gap-2">
                                 <label className="text-sm font-bold">Received:</label>
                                 <input type="number" defaultValue={10} className="w-20 px-3 py-2 bg-background border border-border rounded-lg text-center font-bold focus:ring-2 focus:ring-teal-500 outline-none" />
                               </div>
                             </div>
                             
                             <div className="mt-6 flex justify-between">
                                <button onClick={() => setReceiveStep(1)} className="px-6 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-bold">Back</button>
                                <button onClick={() => setReceiveStep(3)} className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center gap-2">Verify & Proceed <ArrowRight size={18}/></button>
                             </div>
                          </div>
                       </motion.div>
                     )}

                     {/* Step 3: Accession & Barcode */}
                     {receiveStep === 3 && (
                       <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="space-y-6">
                          <h3 className="text-xl font-bold flex items-center gap-2"><Tag size={20} className="text-teal-500"/> Accession & Generate Barcodes</h3>
                          <div className="bg-card border border-border p-5 rounded-2xl text-center space-y-6">
                             <div className="w-24 h-24 mx-auto bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-600">
                               <Tag size={40} />
                             </div>
                             <div>
                               <h4 className="font-bold text-lg mb-1">Generate 15 Barcodes</h4>
                               <p className="text-sm text-muted-foreground">System will assign unique Accession Numbers and generate printable barcodes for the received books.</p>
                             </div>
                             
                             <div className="mt-6 flex justify-between">
                                <button onClick={() => setReceiveStep(2)} className="px-6 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-bold">Back</button>
                                <button onClick={() => setReceiveStep(4)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2">Generate & Print Barcodes <ArrowRight size={18}/></button>
                             </div>
                          </div>
                       </motion.div>
                     )}

                     {/* Step 4: Location & Add to Inventory */}
                     {receiveStep === 4 && (
                       <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="space-y-6">
                          <h3 className="text-xl font-bold flex items-center gap-2"><MapPin size={20} className="text-teal-500"/> Set Location & Add to Inventory</h3>
                          <div className="bg-card border border-border p-5 rounded-2xl space-y-4">
                             
                             <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-1">
                                 <label className="text-xs font-bold text-muted-foreground uppercase">Assign Branch</label>
                                 <select className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-teal-500 outline-none"><option>Central Main Library</option></select>
                               </div>
                               <div className="space-y-1">
                                 <label className="text-xs font-bold text-muted-foreground uppercase">Section/Rack</label>
                                 <input type="text" placeholder="e.g. Rack A1" className="w-full px-4 py-2 border border-border rounded-lg bg-background" />
                               </div>
                             </div>

                             <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-start gap-3 mt-4 text-emerald-800 dark:text-emerald-400">
                               <CheckCircle size={24} className="shrink-0 mt-0.5" />
                               <div>
                                 <h4 className="font-bold">Ready for Inventory</h4>
                                 <p className="text-sm mt-1">15 copies will be marked as 'Available' in the specified branch and rack location.</p>
                               </div>
                             </div>
                             
                             <div className="mt-6 flex justify-between">
                                <button onClick={() => setReceiveStep(3)} className="px-6 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-bold">Back</button>
                                <button onClick={() => {alert("Inventory Updated!"); setReceiveStep(1); setSelectedPO(''); setActiveMenu('dashboard')}} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-2">Add to Inventory <Check size={18}/></button>
                             </div>
                          </div>
                       </motion.div>
                     )}
                   </div>
                </div>
              )}

              {/* --- DASHBOARD PLACEHOLDER --- */}
              {activeMenu === 'dashboard' && (
                 <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                   <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 border border-border">
                     <BarChart3 size={48} className="opacity-30 text-emerald-500" />
                   </div>
                   <h3 className="text-2xl font-bold text-foreground mb-2">Acquisition Dashboard</h3>
                   <p className="text-center max-w-md mb-6">Overview of library expenditure, pending orders, and vendor performance will be displayed here.</p>
                 </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
