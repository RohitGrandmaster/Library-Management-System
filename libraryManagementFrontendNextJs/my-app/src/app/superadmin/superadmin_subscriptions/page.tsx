'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import CreatePlanForm from './CreatePlanForm';
import SubscriptionDetailsView from './SubscriptionDetailsView';
import { CreditCard, Search, Filter, Plus, Activity, Clock } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  "Plans", "Create Plan", "Active Subscriptions", "Trials", 
  "Expired Subscriptions", "Suspended Subscriptions", "Usage & Limits", 
  "Invoices", "Payments", "Refunds", "Coupons / Discounts", "Subscription History"
];

// Mock Data
const mockPlans = [
  { id: '1', name: 'Pro Monthly Plan', price: '$199.00/mo', cycle: 'Monthly', status: 'Active', activeTenants: 12, maxLibs: 5, trial: '14 Days' },
  { id: '2', name: 'Enterprise Annual', price: '$1990.00/yr', cycle: 'Annually', status: 'Active', activeTenants: 5, maxLibs: 'Unlimited', trial: '30 Days' },
  { id: '3', name: 'Basic Tier', price: '$49.00/mo', cycle: 'Monthly', status: 'Suspended', activeTenants: 45, maxLibs: 1, trial: '7 Days' },
  { id: '4', name: 'Lifetime Legacy', price: '$4999.00', cycle: 'One-Time', status: 'Expired', activeTenants: 2, maxLibs: 3, trial: 'None' },
];

export default function SubscriptionsPage() {
  const [activeMenu, setActiveMenu] = useState("Plans");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const gridRef = useRef<AgGridReact>(null);

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'Plan Details', field: 'name', flex: 2, minWidth: 240,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-3 h-full cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center text-pink-600 dark:text-pink-400 font-extrabold text-sm group-hover:scale-110 group-hover:bg-pink-600 group-hover:text-white transition-all shadow-sm">
            {p.data?.name.substring(0,3).toUpperCase()}
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-bold text-gray-900 dark:text-white group-hover:text-pink-600 transition-colors leading-tight">{p.data?.name}</p>
            <p className="text-[11px] text-gray-500 font-semibold">{p.data?.cycle} Billing</p>
          </div>
        </div>
      ),
    },
    { 
      headerName: 'Pricing & Trial', field: 'price', flex: 1.5, minWidth: 150,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex flex-col justify-center h-full">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{p.data?.price}</p>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1"><Clock size={10} /> Trial: {p.data?.trial}</p>
        </div>
      )
    },
    { 
      headerName: 'Platform Limits', field: 'maxLibs', flex: 1.5, minWidth: 160,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center h-full text-sm font-semibold text-gray-700 dark:text-gray-300">
          Max Libraries: {p.data?.maxLibs}
        </div>
      )
    },
    { 
      headerName: 'Active Tenants', field: 'activeTenants', flex: 1.2, minWidth: 140,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-2 h-full">
          <Activity size={16} className="text-blue-500" />
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{p.data?.activeTenants} Orgs</span>
        </div>
      )
    },
    { 
      headerName: 'Status', field: 'status', flex: 1, minWidth: 120,
      cellRenderer: (p: ICellRendererParams) => {
        let colors = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        if (p.data?.status === 'Active') colors = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
        if (p.data?.status === 'Suspended') colors = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800';
        if (p.data?.status === 'Expired') colors = 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800';
        
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

  const getFilteredPlans = () => {
    // Basic mock filtering logic for demonstration
    if (activeMenu === "Expired Subscriptions") return mockPlans.filter(p => p.status === 'Expired');
    if (activeMenu === "Suspended Subscriptions") return mockPlans.filter(p => p.status === 'Suspended');
    if (activeMenu === "Active Subscriptions") return mockPlans.filter(p => p.status === 'Active');
    return mockPlans;
  };

  if (selectedPlan) {
    return <SubscriptionDetailsView onBack={() => setSelectedPlan(null)} />;
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full flex-1 animate-in fade-in zoom-in-95 duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Nexus 360</span><span>/</span><span className="text-pink-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Plans & Subscriptions</span>
          </div>
          <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl shadow-sm border border-pink-200/50 dark:border-pink-800/50">
              <CreditCard size={28} className="text-pink-600 dark:text-pink-400" />
            </div>
            Plans & Subscriptions
          </h1>
        </div>
        <button 
          onClick={() => setActiveMenu("Create Plan")}
          className="flex items-center gap-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow-lg shadow-pink-600/20 transition-all hover:-translate-y-0.5"
        >
          <Plus size={18} /> Create New Plan
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
                ? 'bg-pink-600 text-white shadow-pink-600/20 scale-105' 
                : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-pink-50 dark:hover:bg-[#1E293B] hover:text-pink-600 hover:border-pink-200'
            }`}
          >
            {menu}
          </button>
        ))}
      </div>

      {/* Main Content Area based on Tab */}
      {activeMenu === "Create Plan" ? (
        <CreatePlanForm onCancel={() => setActiveMenu("Plans")} />
      ) : (
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col flex-1">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-[#0D1F3C]">
            <div className="relative max-w-md w-full">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search plans or subscriptions..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all shadow-sm"
                onChange={e => gridRef.current?.api.setGridOption('quickFilterText', e.target.value)}
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all hover:border-gray-400">
              <Filter size={16} className="text-gray-500" /> Plan Filters
            </button>
          </div>
          
          <div className="flex-1 w-full min-h-0 relative">
            <AgGridReact
              ref={gridRef}
              theme={gridTheme}
              rowData={getFilteredPlans()}
              columnDefs={colDefs}
              rowHeight={72}
              headerHeight={52}
              onGridReady={onGridReady}
              onRowClicked={p => setSelectedPlan(p.data)}
              pagination={true}
              paginationPageSize={15}
              rowClass="cursor-pointer hover:bg-pink-50/50 dark:hover:bg-pink-900/10 transition-colors"
            />
          </div>
        </div>
      )}
    </div>
  );
}
