'use client';
import { useState, useMemo } from 'react';
import { Plus, Shield, ShieldCheck, Key, History, Activity } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Mock Data
const MOCK_USERS = [
  { id: '1', name: 'Rahul Sharma', username: 'rahul.s', email: 'rahul@nexus360.com', role: 'SuperAdmin', branch: 'Global', status: 'Active', lastLogin: '2024-03-10 09:30 AM' },
  { id: '2', name: 'Amit Verma', username: 'amit.v', email: 'amit@studynest.com', role: 'Admin', branch: 'StudyNest Patna', status: 'Active', lastLogin: '2024-03-09 11:15 AM' },
  { id: '3', name: 'Priya Das', username: 'priya.d', email: 'priya@studynest.com', role: 'Manager', branch: 'StudyNest Patna', status: 'Inactive', lastLogin: '2024-02-28 04:20 PM' },
  { id: '4', name: 'Sanjay Gupta', username: 'sanjay.g', email: 'sanjay@gyankendra.com', role: 'Admin', branch: 'Gyan Kendra', status: 'Active', lastLogin: '2024-03-10 08:00 AM' },
];

export default function UsersAndAccessPage() {
  const [activeTab, setActiveTab] = useState('All Users');

  const tabs = [
    { name: 'All Users', icon: Shield },
    { name: 'Roles & Permissions', icon: ShieldCheck },
    { name: 'User Sessions', icon: Activity },
    { name: 'Login History', icon: History },
  ];

  const columnDefs = useMemo(() => [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1, 
      cellClass: 'sa-cell-primary-bold',
      cellRenderer: (p: any) => (
        <div className="flex items-center gap-2 h-full">
          <div className="sa-avatar-cell">{p.value.charAt(0)}</div>
          <span>{p.value}</span>
        </div>
      )
    },
    { field: 'username', headerName: 'Username', flex: 1, cellClass: 'sa-cell-muted' },
    { field: 'email', headerName: 'Email', flex: 1.2, cellClass: 'sa-cell-muted' },
    { 
      field: 'role', 
      headerName: 'Role', 
      flex: 1,
      cellRenderer: (p: any) => (
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          p.value === 'SuperAdmin' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
          p.value === 'Admin' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
          'bg-orange-500/10 text-orange-400 border border-orange-500/20'
        }`}>
          {p.value}
        </span>
      )
    },
    { field: 'branch', headerName: 'Branch', flex: 1, cellClass: 'sa-cell-muted' },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 0.8,
      cellRenderer: (p: any) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
          p.value === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }`}>
          {p.value}
        </span>
      )
    },
    { field: 'lastLogin', headerName: 'Last Login', flex: 1, cellClass: 'sa-cell-muted-sm' },
    {
      headerName: 'Actions',
      flex: 1,
      cellRenderer: () => (
        <div className="flex items-center gap-3 h-full">
          <button className="text-indigo-400 hover:text-indigo-300 font-medium text-xs">Edit</button>
          <button className="text-rose-400 hover:text-rose-300 font-medium text-xs">Logout</button>
        </div>
      )
    }
  ], []);

  const gridTheme = useMemo(() => {
    // We import here if we want or just use the global one. Wait, let me just import it properly.
  }, []);

  return (
    <div className="sa-page-animate">
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Nexus 360</span><span>/</span><span>Super Admin</span><span>/</span><span>Users & Access</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title">Users & Access</h1>
          <button className="sa-btn-primary">
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.name 
                ? 'bg-indigo-500/20 text-white border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon size={16} /> {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="sa-card p-0 overflow-hidden h-[600px] flex flex-col">
        {activeTab === 'All Users' ? (
          <div className="flex-1 w-full">
            <AgGridReact
              theme={gridTheme}
              rowData={MOCK_USERS}
              columnDefs={columnDefs}
              headerHeight={48}
              rowHeight={64}
              suppressCellFocus
              domLayout="normal"
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/40">
            <ShieldCheck size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">{activeTab} Configuration</p>
            <p className="text-sm mt-1">This module section is under construction.</p>
          </div>
        )}
      </div>
    </div>
  );
}
