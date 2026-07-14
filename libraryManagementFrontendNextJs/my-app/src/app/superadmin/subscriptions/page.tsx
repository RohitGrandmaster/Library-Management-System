'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/reusable/gridTheme';
import { Eye, ReceiptText, Users, TrendingDown, X, Calendar, IndianRupee, CheckCircle, Edit2, Save } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const INITIAL_SUBS = [
  { id: '1', tenant: 'The Alexandria Modern', plan: 'Enterprise (Annual)', cycle: 'Yearly',  nextInvoice: '12 Oct, 2026', status: 'Paid',     mrr: 15000, seats: 120, startDate: '12 Oct, 2025' },
  { id: '2', tenant: 'City Reading Hub',       plan: 'Pro (Monthly)',      cycle: 'Monthly', nextInvoice: '15 Apr, 2026', status: 'Due Soon', mrr: 2999,  seats: 80,  startDate: '15 Mar, 2025' },
  { id: '3', tenant: 'Scholar Spaces',         plan: 'Basic (Monthly)',    cycle: 'Monthly', nextInvoice: '01 Apr, 2026', status: 'Overdue',  mrr: 999,   seats: 150, startDate: '01 Jan, 2025' },
  { id: '4', tenant: 'Quiet Corner Lib',       plan: 'Basic (Monthly)',    cycle: 'Monthly', nextInvoice: '28 Apr, 2026', status: 'Paid',     mrr: 999,   seats: 40,  startDate: '28 Feb, 2025' },
];

type Sub = typeof INITIAL_SUBS[0];
const PLANS = ['Basic (Monthly)', 'Pro (Monthly)', 'Enterprise (Annual)'];

const KPI = [
  { label: 'Active Subscriptions',      val: '24',        icon: Users,        colorCls: 'sa-metric--primary', trend: '+3 this month' },
  { label: 'Monthly Recurring Revenue', val: '₹1,42,500', icon: ReceiptText,  colorCls: 'sa-metric--success', trend: '↑ 12% vs last month' },
  { label: 'Churn Rate',                val: '1.2%',       icon: TrendingDown, colorCls: 'sa-metric--warning', trend: 'Healthy ✓' },
];

