'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { UserPlus, Users2, Download, Eye, Pencil, MessageSquare } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/manager/reusable/gridTheme';
import { openWhatsApp } from '@/lib/whatsappUtils';
import { formatCurrency } from '@/app/manager/reusable/format';
import { fetchApi } from '@/lib/api';

ModuleRegistry.registerModules([AllCommunityModule]);

const MANAGER_BRANCH = 'Main Branch';

type Student = {
  id: string;
  smartId: string; name: string; phone: string;
  shift: string; seat: string; status: string;
  plan: string; due: number; joined: string;
};

function NameCell({ data }: { data: Student }) {
  const initials = data.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: '100%' }}>
      <div className="mgr-avatar-sm">{initials}</div>
      <div>
        <p className="mgr-cell-name">{data.name}</p>
        <p className="mgr-cell-sub">{data.phone}</p>
      </div>
    </div>
  );
}

function ShiftCell({ data }: { data: Student }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
      <span className="mgr-cell-name">{data.shift}</span>
      <span className="mgr-cell-sub">{data.seat}</span>
    </div>
  );
}

function StatusCell({ value }: { value: string }) {
  const cls = value === 'Active' ? 'mgr-badge mgr-badge--success'
    : value === 'Suspended' ? 'mgr-badge mgr-badge--warning'
    : 'mgr-badge mgr-badge--danger';
  return <span className={cls}>{value}</span>;
}

function DueCell({ value }: { value: number }) {
  return (
    <span style={{ fontWeight: 600, color: value > 0 ? 'var(--danger)' : 'var(--success)' }}>
      {value > 0 ? `₹${value.toLocaleString('en-IN')}` : '✅ Clear'}
    </span>
  );
}

function ActionsCell({ data }: { data: Student }) {
  function sendDuesReminder() {
    if (data.due <= 0) return;
    const W = 42;
    const line = '─'.repeat(W);
    const c = (t: string) => ' '.repeat(Math.max(0, Math.floor((W - t.length) / 2))) + t;
    const row = (l: string, v: string) => l + ' '.repeat(Math.max(1, W - l.length - v.length)) + v;
    const msg = [
      c('★ SMART LIBRARY 360 ★'),
      c('Main Branch'),
      line,
      c('[ FEE REMINDER ]'),
      line,
      row('Name    :', data.name),
      row('Smart ID:', data.smartId),
      '',
      line,
      row('DUE AMT :', `Rs.${data.due.toLocaleString('en-IN')}`),
      line,
      '',
      c('⚠️ Please clear dues to avoid'),
      c('seat suspension.'),
      '',
      c('Smart Library 360 | Main Branch'),
    ].join('\n');
    openWhatsApp(data.phone, msg);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: '100%' }}>
      <Link href={`/manager/students/${data.id || data.smartId}`} className="mgr-btn-icon" title="View Profile">
        <Eye size={13} />
      </Link>
      <Link href={`/manager/students/${data.id || data.smartId}/edit`} className="mgr-btn-icon" title="Edit">
        <Pencil size={13} />
      </Link>
      {data.due > 0 && (
        <button
          className="mgr-btn-icon mgr-btn-icon--wa"
          title={`Send dues reminder — ₹${data.due}`}
          onClick={sendDuesReminder}
        >
          <MessageSquare size={13} />
        </button>
      )}
    </div>
  );
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/students').then(data => {
      console.log("FETCHED STUDENTS:", data);
      setStudents(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shiftFilter, setShiftFilter]   = useState('all');

  const filtered = useMemo(() =>
    students.filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !search ||
        s.name.toLowerCase().includes(q) ||
        s.phone.includes(search) ||
        s.smartId.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchShift  = shiftFilter  === 'all' || s.shift  === shiftFilter;
      return matchSearch && matchStatus && matchShift;
    }),
    [students, search, statusFilter, shiftFilter]
  );

  const colDefs = useMemo(() => [
    {
      field: 'smartId', headerName: 'SMART ID', width: 110,
      cellStyle: { color: 'var(--mgr-primary)', fontFamily: 'monospace', fontSize: 12 },
    },
    { field: 'name',   headerName: 'STUDENT',      flex: 2, minWidth: 160, cellRenderer: NameCell },
    { field: 'shift',  headerName: 'SHIFT / SEAT', flex: 1, minWidth: 120, cellRenderer: ShiftCell },
    { field: 'status', headerName: 'STATUS',        width: 105, cellRenderer: StatusCell },
    { field: 'plan',   headerName: 'PLAN',          flex: 1, minWidth: 100, cellStyle: { color: 'var(--mgr-text-secondary)', fontSize: 13 } },
    { field: 'due',    headerName: 'DUE',           width: 100, cellRenderer: DueCell },
    { field: 'joined', headerName: 'JOINED',        width: 100, cellStyle: { color: 'var(--mgr-text-secondary)', fontSize: 12 } },
    {
      headerName: 'ACTIONS',
      width: 120,
      pinned: 'right' as const,
      sortable: false,
      resizable: false,
      cellRenderer: ActionsCell,
    },
  ], []);

  return (
    <div className="mgr-page">
      <div className="mgr-page-header">
        <div>
          <p className="mgr-breadcrumb">Smart Library 360 › Students</p>
          <h1 className="mgr-page-title">Student Directory</h1>
          <p className="mgr-page-subtitle">Manage admissions, seating, and billing for all active learners.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="mgr-btn-ghost mgr-btn-sm"><Download size={14} /> Export</button>
          <Link href="/manager/students/group" className="mgr-btn-ghost mgr-btn-sm"><Users2 size={14} /> Group Admission</Link>
          <Link href="/manager/students/new" className="mgr-btn-primary"><UserPlus size={14} /> New Admission</Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="mgr-kpi-grid mgr-section-gap">
        {[
          { label: 'Total',     value: students.length },
          { label: 'Active',    value: students.filter(s => s.status === 'Active').length },
          { label: 'Suspended', value: students.filter(s => s.status === 'Suspended').length },
          { label: 'Fee Due',   value: students.filter(s => s.due > 0).length },
        ].map(k => (
          <div key={k.label} className="mgr-kpi-card">
            <p className="mgr-kpi-label">{k.label}</p>
            <p className="mgr-kpi-value">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
        <input
          className="mgr-input mgr-search-input"
          placeholder="Search name, phone, Smart ID…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="mgr-select" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
          <option value="Expired">Expired</option>
        </select>
        <select className="mgr-select" style={{ width: 'auto' }} value={shiftFilter} onChange={e => setShiftFilter(e.target.value)}>
          <option value="all">All Shifts</option>
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
          <option value="Night">Night</option>
          <option value="Full Day">Full Day</option>
        </select>
      </div>

      {/* Grid — overflow visible so pinned right column buttons don't clip */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ height: 480 }}>
          <AgGridReact
            theme={gridTheme}
            rowData={filtered}
            columnDefs={colDefs as any}
            rowHeight={56}
            headerHeight={38}
            suppressMovableColumns
            suppressCellFocus
            defaultColDef={{ resizable: true, sortable: true }}
          />
        </div>
      </div>
    </div>
  );
}
