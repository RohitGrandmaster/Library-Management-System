
'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import CreateBranchForm from './CreateBranchForm';
import BranchDetailsView from './BranchDetailsView';
import {
  Building2, Search, Filter, Plus, Building, Users, Settings,
  BarChart3, Package, FileClock, RefreshCw, Save, UserPlus, Download,
  CheckCircle2, MapPin
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  'All Branches', 'Create Branch', 'Active Branches', 'Pending Branches',
  'Suspended Branches', 'Archived Branches', 'Branch Managers', 'Branch Settings',
  'Branch Usage', 'Branch Inventory', 'Branch Audit'
];

const initialBranches = [
  { id: '1', name: 'Kankarbagh Branch', code: 'SN-KKB', parent: 'StudyNest Patna', location: 'Patna, Bihar', manager: 'Amit Kumar', status: 'Active', capacity: 300, occupied: 250 },
  { id: '2', name: 'Boring Road Branch', code: 'SN-BOR', parent: 'StudyNest Patna', location: 'Patna, Bihar', manager: 'Neha Singh', status: 'Active', capacity: 200, occupied: 180 },
  { id: '3', name: 'Delhi South Extension', code: 'RD-DSE', parent: 'Readers Den Delhi', location: 'New Delhi', manager: 'Rajiv Sharma', status: 'Pending', capacity: 500, occupied: 0 },
  { id: '4', name: 'Mumbai Andheri West', code: 'LM-MAW', parent: 'LibroHub Mumbai', location: 'Mumbai, MH', manager: 'Priya Desai', status: 'Suspended', capacity: 400, occupied: 400 },
  { id: '5', name: 'Bangalore Koramangala', code: 'BH-KRM', parent: 'BookHaven BLR', location: 'Bangalore, KA', manager: 'Rahul Iyer', status: 'Active', capacity: 600, occupied: 540 },
  { id: '6', name: 'Pune Deccan', code: 'PR-DCN', parent: 'Pune Readers', location: 'Pune, MH', manager: 'Sneha Kulkarni', status: 'Active', capacity: 250, occupied: 150 },
  { id: '7', name: 'Kolkata Salt Lake', code: 'KL-SLK', parent: 'Knowledge Lounge', location: 'Kolkata, WB', manager: 'Ayan Das', status: 'Archived', capacity: 350, occupied: 0 },
  { id: '8', name: 'Chennai Anna Nagar', code: 'CN-AN', parent: 'Chennai Nexus', location: 'Chennai, TN', manager: 'Karthik N', status: 'Active', capacity: 450, occupied: 300 },
  { id: '9', name: 'Hyderabad Gachibowli', code: 'HL-GAC', parent: 'Hyd Library', location: 'Hyderabad, TS', manager: 'Swathi Reddy', status: 'Active', capacity: 800, occupied: 780 },
  { id: '10', name: 'Ahmedabad Navrangpura', code: 'AL-NVR', parent: 'Ahm Library', location: 'Ahmedabad, GJ', manager: 'Vikram Patel', status: 'Pending', capacity: 300, occupied: 0 },
  { id: '11', name: 'Jaipur Malviya Nagar', code: 'JP-MLV', parent: 'Jaipur Readers', location: 'Jaipur, RJ', manager: 'Ritu Sharma', status: 'Active', capacity: 150, occupied: 100 },
  { id: '12', name: 'Lucknow Gomti Nagar', code: 'LK-GOM', parent: 'Lucknow Library', location: 'Lucknow, UP', manager: 'Sandeep Singh', status: 'Active', capacity: 200, occupied: 120 },
  { id: '13', name: 'Chandigarh Sector 17', code: 'CH-S17', parent: 'Chandigarh Central', location: 'Chandigarh', manager: 'Preeti Kaur', status: 'Suspended', capacity: 400, occupied: 100 },
  { id: '14', name: 'Indore Vijay Nagar', code: 'IN-VJY', parent: 'Indore InfoHub', location: 'Indore, MP', manager: 'Manish Jain', status: 'Active', capacity: 320, occupied: 290 },
  { id: '15', name: 'Bhopal MP Nagar', code: 'BP-MPN', parent: 'Bhopal Library', location: 'Bhopal, MP', manager: 'Anjali Verma', status: 'Active', capacity: 180, occupied: 150 },
  { id: '16', name: 'Nagpur Dharampeth', code: 'NG-DHM', parent: 'Nagpur Nexus', location: 'Nagpur, MH', manager: 'Ramesh Rao', status: 'Active', capacity: 220, occupied: 110 }
];

