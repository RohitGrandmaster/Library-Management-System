'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { Download, FileText, X, CheckCircle, AlertCircle, Send } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const INITIAL_INVOICES = [
  { id: 'REC-2026-0410', tenant: 'City Reading Hub',      date: '10 Apr, 2026', amount: 2999,  status: 'Paid',    method: 'UPI',           gst: '29AABCT1332L1ZD' },
  { id: 'REC-2026-0401', tenant: 'Scholar Spaces',        date: '01 Apr, 2026', amount: 999,   status: 'Overdue', method: '—',             gst: '27AABCS1429B1Z6' },
  { id: 'REC-2026-0328', tenant: 'Quiet Corner Lib',      date: '28 Mar, 2026', amount: 999,   status: 'Paid',    method: 'Card',          gst: '29AABCQ1234A1Z5' },
  { id: 'REC-2026-0315', tenant: 'The Alexandria Modern', date: '15 Mar, 2026', amount: 15000, status: 'Paid',    method: 'Bank Transfer', gst: '29AABCA5678B1Z3' },
];

type Invoice = typeof INITIAL_INVOICES[0];

function InvoicePanel({ inv, onClose, onMarkPaid }: { inv: Invoice; onClose: () => void; onMarkPaid: (id: string) => void }) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded]   = useState(false);
  const [reminded, setReminded]       = useState(false);
  const [markedPaid, setMarkedPaid]   = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => { setDownloading(false); setDownloaded(true); setTimeout(() => setDownloaded(false), 2000); }, 1500);
  };

  const handleReminder = () => { setReminded(true); setTimeout(() => setReminded(false), 2000); };

  const handleMarkPaid = () => {
    onMarkPaid(inv.id);
    setMarkedPaid(true);
    setTimeout(() => { setMarkedPaid(false); onClose(); }, 1200);
  };

  return (
    <div className="sa-panel-overlay" onClick={onClose}>
      <div className="sa-panel-backdrop" />
      <div className="sa-panel-drawer" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <div className="sa-invoice-id-cell mb-1">
              <FileText size={16} className="sa-metric--primary" />
              <span className="sa-invoice-id-text">{inv.id}</span>
            </div>
            <h2 className="text-lg font-bold text-primary">{inv.tenant}</h2>
          </div>
          <button className="sa-btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="sa-card p-4 text-center">
          <p className="text-xs text-secondary mb-1">Invoice Amount</p>
          <p className="text-3xl font-bold text-primary">₹{inv.amount.toLocaleString()}</p>
          <div className="flex justify-center mt-2">
            {inv.status === 'Paid'
              ? <span className="sa-badge sa-badge--success"><CheckCircle size={11} /> Paid</span>
              : <span className="sa-badge sa-badge--danger"><AlertCircle size={11} /> Overdue</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[['Date',inv.date],['Method',inv.method],['GST Number',inv.gst],['Status',inv.status]].map(([label,val]) => (
            <div key={label} className="sa-panel-info-cell">
              <p className="sa-panel-info-label">{label}</p>
              <p className="sa-panel-info-value">{val}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2 flex-wrap">
          <button className="sa-btn-primary sa-btn-primary--flex" onClick={handleDownload} disabled={downloading}>
            {downloaded ? <><CheckCircle size={14} /> Downloaded!</>
              : downloading ? <><span className="sa-spinner" /> Generating...</>
              : <><Download size={14} /> Download PDF</>}
          </button>
          {inv.status === 'Overdue' && (
            <button className="sa-btn-ghost sa-btn-primary--flex sa-btn-ghost--warning" onClick={handleReminder}>
              {reminded ? <><CheckCircle size={14} /> Sent!</> : <><Send size={14} /> Send Reminder</>}
            </button>
          )}
        </div>

        {inv.status === 'Overdue' && (
          <button className="sa-btn-ghost sa-btn-primary--full sa-btn-ghost--success" onClick={handleMarkPaid}>
            {markedPaid ? <><CheckCircle size={14} /> Marked Paid!</> : <><CheckCircle size={14} /> Mark as Paid</>}
          </button>
        )}
      </div>
    </div>
  );
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [exported, setExported] = useState(false);
  const [toast, setToast]       = useState('');
  const gridRef = useRef<AgGridReact>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleMarkPaid = (id: string) => {
    setInvoices(inv => inv.map((i: any) => i.id === id ? { ...i, status: 'Paid', method: 'Manual' } : i));
    showToast('✅ Invoice marked as Paid');
  };

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2000);
    showToast('📥 CSV exported successfully');
  };

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'Invoice ID', field: 'id', flex: 1.2, minWidth: 150,
      cellRenderer: (p: ICellRendererParams<Invoice>) => (
        <div className="sa-invoice-id-cell">
          <FileText size={13} className="sa-metric--primary" />
          <span className="sa-invoice-id-text">{p.data?.id}</span>
        </div>
      ),
    },
    { headerName: 'Tenant', field: 'tenant', flex: 2, minWidth: 160,
      cellClass: () => 'sa-cell-primary-bold' },
    {
      headerName: 'Date & Method', field: 'date', flex: 1.2, minWidth: 140,
      cellRenderer: (p: ICellRendererParams<Invoice>) => (
        <div>
          <p className="sa-cell-invoice-date">{p.data?.date}</p>
          <p className="sa-invoice-id-text sa-invoice-method-text">{p.data?.method}</p>
        </div>
      ),
    },
    {
      headerName: 'Amount', field: 'amount', flex: 1, minWidth: 110,
      cellRenderer: (p: ICellRendererParams<Invoice>) => (
        <span className="sa-billing-amount">₹{p.data?.amount.toLocaleString()}</span>
      ),
    },
    {
      headerName: 'Status', field: 'status', flex: 1, minWidth: 110,
      cellRenderer: (p: ICellRendererParams<Invoice>) => (
        p.data?.status === 'Paid'
          ? <span className="sa-badge sa-badge--success">✅ Paid</span>
          : <span className="sa-badge sa-badge--danger">🔴 Overdue</span>
      ),
    },
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  return (
    <>
      {toast && <div className="sa-toast">{toast}</div>}
      {selected && (
        <InvoicePanel inv={selected} onClose={() => setSelected(null)} onMarkPaid={handleMarkPaid} />
      )}

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Nexus 360</span><span>/</span><span>Super Admin</span><span>/</span><span>Billing</span>
        </div>
        <h1 className="sa-page-title">Billing & Receipts</h1>
      </div>

      <div className="sa-card overflow-hidden">
        <div className="sa-actions-bar justify-between">
          <input type="text" placeholder="Search Invoice ID or tenant..." className="sa-input w-64"
            onChange={e => gridRef.current?.api.setGridOption('quickFilterText', e.target.value)} />
          <button className="sa-btn-ghost sa-btn-ghost--sm" onClick={handleExport}>
            {exported ? <><CheckCircle size={14} className="text-success" /> Exported!</> : <><Download size={14} /> Export CSV</>}
          </button>
        </div>
        <div style={{ height: 360 }}>
          <AgGridReact
            ref={gridRef}
            theme={gridTheme}
            rowData={invoices}
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
      </div>
    </>
  );
}