function SubPanel({ sub, onClose, onUpdate }: { sub: Sub; onClose: () => void; onUpdate: (s: Sub) => void }) {
  const [editing, setEditing] = useState(false);
  const [plan, setPlan] = useState(sub.plan);
  const [renewed, setRenewed] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleRenew = () => {
    setRenewed(true);
    onUpdate({ ...sub, status: 'Paid' });
    setTimeout(() => setRenewed(false), 2000);
  };

  const handleSavePlan = () => {
    onUpdate({ ...sub, plan });
    setSaved(true);
    setTimeout(() => { setSaved(false); setEditing(false); }, 1200);
  };

  return (
    <div className="sa-panel-overlay" onClick={onClose}>
      <div className="sa-panel-backdrop" />
      <div className="sa-panel-drawer" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-[var(--text-primary)]">{sub.tenant}</h2>
            <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">{sub.plan}</p>
          </div>
          <button className="sa-btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[['Billing Cycle',sub.cycle],['Start Date',sub.startDate],['Next Invoice',sub.nextInvoice],['Seats',`${sub.seats} seats`]].map(([label,val]) => (
            <div key={label} className="sa-panel-info-cell">
              <p className="sa-panel-info-label">{label}</p>
              <p className="sa-panel-info-value">{val}</p>
            </div>
          ))}
        </div>

        <div className="sa-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <IndianRupee size={14} /> <span className="text-[13px]">Monthly Value</span>
          </div>
          <span className="text-[22px] font-bold text-[var(--text-primary)]">₹{sub.mrr.toLocaleString()}</span>
        </div>

        {editing ? (
          <div className="space-y-3">
            <label className="sa-label">Change Plan</label>
            <select className="sa-select w-full" value={plan} onChange={e => setPlan(e.target.value)}>
              {PLANS.map(p => <option key={p}>{p}</option>)}
            </select>
            <div className="flex gap-2">
              <button className="sa-btn-primary sa-btn-primary--flex" onClick={handleSavePlan}>
                {saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save Plan</>}
              </button>
              <button className="sa-btn-ghost sa-btn-primary--flex" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {sub.status === 'Paid'     && <span className="sa-badge sa-badge--success">✅ Paid</span>}
            {sub.status === 'Due Soon' && <span className="sa-badge sa-badge--info">🔵 Due Soon</span>}
            {sub.status === 'Overdue'  && <span className="sa-badge sa-badge--danger">🔴 Overdue</span>}
          </div>
        )}

        {!editing && (
          <div className="flex gap-3 pt-2">
            <button className="sa-btn-primary sa-btn-primary--flex" onClick={handleRenew} disabled={renewed}>
              {renewed ? <><CheckCircle size={14} /> Renewed!</> : <><Calendar size={14} /> Renew Now</>}
            </button>
            <button className="sa-btn-ghost sa-btn-primary--flex" onClick={() => setEditing(true)}>
              <Edit2 size={14} /> Edit Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState(INITIAL_SUBS);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<Sub | null>(null);
  const [toast, setToast] = useState('');
  const gridRef = useRef<AgGridReact>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleUpdate = (updated: Sub) => {
    setSubs(s => s.map(x => x.id === updated.id ? updated : x));
    setSelected(updated);
    showToast(`✅ ${updated.tenant} subscription updated`);
  };

  const filtered = filter === 'All' ? subs : subs.filter(s => s.status === filter);

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'Tenant', field: 'tenant', flex: 2, minWidth: 160,
      cellClass: () => 'sa-cell-primary-bold',
    },
    { headerName: 'Plan', field: 'plan', flex: 1.5, minWidth: 140,
      cellClass: () => 'sa-cell-plan' },
    {
      headerName: 'Cycle & MRR', field: 'mrr', flex: 1, minWidth: 120,
      cellRenderer: (p: ICellRendererParams<Sub>) => (
        <div>
          <p className="text-[14px] font-medium text-[var(--text-primary)]">₹{p.data?.mrr.toLocaleString()}</p>
          <p className="text-[12px] text-[var(--text-secondary)]">{p.data?.cycle}</p>
        </div>
      ),
    },
    { headerName: 'Next Invoice', field: 'nextInvoice', flex: 1, minWidth: 130,
      cellClass: () => 'sa-cell-invoice-date' },
    {
      headerName: 'Status', field: 'status', flex: 1, minWidth: 120,
      cellRenderer: (p: ICellRendererParams<Sub>) => (
        <>
          {p.data?.status === 'Paid'     && <span className="sa-badge sa-badge--success">✅ Paid</span>}
          {p.data?.status === 'Due Soon' && <span className="sa-badge sa-badge--info">🔵 Due Soon</span>}
          {p.data?.status === 'Overdue'  && <span className="sa-badge sa-badge--danger">🔴 Overdue</span>}
        </>
      ),
    },
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  return (
    <>
      {toast && <div className="sa-toast">{toast}</div>}
      {selected && <SubPanel sub={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />}

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Nexus 360</span><span>/</span><span>Super Admin</span><span>/</span><span>Subscriptions</span>
        </div>
        <h1 className="sa-page-title">SaaS Subscriptions</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {KPI.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="sa-kpi-card">
              <div className="flex items-start justify-between">
                <div className="sa-kpi-icon-box">
                  <Icon size={18} className={k.colorCls} />
                </div>
                <p className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-widest text-right">{k.label}</p>
              </div>
              <div>
                <h2 className="text-[28px] font-bold text-[var(--text-primary)] leading-tight">{k.val}</h2>
                <p className="text-[12px] mt-1 font-medium text-[var(--success)]">{k.trend}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sa-card overflow-hidden">
        <div className="sa-actions-bar gap-2">
          {['All', 'Paid', 'Due Soon', 'Overdue'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`sa-filter-tab ${filter === f ? 'sa-filter-tab--active' : ''}`}>{f}</button>
          ))}
          <span className="ml-auto text-[12px] text-[var(--text-secondary)]">{filtered.length} records</span>
        </div>
        <div style={{ height: 380 }}>
          <AgGridReact
            ref={gridRef}
            theme={gridTheme}
            rowData={filtered}
            columnDefs={colDefs as any}
            rowHeight={56}
            headerHeight={44}
            onGridReady={onGridReady}
            onRowClicked={p => setSelected(p.data)}
            pagination={true}
            paginationPageSize={10}
            suppressCellFocus={true}
          />
        </div>
        <div className="p-4 border-t border-[var(--border)] text-center">
          <span className="text-[13px] text-[var(--text-secondary)]">Showing {filtered.length} of 24 subscriptions</span>
        </div>
      </div>
    </>
  );
}
