'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import CreateBranchForm from './CreateBranchForm';
import BranchDetailsView from './BranchDetailsView';
import { Building2, Search, Filter, Plus, Building } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  "All Branches", "Create Branch", "Active Branches", "Pending Branches", 
  "Suspended Branches", "Archived Branches", "Branch Managers", "Branch Settings",
  "Branch Usage", "Branch Inventory", "Branch Audit"
];

// Mock Data
const mockBranches = [
  { id: '1', name: 'Kankarbagh Branch', code: 'SN-KKB', parent: 'StudyNest Patna', location: 'Patna, Bihar', manager: 'Amit Kumar', status: 'Active', capacity: 300, occupied: 250 },
  { id: '2', name: 'Boring Road Branch', code: 'SN-BOR', parent: 'StudyNest Patna', location: 'Patna, Bihar', manager: 'Neha Singh', status: 'Active', capacity: 200, occupied: 180 },
  { id: '3', name: 'Delhi South Extension', code: 'RD-DSE', parent: 'Readers Den Delhi', location: 'New Delhi', manager: 'Rajiv Sharma', status: 'Pending', capacity: 500, occupied: 0 },
  { id: '4', name: 'Mumbai Andheri West', code: 'LM-MAW', parent: 'LibroHub Mumbai', location: 'Mumbai, MH', manager: 'Priya Desai', status: 'Suspended', capacity: 400, occupied: 400 },
];

export default function BranchesPage() {
  const [activeMenu, setActiveMenu] = useState("All Branches");
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const gridRef = useRef<AgGridReact>(null);

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'Branch Details', field: 'name', flex: 2, minWidth: 240,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-3 h-full cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-sm group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
            {p.data?.name.substring(0,2).toUpperCase()}
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-tight">{p.data?.name}</p>
            <p className="text-[11px] text-gray-500 font-semibold">{p.data?.code} | {p.data?.parent}</p>
          </div>
        </div>
      ),
    },
    { 
      headerName: 'Location & Manager', field: 'location', flex: 1.5, minWidth: 180,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex flex-col justify-center h-full">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{p.data?.location}</p>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Mgr: {p.data?.manager}</p>
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
        
        return (
          <div className="flex items-center h-full">
            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${colors}`}>
              {p.data?.status}
            </span>
          </div>
        )
      }
    },
    {
      headerName: 'Utilization (Capacity)', field: 'occupied', flex: 1.5, minWidth: 150,
      cellRenderer: (p: ICellRendererParams) => {
        const pct = Math.round(((p.data?.occupied ?? 0) / (p.data?.capacity ?? 1)) * 100);
        return (
          <div className="flex flex-col justify-center h-full gap-1.5 w-full pr-4">
            <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
              <span>{p.data?.occupied} / {p.data?.capacity}</span>
              <span className={pct > 90 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}>{pct}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
              <div className={`h-full transition-all duration-500 ease-out ${pct > 90 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      }
    }
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  const getFilteredBranches = () => {
    if (activeMenu === "Pending Branches") return mockBranches.filter(l => l.status === 'Pending');
    if (activeMenu === "Active Branches") return mockBranches.filter(l => l.status === 'Active');
    if (activeMenu === "Suspended Branches") return mockBranches.filter(l => l.status === 'Suspended');
    if (activeMenu === "Archived Branches") return mockBranches.filter(l => l.status === 'Archived');
    return mockBranches;
  };

  if (selectedBranchId) {
    return <BranchDetailsView onBack={() => setSelectedBranchId(null)} />;
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full flex-1 animate-in fade-in zoom-in-95 duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Nexus 360</span><span>/</span><span className="text-indigo-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Branches</span>
          </div>
          <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl shadow-sm border border-indigo-200/50 dark:border-indigo-800/50">
              <Building size={28} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            Branch Management
          </h1>
        </div>
        <button 
          onClick={() => setActiveMenu("Create Branch")}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
        >
          <Plus size={18} /> Register New Branch
        </button>
      </div>

      {/* Sub-menu Tabs */}
      <div className="flex gap-1.5 pb-2 pt-1 px-1 overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {SUB_MENUS.map(menu => (
          <button
            key={menu}
            onClick={() => setActiveMenu(menu)}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all shadow-sm flex-1 ${
              activeMenu === menu 
                ? 'bg-indigo-600 text-white shadow-indigo-600/20 scale-105' 
                : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-indigo-50 dark:hover:bg-[#1E293B] hover:text-indigo-600 hover:border-indigo-200'
            }`}
          >
            {menu}
          </button>
        ))}
      </div>

      {/* Main Content Area based on Tab */}
      {activeMenu === "Create Branch" ? (
        <CreateBranchForm onCancel={() => setActiveMenu("All Branches")} />
      ) : (
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col flex-1">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-[#0D1F3C]">
            <div className="relative max-w-md w-full">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search branches by name, code, or parent library..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                onChange={e => gridRef.current?.api.setGridOption('quickFilterText', e.target.value)}
              />
            </div>
            <button onClick={() => gridRef.current?.api.setFilterModel(null)} className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all hover:border-gray-400">
              <Filter size={16} className="text-gray-500" /> Reset Filters
            </button>
          </div>
          
          <div className="flex-1 w-full min-h-0 relative">
            <AgGridReact
              ref={gridRef}
              theme={gridTheme}
              rowData={getFilteredBranches()}
              columnDefs={colDefs}
              rowHeight={72}
              headerHeight={52}
              onGridReady={onGridReady}
              onRowClicked={p => setSelectedBranchId(p.data!.id)}
              pagination={true}
              paginationPageSize={15}
              rowClass="cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors"
            />
          </div>
        </div>
      )}
    </div>
  );
}
