'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Users, Receipt, History, Wallet, LineChart, 
  Archive, FileText, PlusCircle, Search, Edit3, MapPin, 
  Phone, Mail, CheckCircle, Ban, AlertTriangle, MoreVertical,
  Briefcase, DollarSign, ExternalLink, ShieldCheck, CreditCard, ShoppingCart
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_VENDORS = [
  { id: 'VND-001', company: 'Tech Books Distributor', contact: 'Mike Johnson', phone: '+1 800 123 4567', email: 'sales@techbooks.com', address: '123 Publisher Ave, NY', tax: 'GSTIN123456789', terms: 'Net 30', status: 'Active', totalPurchases: '₹1,50,000', pendingPayments: '₹25,000' },
  { id: 'VND-002', company: 'Global Publishers', contact: 'Sarah Smith', phone: '+1 800 987 6543', email: 'orders@globalpub.com', address: '45 Book St, CA', tax: 'GSTIN987654321', terms: 'Payment on Delivery', status: 'Active', totalPurchases: '₹4,20,000', pendingPayments: '₹0' },
  { id: 'VND-003', company: 'Academic Resources Ltd', contact: 'Robert Lee', phone: '+1 800 555 1111', email: 'info@academicres.com', address: '88 Scholar Way, TX', tax: 'GSTIN112233445', terms: 'Net 15', status: 'Inactive', totalPurchases: '₹50,000', pendingPayments: '₹10,000' },
];

const SIDEBAR_MENU = [
  { id: 'all', label: 'All Vendors', icon: Building2 },
  { id: 'add', label: 'Add Vendor', icon: PlusCircle },
  { id: 'contacts', label: 'Vendor Contacts', icon: Users },
  { id: 'history', label: 'Purchase History', icon: History },
  { id: 'invoices', label: 'Vendor Invoices', icon: Receipt },
  { id: 'outstanding', label: 'Outstanding Payments', icon: Wallet },
  { id: 'performance', label: 'Vendor Performance', icon: LineChart },
  { id: 'reports', label: 'Vendor Reports', icon: FileText },
  { id: 'archived', label: 'Archived Vendors', icon: Archive },
];

