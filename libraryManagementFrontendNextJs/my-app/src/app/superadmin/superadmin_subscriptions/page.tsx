'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import CreatePlanForm from './CreatePlanForm';
import SubscriptionDetailsView from './SubscriptionDetailsView';
import { 
  CreditCard, Search, Filter, Plus, Activity, Clock, 
  Receipt, Tag, Building2, TrendingUp, DollarSign, Wallet
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  { id: "Plans Catalog", icon: CreditCard, color: "pink", tabClass: "bg-pink-50 border-pink-200 text-pink-700 dark:bg-pink-900/20 dark:border-pink-800/50 dark:text-pink-400", iconClass: "text-pink-600 dark:text-pink-400" },
  { id: "Create New Plan", icon: Plus, color: "emerald", tabClass: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400", iconClass: "text-emerald-600 dark:text-emerald-400" },
  { id: "Billing & Invoices", icon: Receipt, color: "blue", tabClass: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400", iconClass: "text-blue-600 dark:text-blue-400" },
  { id: "Coupons & Promos", icon: Tag, color: "amber", tabClass: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400", iconClass: "text-amber-600 dark:text-amber-400" }
];

// Mock Data
const mockPlans = [
  { id: '1', name: 'Pro Monthly Plan', price: '$199.00/mo', cycle: 'Monthly', status: 'Active', activeTenants: 12, maxLibs: 5, trial: '14 Days' },
  { id: '2', name: 'Enterprise Annual', price: '$1990.00/yr', cycle: 'Annually', status: 'Active', activeTenants: 5, maxLibs: 'Unlimited', trial: '30 Days' },
  { id: '3', name: 'Basic Tier', price: '$49.00/mo', cycle: 'Monthly', status: 'Suspended', activeTenants: 45, maxLibs: 1, trial: '7 Days' },
  { id: '4', name: 'Lifetime Legacy', price: '$4999.00', cycle: 'One-Time', status: 'Expired', activeTenants: 2, maxLibs: 3, trial: 'None' },
];

const mockBilling = [
  { id: 'INV-1001', name: 'StudyNest Patna', price: '$199.00', cycle: 'Invoice', status: 'Paid', activeTenants: 1, maxLibs: 'INV', trial: 'Jan 2024' },
  { id: 'INV-1002', name: 'LibroHub Mumbai', price: '$1990.00', cycle: 'Invoice', status: 'Pending', activeTenants: 1, maxLibs: 'INV', trial: 'Feb 2024' },
  { id: 'PAY-8812', name: 'Stripe Credit Card', price: '$199.00', cycle: 'Payment', status: 'Paid', activeTenants: 1, maxLibs: 'TXN', trial: 'Today' },
  { id: 'REF-091', name: 'BookHaven BLR', price: '$199.00', cycle: 'Refund', status: 'Refunded', activeTenants: 1, maxLibs: 'RFD', trial: 'Last Week' }
];

export default function SubscriptionsPage() {
  const [activeMenu, setActiveMenu] = useState("Plans Catalog");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const gridRef = useRef<AgGridReact>(null);

  const colDefs = useMemo<any[]>(() => {
    if (activeMenu === "Plans Catalog") {
      return [
        {
          headerName: 'Plan Details', field: 'name', flex: 2, minWidth: 240,
          cellRenderer: (p: ICellRendererParams) => {
            if (!p.data) return null;
            return (
              <div className="flex items-center gap-3 h-full cursor-pointer group" onClick={() => setSelectedPlan(p.data)}>
                <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/40 border border-pink-200 dark:border-pink-800/50 flex items-center justify-center text-pink-600 dark:text-pink-400 font-extrabold text-sm group-hover:scale-110 group-hover:bg-pink-600 group-hover:text-white transition-all shadow-sm">
                  {p.data.name.substring(0,3).toUpperCase()}
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-extrabold text-gray-900 dark:text-white group-hover:text-pink-600 transition-colors leading-tight">{p.data.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{p.data.cycle} Billing</p>
                </div>
              </div>
            );
          },
        },
        { 
          headerName: 'Pricing & Trial', field: 'price', flex: 1.5, minWidth: 150,
          cellRenderer: (p: ICellRendererParams) => {
            if (!p.data) return null;
            return (
              <div className="flex flex-col justify-center h-full">
                <p className="text-sm font-black text-gray-800 dark:text-gray-200">{p.data.price}</p>
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1 uppercase tracking-wider"><Clock size={10} /> Trial: {p.data.trial}</p>
              </div>
            );
          }
        },
        { 
          headerName: 'Platform Limits', field: 'maxLibs', flex: 1.5, minWidth: 160,
          cellRenderer: (p: ICellRendererParams) => {
            if (!p.data) return null;
            return (
              <div className="flex items-center h-full text-xs font-bold text-gray-700 dark:text-gray-300">
                <Building2 size={14} className="mr-2 text-pink-400" /> Max Libraries: {p.data.maxLibs}
              </div>
            );
          }
        },
        { 
          headerName: 'Subscribers', field: 'activeTenants', flex: 1, minWidth: 120,
          cellRenderer: (p: ICellRendererParams) => {
            if (!p.data) return null;
            return (
              <div className="flex items-center gap-2 h-full">
                <span className="text-sm font-black text-gray-800 dark:text-gray-200">{p.data.activeTenants}</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tenants</span>
              </div>
            );
          }
        },
        { 
          headerName: 'Status', field: 'status', flex: 1, minWidth: 120,
          cellRenderer: (p: ICellRendererParams) => {
            if (!p.data) return null;
            let colors = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
            if (p.data.status === 'Active') colors = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
            if (p.data.status === 'Suspended') colors = 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800';
            if (p.data.status === 'Expired') colors = 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border-rose-200 dark:border-rose-800';
            
            return (
              <div className="flex items-center h-full">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm border ${colors}`}>
                  {p.data.status}
                </span>
              </div>
            );
          }
        }
      ];
    } else {
      return [
        {
          headerName: 'Record ID & Name', field: 'name', flex: 2, minWidth: 240,
          cellRenderer: (p: ICellRendererParams) => (
            <div className="flex flex-col justify-center h-full">
              <p className="font-extrabold text-gray-900 dark:text-white leading-tight">{p.data?.name}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{p.data?.id} • {p.data?.cycle}</p>
            </div>
          )
        },
        { 
          headerName: 'Amount / Value', field: 'price', flex: 1, minWidth: 150,
          cellRenderer: (p: ICellRendererParams) => (
            <div className="flex items-center h-full text-sm font-black text-gray-800 dark:text-gray-200 font-mono">
              {p.data?.price}
            </div>
          )
        },
        { 
          headerName: 'Date / Context', field: 'trial', flex: 1, minWidth: 150,
          cellRenderer: (p: ICellRendererParams) => (
            <div className="flex items-center h-full text-xs font-bold text-gray-600 dark:text-gray-400">
              {p.data?.trial}
            </div>
          )
        },
        { 
          headerName: 'Status', field: 'status', flex: 1, minWidth: 120,
          cellRenderer: (p: ICellRendererParams) => {
            let colors = 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
            if (p.data?.status === 'Paid' || p.data?.status === 'Success' || p.data?.status === 'Active') {
              colors = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
            } else if (p.data?.status === 'Pending' || p.data?.status === 'Warning') {
              colors = 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800';
            } else if (p.data?.status === 'Failed' || p.data?.status === 'Expired' || p.data?.status === 'Refunded') {
              colors = 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border-rose-200 dark:border-rose-800';
            }
            return (
              <div className="flex items-center h-full">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm border ${colors}`}>
                  {p.data?.status}
                </span>
              </div>
            );
          }
        }
      ];
    }
  }, [activeMenu]);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  if (selectedPlan) {
    return <SubscriptionDetailsView plan={selectedPlan} onBack={() => setSelectedPlan(null)} />;
  }

  const renderContent = () => {
    switch (activeMenu) {
      case "Create New Plan":
        return (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <CreatePlanForm />
          </div>
        );
      
      case "Coupons & Promos":
        return (
          <div className="border-2 border-dashed border-amber-300 dark:border-amber-700/50 rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-amber-50/30 dark:bg-amber-900/10 animate-in zoom-in-95 duration-500 min-h-[500px]">
            <div className="p-5 bg-amber-100 dark:bg-amber-900/40 rounded-full mb-6 shadow-inner">
              <Tag size={48} className="text-amber-500 dark:text-amber-400" />
            </div>
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">Discount Codes</h4>
            <p className="text-gray-500 font-medium max-w-lg mx-auto mb-8">
              Generate promotional codes for new signups or special events. Configure usage limits and expiration dates.
            </p>
            <button className="px-6 py-3 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center mx-auto gap-2">
              <Plus size={16} /> Generate Coupon
            </button>
          </div>
        );

      case "Billing & Invoices":
      case "Plans Catalog":
      default:
        return (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 flex flex-col min-h-0 h-full">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
              {[
                { title: 'MRR (Monthly Recurring)', value: '$12,450', icon: <DollarSign size={24} />, color: 'emerald' },
                { title: 'Active Subscribers', value: '412', icon: <Building2 size={24} />, color: 'blue' },
                { title: 'Growth Rate', value: '+14.2%', icon: <TrendingUp size={24} />, color: 'pink' },
                { title: 'Pending Invoices', value: '18', icon: <Receipt size={24} />, color: 'amber' }
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
                  <Wallet size={20} className="text-pink-500" /> {activeMenu === 'Plans Catalog' ? 'Subscription Plans' : 'Billing Ledger'}
                </h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:text-pink-600 shadow-sm"><Filter size={16} /></button>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none shadow-sm" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0">
                  <AgGridReact
                    ref={gridRef}
                    theme={gridTheme}
                    rowData={activeMenu === "Plans Catalog" ? mockPlans : mockBilling}
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
          <span>Nexus 360</span><span>/</span><span className="text-pink-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Plans & Subscriptions</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center shadow-sm border border-pink-200/50 dark:border-pink-800/50">
                <CreditCard size={24} />
              </div>
              Billing & Subscriptions
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Design SaaS plans, monitor MRR growth, track tenant invoices, and manage payment gateway configurations.</p>
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