const inventory = [
  { code: 'INV-001', title: 'Books', total: 8400, available: 8120, issued: 240, damaged: 20, status: 'Healthy' },
  { code: 'INV-002', title: 'Reference Books', total: 920, available: 900, issued: 12, damaged: 8, status: 'Healthy' },
  { code: 'INV-003', title: 'Magazines', total: 460, available: 430, issued: 20, damaged: 10, status: 'Watch' },
  { code: 'INV-004', title: 'Digital Assets', total: 1280, available: 1280, issued: 0, damaged: 0, status: 'Healthy' },
];

const auditLogs = [
  { id: 'AUD-1001', action: 'Branch created', actor: 'Super Admin', target: 'Delhi South Extension', time: 'Today, 10:42 AM', severity: 'info' },
  { id: 'AUD-1002', action: 'Manager changed', actor: 'Super Admin', target: 'Boring Road Branch', time: 'Today, 09:20 AM', severity: 'info' },
  { id: 'AUD-1003', action: 'Branch suspended', actor: 'Super Admin', target: 'Mumbai Andheri West', time: 'Yesterday, 05:12 PM', severity: 'warning' },
  { id: 'AUD-1004', action: 'Limits updated', actor: 'Super Admin', target: 'Kankarbagh Branch', time: 'Yesterday, 03:05 PM', severity: 'info' },
];

