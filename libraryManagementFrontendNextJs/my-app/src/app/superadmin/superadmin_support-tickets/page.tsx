'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { Eye, Clock, MessageSquare, AlertTriangle, X, CheckCircle, Loader, Send } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const INITIAL_TICKETS = [
  { id: 'TKT-991', subject: 'Payment Gateway Failing for UPI',    tenant: 'City Reading Hub',      priority: 'High',   status: 'Open',        age: '2 hours', replies: 2, desc: 'UPI payments are failing with error code 502. Students unable to pay fees online. Razorpay dashboard shows gateway timeout.' },
  { id: 'TKT-988', subject: 'Cannot generate student ID card',    tenant: 'Scholar Spaces',        priority: 'Medium', status: 'In-Progress', age: '1 day',   replies: 5, desc: 'The ID card generator throws a blank PDF when clicking Print. Issue started after the last update on 8th Apr.' },
  { id: 'TKT-987', subject: 'Change email address of owner',      tenant: 'The Alexandria Modern', priority: 'Low',    status: 'Resolved',    age: '3 days',  replies: 3, desc: 'Owner wants to update their registered email from old@alex.com to new@alex.com. Identity verified via phone OTP.' },
  { id: 'TKT-980', subject: 'Seats occupancy showing wrong count',tenant: 'Quiet Corner Lib',      priority: 'High',   status: 'Resolved',    age: '5 days',  replies: 7, desc: 'Dashboard shows 42/40 seats occupied which is impossible. Likely a sync issue after manual seat deletion.' },
];

type Ticket = typeof INITIAL_TICKETS[0];