export default function VendorsView() {
  const [activeMenu, setActiveMenu] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [vendors, setVendors] = useState(MOCK_VENDORS);
  const [notice, setNotice] = useState('');
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(v => v === message ? '' : v), 2200); };

  const getStatusColor = (status: string) => {
    if (status === 'Active') return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400';
    if (status === 'Inactive') return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400';
    return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400';
  };

  const handleAction = (action: string, vendor: any) => {
    setActionMenuOpen(null);
    if(action === 'View Profile') {
      setSelectedVendor(vendor);
      return;
    }
    if(action === 'Deactivate') {
      setVendors(items => items.map(v => v.id === vendor.id ? { ...v, status: 'Inactive' } : v));
      notify(vendor.company + ' deactivated.');
      return;
    }
    notify(action + ' completed for ' + vendor.company + '.');
  };

  const displayVendors = vendors.filter(vendor => {
    const menuMatch = activeMenu === 'archived' ? vendor.status === 'Inactive' : vendor.status !== 'Inactive';
    const q = search.trim().toLowerCase();
    const searchMatch = !q || [vendor.company,vendor.contact,vendor.email,vendor.tax,vendor.id].some(v => v.toLowerCase().includes(q));
    return menuMatch && searchMatch;
  });

  return (
    <div className="w-full max-w-full space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
            <Building2 size={28} className="text-amber-600" /> Vendor Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedVendor ? `Viewing profile of ${selectedVendor.company}` : 'Manage book suppliers, purchase history, and outstanding payments.'}
          </p>
        </div>
        <div className="flex gap-2">
          {selectedVendor ? (
            <button onClick={() => setSelectedVendor(null)} className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 shadow-sm transition-colors">
               <Building2 size={16} /> Back to Vendors
            </button>
          ) : (
            <button onClick={() => setActiveMenu('add')} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 shadow-sm transition-colors">
              <PlusCircle size={16} /> Add Vendor
            </button>
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
              key={selectedVendor ? 'detail' : activeMenu}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              
              {/* --- VENDORS LIST --- */}
              {!selectedVendor && activeMenu === 'all' && (
                <div className="p-6 h-full flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                     <h2 className="text-2xl font-bold flex items-center gap-2">
                       <Building2 className="text-amber-500" /> All Vendors
                     </h2>
                     <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                       <input type="text" placeholder="Search Company or Contact..." className="pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-64" value={search} onChange={e=>setSearch(e.target.value)} />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {displayVendors.map(vendor => (
                      <div key={vendor.id} className="relative p-5 border border-border rounded-2xl bg-background hover:shadow-lg transition-all hover:border-amber-500/40">
                         <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center border border-amber-200 dark:border-amber-800">
                               <Briefcase size={24} />
                             </div>
                             <div>
                               <h3 className="font-bold text-lg leading-tight">{vendor.company}</h3>
                               <p className="text-xs text-muted-foreground mt-0.5">{vendor.id} • {vendor.contact}</p>
                             </div>
                           </div>

                           {/* ACTION MENU */}
                           <div className="relative">
                              <button onClick={() => setActionMenuOpen(actionMenuOpen === vendor.id ? null : vendor.id)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                                <MoreVertical size={20} />
                              </button>
                              {actionMenuOpen === vendor.id && (
                                <div className="absolute right-0 top-full mt-1 w-52 bg-card border border-border rounded-xl shadow-xl z-50 py-2">
                                  <button onClick={() => handleAction('View Profile', vendor)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><ExternalLink size={16} className="text-blue-500"/> Full Details</button>
                                  <button onClick={() => handleAction('Edit', vendor)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Edit3 size={16} className="text-amber-500"/> Edit Vendor</button>
                                  <div className="h-px bg-border my-1"></div>
                                  <button onClick={() => handleAction('Purchase History', vendor)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><History size={16} className="text-slate-500"/> Purchase History</button>
                                  <button onClick={() => handleAction('Invoice History', vendor)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Receipt size={16} className="text-indigo-500"/> Invoice History</button>
                                  <button onClick={() => handleAction('Payment Status', vendor)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Wallet size={16} className="text-emerald-500"/> Payment Status</button>
                                  <div className="h-px bg-border my-1"></div>
                                  <button onClick={() => handleAction('Deactivate', vendor)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2 text-red-500"><Ban size={16}/> Deactivate Vendor</button>
                                </div>
                              )}
                           </div>
                         </div>

                         <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                           <p className="flex items-center gap-2 text-muted-foreground"><Phone size={14}/> {vendor.phone}</p>
                           <p className="flex items-center gap-2 text-muted-foreground truncate"><Mail size={14}/> {vendor.email}</p>
                         </div>

                         <div className="grid grid-cols-2 gap-3 p-3 bg-muted/40 border border-border rounded-xl mb-4 text-sm">
                           <div><p className="text-xs text-muted-foreground">Total Purchases</p><p className="font-bold">{vendor.totalPurchases}</p></div>
                           <div>
                             <p className="text-xs text-muted-foreground">Pending Payments</p>
                             <p className={`font-bold ${vendor.pendingPayments !== '₹0' ? 'text-red-500' : 'text-emerald-500'}`}>{vendor.pendingPayments}</p>
                           </div>
                         </div>

                         <div className="flex justify-between items-center">
                           <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getStatusColor(vendor.status)}`}>{vendor.status}</span>
                           <button onClick={() => handleAction('View Profile', vendor)} className="text-sm font-bold text-amber-600 hover:underline">Manage Vendor</button>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- ADD VENDOR FORM --- */}
              {!selectedVendor && activeMenu === 'add' && (
                <div className="p-6 md:p-8 h-full bg-background overflow-y-auto">
                   <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                     <PlusCircle className="text-amber-500" /> Add New Vendor
                   </h2>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                      {/* Basic Info */}
                      <div className="col-span-1 md:col-span-2"><h3 className="font-bold flex items-center gap-2 border-b border-border pb-2"><Building2 size={18} className="text-blue-500"/> Company Details</h3></div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Company Name <span className="text-red-500">*</span></label>
                        <input type="text" placeholder="e.g. Tech Books Inc" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-amber-500 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Status</label>
                        <select className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-amber-500 outline-none"><option>Active</option><option>Inactive</option></select>
                      </div>

                      {/* Contact Info */}
                      <div className="col-span-1 md:col-span-2 mt-4"><h3 className="font-bold flex items-center gap-2 border-b border-border pb-2"><Users size={18} className="text-emerald-500"/> Contact Information</h3></div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Contact Person <span className="text-red-500">*</span></label>
                        <input type="text" placeholder="Full name of representative" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-amber-500 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Email Address <span className="text-red-500">*</span></label>
                        <input type="email" placeholder="contact@vendor.com" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-amber-500 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Phone Number <span className="text-red-500">*</span></label>
                        <input type="tel" placeholder="+1..." className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-amber-500 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Address</label>
                        <input type="text" placeholder="Full address" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-amber-500 outline-none" />
                      </div>

                      {/* Financial Info */}
                      <div className="col-span-1 md:col-span-2 mt-4"><h3 className="font-bold flex items-center gap-2 border-b border-border pb-2"><DollarSign size={18} className="text-purple-500"/> Financial & Tax Details</h3></div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Tax / GST Details <span className="text-red-500">*</span></label>
                        <input type="text" placeholder="GSTIN or Tax ID" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-amber-500 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Payment Terms</label>
                        <select className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-amber-500 outline-none"><option>Net 30</option><option>Net 15</option><option>Payment on Delivery</option></select>
                      </div>
                      <div className="space-y-1.5 col-span-1 md:col-span-2">
                        <label className="text-sm font-medium">Bank & Reference Details</label>
                        <textarea rows={2} placeholder="Account no, IFSC, Routing no..." className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-amber-500 outline-none" />
                      </div>

                      <div className="col-span-1 md:col-span-2 pt-6 flex justify-end gap-3">
                         <button onClick={()=>setActiveMenu("all")} className="px-6 py-2.5 rounded-xl border border-border bg-muted hover:bg-muted/80 font-medium">Cancel</button>
                         <button onClick={()=>setActiveMenu("all")} className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium flex items-center gap-2 shadow-md">
                           <CheckCircle size={18} /> Save Vendor
                         </button>
                      </div>
                   </div>
                </div>
              )}

              {/* --- VENDOR DETAILED PROFILE --- */}
              {selectedVendor && (
                <div className="h-full flex flex-col bg-background overflow-y-auto">
                   
                   <div className="p-6 border-b border-border bg-card">
                      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-20 h-20 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center border border-amber-200 dark:border-amber-800 shrink-0">
                          <Briefcase size={40} />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-3xl font-bold">{selectedVendor.company}</h2>
                          <p className="text-sm text-muted-foreground mt-1">Vendor ID: {selectedVendor.id} • Registered Supplier</p>
                          <div className="flex gap-4 mt-3">
                            <span className={`px-2.5 py-0.5 text-xs font-bold rounded border ${getStatusColor(selectedVendor.status)}`}>{selectedVendor.status}</span>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">Terms: {selectedVendor.terms}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={()=>notify("New purchase order workflow opened for "+selectedVendor.company+".")} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 hover:opacity-90"><PlusCircle size={16}/> New Order</button>
                        </div>
                      </div>
                   </div>

                   <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div className="p-5 border border-border rounded-xl bg-card space-y-4">
                         <h3 className="font-bold flex items-center gap-2"><Users size={18} className="text-blue-500"/> Contact Info</h3>
                         <div className="space-y-3 text-sm">
                           <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Contact Person</span><span className="font-medium">{selectedVendor.contact}</span></div>
                           <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Phone</span><span className="font-medium">{selectedVendor.phone}</span></div>
                           <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Email</span><span className="font-medium text-blue-500">{selectedVendor.email}</span></div>
                           <div className="flex justify-between pb-1"><span className="text-muted-foreground">Address</span><span className="font-medium max-w-[200px] text-right">{selectedVendor.address}</span></div>
                         </div>
                      </div>

                      <div className="p-5 border border-border rounded-xl bg-card space-y-4">
                         <h3 className="font-bold flex items-center gap-2"><ShieldCheck size={18} className="text-emerald-500"/> Tax & Financial Info</h3>
                         <div className="space-y-3 text-sm">
                           <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Tax / GSTIN</span><span className="font-mono font-bold">{selectedVendor.tax}</span></div>
                           <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Total Purchases</span><span className="font-bold text-emerald-600">{selectedVendor.totalPurchases}</span></div>
                           <div className="flex justify-between pb-1"><span className="text-muted-foreground">Pending Payments</span><span className={`font-bold ${selectedVendor.pendingPayments !== '₹0' ? 'text-red-500' : 'text-emerald-500'}`}>{selectedVendor.pendingPayments}</span></div>
                         </div>
                      </div>
                   </div>

                   {/* Activity Logs Mockup */}
                   <div className="px-6 pb-6">
                     <h3 className="font-bold flex items-center gap-2 mb-4"><History size={18} className="text-slate-500"/> Recent Activity</h3>
                     <div className="bg-card border border-border rounded-xl overflow-hidden">
                       <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                         <div className="flex items-center gap-3"><ShoppingCart size={16} className="text-blue-500"/> <div><p className="text-sm font-bold">PO-9001 Created</p><p className="text-xs text-muted-foreground">15 items ordered</p></div></div>
                         <span className="text-xs text-muted-foreground">2 days ago</span>
                       </div>
                       <div className="p-4 flex justify-between items-center">
                         <div className="flex items-center gap-3"><CreditCard size={16} className="text-emerald-500"/> <div><p className="text-sm font-bold">Payment Cleared</p><p className="text-xs text-muted-foreground">Amount: ₹15,000 for INV-042</p></div></div>
                         <span className="text-xs text-muted-foreground">5 days ago</span>
                       </div>
                     </div>
                   </div>

                </div>
              )}

              {/* --- VENDOR WORKSPACES --- */}
              {!selectedVendor && !['all', 'add'].includes(activeMenu) && (
                <div className="p-6 bg-background space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div><h2 className="text-2xl font-bold capitalize">{SIDEBAR_MENU.find(m=>m.id===activeMenu)?.label}</h2><p className="text-sm text-muted-foreground mt-1">Live mock records from the Admin vendor workspace.</p></div>
                    <span className="text-sm font-bold px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">{displayVendors.length} records</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {displayVendors.map(vendor=>(
                      <div key={vendor.id} className="p-4 border border-border rounded-xl bg-card space-y-3">
                        <div className="flex items-start justify-between gap-2"><div><b>{vendor.company}</b><p className="text-xs text-muted-foreground">{vendor.contact}</p></div><span className="text-xs font-bold">{vendor.status}</span></div>
                        {activeMenu==='contacts' && <div className="text-sm space-y-1"><p>{vendor.email}</p><p>{vendor.phone}</p><p>{vendor.address}</p></div>}
                        {activeMenu==='history' && <div className="text-sm"><p className="font-semibold">Total purchases</p><p className="text-emerald-600 font-bold">{vendor.totalPurchases}</p></div>}
                        {activeMenu==='invoices' && <div className="text-sm"><p className="font-semibold">Latest Invoice: INV-042</p><p className="text-muted-foreground">Terms: {vendor.terms}</p></div>}
                        {activeMenu==='outstanding' && <div className="text-sm"><p className="font-semibold">Pending payment</p><p className="text-red-500 font-bold">{vendor.pendingPayments}</p></div>}
                        {activeMenu==='performance' && <div><div className="flex justify-between text-sm mb-1"><span>Fulfilment score</span><b>{vendor.status==='Active'?'94':'68'}%</b></div><div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{width:vendor.status==='Active'?'94%':'68%'}}/></div></div>}
                        {activeMenu==='reports' && <div className="text-sm space-y-1"><p>Purchase volume: <b>{vendor.totalPurchases}</b></p><p>Outstanding: <b>{vendor.pendingPayments}</b></p><button onClick={()=>notify('Vendor report prepared for '+vendor.company+'.')} className="text-amber-600 font-semibold hover:underline">Generate Report</button></div>}
                        {activeMenu==='archived' && <button onClick={()=>{setVendors(items=>items.map(v=>v.id===vendor.id?{...v,status:'Active'}:v));notify(vendor.company+' restored.');}} className="admin-btn admin-btn-primary w-full">Restore Vendor</button>}
                      </div>
                    ))}
                  </div>
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
