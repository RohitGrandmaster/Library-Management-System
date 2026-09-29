'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, FileText, Grid, RefreshCw, CheckCircle, Clock,
  AlertTriangle, Ban, Download, Upload, ShieldCheck, MoreVertical,
  Eye, Edit3, Lock, Unlock, ArrowRightLeft, CreditCard, User,
  Calendar, Phone, Mail, MapPin, Search, PlusCircle, Activity,
  Briefcase, BookOpen, AlertCircle
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_MEMBERS = [
  { id: 'MEM-001', name: 'Alice Walker', phone: '+1 234 567 8900', email: 'alice@example.com', type: 'Premium', status: 'Active', plan: 'Yearly Access', joined: '12 Jan 2024', expires: '12 Jan 2025', issuedBooks: 2, fine: 0, photo: 'https://i.pravatar.cc/150?u=alice' },
  { id: 'MEM-002', name: 'Bob Smith', phone: '+1 234 567 8901', email: 'bob@example.com', type: 'Student', status: 'Expired', plan: 'Semester Plan', joined: '01 Jul 2023', expires: '01 Jan 2024', issuedBooks: 0, fine: 50, photo: 'https://i.pravatar.cc/150?u=bob' },
  { id: 'MEM-003', name: 'Charlie Davis', phone: '+1 234 567 8902', email: 'charlie@example.com', type: 'Standard', status: 'Suspended', plan: 'Monthly Access', joined: '15 Feb 2024', expires: '15 Mar 2024', issuedBooks: 3, fine: 150, photo: 'https://i.pravatar.cc/150?u=charlie' },
  { id: 'MEM-004', name: 'Diana Prince', phone: '+1 234 567 8903', email: 'diana@example.com', type: 'Faculty', status: 'Active', plan: 'Lifetime Access', joined: '05 Mar 2020', expires: 'Never', issuedBooks: 5, fine: 0, photo: 'https://i.pravatar.cc/150?u=diana' },
];

const SIDEBAR_MENU = [
  { id: 'all', label: 'All Members', icon: Users },
  { id: 'add', label: 'Add Member', icon: UserPlus },
  { id: 'categories', label: 'Member Categories', icon: Grid },
  { id: 'departments', label: 'Departments', icon: Briefcase },
  { id: 'plans', label: 'Membership Plans', icon: ShieldCheck },
  { id: 'renewal', label: 'Membership Renewal', icon: RefreshCw },
  { id: 'active', label: 'Active Members', icon: CheckCircle },
  { id: 'expired', label: 'Expired Members', icon: Clock },
  { id: 'suspended', label: 'Suspended Members', icon: AlertTriangle },
  { id: 'blocked', label: 'Blocked Members', icon: Ban },
  { id: 'import', label: 'Import Members', icon: Upload },
  { id: 'export', label: 'Export Members', icon: Download },
  { id: 'docs', label: 'Member Documents', icon: FileText },
];

const DETAIL_TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'membership', label: 'Membership' },
  { id: 'books', label: 'Current Books' },
  { id: 'history_issue', label: 'Issue History' },
  { id: 'history_fine', label: 'Fine History' },
];

