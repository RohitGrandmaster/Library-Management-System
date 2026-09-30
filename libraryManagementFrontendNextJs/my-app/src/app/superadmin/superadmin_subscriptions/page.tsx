'use client';
import { useState, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { Eye, ReceiptText, Users, TrendingDown, X, CheckCircle, Edit2, Package, Tag } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const INITIAL_SUBS = [
  { id: '1', tenant: 'The Alexandria Modern', plan: 'Enterprise (Annual)', cycle: 'Yearly',  nextInvoice: '12 Oct, 2026', status: 'Paid',     mrr: 15000, seats: 120, startDate: '12 Oct, 2025' },
  { id: '2', tenant: 'City Reading Hub',       plan: 'Pro (Monthly)',      cycle: 'Monthly', nextInvoice: '15 Apr, 2026', status: 'Due Soon', mrr: 2999,  seats: 80,  startDate: '15 Mar, 2025' },
];

const INITIAL_PLANS = [
  { id: 'P1', name: 'Starter', price: 999, branches: 1, members: 150, storage: '1GB', isPopular: false },
  { id: 'P2', name: 'Pro', price: 2999, branches: 5, members: 1000, storage: '10GB', isPopular: true },
  { id: 'P3', name: 'Enterprise', price: 15000, branches: 'Unlimited', members: 'Unlimited', storage: '100GB', isPopular: false },
];

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState('Active Subscribers');
  const [subs, setSubs] = useState(INITIAL_SUBS);
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const tabs = [
    { name: 'Active Subscribers', icon: Users },
    { name: 'SaaS Pricing Plans', icon: Package },
  ];

  const colDefs = useMemo<any[]>(() => [
    { headerName: 'Tenant', field: 'tenant', flex: 2, cellClass: () => 'sa-cell-primary-bold' },
    { headerName: 'Plan', field: 'plan', flex: 1.5, cellClass: () => 'sa-cell-plan' },
    { headerName: 'Cycle & MRR', field: 'mrr', flex: 1,
      cellRenderer: (p: ICellRendererParams) => (
        <div>
          <p className="text-sm font-medium text-primary">₹{p.data?.mrr.toLocaleString()}</p>
          <p className="text-xs text-secondary">{p.data?.cycle}</p>
        </div>
      ),
    },
    { headerName: 'Status', field: 'status', flex: 1,
      cellRenderer: (p: ICellRendererParams) => (
        <span className={`sa-badge ${
          p.value === 'Paid' ? 'sa-badge--success' : 
          p.value === 'Due Soon' ? 'sa-badge--warning' : 'sa-badge--danger'
        }`}>{p.value}</span>
      ),
    },
    { headerName: 'Actions', flex: 0.8,
      cellRenderer: () => (
        <button className="text-indigo-400 text-xs font-bold hover:text-indigo-300">Manage</button>
      )
    },
  ], []);

  return (
    <div className="sa-page-animate relative">
      {toast && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <CheckCircle size={16} /> {toast}
        </div>
      )}

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Nexus 360</span><span>/</span><span>Super Admin</span><span>/</span><span>Subscriptions</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title">SaaS Subscriptions</h1>
          <button className="sa-btn-primary" onClick={() => showToast('New plan creation started')}><Plus size={16} /> Create Plan</button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.name 
                ? 'bg-indigo-500/20 text-white border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon size={16} /> {tab.name}
          </button>
        ))}
      </div>

      <div className="sa-card p-0 overflow-hidden h-[600px] flex flex-col">
        {activeTab === 'Active Subscribers' && (
          <div className="flex-1 w-full animate-fade-in">
            <AgGridReact
              theme={gridTheme}
              rowData={subs}
              columnDefs={colDefs}
              headerHeight={48}
              rowHeight={64}
              suppressCellFocus
              domLayout="normal"
            />
          </div>
        )}

        {activeTab === 'SaaS Pricing Plans' && (
          <div className="p-6 h-full overflow-y-auto animate-fade-in">
            <h2 className="text-lg font-bold text-white mb-6">Manage Subscription Plans</h2>
            <div className="grid grid-cols-3 gap-6">
              {plans.map(p => (
                <div key={p.id} className={`p-6 rounded-2xl border ${p.isPopular ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5'} relative`}>
                  {p.isPopular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">MOST POPULAR</span>}
                  <h3 className="text-xl font-bold text-white mb-2">{p.name}</h3>
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-3xl font-black text-primary">₹{p.price}</span>
                    <span className="text-sm text-secondary pb-1">/mo</span>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-sm"><span className="text-secondary">Branches</span><span className="text-white font-medium">{p.branches}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-secondary">Members</span><span className="text-white font-medium">{p.members}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-secondary">Storage</span><span className="text-white font-medium">{p.storage}</span></div>
                  </div>

                  <button className="w-full sa-btn-secondary" onClick={() => showToast(`${p.name} plan updated`)}>Edit Limits & Pricing</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Needed to avoid undefined Plus
import { Plus } from 'lucide-react';