export default function BranchesPage() {
  const [branches, setBranches] = useState(initialBranches);
  const [activeMenu, setActiveMenu] = useState('All Branches');
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [managerSearch, setManagerSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryData, setInventoryData] = useState(inventory);
  const [auditFilter, setAuditFilter] = useState('All');
  const [settings, setSettings] = useState({
    autoAssignManager: true,
    allowSelfRegistration: false,
    allowTransfers: true,
    enforceBranchLimits: true,
    defaultWorkingHours: '09:00 AM - 08:00 PM',
    timezone: 'Asia/Kolkata',
    notificationMode: 'Email + In-app',
  });
  const [usageTick, setUsageTick] = useState(0);
  const gridRef = useRef<AgGridReact>(null);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  };

  const updateBranchStatus = (id: string, status: string) => {
    setBranches(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    notify(`Branch status changed to ${status}.`);
  };

  const selectedBranch = branches.find(b => b.id === selectedBranchId);

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'Branch Details', field: 'name', flex: 2, minWidth: 240,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-3 h-full cursor-pointer group min-w-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-sm group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm shrink-0">
            {p.data?.name.substring(0,2).toUpperCase()}
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <p className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-tight truncate">{p.data?.name}</p>
            <p className="text-[11px] text-gray-500 font-semibold truncate">{p.data?.code} | {p.data?.parent}</p>
          </div>
        </div>
      ),
    },
    {
      headerName: 'Location & Manager', field: 'location', flex: 1.5, minWidth: 180,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex flex-col justify-center h-full min-w-0">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate">{p.data?.location}</p>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">Mgr: {p.data?.manager || 'Unassigned'}</p>
        </div>
      )
    },
    {
      headerName: 'Status', field: 'status', flex: 1, minWidth: 120,
      cellRenderer: (p: ICellRendererParams) => {
        let colors = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        if (p.data?.status === 'Active') colors = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
        if (p.data?.status === 'Pending') colors = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800';
        if (p.data?.status === 'Suspended') colors = 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800';
        if (p.data?.status === 'Archived') colors = 'bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300 border border-slate-200 dark:border-slate-800';
        return <div className="flex items-center h-full"><span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${colors}`}>{p.data?.status}</span></div>
      }
    },
    {
      headerName: 'Utilization (Capacity)', field: 'occupied', flex: 1.5, minWidth: 150,
      cellRenderer: (p: ICellRendererParams) => {
        const pct = Math.round(((p.data?.occupied ?? 0) / (p.data?.capacity ?? 1)) * 100);
        return <div className="flex flex-col justify-center h-full gap-1.5 w-full pr-4 min-w-0">
          <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300 gap-2"><span>{p.data?.occupied} / {p.data?.capacity}</span><span className={pct > 90 ? 'text-red-600' : 'text-emerald-600'}>{pct}%</span></div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div className={`h-full ${pct > 90 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, pct)}%` }} /></div>
        </div>;
      }
    }
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => e.api.sizeColumnsToFit(), []);
  const getFilteredBranches = () => {
    if (activeMenu === 'Pending Branches') return branches.filter(b => b.status === 'Pending');
    if (activeMenu === 'Active Branches') return branches.filter(b => b.status === 'Active');
    if (activeMenu === 'Suspended Branches') return branches.filter(b => b.status === 'Suspended');
    if (activeMenu === 'Archived Branches') return branches.filter(b => b.status === 'Archived');
    return branches;
  };

  const handleCreated = (branch: any) => {
    setBranches(prev => [...prev, branch]);
    setActiveMenu('All Branches');
    notify('Branch created successfully.');
  };

  const managers = branches.filter(b => !managerSearch || [b.manager, b.name, b.location].join(' ').toLowerCase().includes(managerSearch.toLowerCase()));
  const inventoryRows = inventoryData.filter(i => !inventorySearch || [i.code, i.title].join(' ').toLowerCase().includes(inventorySearch.toLowerCase()));
  const filteredInventoryRows = inventoryRows;
  const filteredAudit = auditFilter === 'All' ? auditLogs : auditLogs.filter(x => x.severity === auditFilter.toLowerCase());

  if (selectedBranch) {
    return <BranchDetailsView branch={selectedBranch} onBack={() => setSelectedBranchId(null)} onStatusChange={status => updateBranchStatus(selectedBranch.id, status)} />;
  }

  const pageTitleIcon = activeMenu === 'Branch Managers' ? <Users size={28} className="text-indigo-600" />
    : activeMenu === 'Branch Settings' ? <Settings size={28} className="text-indigo-600" />
    : activeMenu === 'Branch Usage' ? <BarChart3 size={28} className="text-indigo-600" />
    : activeMenu === 'Branch Inventory' ? <Package size={28} className="text-indigo-600" />
    : activeMenu === 'Branch Audit' ? <FileClock size={28} className="text-indigo-600" />
    : <Building size={28} className="text-indigo-600" />;

  return (
    <div className="flex flex-col gap-6 w-full min-w-0 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 min-w-0">
        <div className="min-w-0">
          <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"><span>Nexus 360</span><span>/</span><span className="text-indigo-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Branches</span></div>
          <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3 min-w-0"><div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl shadow-sm border border-indigo-200/50 shrink-0">{pageTitleIcon}</div><span className="truncate">{activeMenu === 'Create Branch' ? 'Create New Branch' : activeMenu}</span></h1>
        </div>
        <button onClick={() => setActiveMenu('Create Branch')} className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all"><Plus size={18} /> Register New Branch</button>
      </div>

      <div className="flex gap-1.5 pb-2 pt-1 px-1 overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {SUB_MENUS.map(menu => <button key={menu} onClick={() => setActiveMenu(menu)} className={`shrink-0 px-3 py-2 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all shadow-sm ${activeMenu === menu ? 'bg-indigo-600 text-white shadow-indigo-600/20' : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-indigo-50 dark:hover:bg-[#1E293B] hover:text-indigo-600'}`}>{menu}</button>)}
      </div>

      {activeMenu === 'Create Branch' && <CreateBranchForm onCancel={() => setActiveMenu('All Branches')} onCreated={handleCreated} />}

      {['All Branches','Active Branches','Pending Branches','Suspended Branches','Archived Branches'].includes(activeMenu) && (
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col w-full min-w-0 min-h-[520px]">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-[#0D1F3C]">
            <div className="relative w-full sm:max-w-xl"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search branches by name, code, parent or location..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none" onChange={e => gridRef.current?.api.setGridOption('quickFilterText', e.target.value)} /></div>
            <button onClick={() => { gridRef.current?.api.setFilterModel(null); gridRef.current?.api.setGridOption('quickFilterText', ''); }} className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200"><Filter size={16} /> Reset Filters</button>
          </div>
          <div className="flex-1 w-full min-h-[420px] relative"><AgGridReact ref={gridRef} theme={gridTheme} rowData={getFilteredBranches()} columnDefs={colDefs} rowHeight={72} headerHeight={52} onGridReady={onGridReady} onGridSizeChanged={e => e.api.sizeColumnsToFit()} onRowClicked={p => setSelectedBranchId(p.data!.id)} pagination paginationPageSize={15} rowClass="cursor-pointer" /></div>
        </div>
      )}

      {activeMenu === 'Branch Managers' && (
        <section className="w-full bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 md:items-center md:justify-between"><div><h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Branch Managers</h2><p className="text-xs text-gray-500 mt-1">Review assignments and manage ownership for every branch.</p></div><div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto"><input value={managerSearch} onChange={e=>setManagerSearch(e.target.value)} placeholder="Search manager or branch" className="w-full sm:w-72 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E293B] text-sm"/><button onClick={()=>{ const target=window.prompt('Branch name to assign a manager to', branches[0]?.name || ''); const name=window.prompt('New manager name'); if(target && name && name.trim()){ setBranches(prev=>prev.map(b=>b.name.toLowerCase()===target.toLowerCase()?{...b,manager:name.trim()}:b)); notify('Manager assigned successfully.'); } }} className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2"><UserPlus size={16}/> Assign Manager</button></div></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-5">{managers.map(b=><div key={b.id} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-bold text-gray-900 dark:text-white truncate">{b.manager || 'Unassigned'}</p><p className="text-xs text-gray-500 truncate">{b.name}</p></div><span className={`text-[10px] font-bold px-2 py-1 rounded-full ${b.status==='Active'?'bg-emerald-100 text-emerald-700':'bg-gray-100 text-gray-600'}`}>{b.status}</span></div><div className="mt-4 flex items-center gap-2 text-xs text-gray-500"><MapPin size={14}/> {b.location}</div><button onClick={()=>{ const next=window.prompt(`New manager for ${b.name}`, b.manager || ''); if(next && next.trim()){ setBranches(prev=>prev.map(x=>x.id===b.id?{...x,manager:next.trim()}:x)); notify('Manager updated successfully.'); } }} className="mt-4 w-full py-2 rounded-lg border border-indigo-200 text-indigo-600 font-bold text-xs hover:bg-indigo-50">Change Manager</button></div>)}</div>
        </section>
      )}

      {activeMenu === 'Branch Settings' && (
        <section className="w-full bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl p-5 sm:p-7"><div className="mb-6"><h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Branch Settings</h2><p className="text-xs text-gray-500 mt-1">Default controls applied across branch operations.</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[
          ['autoAssignManager','Auto-assign first available manager'],['allowSelfRegistration','Allow branch self-registration'],['allowTransfers','Allow inter-branch transfers'],['enforceBranchLimits','Enforce subscription branch limits']
        ].map(([key,label])=><label key={key} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700"><span className="font-bold text-sm text-gray-800 dark:text-gray-200">{label}</span><input type="checkbox" checked={Boolean((settings as any)[key])} onChange={e=>setSettings(s=>({...s,[key]:e.target.checked}))} className="h-5 w-5 accent-indigo-600"/></label>)}</div><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"><input value={settings.defaultWorkingHours} onChange={e=>setSettings(s=>({...s,defaultWorkingHours:e.target.value}))} className="px-3 py-2.5 rounded-xl border bg-gray-50 dark:bg-[#1E293B]" placeholder="Working hours"/><select value={settings.timezone} onChange={e=>setSettings(s=>({...s,timezone:e.target.value}))} className="px-3 py-2.5 rounded-xl border bg-gray-50 dark:bg-[#1E293B]"><option>Asia/Kolkata</option><option>Asia/Dubai</option><option>Asia/Singapore</option></select><select value={settings.notificationMode} onChange={e=>setSettings(s=>({...s,notificationMode:e.target.value}))} className="px-3 py-2.5 rounded-xl border bg-gray-50 dark:bg-[#1E293B]"><option>Email + In-app</option><option>In-app only</option><option>Email only</option></select></div><div className="mt-6 flex justify-end"><button onClick={()=>notify('Branch settings saved successfully.')} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold flex items-center gap-2"><Save size={16}/> Save Settings</button></div></section>
      )}

      {activeMenu === 'Branch Usage' && (
        <section className="w-full space-y-5"><div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">{[
          ['Branches',branches.length,'bg-indigo-50 text-indigo-600'],['Active',branches.filter(b=>b.status==='Active').length,'bg-emerald-50 text-emerald-600'],['Occupied Seats',branches.reduce((n,b)=>n+b.occupied,0),'bg-amber-50 text-amber-600'],['Capacity',branches.reduce((n,b)=>n+b.capacity,0),'bg-cyan-50 text-cyan-600']
        ].map(([label,value,cls])=><div key={label as string} className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm"><div className={`inline-flex p-2 rounded-xl ${cls as string}`}><BarChart3 size={20}/></div><p className="text-xs font-bold text-gray-500 mt-4">{label as string}</p><p className="text-2xl font-extrabold text-gray-900 dark:text-white">{value as number}</p></div>)}</div><div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"><div className="p-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-800"><div><h3 className="font-extrabold text-gray-900 dark:text-white">Live Branch Usage</h3><p className="text-xs text-gray-500">Refresh tick: {usageTick}</p></div><button onClick={()=>{setUsageTick(x=>x+1);notify('Usage metrics refreshed.')}} className="px-4 py-2 rounded-xl border font-bold text-sm flex items-center gap-2"><RefreshCw size={15}/> Refresh</button></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead><tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b"><th className="p-4">Branch</th><th className="p-4">Members</th><th className="p-4">Books</th><th className="p-4">Seats</th><th className="p-4">Utilization</th></tr></thead><tbody>{branches.map(b=>{const pct=Math.round((b.occupied/b.capacity)*100);return <tr key={b.id} className="border-b last:border-0"><td className="p-4 font-bold">{b.name}</td><td className="p-4">{Math.round(b.capacity*0.7)}</td><td className="p-4">{Math.round(b.capacity*18)}</td><td className="p-4">{b.occupied}/{b.capacity}</td><td className="p-4 font-bold">{pct}%</td></tr>})}</tbody></table></div></div></section>
      )}

      {activeMenu === 'Branch Inventory' && (
        <section className="w-full bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden"><div className="p-5 border-b flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"><div><h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Branch Inventory</h2><p className="text-xs text-gray-500 mt-1">Track stock, availability and exceptions.</p></div><div className="flex gap-2"><input value={inventorySearch} onChange={e=>setInventorySearch(e.target.value)} placeholder="Search inventory" className="w-full sm:w-64 px-3 py-2.5 rounded-xl border bg-gray-50 dark:bg-[#1E293B]"/><button onClick={()=>{ const code=window.prompt('Inventory code to adjust', inventoryRows[0]?.code || ''); const delta=window.prompt('Quantity change (+/-)', '10'); const amount=Number(delta); if(code && Number.isFinite(amount)){ setInventoryData((prev: any[]) =>prev.map((x: any)=>x.code===code?{...x,total:Math.max(0,x.total+amount),available:Math.max(0,x.available+amount)}:x)); notify('Inventory stock adjusted successfully.'); } }} className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm">Adjust Stock</button></div></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead><tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b"><th className="p-4">Code</th><th className="p-4">Category</th><th className="p-4">Total</th><th className="p-4">Available</th><th className="p-4">Issued</th><th className="p-4">Damaged</th><th className="p-4">Status</th></tr></thead><tbody>{filteredInventoryRows.map(row=><tr key={row.code} className="border-b last:border-0"><td className="p-4 font-mono text-xs">{row.code}</td><td className="p-4 font-bold">{row.title}</td><td className="p-4">{row.total}</td><td className="p-4">{row.available}</td><td className="p-4">{row.issued}</td><td className="p-4">{row.damaged}</td><td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.status==='Healthy'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700'}`}>{row.status}</span></td></tr>)}</tbody></table></div></section>
      )}

      {activeMenu === 'Branch Audit' && (
        <section className="w-full bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden"><div className="p-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"><div><h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Branch Audit</h2><p className="text-xs text-gray-500 mt-1">Review branch-level administrative activity.</p></div><div className="flex gap-2"><select value={auditFilter} onChange={e=>setAuditFilter(e.target.value)} className="px-3 py-2 rounded-xl border bg-gray-50 dark:bg-[#1E293B] text-sm"><option>All</option><option>Info</option><option>Warning</option></select><button onClick={()=>{ const payload=JSON.stringify(filteredAudit,null,2); const blob=new Blob([payload],{type:'application/json'}); const url=URL.createObjectURL(blob); const link=document.createElement('a'); link.href=url; link.download='branch-audit.json'; link.click(); URL.revokeObjectURL(url); notify('Audit export downloaded.'); }} className="px-4 py-2 rounded-xl border font-bold text-sm flex items-center gap-2"><Download size={15}/> Export</button></div></div><div className="divide-y dark:divide-gray-800">{filteredAudit.map(item=><div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center gap-3 md:justify-between"><div><p className="font-bold text-gray-900 dark:text-white">{item.action}</p><p className="text-xs text-gray-500 mt-1">{item.target} • {item.actor}</p></div><div className="flex items-center gap-3"><span className="font-mono text-[11px] text-gray-400">{item.id}</span><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.severity==='warning'?'bg-amber-100 text-amber-700':'bg-blue-100 text-blue-700'}`}>{item.severity}</span><span className="text-xs text-gray-500">{item.time}</span></div></div>)}</div></section>
      )}

      {toast && <div className="fixed bottom-5 right-5 z-[100] rounded-xl bg-gray-900 text-white px-4 py-3 text-sm font-bold shadow-2xl flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400"/>{toast}</div>}
    </div>
  );
}
