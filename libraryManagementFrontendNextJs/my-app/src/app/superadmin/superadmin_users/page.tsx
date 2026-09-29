'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import CreateUserForm from './CreateUserForm';
import UserDetailsView from './UserDetailsView';
import { 
  Users, Search, Filter, Plus, Shield, Building2, Store, 
  UserPlus, ScrollText, KeyRound, Mail, Clock, ShieldCheck
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  { id: "User Directory", icon: Users, color: "teal", tabClass: "bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/20 dark:border-teal-800/50 dark:text-teal-400", iconClass: "text-teal-600 dark:text-teal-400" },
  { id: "Invite / Add User", icon: UserPlus, color: "emerald", tabClass: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400", iconClass: "text-emerald-600 dark:text-emerald-400" },
  { id: "Access Policies", icon: KeyRound, color: "orange", tabClass: "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800/50 dark:text-orange-400", iconClass: "text-orange-600 dark:text-orange-400" },
  { id: "Session Logs", icon: ScrollText, color: "indigo", tabClass: "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800/50 dark:text-indigo-400", iconClass: "text-indigo-600 dark:text-indigo-400" }
];

// Mock Data
const mockUsers = [
  { id: '1', name: 'Ramesh Singh', email: 'ramesh.s@nexus360.com', role: 'SuperAdmin', scope: 'Global Platform', status: 'Active' },
  { id: '2', name: 'Neha Sharma', email: 'neha.admin@studynest.com', role: 'Admin', scope: 'StudyNest Patna', status: 'Active' },
  { id: '3', name: 'Amit Kumar', email: 'amit.k@studynest.com', role: 'Manager', scope: 'Kankarbagh Branch', status: 'Pending' },
  { id: '4', name: 'Priya Desai', email: 'priya.d@librohub.com', role: 'Manager', scope: 'Mumbai Andheri West', status: 'Suspended' },
  { id: '5', name: 'Vikas Jain', email: 'vikas.admin@readersden.com', role: 'Admin', scope: 'Readers Den Delhi', status: 'Deactivated' },
  { id: '6', name: 'Sanjay Verma', email: 'sanjay.v@nexus360.com', role: 'SuperAdmin', scope: 'Global Platform', status: 'Active' },
  { id: '7', name: 'Anjali Gupta', email: 'anjali.g@bookhaven.com', role: 'Admin', scope: 'BookHaven BLR', status: 'Active' },
  { id: '8', name: 'Rahul Iyer', email: 'rahul.i@bookhaven.com', role: 'Manager', scope: 'Bangalore Koramangala', status: 'Active' },
  { id: '9', name: 'Sneha Kulkarni', email: 'sneha.k@punereaders.com', role: 'Manager', scope: 'Pune Deccan', status: 'Pending' },
  { id: '10', name: 'Ayan Das', email: 'ayan.d@knowledgelounge.com', role: 'Manager', scope: 'Kolkata Salt Lake', status: 'Deactivated' }
];

export default function UsersPage() {
  const [activeMenu, setActiveMenu] = useState("User Directory");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const gridRef = useRef<AgGridReact>(null);

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'User Details', field: 'name', flex: 2, minWidth: 240,
      cellRenderer: (p: ICellRendererParams) => {
        if (!p.data) return null;
        return (
          <div className="flex items-center gap-3 h-full cursor-pointer group" onClick={() => setSelectedUser(p.data)}>
            <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-900/40 border border-teal-200 dark:border-teal-800/50 flex items-center justify-center text-teal-600 dark:text-teal-400 font-extrabold text-sm group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm shrink-0">
              {p.data.name.substring(0,2).toUpperCase()}
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <p className="font-extrabold text-gray-900 dark:text-white group-hover:text-teal-600 transition-colors leading-tight truncate">{p.data.name}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider truncate flex items-center gap-1 mt-0.5"><Mail size={10}/> {p.data.email}</p>
            </div>
          </div>
        );
      },
    },
    { 
      headerName: 'System Role', field: 'role', flex: 1, minWidth: 140,
      cellRenderer: (p: ICellRendererParams) => {
        if (!p.data) return null;
        let icon = <Shield size={12} />;
        let colors = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-400 dark:border-purple-800/50';
        
        if (p.data.role === 'Admin') {
          icon = <Building2 size={12} />;
          colors = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800/50';
        } else if (p.data.role === 'Manager') {
          icon = <Store size={12} />;
          colors = 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-400 dark:border-indigo-800/50';
        }
        
        return (
          <div className="flex items-center h-full">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm border flex items-center gap-1.5 ${colors}`}>
              {icon} {p.data.role}
            </span>
          </div>
        )
      }
    },
    { 
      headerName: 'Assigned Scope', field: 'scope', flex: 1.5, minWidth: 180,
      cellRenderer: (p: ICellRendererParams) => {
        if (!p.data) return null;
        return (
          <div className="flex items-center h-full text-xs font-extrabold text-gray-700 dark:text-gray-300 truncate pr-4">
            {p.data.scope}
          </div>
        );
      }
    },
    { 
      headerName: 'Status', field: 'status', flex: 1, minWidth: 120,
      cellRenderer: (p: ICellRendererParams) => {
        if (!p.data) return null;
        let colors = 'bg-gray-50 text-gray-700 dark:bg-gray-900/40 dark:text-gray-400 border-gray-200 dark:border-gray-700';
        let dot = 'bg-gray-400';
        if (p.data.status === 'Active') {
          colors = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
          dot = 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]';
        }
        if (p.data.status === 'Pending') {
          colors = 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
          dot = 'bg-amber-500';
        }
        if (p.data.status === 'Suspended' || p.data.status === 'Deactivated') {
          colors = 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/50';
          dot = 'bg-rose-500';
        }
        
        return (
          <div className="flex items-center h-full">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm border flex items-center gap-1.5 ${colors}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${dot}`}></div> {p.data.status}
            </span>
          </div>
        )
      }
    },
    {
      headerName: 'Action', field: 'id', flex: 1, minWidth: 100, sortable: false, filter: false,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center h-full">
          <button onClick={() => setSelectedUser(p.data)} className="px-3 py-1.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Profile
          </button>
        </div>
      )
    }
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  if (selectedUser) {
    return <UserDetailsView user={selectedUser} onBack={() => setSelectedUser(null)} />;
  }

  const renderContent = () => {
    switch (activeMenu) {
      case "Invite / Add User":
        return (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <CreateUserForm onCancel={() => {}} />
          </div>
        );
        
      case "Access Policies":
      case "Session Logs":
        return (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-gray-50/30 dark:bg-[#0D1F3C]/20 animate-in zoom-in-95 duration-500 min-h-[400px]">
            <div className="p-5 bg-gray-100 dark:bg-gray-800 rounded-full mb-6 shadow-inner">
               {activeMenu === "Session Logs" ? <ScrollText size={48} className="text-gray-400" /> : <KeyRound size={48} className="text-gray-400" />}
            </div>
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">{activeMenu}</h4>
            <p className="text-gray-500 font-medium max-w-lg mx-auto">
              Configure strict SSO/MFA constraints or view detailed authentication trails for all platform users.
            </p>
          </div>
        )

      case "User Directory":
      default:
        return (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 flex flex-col min-h-0 h-full">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
              {[
                { title: 'Total Registered', value: '4,284', icon: <Users size={24} />, color: 'teal' },
                { title: 'Active Admins', value: '82', icon: <Building2 size={24} />, color: 'blue' },
                { title: 'Active Managers', value: '312', icon: <Store size={24} />, color: 'indigo' },
                { title: 'Pending Invites', value: '14', icon: <Clock size={24} />, color: 'amber' }
              ].map(stat => (
                <div key={stat.title} className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between group overflow-hidden relative">
                   <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 dark:bg-${stat.color}-500/10 rounded-bl-full transition-transform group-hover:scale-110`}></div>
                  <div className="relative z-10">
                    <h3 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">{stat.title}</h3>
                    <div className="text-3xl font-black text-gray-900 dark:text-white leading-none">{stat.value}</div>
                  </div>
                  <div className={`relative z-10 w-14 h-14 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 flex items-center justify-center border border-${stat.color}-100 dark:border-${stat.color}-800/50 shadow-sm`}>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col flex-1 min-h-[400px]">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1F3C]/50 flex justify-between items-center shrink-0">
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck size={20} className="text-teal-500" /> Platform Authentication Directory
                </h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:text-teal-600 shadow-sm"><Filter size={16} /></button>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search Users..." className="pl-9 pr-4 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none shadow-sm" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0">
                  <AgGridReact
                    ref={gridRef}
                    theme={gridTheme}
                    rowData={mockUsers}
                    columnDefs={colDefs}
                    rowHeight={64}
                    headerHeight={48}
                    onGridReady={onGridReady}
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-[calc(100vh-6rem)]">
      
      {/* Page Header */}
      <div className="shrink-0">
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-teal-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Users</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-sm border border-teal-200/50 dark:border-teal-800/50">
                <Users size={24} />
              </div>
              Platform Users
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Manage centralized platform access, monitor user sessions, configure global authentication policies, and invite new tenant admins.</p>
          </div>
        </div>
      </div>

      {/* Sub-menu Grid */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        {SUB_MENUS.map(menu => {
          const Icon = menu.icon;
          const isActive = activeMenu === menu.id;
          
          return (
            <button
              key={menu.id}
              onClick={() => setActiveMenu(menu.id)}
              className={`flex flex-col items-center justify-center p-4 gap-2 rounded-2xl border text-center transition-all ${
                isActive 
                  ? `${menu.tabClass} shadow-md scale-[1.02]`
                  : 'bg-white dark:bg-[#0F172A] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-gray-900 dark:hover:text-white shadow-sm'
              }`}
            >
              <Icon size={20} className={isActive ? menu.iconClass : 'opacity-70'} />
              <span className="text-[11px] font-extrabold uppercase tracking-wider">{menu.id}</span>
            </button>
          )
        })}
      </div>

      {/* Dynamic Content */}
      <div className="w-full flex-1 min-h-0 relative">
        {renderContent()}
      </div>
    </div>
  );
}
