'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import CreateUserForm from './CreateUserForm';
import UserDetailsView from './UserDetailsView';
import { Users, Search, Filter, Plus, Shield, Building2, Store } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  "All Users", "Create User", "SuperAdmins", "Admins", "Managers", 
  "Pending Users", "Active Users", "Suspended Users", "Deactivated Users"
];

// Mock Data
const mockUsers = [
  { id: '1', name: 'Ramesh Singh', email: 'ramesh.s@nexus360.com', role: 'SuperAdmin', scope: 'Global Platform', status: 'Active' },
  { id: '2', name: 'Neha Sharma', email: 'neha.admin@studynest.com', role: 'Admin', scope: 'StudyNest Patna', status: 'Active' },
  { id: '3', name: 'Amit Kumar', email: 'amit.k@studynest.com', role: 'Manager', scope: 'Kankarbagh Branch', status: 'Pending' },
  { id: '4', name: 'Priya Desai', email: 'priya.d@librohub.com', role: 'Manager', scope: 'Mumbai Andheri West', status: 'Suspended' },
  { id: '5', name: 'Vikas Jain', email: 'vikas.admin@readersden.com', role: 'Admin', scope: 'Readers Den Delhi', status: 'Deactivated' },
];

export default function UsersPage() {
  const [activeMenu, setActiveMenu] = useState("All Users");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const gridRef = useRef<AgGridReact>(null);

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'User Details', field: 'name', flex: 2, minWidth: 240,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-3 h-full cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-teal-600 dark:text-teal-400 font-extrabold text-sm group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
            {p.data?.name.substring(0,2).toUpperCase()}
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-bold text-gray-900 dark:text-white group-hover:text-teal-600 transition-colors leading-tight">{p.data?.name}</p>
            <p className="text-[11px] text-gray-500 font-semibold">{p.data?.email}</p>
          </div>
        </div>
      ),
    },
    { 
      headerName: 'System Role', field: 'role', flex: 1, minWidth: 140,
      cellRenderer: (p: ICellRendererParams) => {
        let icon = <Shield size={12} />;
        let colors = 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-400 dark:border-purple-800';
        
        if (p.data?.role === 'Admin') {
          icon = <Building2 size={12} />;
          colors = 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800';
        } else if (p.data?.role === 'Manager') {
          icon = <Store size={12} />;
          colors = 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-400 dark:border-indigo-800';
        }
        
        return (
          <div className="flex items-center h-full">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-sm flex items-center gap-1.5 ${colors}`}>
              {icon} {p.data?.role}
            </span>
          </div>
        )
      }
    },
    { 
      headerName: 'Assigned Scope', field: 'scope', flex: 1.5, minWidth: 180,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center h-full text-sm font-bold text-gray-700 dark:text-gray-300">
          {p.data?.scope}
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
        if (p.data?.status === 'Deactivated') colors = 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-600';
        
        return (
          <div className="flex items-center h-full">
            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${colors}`}>
              {p.data?.status}
            </span>
          </div>
        )
      }
    }
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  const getFilteredUsers = () => {
    let filtered = [...mockUsers];
    if (activeMenu === "SuperAdmins") filtered = filtered.filter(u => u.role === 'SuperAdmin');
    if (activeMenu === "Admins") filtered = filtered.filter(u => u.role === 'Admin');
    if (activeMenu === "Managers") filtered = filtered.filter(u => u.role === 'Manager');
    if (activeMenu === "Pending Users") filtered = filtered.filter(u => u.status === 'Pending');
    if (activeMenu === "Active Users") filtered = filtered.filter(u => u.status === 'Active');
    if (activeMenu === "Suspended Users") filtered = filtered.filter(u => u.status === 'Suspended');
    if (activeMenu === "Deactivated Users") filtered = filtered.filter(u => u.status === 'Deactivated');
    return filtered;
  };

  if (selectedUser) {
    return <UserDetailsView onBack={() => setSelectedUser(null)} role={selectedUser.role} />;
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in zoom-in-95 duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Nexus 360</span><span>/</span><span className="text-teal-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Platform Users</span>
          </div>
          <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl shadow-sm border border-teal-200/50 dark:border-teal-800/50">
              <Users size={28} className="text-teal-600 dark:text-teal-400" />
            </div>
            Platform Users
          </h1>
        </div>
        <button 
          onClick={() => setActiveMenu("Create User")}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 transition-all hover:-translate-y-0.5"
        >
          <Plus size={18} /> Register New User
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
                ? 'bg-teal-600 text-white shadow-teal-600/20 scale-105' 
                : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-teal-50 dark:hover:bg-[#1E293B] hover:text-teal-600 hover:border-teal-200'
            }`}
          >
            {menu}
          </button>
        ))}
      </div>

      {/* Main Content Area based on Tab */}
      {activeMenu === "Create User" ? (
        <CreateUserForm onCancel={() => setActiveMenu("All Users")} />
      ) : (
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-[#0D1F3C]">
            <div className="relative max-w-md w-full">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search users by name, email, or scope..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all shadow-sm"
                onChange={e => gridRef.current?.api.setGridOption('quickFilterText', e.target.value)}
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all hover:border-gray-400">
              <Filter size={16} className="text-gray-500" /> User Filters
            </button>
          </div>
          
          <div className="h-[calc(100vh-260px)] min-h-[400px] w-full">
            <AgGridReact
              ref={gridRef}
              theme={gridTheme}
              rowData={getFilteredUsers()}
              columnDefs={colDefs}
              rowHeight={72}
              headerHeight={52}
              onGridReady={onGridReady}
              onRowClicked={p => setSelectedUser(p.data)}
              pagination={true}
              paginationPageSize={15}
              rowClass="cursor-pointer hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-colors"
            />
          </div>
        </div>
      )}
    </div>
  );
}
