'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Info, BarChart2, ShieldCheck, FileText, Activity, CreditCard,
  Building2, Phone, Mail, Globe, MapPin, Edit3, Image as ImageIcon,
  BookOpen, Users, Map, DollarSign, Clock, AlertTriangle, File,
  Download, ArrowRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

// --- MOCK DATA ---
const LIBRARY_INFO = {
  name: 'Central City Library',
  code: 'LIB-CC-001',
  address: '123 Knowledge Avenue, Tech District, City 40001',
  contact: '+91 98765 43210',
  email: 'admin@citylibrary.com',
  website: 'www.citylibrary.com',
  regDetails: 'Govt. Reg. #987-654-321',
  description: 'A modern, fully digital smart library providing extensive resources for students, researchers, and book lovers across the city.'
};

const LIBRARY_STATS = [
  { title: 'Total Branches', value: '5', icon: Map, color: 'from-blue-500 to-cyan-500' },
  { title: 'Total Users', value: '25,400', icon: Users, color: 'from-purple-500 to-fuchsia-500' },
  { title: 'Total Books', value: '1,50,000', icon: BookOpen, color: 'from-emerald-500 to-teal-500' },
  { title: 'Total Members', value: '18,200', icon: ShieldCheck, color: 'from-orange-500 to-amber-500' },
  { title: 'Total Circulation', value: '4,50,200', icon: Activity, color: 'from-indigo-500 to-violet-500' },
  { title: 'Inventory Value', value: '₹1.2 Cr', icon: DollarSign, color: 'from-rose-500 to-red-500' },
];

const LIBRARY_RULES = [
  { label: 'Issue Limit', value: '5 Books per Member', icon: BookOpen },
  { label: 'Renewal Limit', value: '2 Times per Book', icon: Activity },
  { label: 'Issue Period', value: '14 Days', icon: Clock },
  { label: 'Grace Period', value: '2 Days', icon: ShieldCheck },
  { label: 'Reservation Limit', value: '2 Books', icon: FileText },
  { label: 'Fine Rules', value: '₹10 per day after grace period', icon: AlertTriangle },
  { label: 'Membership Rules', value: 'Valid ID and Address proof required', icon: Users },
];

const LIBRARY_DOCUMENTS = [
  { title: 'Registration Certificate', type: 'PDF', size: '2.4 MB', date: '10 Jan 2024' },
  { title: 'Library Policies 2024', type: 'DOCX', size: '1.1 MB', date: '15 Feb 2024' },
  { title: 'Terms & Conditions', type: 'PDF', size: '0.8 MB', date: '20 Feb 2024' },
  { title: 'Internal Operations Manual', type: 'PDF', size: '5.6 MB', date: '01 Mar 2024' },
];

const USAGE_DATA = [
  { month: 'Jan', usage: 4000, storage: 2400 },
  { month: 'Feb', usage: 3000, storage: 1398 },
  { month: 'Mar', usage: 2000, storage: 9800 },
  { month: 'Apr', usage: 2780, storage: 3908 },
  { month: 'May', usage: 1890, storage: 4800 },
  { month: 'Jun', usage: 2390, storage: 3800 },
];

const SUBSCRIPTION_DETAILS = {
  planName: 'Enterprise Premium',
  status: 'Active',
  startDate: '01 Jan 2024',
  expiryDate: '31 Dec 2024',
  renewalStatus: 'Auto-renewal ON',
  limits: {
    branches: { used: 5, total: 10 },
    members: { used: 18200, total: 50000 },
    storage: { used: 45, total: 100, unit: 'GB' }
  }
};

const TABS = [
  { id: 'info', label: 'Information', icon: Info },
  { id: 'stats', label: 'Statistics', icon: BarChart2 },
  { id: 'rules', label: 'Library Rules', icon: ShieldCheck },
  { id: 'docs', label: 'Documents', icon: FileText },
  { id: 'usage', label: 'Usage Analytics', icon: Activity },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
];

