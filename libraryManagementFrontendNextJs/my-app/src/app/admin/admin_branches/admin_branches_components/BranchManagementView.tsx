'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map, Building2, CheckCircle, AlertTriangle, Archive, Users, Settings, 
  Activity, FileText, PlusCircle, MoreVertical, Edit3, Eye, Power,
  XCircle, UserCog, Mail, Phone, MapPin, Clock, Shield, Search,
  BookOpen, ArrowRightLeft, DollarSign, List, ShieldCheck
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar } from 'recharts';

// --- MOCK DATA ---
const MOCK_BRANCHES = [
  { id: 'b1', name: 'Central Main Library', code: 'CML-01', manager: 'John Doe', status: 'Active', address: '123 Main St, City Center', phone: '+1 234 567 8900', email: 'cml@library.com', hours: '08:00 AM - 08:00 PM', users: 1540, books: 45000, members: 3200, circ: 840, fine: 15200 },
  { id: 'b2', name: 'Northside Hub', code: 'NSH-02', manager: 'Sarah Smith', status: 'Active', address: '45 North Ave, Uptown', phone: '+1 234 567 8901', email: 'nsh@library.com', hours: '09:00 AM - 07:00 PM', users: 820, books: 12000, members: 1100, circ: 420, fine: 4300 },
  { id: 'b3', name: 'East Wing Branch', code: 'EWB-03', manager: 'Mike Johnson', status: 'Suspended', address: '78 East Blvd', phone: '+1 234 567 8902', email: 'ewb@library.com', hours: '09:00 AM - 05:00 PM', users: 400, books: 8000, members: 500, circ: 0, fine: 1200 },
  { id: 'b4', name: 'West End Archive', code: 'WEA-04', manager: 'Emma Davis', status: 'Archived', address: '12 West St', phone: '+1 234 567 8903', email: 'wea@library.com', hours: 'Closed', users: 0, books: 25000, members: 0, circ: 0, fine: 0 },
];

const MAIN_MENU = [
  { id: 'all', label: 'All Branches', icon: Building2 },
  { id: 'create', label: 'Create Branch', icon: PlusCircle },
  { id: 'active', label: 'Active', icon: CheckCircle },
  { id: 'suspended', label: 'Suspended', icon: AlertTriangle },
  { id: 'archived', label: 'Archived', icon: Archive },
  { id: 'managers', label: 'Branch Managers', icon: Users },
  { id: 'usage', label: 'Branch Usage', icon: Activity },
  { id: 'reports', label: 'Branch Reports', icon: FileText },
  { id: 'settings', label: 'Branch Settings', icon: Settings },
];

const BRANCH_DETAIL_TABS = [
  { id: 'overview', label: 'Overview', icon: Building2 },
  { id: 'users', label: 'Staff/Users', icon: Users },
  { id: 'books', label: 'Books', icon: BookOpen },
  { id: 'members', label: 'Members', icon: ShieldCheck },
  { id: 'circ', label: 'Circulation', icon: ArrowRightLeft },
  { id: 'resv', label: 'Reservations', icon: Clock },
  { id: 'inv', label: 'Inventory', icon: List },
  { id: 'fines', label: 'Fines', icon: DollarSign },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'audit', label: 'Audit', icon: Shield },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const USAGE_DATA = [
  { name: 'Jan', CML: 4000, NSH: 2400 },
  { name: 'Feb', CML: 3000, NSH: 1398 },
  { name: 'Mar', CML: 2000, NSH: 9800 },
  { name: 'Apr', CML: 2780, NSH: 3908 },
  { name: 'May', CML: 1890, NSH: 4800 },
  { name: 'Jun', CML: 2390, NSH: 3800 },
];