function TicketPanel({ tkt, onClose, onSave }: { tkt: Ticket; onClose: () => void; onSave: (t: Ticket) => void }) {
  const [status, setStatus] = useState(tkt.status);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      onSave({ ...tkt, status });
      setSaving(false);
      setSaved(true);
      setTimeout(() => { setSaved(false); onClose(); }, 1000);
    }, 800);
  };

  return (
    <div className="sa-panel-overlay" onClick={onClose}>
      <div className="sa-panel-backdrop" />
      <div className="sa-panel-drawer" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono text-xs text-secondary">{tkt.id}</span>
            <h2 className="text-base font-bold text-primary mt-1 leading-snug">{tkt.subject}</h2>
          </div>
          <button className="sa-btn-icon shrink-0" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="sa-card p-4">
          <p className="text-sm text-secondary leading-relaxed">{tkt.desc}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[['Tenant',tkt.tenant],['Priority',tkt.priority],['Age',`${tkt.age} ago`],['Replies',`${tkt.replies} replies`]].map(([label,val]) => (
            <div key={label} className="sa-panel-info-cell">
              <p className="sa-panel-info-label">{label}</p>
              <p className="sa-panel-info-value">{val}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="sa-label mb-2">Update Status</p>
          <div className="flex gap-2">
            {(['Open', 'In-Progress', 'Resolved'] as const).map((s: any) => (
              <button key={s} type="button" onClick={() => setStatus(s)}
                className={`sa-status-btn ${
                  status === s
                    ? s === 'Resolved'    ? 'sa-status-btn--resolved'
                    : s === 'In-Progress' ? 'sa-status-btn--in-progress'
                    :                       'sa-status-btn--open'
                    : ''
                }`}>
                {s === 'Resolved'    ? <><CheckCircle size={11} className="inline mr-1" />{s}</>
                 : s === 'In-Progress' ? <><Loader size={11} className="inline mr-1" />{s}</>
                 : s}
              </button>
            ))}
          </div>
        </div>

        <button className="sa-btn-primary w-full" onClick={handleSave} disabled={saving || saved}>
          {saved    ? <><CheckCircle size={14} /> Saved & Notified!</>
           : saving ? <><span className="sa-spinner" /> Saving...</>
           : <><Send size={14} /> Save & Notify Tenant</>}
        </button>
      </div>
    </div>
  );
}

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [filter, setFilter]   = useState('All');
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [toast, setToast]     = useState('');
  const gridRef = useRef<AgGridReact>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleSave = (updated: Ticket) => {
    setTickets(t => t.map((x: any) => x.id === updated.id ? updated : x));
    showToast(`✅ ${updated.id} updated to ${updated.status}`);
  };

  const filtered = filter === 'All' ? tickets : tickets.filter(t => t.status === filter);

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'Subject / Ticket ID', field: 'subject', flex: 2, minWidth: 200,
      cellRenderer: (p: ICellRendererParams<Ticket>) => (
        <div>
          <p className="font-medium text-primary">{p.data?.subject}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-mono text-secondary">{p.data?.id}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="flex items-center gap-1 text-xs text-secondary">
              <MessageSquare size={10} /> {p.data?.replies} replies
            </span>
          </div>
        </div>
      ),
    },
    { headerName: 'Tenant', field: 'tenant', flex: 1.5, minWidth: 150,
      cellClass: () => 'sa-cell-primary' },
    {
      headerName: 'Priority', field: 'priority', flex: 0.8, minWidth: 100,
      cellRenderer: (p: ICellRendererParams<Ticket>) => (
        <>
          {p.data?.priority === 'High'   && <span className="sa-badge sa-badge--danger"><AlertTriangle size={10} /> HIGH</span>}
          {p.data?.priority === 'Medium' && <span className="sa-badge sa-badge--warning">MEDIUM</span>}
          {p.data?.priority === 'Low'    && <span className="sa-badge sa-badge--muted">LOW</span>}
        </>
      ),
    },
    {
      headerName: 'Status & Age', field: 'status', flex: 1, minWidth: 130,
      cellRenderer: (p: ICellRendererParams<Ticket>) => (
        <div>
          <p className={`${
            p.data?.status === 'Resolved' ? 'sa-ticket-status--resolved' :
            p.data?.status === 'Open'     ? 'sa-ticket-status--open' : 'sa-ticket-status--progress'
          }`}>{p.data?.status}</p>
          <p className="flex items-center gap-1 text-xs text-secondary mt-0.5">
            <Clock size={10} /> {p.data?.age} ago
          </p>
        </div>
      ),
    },
    {
      headerName: 'Actions', field: 'id', flex: 0.7, minWidth: 90, sortable: false, filter: false,
      cellRenderer: (p: ICellRendererParams<Ticket>) => (
        <button className="sa-btn-ghost sa-btn-ghost--sm" onClick={e => { e.stopPropagation(); setSelected(p.data!); }}>
          <Eye size={13} /> View
        </button>
      ),
    },
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  return (
    <>
      {toast && <div className="sa-toast">{toast}</div>}
      {selected && <TicketPanel tkt={selected} onClose={() => setSelected(null)} onSave={handleSave} />}

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Nexus 360</span><span>/</span><span>Super Admin</span><span>/</span><span>Support Tickets</span>
        </div>
        <h1 className="sa-page-title">Support Escalations</h1>
      </div>

      <div className="sa-card overflow-hidden">
        <div className="sa-actions-bar gap-2">
          {['All', 'Open', 'In-Progress', 'Resolved'].map((f: any) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`sa-filter-tab ${filter === f ? 'sa-filter-tab--active' : ''}`}>{f}</button>
          ))}
          <span className="ml-auto text-xs text-secondary">{filtered.length} tickets</span>
        </div>
        <div style={{ height: 360 }}>
          <AgGridReact
            ref={gridRef}
            theme={gridTheme}
            rowData={filtered}
            columnDefs={colDefs as any}
            rowHeight={60}
            headerHeight={44}
            onGridReady={onGridReady}
            onRowClicked={p => setSelected(p.data)}
            pagination={true}
            paginationPageSize={10}
            suppressCellFocus={true}
          />
        </div>
      </div>
    </>
  );
}
