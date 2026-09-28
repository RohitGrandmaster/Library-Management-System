'use client';
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { 
  Eye, Clock, MessageSquare, AlertTriangle, X, CheckCircle, Loader2, Send,
  LifeBuoy, Search, Filter, ArrowUpRight, Paperclip, Image as ImageIcon,
  MoreVertical, ShieldAlert, User, Building, Calendar
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const INITIAL_TICKETS = [
  { id: 'TKT-991', subject: 'Payment Gateway Failing for UPI',    tenant: 'City Reading Hub',      submitter: 'rohit_admin', priority: 'High',   status: 'Open',        age: '2 hours', replies: 2, desc: 'UPI payments are failing with error code 502. Students unable to pay fees online. Razorpay dashboard shows gateway timeout.' },
  { id: 'TKT-988', subject: 'Cannot generate student ID card',    tenant: 'Scholar Spaces',        submitter: 'library_mgr', priority: 'Medium', status: 'In-Progress', age: '1 day',   replies: 5, desc: 'The ID card generator throws a blank PDF when clicking Print. Issue started after the last update on 8th Apr.' },
  { id: 'TKT-987', subject: 'Change email address of owner',      tenant: 'The Alexandria Modern', submitter: 'alex_owner',  priority: 'Low',    status: 'Resolved',    age: '3 days',  replies: 3, desc: 'Owner wants to update their registered email from old@alex.com to new@alex.com. Identity verified via phone OTP.' },
  { id: 'TKT-980', subject: 'Seats occupancy showing wrong count',tenant: 'Quiet Corner Lib',      submitter: 'quiet_staff', priority: 'High',   status: 'Resolved',    age: '5 days',  replies: 7, desc: 'Dashboard shows 42/40 seats occupied which is impossible. Likely a sync issue after manual seat deletion.' },
  { id: 'TKT-975', subject: 'Custom report not downloading',      tenant: 'StudyNest Patna',       submitter: 'sn_admin',    priority: 'Medium', status: 'Open',        age: '10 hours', replies: 0, desc: 'When I click on download custom Excel report, it just spins forever.' },
];

type Ticket = typeof INITIAL_TICKETS[0];

function TicketDrawer({ tkt, onClose, onSave }: { tkt: Ticket; onClose: () => void; onSave: (t: Ticket) => void }) {
  const [reply, setReply] = useState('');
  const [status, setStatus] = useState(tkt.status);
  const [saving, setSaving] = useState(false);

  const handleSend = () => {
    if (!reply.trim() && status === tkt.status) return;
    setSaving(true);
    setTimeout(() => {
      onSave({ ...tkt, status, replies: tkt.replies + (reply.trim() ? 1 : 0) });
      setSaving(false);
      onClose();
    }, 1000);
  };

  const priorityColor = tkt.priority === 'High' ? 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/30 dark:text-red-400' :
                        tkt.priority === 'Medium' ? 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400' :
                        'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400';

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="w-full max-w-2xl h-full bg-white dark:bg-[#0F172A] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#1E293B]/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono text-xs font-bold text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">{tkt.id}</span>
              <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${priorityColor}`}>{tkt.priority}</span>
            </div>
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white line-clamp-1">{tkt.subject}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tenant</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate flex items-center gap-1.5"><Building size={14} className="text-gray-400"/> {tkt.tenant}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Submitter</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate flex items-center gap-1.5"><User size={14} className="text-gray-400"/> {tkt.submitter}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Time Logged</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5"><Calendar size={14} className="text-gray-400"/> {tkt.age} ago</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Replies</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5"><MessageSquare size={14} className="text-gray-400"/> {tkt.replies}</p>
            </div>
          </div>

          {/* Original Message */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                {tkt.submitter.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{tkt.submitter}</p>
                <p className="text-xs text-gray-500">Reported via Support Portal</p>
              </div>
            </div>
            <div className="ml-11 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl rounded-tl-none border border-blue-100 dark:border-blue-900/30">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{tkt.desc}</p>
            </div>
          </div>

          {/* Mock Thread */}
          {tkt.replies > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 justify-end">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">SuperAdmin (You)</p>
                  <p className="text-xs text-gray-500">Replied 1 hour ago</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                  SA
                </div>
              </div>
              <div className="mr-11 p-4 bg-purple-50/50 dark:bg-purple-900/10 rounded-2xl rounded-tr-none border border-purple-100 dark:border-purple-900/30">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">We are looking into this issue. It seems related to the upstream provider. I will keep you updated.</p>
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer / Reply Box */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0F172A]">
          <div className="mb-4">
            <label className="text-xs font-bold text-gray-500 mb-2 block">Change Ticket Status</label>
            <div className="flex gap-2">
              {['Open', 'In-Progress', 'Resolved'].map(s => (
                <button key={s} onClick={() => setStatus(s)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                  status === s 
                    ? s === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30' 
                      : s === 'In-Progress' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30'
                      : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-700 dark:text-gray-300'
                }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <textarea 
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Type your reply here to notify the tenant..."
              className="w-full h-32 p-4 pb-12 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 resize-none dark:text-white placeholder-gray-400"
            />
            <div className="absolute bottom-3 left-3 flex gap-2">
              <button className="p-1.5 text-gray-400 hover:text-purple-600 transition-colors"><Paperclip size={16}/></button>
              <button className="p-1.5 text-gray-400 hover:text-purple-600 transition-colors"><ImageIcon size={16}/></button>
            </div>
            <button 
              onClick={handleSend}
              disabled={saving}
              className="absolute bottom-3 right-3 px-4 py-1.5 bg-purple-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Update Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<Ticket | null>(null);
  const gridRef = useRef<AgGridReact>(null);

  const handleSave = (updated: Ticket) => {
    setTickets(t => t.map(x => x.id === updated.id ? updated : x));
  };

  const filtered = useMemo(() => {
    return tickets.filter(t => {
      const matchStatus = filter === 'All' || t.status === filter;
      const matchSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.tenant.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [tickets, filter, searchQuery]);

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'Subject & ID', field: 'subject', flex: 2, minWidth: 280,
      cellRenderer: (p: ICellRendererParams<Ticket>) => (
        <div className="flex flex-col justify-center h-full">
          <p className="font-bold text-gray-900 dark:text-white truncate">{p.data?.subject}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-mono text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{p.data?.id}</span>
            <span className="flex items-center gap-1 text-[11px] text-gray-500">
              <MessageSquare size={10} /> {p.data?.replies} replies
            </span>
          </div>
        </div>
      ),
    },
    { 
      headerName: 'Tenant Info', field: 'tenant', flex: 1.5, minWidth: 200,
      cellRenderer: (p: ICellRendererParams<Ticket>) => (
        <div className="flex flex-col justify-center h-full">
          <p className="font-bold text-gray-800 dark:text-gray-200 truncate">{p.data?.tenant}</p>
          <p className="text-[11px] text-gray-500 flex items-center gap-1 truncate"><User size={10}/> {p.data?.submitter}</p>
        </div>
      )
    },
    {
      headerName: 'Priority', field: 'priority', flex: 0.8, minWidth: 120,
      cellRenderer: (p: ICellRendererParams<Ticket>) => {
        if(!p.data) return null;
        const isHigh = p.data.priority === 'High';
        const isMed = p.data.priority === 'Medium';
        return (
          <div className="flex items-center h-full">
            <span className={`px-2 py-1 text-[10px] uppercase font-extrabold rounded-full border flex items-center gap-1 ${
              isHigh ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30' : 
              isMed ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30' : 
              'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30'
            }`}>
              {isHigh && <ShieldAlert size={10} />}
              {p.data.priority}
            </span>
          </div>
        );
      },
    },
    {
      headerName: 'Status & Age', field: 'status', flex: 1, minWidth: 140,
      cellRenderer: (p: ICellRendererParams<Ticket>) => {
        if(!p.data) return null;
        const isRes = p.data.status === 'Resolved';
        const isProg = p.data.status === 'In-Progress';
        return (
          <div className="flex flex-col justify-center h-full">
            <span className={`w-fit px-2 py-0.5 text-xs font-bold rounded-md flex items-center gap-1.5 ${
              isRes ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30' :
              isProg ? 'text-amber-700 bg-amber-100 dark:bg-amber-900/30' :
              'text-purple-700 bg-purple-100 dark:bg-purple-900/30'
            }`}>
              {isRes ? <CheckCircle size={10}/> : isProg ? <Loader2 size={10} className="animate-spin"/> : <AlertTriangle size={10}/>}
              {p.data.status}
            </span>
            <p className="flex items-center gap-1 text-[10px] font-medium text-gray-500 mt-1">
              <Clock size={10} /> {p.data.age} ago
            </p>
          </div>
        );
      }
    },
    {
      headerName: '', field: 'id', flex: 0.5, minWidth: 80, sortable: false, filter: false,
      cellRenderer: (p: ICellRendererParams<Ticket>) => (
        <div className="flex items-center justify-end h-full px-2">
          <button 
            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors" 
            onClick={e => { e.stopPropagation(); setSelected(p.data!); }}
          >
            <ArrowUpRight size={18} />
          </button>
        </div>
      ),
    },
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  // Stats
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgCount = tickets.filter(t => t.status === 'In-Progress').length;
  const resCount = tickets.filter(t => t.status === 'Resolved').length;

  return (
    <div className="flex flex-col w-full min-h-0 h-full gap-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <header className="shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2">
            <span>Nexus 360</span> <span className="text-gray-300">/</span> 
            <span className="text-purple-600">Super Admin</span> <span className="text-gray-300">/</span>
            <span className="text-gray-900 dark:text-white">Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center">
              <LifeBuoy size={20} />
            </div>
            Support Escalations
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">Manage and resolve tickets escalated by library admins and staff.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">Export Report</button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <div className="bg-white dark:bg-[#0F172A] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Total Tickets</p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{tickets.length}</p>
        </div>
        <div className="bg-white dark:bg-[#0F172A] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-purple-500 uppercase flex items-center gap-1.5"><AlertTriangle size={14}/> Open</p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{openCount}</p>
        </div>
        <div className="bg-white dark:bg-[#0F172A] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-amber-500 uppercase flex items-center gap-1.5"><Loader2 size={14}/> In Progress</p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{inProgCount}</p>
        </div>
        <div className="bg-white dark:bg-[#0F172A] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-emerald-500 uppercase flex items-center gap-1.5"><CheckCircle size={14}/> Resolved</p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{resCount}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 bg-white dark:bg-[#0F172A] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50 dark:bg-[#1E293B]/30">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
            {['All', 'Open', 'In-Progress', 'Resolved'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === f ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by ID, tenant or subject..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full sm:w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all dark:text-white"
            />
          </div>
        </div>

        {/* Grid Area */}
        <div className="flex-1">
          <AgGridReact
            ref={gridRef}
            theme={gridTheme}
            rowData={filtered}
            columnDefs={colDefs as any}
            rowHeight={72}
            headerHeight={48}
            onGridReady={onGridReady}
            onRowClicked={(p: any) => setSelected(p.data)}
            pagination={true}
            paginationPageSize={15}
            suppressCellFocus={true}
            className="h-full"
          />
        </div>
      </div>

      {selected && <TicketDrawer tkt={selected} onClose={() => setSelected(null)} onSave={handleSave} />}
    </div>
  );
}