export default function BranchManagementView() {
  const [branches, setBranches] = useState(MOCK_BRANCHES);
  const [activeMenu, setActiveMenu] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState<any | null>(null);
  const [activeBranchTab, setActiveBranchTab] = useState('overview');
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [managerSearch, setManagerSearch] = useState('');
  const [managerAssignments, setManagerAssignments] = useState<Record<string,string>>({});
  const [form, setForm] = useState({name:'',code:'',address:'',phone:'',email:'',hours:'',manager:''});
  const [hours, setHours] = useState('08:00 AM - 08:00 PM');
  const [autoRenew, setAutoRenew] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [notice, setNotice] = useState('');

  // Filter branches based on menu
  const displayBranches = useMemo(() => branches.filter(b => {
    const statusMatch = activeMenu === 'all' ? true : activeMenu === 'active' ? b.status === 'Active' : activeMenu === 'suspended' ? b.status === 'Suspended' : activeMenu === 'archived' ? b.status === 'Archived' : true;
    const q = search.trim().toLowerCase();
    const searchMatch = !q || [b.name,b.code,b.manager,b.address].some(v => v.toLowerCase().includes(q));
    return statusMatch && searchMatch;
  }), [branches, activeMenu, search]);

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(current => current === message ? '' : current), 2200);
  };

  const updateBranch = (id: string, patch: Record<string, any>) => setBranches(items => items.map(item => item.id === id ? { ...item, ...patch } : item));

  const saveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim() || !form.address.trim()) { notify('Branch Name, Branch Code and Address are required.'); return; }
    const existing = branches.find(b => b.code.toLowerCase() === form.code.trim().toLowerCase());
    if (existing) {
      updateBranch(existing.id,{name:form.name.trim(),address:form.address.trim(),phone:form.phone.trim(),email:form.email.trim(),hours:form.hours.trim() || existing.hours,manager:form.manager || existing.manager});
      notify('Branch updated successfully.');
    } else {
      setBranches(items => [...items,{id:`b-${Date.now()}`,name:form.name.trim(),code:form.code.trim().toUpperCase(),manager:form.manager || 'Unassigned',status:'Active',address:form.address.trim(),phone:form.phone.trim() || '—',email:form.email.trim() || '—',hours:form.hours.trim() || '09:00 AM - 06:00 PM',users:0,books:0,members:0,circ:0,fine:0}]);
      notify('Branch created successfully.');
    }
    setForm({name:'',code:'',address:'',phone:'',email:'',hours:'',manager:''});
    setActiveMenu('all');
  };

  const saveManager = (branch: any) => {
    const manager = managerAssignments[branch.id];
    if (!manager) { notify('Please select a manager.'); return; }
    updateBranch(branch.id,{manager});
    notify('Manager assignment saved.');
  };

  const getStatusColor = (status: string) => {
    if (status === 'Active') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    if (status === 'Suspended') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400 border-slate-200 dark:border-slate-800';
  };

  const handleBranchAction = (action: string, branch: any) => {
    setActionMenuOpen(null);
    if (action === 'view') { setSelectedBranch(branch); setActiveBranchTab('overview'); return; }
    if (action === 'edit') { setForm({name:branch.name,code:branch.code,address:branch.address,phone:branch.phone,email:branch.email,hours:branch.hours,manager:branch.manager}); setActiveMenu('create'); notify('Branch loaded for editing.'); return; }
    if (action === 'activate') { updateBranch(branch.id,{status:'Active'}); notify('Branch activated.'); return; }
    if (action === 'suspend') { updateBranch(branch.id,{status:'Suspended'}); notify('Branch suspended.'); return; }
    if (action === 'archive') { updateBranch(branch.id,{status:'Archived'}); notify('Branch archived.'); return; }
    if (action === 'change_manager') { setManagerAssignments(current => ({...current,[branch.id]:branch.manager})); setActiveMenu('managers'); notify('Manager assignment opened.'); }
  };

  return (
    <div className="w-full max-w-full space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent">
            {selectedBranch ? `${selectedBranch.name} Management` : 'Branch Management'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedBranch ? 'Detailed view and control for this specific branch.' : 'Control and monitor all library branches across your organization.'}
          </p>
        </div>
        {selectedBranch && (
          <button 
            onClick={() => setSelectedBranch(null)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-all shadow-sm"
          >
            <Map size={16} /> Back to All Branches
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* SIDEBAR SUB-MENU */}
        <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0 bg-card border border-border p-3 rounded-2xl shadow-sm">
          {!selectedBranch ? (
            MAIN_MENU.map((menu) => (
              <button
                key={menu.id}
                onClick={() => setActiveMenu(menu.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeMenu === menu.id 
                  ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <menu.icon size={18} className={activeMenu === menu.id ? 'text-primary-foreground' : 'text-primary/70'} />
                  <span className="font-medium text-sm">{menu.label}</span>
                </div>
                {['all', 'active', 'suspended', 'archived'].includes(menu.id) && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeMenu === menu.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted-foreground/10 text-muted-foreground'}`}>
                    {menu.id === 'all' ? MOCK_BRANCHES.length : MOCK_BRANCHES.filter(b => b.status.toLowerCase() === menu.id).length}
                  </span>
                )}
              </button>
            ))
          ) : (
            BRANCH_DETAIL_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveBranchTab(tab.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeBranchTab === tab.id 
                  ? 'bg-teal-600 text-white shadow-md scale-[1.02]' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon size={18} className={activeBranchTab === tab.id ? 'text-white' : 'text-teal-500/70'} />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))
          )}
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 w-full bg-card border border-border rounded-2xl shadow-sm overflow-visible min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedBranch ? `branch-${activeBranchTab}` : `main-${activeMenu}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-8"
            >
              {/* --- MAIN LAYOUT STATES --- */}
              {!selectedBranch && (
                <>
                  {/* BRANCH LISTING (All, Active, Suspended, Archived) */}
                  {['all', 'active', 'suspended', 'archived'].includes(activeMenu) && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold flex items-center gap-2 capitalize">
                          <Building2 className="text-blue-500" /> {activeMenu} Branches
                        </h2>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          <input type="text" placeholder="Search branches..." className="pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {displayBranches.map(branch => (
                          <div key={branch.id} className="relative bg-background border border-border rounded-2xl p-5 hover:shadow-lg transition-all hover:border-primary/40 group">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                                  <Building2 size={24} />
                                </div>
                                <div>
                                  <h3 className="font-bold text-base leading-tight">{branch.name}</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">{branch.code}</p>
                                </div>
                              </div>
                              <div className="relative">
                                <button 
                                  onClick={() => setActionMenuOpen(actionMenuOpen === branch.id ? null : branch.id)}
                                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
                                >
                                  <MoreVertical size={18} />
                                </button>
                                {/* ACTION DROPDOWN */}
                                {actionMenuOpen === branch.id && (
                                  <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-xl z-50 py-1">
                                    <button onClick={() => handleBranchAction('view', branch)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Eye size={14} className="text-blue-500"/> View Details</button>
                                    <button onClick={() => handleBranchAction('edit', branch)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Edit3 size={14} className="text-amber-500"/> Edit Info</button>
                                    <div className="h-px bg-border my-1"></div>
                                    <button onClick={() => handleBranchAction('activate', branch)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500"/> Activate</button>
                                    <button onClick={() => handleBranchAction('suspend', branch)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><AlertTriangle size={14} className="text-orange-500"/> Suspend</button>
                                    <button onClick={() => handleBranchAction('archive', branch)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Archive size={14} className="text-slate-500"/> Archive</button>
                                    <div className="h-px bg-border my-1"></div>
                                    <button onClick={() => handleBranchAction('change_manager', branch)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><UserCog size={14} className="text-purple-500"/> Change Manager</button>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-1.5"><Users size={14}/> Manager</span>
                                <span className="font-medium">{branch.manager}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-1.5"><BookOpen size={14}/> Total Books</span>
                                <span className="font-medium">{branch.books.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-1.5"><ShieldCheck size={14}/> Members</span>
                                <span className="font-medium">{branch.members.toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-border">
                              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(branch.status)}`}>
                                {branch.status}
                              </span>
                              <button onClick={() => handleBranchAction('view', branch)} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                                Manage <Eye size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CREATE BRANCH FORM */}
                  {activeMenu === 'create' && (
                    <div className="space-y-6 max-w-3xl">
                      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                        <PlusCircle className="text-emerald-500" /> Create New Branch
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Branch Name <span className="text-red-500">*</span></label>
                          <input type="text" placeholder="e.g., Downtown Library" className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Branch Code <span className="text-red-500">*</span></label>
                          <input type="text" placeholder="e.g., DTL-01" className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">Address <span className="text-red-500">*</span></label>
                          <textarea rows={2} placeholder="Full address" className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Phone Number</label>
                          <input type="tel" placeholder="+1..." className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email Address</label>
                          <input type="email" placeholder="branch@library.com" className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Working Hours</label>
                          <input type="text" placeholder="e.g., 09:00 AM - 08:00 PM" className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Assign Manager</label>
                          <select className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-emerald-500 outline-none">
                            <option>Select Manager</option>
                            <option>John Doe</option>
                            <option>Sarah Smith</option>
                          </select>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-border flex justify-end gap-3">
                        <button className="px-5 py-2 rounded-lg border border-border bg-muted hover:bg-muted/80 font-medium">Cancel</button>
                        <button className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-2">
                          <CheckCircle size={18} /> Create Branch
                        </button>
                      </div>
                    </div>
                  )}

                  {/* USAGE AND REPORTS (Preview) */}
                  {(activeMenu === 'usage' || activeMenu === 'reports') && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                        <Activity className="text-purple-500" /> Analytics & Reports
                      </h2>
                      <div className="h-[400px] w-full border border-border rounded-xl p-6 bg-background">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={USAGE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorCML" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
                              <linearGradient id="colorNSH" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                            <RechartsTooltip contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px' }} />
                            <Area type="monotone" dataKey="CML" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorCML)" name="Central Main" />
                            <Area type="monotone" dataKey="NSH" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorNSH)" name="Northside Hub" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                  
                  {/* OTHER TABS PLACEHOLDER */}
                  {['managers', 'settings'].includes(activeMenu) && (
                     <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-2xl">
                       <Settings size={48} className="mb-4 opacity-50" />
                       <p>Detailed view for {activeMenu} is coming soon.</p>
                     </div>
                  )}
                </>
              )}


              {/* --- BRANCH DETAIL LAYOUT --- */}
              {selectedBranch && (
                <div>
                   {activeBranchTab === 'overview' && (
                     <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950/30 dark:to-blue-950/30 p-6 rounded-2xl border border-teal-100 dark:border-teal-900/50">
                           <div className="w-20 h-20 bg-white dark:bg-card border border-border shadow-sm rounded-2xl flex items-center justify-center text-teal-600 shrink-0">
                             <Building2 size={40} />
                           </div>
                           <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div><p className="text-xs text-muted-foreground uppercase">Address</p><p className="font-medium text-sm mt-1">{selectedBranch.address}</p></div>
                             <div><p className="text-xs text-muted-foreground uppercase">Manager</p><p className="font-medium text-sm mt-1 text-teal-600 dark:text-teal-400">{selectedBranch.manager}</p></div>
                             <div><p className="text-xs text-muted-foreground uppercase">Contact</p><p className="font-medium text-sm mt-1">{selectedBranch.phone} • {selectedBranch.email}</p></div>
                             <div><p className="text-xs text-muted-foreground uppercase">Working Hours</p><p className="font-medium text-sm mt-1">{selectedBranch.hours}</p></div>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { label: 'Books', val: selectedBranch.books.toLocaleString(), icon: BookOpen, c: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                            { label: 'Members', val: selectedBranch.members.toLocaleString(), icon: ShieldCheck, c: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
                            { label: 'Circulation', val: selectedBranch.circ.toLocaleString(), icon: ArrowRightLeft, c: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
                            { label: 'Fines Pending', val: `₹${selectedBranch.fine.toLocaleString()}`, icon: DollarSign, c: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/30' },
                          ].map((stat, i) => (
                            <div key={i} className="p-4 rounded-xl border border-border bg-background flex flex-col items-center justify-center text-center">
                              <div className={`p-3 rounded-full mb-2 ${stat.bg} ${stat.c}`}><stat.icon size={20} /></div>
                              <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                              <h4 className="text-xl font-bold mt-1">{stat.val}</h4>
                            </div>
                          ))}
                        </div>
                     </div>
                   )}

                   {activeBranchTab !== 'overview' && (
                     <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-2xl bg-muted/20">
                       <Activity size={48} className="mb-4 opacity-30 text-teal-500" />
                       <h3 className="text-xl font-bold text-foreground mb-1">Branch {BRANCH_DETAIL_TABS.find(t=>t.id===activeBranchTab)?.label}</h3>
                       <p className="text-sm">Manage data specific to {selectedBranch.name} here.</p>
                       <button className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">Add New Record</button>
                     </div>
                   )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
