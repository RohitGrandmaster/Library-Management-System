'use client';

// RESPONSIBILITY: Entry page for the admin_audit-logs module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useMemo, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Search, ShieldAlert, ShieldCheck, Shield, AlertTriangle, Info } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/admin/admin_reusable/gridTheme';

ModuleRegistry.registerModules([AllCommunityModule]);

interface AuditLog {
  id: string;
  action: string;
  module: string;
  performedBy: string;
  role: string;
  details: string;
  severity: 'danger' | 'warning' | 'info' | 'success';
  timestamp: string;
  ip: string;
}

const LOGS: AuditLog[] = [
  { id: 'L1',  action: 'Deleted Receipt',        module: 'Finance',    performedBy: 'Rahul Sharma',  role: 'Staff',   details: 'Receipt #R-1042 of ₹500 deleted',          severity: 'danger',  timestamp: '25/07/25 16:30', ip: '192.168.1.10' },
  { id: 'L2',  action: 'Student Blacklisted',     module: 'Admin',      performedBy: 'Rajesh Kumar',  role: 'Admin',   details: 'Student Vikram Patel (ID #20) blacklisted',  severity: 'danger',  timestamp: '25/07/25 15:12', ip: '192.168.1.1'  },
  { id: 'L3',  action: 'Fee Collected',           module: 'Finance',    performedBy: 'Sunita Patil',  role: 'Manager', details: '₹1,500 collected from Arjun Sharma',         severity: 'success', timestamp: '25/07/25 14:45', ip: '192.168.1.5'  },
  { id: 'L4',  action: 'Student Added',           module: 'Students',   performedBy: 'Sunita Patil',  role: 'Manager', details: 'New student Riya Kapoor admitted (Seat S9)',  severity: 'info',    timestamp: '25/07/25 13:20', ip: '192.168.1.5'  },
  { id: 'L5',  action: 'Seat Marked Maintenance', module: 'Seats',      performedBy: 'Rajesh Kumar',  role: 'Admin',   details: 'Seat S5 marked under maintenance',           severity: 'warning', timestamp: '25/07/25 12:00', ip: '192.168.1.1'  },
  { id: 'L6',  action: 'Coupon Created',          module: 'Admin',      performedBy: 'Rajesh Kumar',  role: 'Admin',   details: 'Coupon SUMMER10 created (10% off, 30 uses)', severity: 'info',    timestamp: '25/07/25 11:30', ip: '192.168.1.1'  },
  { id: 'L7',  action: 'Student Exited',          module: 'Students',   performedBy: 'Sunita Patil',  role: 'Manager', details: 'Student Mohit Arya (ID #24) marked exit',    severity: 'warning', timestamp: '25/07/25 10:15', ip: '192.168.1.5'  },
  { id: 'L8',  action: 'Refund Issued',           module: 'Finance',    performedBy: 'Rajesh Kumar',  role: 'Admin',   details: '₹500 security deposit refunded to Divya Nair', severity: 'info',  timestamp: '24/07/25 18:00', ip: '192.168.1.1'  },
  { id: 'L9',  action: 'Staff Added',             module: 'Admin',      performedBy: 'Rajesh Kumar',  role: 'Admin',   details: 'New staff Priya Joshi added (Role: Staff)',   severity: 'success', timestamp: '24/07/25 16:45', ip: '192.168.1.1'  },
  { id: 'L10', action: 'Permissions Updated',     module: 'Admin',      performedBy: 'Rajesh Kumar',  role: 'Admin',   details: 'Manager role: finance.profit access revoked', severity: 'warning', timestamp: '24/07/25 15:30', ip: '192.168.1.1'  },
];

const SEV_BADGE_CLASS: Record<string, string> = {
  danger:  'px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 flex items-center gap-1.5 w-fit',
  warning: 'px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800 flex items-center gap-1.5 w-fit',
  info:    'px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5 w-fit',
  success: 'px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 w-fit',
};

const SEV_ICON: Record<string, React.ReactNode> = {
  danger:  <ShieldAlert size={12} />,
  warning: <AlertTriangle size={12} />,
  info:    <Info size={12} />,
  success: <ShieldCheck size={12} />,
};