export default function MemberManagementView() {
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [activeMenu, setActiveMenu] = useState('all');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState('profile');
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const displayMembers = members.filter(m => {
    if (activeMenu === 'all') return true;
    if (activeMenu === 'active') return m.status === 'Active';
    if (activeMenu === 'expired') return m.status === 'Expired';
    if (activeMenu === 'suspended') return m.status === 'Suspended';
    if (activeMenu === 'blocked') return m.status === 'Blocked';
    const q = search.trim().toLowerCase();
    return !q || [m.id,m.name,m.phone,m.email,m.type].some(v=>v.toLowerCase().includes(q));
  });

  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(v => v === message ? '' : v), 2200); };

  const getStatusColor = (status: string) => {
    if (status === 'Active') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200';
    if (status === 'Expired') return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400 border-slate-200';
    if (status === 'Suspended') return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200';
    if (status === 'Blocked') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200';
    return 'bg-gray-100 text-gray-700';
  };

  const handleAction = (action: string, member: any) => {
    setActionMenuOpen(null);
    if (action === 'view') {
      setSelectedMember(member);
      setActiveDetailTab('profile');
    } else {
      const statusMap: Record<string,string> = { suspend:'Suspended', reactivate:'Active', block:'Blocked' };
      if (statusMap[action]) setMembers(items=>items.map(m=>m.id===member.id?{...m,status:statusMap[action]}:m));
      if (action === 'renew') setMembers(items=>items.map(m=>m.id===member.id?{...m,status:'Active',expires:'12 months from today'}:m));
      notify(action.replace('_',' ') + ' completed for ' + member.name + '.');
    }
  };

  return (
    <div className="w-full max-w-full space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            {selectedMember ? `${selectedMember.name} - Details` : 'Members Management'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedMember ? 'View and manage complete member profile and history.' : 'Comprehensive center for all library members, plans, and actions.'}
          </p>
        </div>
        <div className="flex gap-2">
          {selectedMember ? (
             <button onClick={() => setSelectedMember(null)} className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 shadow-sm transition-colors">
               <Users size={16} /> Back to Members
             </button>
          ) : (
             <button onClick={() => setActiveMenu('add')} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 shadow-sm transition-colors">
               <UserPlus size={16} /> Add Member
             </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* SIDEBAR SUB-MENU */}
        <div className="w-full lg:w-64 flex flex-col gap-1 shrink-0 bg-card border border-border p-3 rounded-2xl shadow-sm h-[650px] overflow-y-auto custom-scrollbar">
          {SIDEBAR_MENU.map((menu) => {
             const isActive = !selectedMember && activeMenu === menu.id;
             return (
              <button
                key={menu.id}
                onClick={() => { setActiveMenu(menu.id); setSelectedMember(null); }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-purple-600 text-white shadow-md scale-[1.02]' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <menu.icon size={18} className={isActive ? 'text-white' : 'text-purple-500/70'} />
                <span className="font-medium text-sm">{menu.label}</span>
              </button>
             );
          })}
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 w-full bg-card border border-border rounded-2xl shadow-sm overflow-hidden min-h-[650px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMember ? `detail-${activeDetailTab}` : `main-${activeMenu}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              
              {/* --- LISTING MODES --- */}
              {!selectedMember && ['all', 'active', 'expired', 'suspended', 'blocked'].includes(activeMenu) && (
                <div className="flex flex-col h-full p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2 capitalize">
                      <Users className="text-purple-500" /> {activeMenu} Members
                    </h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input type="text" WORKSPACE="Search members by ID, Name, Phone..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-72" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayMembers.map(member => (
                      <div key={member.id} className="relative bg-background border border-border rounded-2xl p-5 hover:shadow-lg hover:border-purple-500/50 transition-all flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <img src={member.photo} alt={member.name} className="w-16 h-16 rounded-2xl border-2 border-muted object-cover shadow-sm" />
                            <div>
                              <h3 className="font-bold text-lg leading-tight">{member.name}</h3>
                              <p className="text-xs text-muted-foreground mt-0.5">{member.id} • {member.type}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getStatusColor(member.status)}`}>{member.status}</span>
                                {member.fine > 0 && <span className="text-[10px] font-bold text-red-500 flex items-center gap-0.5"><AlertCircle size={10}/> Fine: ₹{member.fine}</span>}
                              </div>
                            </div>
                          </div>
                          
                          {/* MEGAMENU ACTION BUTTON */}
                          <div className="relative">
                            <button onClick={() => setActionMenuOpen(actionMenuOpen === member.id ? null : member.id)} className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground">
                              <MoreVertical size={20} />
                            </button>
                            {actionMenuOpen === member.id && (
                              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl z-50 py-2">
                                <button onClick={() => handleAction('view', member)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Eye size={16} className="text-blue-500"/> View Details</button>
                                <button onClick={() => handleAction('edit', member)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Edit3 size={16} className="text-amber-500"/> Edit Member</button>
                                <button onClick={() => handleAction('renew', member)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><RefreshCw size={16} className="text-teal-500"/> Renew Membership</button>
                                <div className="h-px bg-border my-1"></div>
                                <button onClick={() => handleAction('issue', member)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><ArrowRightLeft size={16} className="text-indigo-500"/> Issue Book</button>
                                <button onClick={() => handleAction('return', member)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Return Book</button>
                                <button onClick={() => handleAction('reserve', member)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Clock size={16} className="text-orange-500"/> Reserve Book</button>
                                <button onClick={() => handleAction('collect_fine', member)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><CreditCard size={16} className="text-rose-500"/> Collect Fine</button>
                                <div className="h-px bg-border my-1"></div>
                                <button onClick={() => handleAction('suspend', member)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><AlertTriangle size={16} className="text-yellow-600"/> Suspend</button>
                                <button onClick={() => handleAction('reactivate', member)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Unlock size={16} className="text-emerald-600"/> Reactivate</button>
                                <button onClick={() => handleAction('block', member)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2 text-red-500"><Ban size={16}/> Block Permanently</button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 mt-2">
                           <p className="text-sm flex items-center gap-2 text-muted-foreground"><Phone size={14}/> {member.phone}</p>
                           <p className="text-sm flex items-center gap-2 text-muted-foreground"><Mail size={14}/> {member.email}</p>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                           <div className="text-sm">
                             <span className="text-muted-foreground">Books Issued: </span>
                             <span className="font-bold text-foreground">{member.issuedBooks}</span>
                           </div>
                           <button onClick={() => handleAction('view', member)} className="text-sm font-bold text-purple-600 hover:underline">Manage Profile</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- ADD MEMBER FORM --- */}
              {!selectedMember && activeMenu === 'add' && (
                <div className="p-6 md:p-8 h-full bg-background overflow-y-auto">
                  <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                    <UserPlus className="text-purple-500" /> New Member Registration
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     
                     {/* Photo Upload */}
                     <div className="flex flex-col items-center gap-4">
                       <div className="w-48 h-48 rounded-3xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center text-muted-foreground hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all cursor-pointer">
                         <Upload size={32} className="mb-2" />
                         <span className="text-sm font-medium">Upload Photo</span>
                       </div>
                       <p className="text-xs text-muted-foreground text-center px-4">JPG or PNG. Max size 2MB.</p>
                     </div>

                     <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div className="space-y-1.5">
                         <label className="text-sm font-medium">Member ID <span className="text-red-500">*</span></label>
                         <input type="text" WORKSPACE="e.g. MEM-005" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-purple-500 outline-none" />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-sm font-medium">Full Name <span className="text-red-500">*</span></label>
                         <input type="text" WORKSPACE="Enter full name" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-purple-500 outline-none" />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-sm font-medium">Date of Birth</label>
                         <input type="date" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-purple-500 outline-none" />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-sm font-medium">Gender</label>
                         <select className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-purple-500 outline-none"><option>Male</option><option>Female</option><option>Other</option></select>
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-sm font-medium">Phone <span className="text-red-500">*</span></label>
                         <input type="tel" WORKSPACE="+1..." className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-purple-500 outline-none" />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-sm font-medium">Email</label>
                         <input type="email" WORKSPACE="example@domain.com" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-purple-500 outline-none" />
                       </div>
                       <div className="space-y-1.5 md:col-span-2">
                         <label className="text-sm font-medium">Address</label>
                         <textarea rows={2} WORKSPACE="Full address..." className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-purple-500 outline-none" />
                       </div>
                       
                       <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-border">
                         <h3 className="font-bold mb-4 flex items-center gap-2"><ShieldCheck size={18} className="text-teal-500"/> Academic & Membership Details</h3>
                       </div>
                       
                       <div className="space-y-1.5">
                         <label className="text-sm font-medium">Department / Group</label>
                         <select className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-purple-500 outline-none"><option>Computer Science</option><option>Arts</option></select>
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-sm font-medium">Course / Class</label>
                         <input type="text" WORKSPACE="e.g. BCA 2nd Year" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-purple-500 outline-none" />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-sm font-medium">Membership Type <span className="text-red-500">*</span></label>
                         <select className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-purple-500 outline-none"><option>Premium</option><option>Student</option></select>
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-sm font-medium">Membership Plan <span className="text-red-500">*</span></label>
                         <select className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-purple-500 outline-none"><option>Yearly Access</option><option>Lifetime Access</option></select>
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-sm font-medium">Emergency Contact</label>
                         <input type="text" WORKSPACE="Name & Phone" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-purple-500 outline-none" />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-sm font-medium">Status</label>
                         <select className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-purple-500 outline-none"><option>Active</option><option>Suspended</option></select>
                       </div>

                       <div className="md:col-span-2 pt-6 flex justify-end gap-3">
                         <button type="button" onClick={()=>notify("Member form reset.")} className="px-6 py-2.5 rounded-xl border border-border bg-muted hover:bg-muted/80 font-medium">Reset</button>
                         <button type="button" onClick={()=>{const id="MEM-"+String(members.length+1).padStart(3,"0"); setMembers(items=>[...items,{id,name:"New Member "+(members.length+1),phone:"+91 9000000000",email:"newmember@library.com",type:"Standard",status:"Active",plan:"Monthly Access",joined:"29 Sep 2026",expires:"29 Oct 2026",issuedBooks:0,fine:0,photo:"https://i.pravatar.cc/150?u="+id}]); notify("Member registered successfully."); setActiveMenu("all");}} className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium flex items-center gap-2 shadow-md"><CheckCircle size={18}/> Register Member</button>
                       </div>
                     </div>
                  </div>
                </div>
              )}

              {/* --- MEMBER SUB-WORKSPACES --- */}
              {!selectedMember && !['all', 'active', 'expired', 'suspended', 'blocked', 'add'].includes(activeMenu) && (
                <div className="p-6 h-full bg-background space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold capitalize">{activeMenu.replace('_',' ')}</h2>
                      <p className="text-sm text-muted-foreground">Admin workspace for {activeMenu.replace('_',' ')}.</p>
                    </div>
                    {(activeMenu === 'import' || activeMenu === 'export') && <div className="flex gap-2">
                      {activeMenu === 'import' && <label className="admin-btn admin-btn-primary cursor-pointer">Import CSV<input type="file" accept=".csv,text/csv" className="hidden" onChange={e=>e.target.files?.[0] && notify('Imported '+e.target.files[0].name+'.')} /></label>}
                      {activeMenu === 'export' && <button onClick={()=>{const csv=members.map(m=>Object.values(m).join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='members.csv';a.click();URL.revokeObjectURL(url);notify('Member CSV exported.');}} className="admin-btn admin-btn-primary">Export CSV</button>}
                    </div>}
                  </div>
                  {activeMenu === 'renewal' && <div className="space-y-3">{members.filter(m=>m.status!=='Blocked').map(member=><div key={member.id} className="admin-card p-4 flex flex-col md:flex-row md:items-center gap-3"><div className="flex-1"><b>{member.name}</b><div className="text-xs text-muted-foreground">{member.id} • Expires: {member.expires}</div></div><button onClick={()=>{setMembers(items=>items.map(m=>m.id===member.id?{...m,status:'Active',expires:'29 Sep 2027'}:m));notify('Membership renewed for '+member.name+'.');}} className="admin-btn admin-btn-primary">Renew</button></div>)}</div>}
                  {activeMenu !== 'renewal' && activeMenu !== 'import' && activeMenu !== 'export' && <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[
                      ['Member Categories',['Premium','Student','Standard','Faculty']],
                      ['Departments',['Computer Science','Commerce','Humanities','Science']],
                      ['Membership Plans',['Monthly Access','Semester Plan','Yearly Access','Lifetime Access']],
                      ['Member Documents',['Identity Proof','Address Proof','Membership Card','Consent Form']]
                    ].find(x=>x[0].toLowerCase().replace(/ /g,'_').includes(activeMenu.replace('_','_')))?.[1]?.map((item:string)=><div key={item} className="admin-card p-4"><b>{item}</b><p className="text-xs text-muted-foreground mt-1">Configured in Admin workspace.</p></div>)}
                  </div>}
                </div>
              )}

              {/* --- MEMBER DETAILED PROFILE VIEW --- */}
              {selectedMember && (
                <div className="flex flex-col h-full bg-background overflow-y-auto">
                   
                   <div className="p-6 border-b border-border bg-card flex flex-col md:flex-row gap-6 items-start md:items-center">
                     <img src={selectedMember.photo} alt={selectedMember.name} className="w-24 h-24 rounded-3xl border-4 border-background shadow-md object-cover shrink-0" />
                     <div className="flex-1">
                       <h2 className="text-2xl font-bold">{selectedMember.name}</h2>
                       <p className="text-sm text-muted-foreground">{selectedMember.id} • {selectedMember.type}</p>
                       <div className="flex gap-4 mt-3">
                         <span className={`px-2.5 py-0.5 text-xs font-bold rounded border ${getStatusColor(selectedMember.status)}`}>{selectedMember.status}</span>
                         <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={12}/> Expires: {selectedMember.expires}</span>
                       </div>
                     </div>
                     <div className="flex gap-2">
                       <button onClick={()=>notify("Quick Issue workflow opened for "+selectedMember.name+".")} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium shadow-sm flex items-center gap-2"><ArrowRightLeft size={16}/> Quick Issue</button>
                     </div>
                   </div>

                   <div className="p-6 border-b border-border bg-card/50 overflow-x-auto">
                     <div className="flex gap-2 min-w-max">
                       {DETAIL_TABS.map(tab => (
                         <button
                           key={tab.id}
                           onClick={() => setActiveDetailTab(tab.id)}
                           className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                             activeDetailTab === tab.id
                             ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                             : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                           }`}
                         >
                           {tab.label}
                         </button>
                       ))}
                     </div>
                   </div>

                   <div className="p-6">
                     {activeDetailTab === 'profile' && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="p-5 border border-border rounded-xl bg-card space-y-4">
                           <h3 className="font-bold flex items-center gap-2"><User size={18} className="text-purple-500"/> Personal Information</h3>
                           <div className="space-y-2 text-sm">
                             <div className="flex justify-between pb-2 border-b border-border"><span className="text-muted-foreground">Phone</span><span className="font-medium">{selectedMember.phone}</span></div>
                             <div className="flex justify-between pb-2 border-b border-border"><span className="text-muted-foreground">Email</span><span className="font-medium text-blue-500">{selectedMember.email}</span></div>
                             <div className="flex justify-between pb-2"><span className="text-muted-foreground">Address</span><span className="font-medium text-right max-w-[200px]">123 Example St, NY</span></div>
                           </div>
                         </div>
                         
                         <div className="p-5 border border-border rounded-xl bg-card space-y-4">
                           <h3 className="font-bold flex items-center gap-2"><ShieldCheck size={18} className="text-teal-500"/> Membership Overview</h3>
                           <div className="space-y-2 text-sm">
                             <div className="flex justify-between pb-2 border-b border-border"><span className="text-muted-foreground">Plan</span><span className="font-medium">{selectedMember.plan}</span></div>
                             <div className="flex justify-between pb-2 border-b border-border"><span className="text-muted-foreground">Joined On</span><span className="font-medium">{selectedMember.joined}</span></div>
                             <div className="flex justify-between pb-2"><span className="text-muted-foreground">Pending Fines</span><span className="font-bold text-red-500">₹{selectedMember.fine}</span></div>
                           </div>
                         </div>
                       </div>
                     )}

                     {activeDetailTab === 'membership' && (
                       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                         {[['Plan',selectedMember.plan],['Joined',selectedMember.joined],['Expiry',selectedMember.expires],['Status',selectedMember.status],['Issued Books',String(selectedMember.issuedBooks)],['Fine Due','₹'+selectedMember.fine]].map(([label,value])=><div key={label} className="p-5 border border-border rounded-xl bg-card"><p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p><p className="text-lg font-bold mt-1">{value}</p></div>)}
                       </div>
                     )}
                     {activeDetailTab === 'current_books' && (
                       <div className="overflow-x-auto border border-border rounded-xl">
                         <table className="w-full min-w-[620px] text-sm"><thead className="bg-muted/40 text-left"><tr><th className="p-3">Book</th><th className="p-3">Issued On</th><th className="p-3">Due Date</th><th className="p-3">Status</th></tr></thead>
                         <tbody>{[['Clean Code','24 Sep 2026','08 Oct 2026','Issued'],['Python Crash Course','20 Sep 2026','04 Oct 2026','Due Soon']].map(r=><tr key={r[0]} className="border-t border-border"><td className="p-3 font-semibold">{r[0]}</td><td className="p-3">{r[1]}</td><td className="p-3">{r[2]}</td><td className="p-3"><span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">{r[3]}</span></td></tr>)}</tbody></table>
                       </div>
                     )}
                     {activeDetailTab === 'issue_history' && (
                       <div className="space-y-3">{[['The Alchemist','22 Sep 2026','Returned'],['Sapiens','10 Sep 2026','Returned'],['Clean Code','24 Sep 2026','Issued']].map(r=><div key={r[0]+r[1]} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border border-border rounded-xl bg-card"><div><b>{r[0]}</b><p className="text-xs text-muted-foreground mt-1">Issue date: {r[1]}</p></div><span className="text-xs font-bold">{r[2]}</span></div>)}</div>
                     )}
                     {activeDetailTab === 'fine_history' && (
                       <div className="overflow-x-auto border border-border rounded-xl">
                         <table className="w-full min-w-[560px] text-sm"><thead className="bg-muted/40 text-left"><tr><th className="p-3">Fine ID</th><th className="p-3">Reason</th><th className="p-3">Amount</th><th className="p-3">Status</th></tr></thead>
                         <tbody>{[['F-102','Late return','₹50','Paid'],['F-118','Lost-book charge','₹200','Pending']].map(r=><tr key={r[0]} className="border-t border-border"><td className="p-3 font-semibold">{r[0]}</td><td className="p-3">{r[1]}</td><td className="p-3 font-bold">{r[2]}</td><td className="p-3">{r[3]}</td></tr>)}</tbody></table>
                       </div>
                     )}
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