export default function LibraryOverviewView() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [editMode, setEditMode] = useState(false);
  const [info, setInfo] = useState(LIBRARY_INFO);
  const [notice, setNotice] = useState('');

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(current => current === message ? '' : current), 2200);
  };
  const downloadDocument = (doc: typeof LIBRARY_DOCUMENTS[number]) => {
    const blob = new Blob([`Document: ${doc.title}\nType: ${doc.type}\nSize: ${doc.size}\nUploaded: ${doc.date}`], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = doc.title.replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'.txt';
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
    notify(`${doc.title} download prepared.`);
  };

  // Animation variants
  const tabContentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
  };

  return (
    <div className="w-full max-w-full space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
            Library Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your library's core information, rules, usage, and subscription.
          </p>
        </div>
      </div>

      <div className="w-full bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {/* TOP FEATURE NAVIGATION */}
        <div className="border-b border-border bg-muted/20 p-2 sm:p-3 overflow-x-auto">
          <div className="flex min-w-max sm:min-w-0 sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center justify-center gap-2 min-w-[145px] sm:min-w-0 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-transparent text-muted-foreground hover:bg-background hover:text-foreground'
                  }`}
                >
                  <tab.icon size={17} className={isActive ? 'text-primary-foreground' : 'text-primary/70 group-hover:text-primary'} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB CONTENT */}
        <div className="min-h-[500px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-full p-5 sm:p-7 lg:p-8"
            >
              
              {/* 1. INFORMATION TAB */}
              {activeTab === 'info' && (
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Building2 className="text-blue-500" /> Library Information
                    </h2>
                    <button onClick={() => setEditMode(v => !v)} className="flex items-center gap-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                      <Edit3 size={16} /> {editMode ? 'Close Editor' : 'Edit Info'}
                    </button>
                  </div>
                  
                  {editMode && (
                    <form onSubmit={(e)=>{e.preventDefault(); setEditMode(false); notify('Library information saved.');}} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 mb-6 rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
                      {(['name','code','contact','email','website','regDetails','address','description'] as Array<keyof typeof info>).map(key => (
                        <label key={key} className={`text-sm font-medium ${key==='address'||key==='description' ? 'md:col-span-2' : ''}`}>
                          {key.replace(/([A-Z])/g,' $1')}
                          {key==='description' ? <textarea value={info[key]} rows={3} onChange={e=>setInfo({...info,[key]:e.target.value})} className="admin-input w-full mt-2"/> : <input value={info[key]} onChange={e=>setInfo({...info,[key]:e.target.value})} className="admin-input w-full mt-2"/>}
                        </label>
                      ))}
                      <div className="md:col-span-2 flex justify-end gap-2"><button type="button" onClick={()=>setEditMode(false)} className="admin-btn admin-btn-ghost">Cancel</button><button type="submit" className="admin-btn admin-btn-primary">Save Changes</button></div>
                    </form>
                  )}

                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 flex flex-col items-center justify-center border border-indigo-200 dark:border-indigo-800 shrink-0 shadow-inner">
                      <ImageIcon size={40} className="text-indigo-500/50 mb-2" />
                      <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-400">UPLOAD LOGO</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                      <div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Library Name</p><p className="font-medium text-lg">{info.name}</p></div>
                      <div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Library Code</p><p className="font-medium">{info.code}</p></div>
                      <div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin size={12}/> Address</p><p className="font-medium">{info.address}</p></div>
                      <div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><Phone size={12}/> Contact Number</p><p className="font-medium">{info.contact}</p></div>
                      <div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><Mail size={12}/> Email</p><p className="font-medium text-blue-500">{info.email}</p></div>
                      <div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><Globe size={12}/> Website</p><p className="font-medium text-blue-500">{info.website}</p></div>
                      <div className="md:col-span-2"><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><ShieldCheck size={12}/> Registration Details</p><p className="font-medium">{info.regDetails}</p></div>
                      <div className="md:col-span-2"><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><FileText size={12}/> Description</p><p className="text-sm leading-relaxed text-muted-foreground bg-muted/50 p-4 rounded-xl border border-border">{info.description}</p></div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. STATISTICS TAB */}
              {activeTab === 'stats' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BarChart2 className="text-purple-500" /> Key Statistics
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {LIBRARY_STATS.map((stat, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-background border border-border flex items-center gap-4 hover:shadow-md hover:border-primary/50 transition-all group">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <stat.icon size={24} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                          <h4 className="text-2xl font-black mt-1">{stat.value}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. RULES TAB */}
              {activeTab === 'rules' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <ShieldCheck className="text-emerald-500" /> Library Rules & Limits
                    </h2>
                    <button onClick={()=>notify('Library rule editor opened.')} className="flex items-center gap-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors">
                      <Edit3 size={16} /> Configure Rules
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {LIBRARY_RULES.map((rule, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-xl hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-background border border-border text-emerald-600 dark:text-emerald-400 shadow-sm">
                            <rule.icon size={18} />
                          </div>
                          <span className="font-medium">{rule.label}</span>
                        </div>
                        <span className="text-sm bg-background border border-border px-3 py-1 rounded-full font-semibold">{rule.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. DOCUMENTS TAB */}
              {activeTab === 'docs' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <FileText className="text-orange-500" /> Library Documents
                    </h2>
                    <label className="flex items-center gap-2 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors cursor-pointer">
                      <Download size={16} /> Upload New
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={e=>e.target.files?.[0] && notify(`Selected ${e.target.files[0].name} for upload.`)} />
                    </label>
                  </div>
                  <div className="space-y-3">
                    {LIBRARY_DOCUMENTS.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-background border border-border rounded-xl hover:shadow-sm transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-500 border border-orange-100 dark:border-orange-900">
                            <File size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{doc.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{doc.type} • {doc.size} • Uploaded: {doc.date}</p>
                          </div>
                        </div>
                        <button onClick={()=>downloadDocument(doc)} aria-label={"Download "+doc.title} className="p-2 text-muted-foreground hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-full transition-colors">
                          <Download size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. USAGE TAB */}
              {activeTab === 'usage' && (
                <div className="space-y-6 flex flex-col h-full">
                  <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                    <Activity className="text-cyan-500" /> Platform Usage Analytics
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/30">
                      <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase">Monthly API Calls</p>
                      <h4 className="text-2xl font-bold mt-1">1.2M</h4>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Storage Used</p>
                      <h4 className="text-2xl font-bold mt-1">45 GB</h4>
                    </div>
                    <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase">Avg. Daily Logins</p>
                      <h4 className="text-2xl font-bold mt-1">8,450</h4>
                    </div>
                    <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30">
                      <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase">SMS Sent</p>
                      <h4 className="text-2xl font-bold mt-1">12,400</h4>
                    </div>
                  </div>
                  <div className="flex-1 min-h-[300px] border border-border rounded-xl p-4 bg-background">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={USAGE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                        <RechartsTooltip contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="usage" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* 6. SUBSCRIPTION TAB */}
              {activeTab === 'subscription' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <CreditCard className="text-rose-500" /> Subscription & Billing
                  </h2>
                  <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-20">
                      <CreditCard size={200} />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-wider uppercase mb-3 backdrop-blur-sm">
                          {SUBSCRIPTION_DETAILS.status}
                        </div>
                        <h3 className="text-3xl font-black mb-1">{SUBSCRIPTION_DETAILS.planName}</h3>
                        <p className="text-rose-100 text-sm">Billing managed by SuperAdmin.</p>
                      </div>
                      <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20 shrink-0">
                        <div className="flex gap-8">
                          <div>
                            <p className="text-xs text-rose-200 uppercase tracking-wider mb-1">Start Date</p>
                            <p className="font-bold">{SUBSCRIPTION_DETAILS.startDate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-rose-200 uppercase tracking-wider mb-1">Expiry Date</p>
                            <p className="font-bold">{SUBSCRIPTION_DETAILS.expiryDate}</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/20">
                           <p className="text-xs text-rose-200 uppercase tracking-wider mb-1">Renewal</p>
                           <p className="font-semibold text-sm flex items-center gap-1"><ShieldCheck size={14} /> {SUBSCRIPTION_DETAILS.renewalStatus}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="p-5 border border-border bg-background rounded-xl">
                      <div className="flex justify-between items-end mb-2">
                        <p className="font-semibold text-sm">Branches</p>
                        <p className="text-xs text-muted-foreground">{SUBSCRIPTION_DETAILS.limits.branches.used} / {SUBSCRIPTION_DETAILS.limits.branches.total}</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(SUBSCRIPTION_DETAILS.limits.branches.used / SUBSCRIPTION_DETAILS.limits.branches.total) * 100}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="p-5 border border-border bg-background rounded-xl">
                      <div className="flex justify-between items-end mb-2">
                        <p className="font-semibold text-sm">Members</p>
                        <p className="text-xs text-muted-foreground">{SUBSCRIPTION_DETAILS.limits.members.used.toLocaleString()} / {SUBSCRIPTION_DETAILS.limits.members.total.toLocaleString()}</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(SUBSCRIPTION_DETAILS.limits.members.used / SUBSCRIPTION_DETAILS.limits.members.total) * 100}%` }}></div>
                      </div>
                    </div>

                    <div className="p-5 border border-border bg-background rounded-xl">
                      <div className="flex justify-between items-end mb-2">
                        <p className="font-semibold text-sm">Storage Usage</p>
                        <p className="text-xs text-muted-foreground">{SUBSCRIPTION_DETAILS.limits.storage.used}{SUBSCRIPTION_DETAILS.limits.storage.unit} / {SUBSCRIPTION_DETAILS.limits.storage.total}{SUBSCRIPTION_DETAILS.limits.storage.unit}</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${(SUBSCRIPTION_DETAILS.limits.storage.used / SUBSCRIPTION_DETAILS.limits.storage.total) * 100}%` }}></div>
                      </div>
                    </div>
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