function SeverityCell({ data }: { data: AuditLog }) {
  return (
    <span className={SEV_BADGE_CLASS[data.severity]}>
      {SEV_ICON[data.severity]} {data.severity.charAt(0).toUpperCase() + data.severity.slice(1)}
    </span>
  );
}

function ActionCell({ value }: { value: string }) {
  return <span className="font-bold text-foreground">{value}</span>;
}

function UserCell({ data }: { data: AuditLog }) {
  return (
    <div className="flex flex-col justify-center h-full">
      <span className="font-semibold text-sm text-foreground leading-tight">{data.performedBy}</span>
      <span className="text-xs text-muted-foreground">{data.role}</span>
    </div>
  );
}

const TABS = ['all', 'danger', 'warning', 'info', 'success'] as const;
type FilterType = typeof TABS[number];

export default function AdminAuditLogsPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    fetchApi('/admin/admin_audit-logs').then(data => {
      const mapped = data.map((l: any) => ({
        id: l.id,
        action: l.action,
        module: l.entity,
        performedBy: 'Staff User',
        role: 'Admin',
        details: l.details,
        severity: 'info' as 'danger' | 'warning' | 'success' | 'info',
        timestamp: new Date(l.createdAt).toLocaleString(),
        ip: '192.168.1.1'
      }));
      setLogs(mapped);
    }).catch(console.error);
  }, []);

  const filtered = logs.filter(l => {
    const sevMatch = filter === 'all' || l.severity === filter;
    const searchMatch = !search || l.action.toLowerCase().includes(search.toLowerCase()) || l.performedBy.toLowerCase().includes(search.toLowerCase());
    return sevMatch && searchMatch;
  });

  const colDefs = useMemo<any[]>(() => [
    { field: 'timestamp',   headerName: 'TIME',         flex: 1.2, minWidth: 120, cellStyle: { color: 'var(--text-secondary)', fontSize: 12 } },
    { field: 'action',      headerName: 'ACTION',       flex: 2,   minWidth: 180, cellRenderer: ActionCell },
    { field: 'module',      headerName: 'MODULE',       flex: 1,   minWidth: 100, cellStyle: { color: 'var(--text-secondary)', fontSize: 13 } },
    { field: 'performedBy', headerName: 'PERFORMED BY', flex: 1.5, minWidth: 150, cellRenderer: UserCell },
    { field: 'details',     headerName: 'DETAILS',      flex: 2.5, minWidth: 250, cellStyle: { color: 'var(--text-secondary)', fontSize: 12 } },
    { field: 'severity',    headerName: 'SEVERITY',     flex: 1,   minWidth: 120, cellRenderer: SeverityCell },
  ], []);

  return (
    <div className="w-full max-w-full space-y-6 pb-12 flex flex-col h-full min-h-[calc(100vh-6rem)]">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-600 to-green-500 bg-clip-text text-transparent flex items-center gap-2">
            <ShieldAlert size={28} className="text-teal-600" /> Audit Logs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track all sensitive actions performed in the system.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 shrink-0">
        <div className="relative w-full max-w-[300px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            placeholder="Search action or user…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex bg-muted/30 p-1 rounded-xl border border-border overflow-x-auto">
          {TABS.map(s => (
            <button
              key={s}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${filter === s ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setFilter(s)}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* AG Grid */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex-1 min-h-[400px]">
        <AgGridReact
          theme={gridTheme}
          rowData={filtered}
          columnDefs={colDefs as any}
          rowHeight={52}
          headerHeight={44}
          suppressMovableColumns
          suppressCellFocus
          defaultColDef={{ resizable: false, sortable: true }}
        />
      </div>

      {/* Info Tip */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 text-blue-800 dark:text-blue-300 shrink-0">
        <Shield size={20} className="shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
        <p className="text-sm font-medium leading-relaxed m-0">
          Audit logs are retained for 90 days. Use the severity filter to quickly identify suspicious activity like deleted receipts or unauthorized access attempts.
        </p>
      </div>
    </div>
  );
}
