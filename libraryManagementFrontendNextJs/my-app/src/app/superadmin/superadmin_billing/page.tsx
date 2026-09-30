'use client';
import { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { FileText, Tag, Plus, CheckCircle, Download, AlertCircle } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const INITIAL_INVOICES = [
  { id: 'REC-2026-0410', tenant: 'City Reading Hub',      date: '10 Apr, 2026', amount: 2999,  status: 'Paid',    method: 'UPI',           gst: '29AABCT1332L1ZD' },
  { id: 'REC-2026-0401', tenant: 'Scholar Spaces',        date: '01 Apr, 2026', amount: 999,   status: 'Overdue', method: '—',             gst: '27AABCS1429B1Z6' },
  { id: 'REC-2026-0328', tenant: 'Quiet Corner Lib',      date: '28 Mar, 2026', amount: 999,   status: 'Paid',    method: 'Card',          gst: '29AABCQ1234A1Z5' },
];

const INITIAL_PROMOS = [
  { id: '1', code: 'DIWALI50', discount: '50%', expiry: '2026-11-01', uses: 124, maxUses: 500, status: 'Active' },
  { id: '2', code: 'NEWLIBRARY20', discount: '20%', expiry: '2026-12-31', uses: 8, maxUses: 50, status: 'Active' },
  { id: '3', code: 'WINTER99', discount: '₹999 Flat', expiry: '2025-12-31', uses: 150, maxUses: 150, status: 'Expired' },
];

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState('Invoices & Transactions');
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [promos, setPromos] = useState(INITIAL_PROMOS);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleGenerateCode = () => {
    const newCode = {
      id: Math.random().toString(),
      code: `SPECIAL${Math.floor(Math.random() * 99)}`,
      discount: '30%',
      expiry: '2027-01-01',
      uses: 0,
      maxUses: 100,
      status: 'Active'
    };
    setPromos(prev => [newCode, ...prev]);
    showToast(`New promo code ${newCode.code} generated!`);
  };

  const tabs = [
    { name: 'Invoices & Transactions', icon: FileText },
    { name: 'Promo Codes & Offers', icon: Tag },
  ];

  const colDefs = useMemo<any[]>(() => [
    { headerName: 'Invoice ID', field: 'id', flex: 1.2, cellClass: () => 'sa-cell-primary-bold' },
    { headerName: 'Tenant', field: 'tenant', flex: 1.5, cellClass: () => 'sa-cell-muted' },
    { headerName: 'Date', field: 'date', flex: 1, cellClass: () => 'sa-cell-muted-sm' },
    { headerName: 'Amount', field: 'amount', flex: 1,
      cellRenderer: (p: ICellRendererParams) => <span className="text-sm font-bold text-primary">₹{p.value.toLocaleString()}</span>
    },
    { headerName: 'Status', field: 'status', flex: 1,
      cellRenderer: (p: ICellRendererParams) => (
        <span className={`sa-badge ${p.value === 'Paid' ? 'sa-badge--success' : 'sa-badge--danger'}`}>
          {p.value === 'Paid' ? <CheckCircle size={11} className="mr-1 inline" /> : <AlertCircle size={11} className="mr-1 inline" />} {p.value}
        </span>
      ),
    },
    { headerName: 'Method', field: 'method', flex: 1, cellClass: () => 'sa-cell-muted' },
    { headerName: 'Action', flex: 1,
      cellRenderer: () => (
        <button className="sa-btn-ghost sa-btn-ghost--sm text-indigo-400 border-indigo-500/20 px-2 py-1 h-auto" onClick={() => showToast('Invoice downloaded successfully.')}>
          <Download size={14} className="mr-1 inline" /> Download
        </button>
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
          <span>Nexus 360</span><span>/</span><span>Super Admin</span><span>/</span><span>Billing</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title">Billing & Revenue</h1>
          {activeTab === 'Promo Codes & Offers' && (
            <button className="sa-btn-primary bg-emerald-600 hover:bg-emerald-500 border-none" onClick={handleGenerateCode}>
              <Plus size={16} /> Generate Code
            </button>
          )}
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
        {activeTab === 'Invoices & Transactions' && (
          <div className="flex-1 w-full animate-fade-in">
            <AgGridReact
              theme={gridTheme}
              rowData={invoices}
              columnDefs={colDefs}
              headerHeight={48}
              rowHeight={64}
              suppressCellFocus
              domLayout="normal"
            />
          </div>
        )}

        {activeTab === 'Promo Codes & Offers' && (
          <div className="p-6 h-full overflow-y-auto animate-fade-in space-y-4">
            <h2 className="text-lg font-bold text-white mb-2">Active Promo Codes</h2>
            <p className="text-sm text-secondary mb-6">Create discount codes to attract new library registrations or reward existing clients.</p>
            
            <div className="grid gap-4">
              {promos.map(p => (
                <div key={p.id} className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Tag className="text-emerald-400" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-widest text-white">{p.code}</h3>
                      <p className="text-xs text-secondary mt-1">Discount: <strong className="text-emerald-400">{p.discount}</strong> • Expires: {p.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{p.uses} <span className="text-secondary font-normal">/ {p.maxUses} uses</span></p>
                      <div className="w-24 h-1.5 bg-black/40 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(p.uses/p.maxUses)*100}%` }} />
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
