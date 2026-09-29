'use client';

import { useMemo, useState } from 'react';
import { Download, Filter, RotateCcw, Search, ScrollText, UserCheck } from 'lucide-react';

type Activity = {
  id: string;
  action: string;
  module: string;
  user: string;
  role: string;
  status: 'Success' | 'Warning';
  time: string;
  details: string;
};

const INITIAL_ACTIVITIES: Activity[] = [
  { id: 'ACT-1001', action: 'Member Registered', module: 'Members', user: 'Rajesh Kumar', role: 'Admin', status: 'Success', time: '2026-09-29 12:14', details: 'Added member MBR-1024' },
  { id: 'ACT-1002', action: 'Book Issued', module: 'Circulation', user: 'Sunita Patil', role: 'Manager', status: 'Success', time: '2026-09-29 11:58', details: 'Issued BK-2088 to MBR-1012' },
  { id: 'ACT-1003', action: 'Fine Waived', module: 'Fines', user: 'Rajesh Kumar', role: 'Admin', status: 'Warning', time: '2026-09-29 11:22', details: 'Waived ₹150 fine for MBR-0991' },
  { id: 'ACT-1004', action: 'Staff Updated', module: 'Staff', user: 'Rajesh Kumar', role: 'Admin', status: 'Success', time: '2026-09-29 10:47', details: 'Updated access for STAFF-204' },
  { id: 'ACT-1005', action: 'Branch Settings Saved', module: 'Branches', user: 'Rajesh Kumar', role: 'Admin', status: 'Success', time: '2026-09-29 10:05', details: 'Updated operating hours for Main Branch' },
  { id: 'ACT-1006', action: 'Export Generated', module: 'Import/Export', user: 'Sunita Patil', role: 'Manager', status: 'Success', time: '2026-09-28 18:41', details: 'Generated member report export' },
];

export default function AdminActivityLogsPage() {
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = useMemo(() => activities.filter((item) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || [item.action, item.module, item.user, item.role, item.details].some(v => v.toLowerCase().includes(q));
    const matchesModule = moduleFilter === 'All' || item.module === moduleFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesModule && matchesStatus;
  }), [activities, search, moduleFilter, statusFilter]);

  const exportLogs = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'admin-activity-logs.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearch('');
    setModuleFilter('All');
    setStatusFilter('All');
  };

  const modules = Array.from(new Set(activities.map(a => a.module)));

  return (
    <div className="space-y-6 pb-12 min-w-0">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b pb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Library OS › Admin › Activity Logs</p>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><ScrollText size={22} /> Activity Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">Track administrative actions across branches, members, books, finance and system settings.</p>
        </div>
        <button onClick={exportLogs} className="admin-btn admin-btn-primary inline-flex items-center justify-center gap-2">
          <Download size={16} /> Export Visible Logs
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_180px_180px_auto] gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="admin-input w-full pl-9" value={search} onChange={(e) => setSearch(e.target.value)} WORKSPACE="Search action, user, module..." />
        </div>
        <select className="admin-input" value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)}>
          <option value="All">All Modules</option>
          {modules.map(module => <option key={module} value={module}>{module}</option>)}
        </select>
        <select className="admin-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Success">Success</option>
          <option value="Warning">Warning</option>
        </select>
        <button onClick={clearFilters} className="admin-btn admin-btn-ghost inline-flex items-center justify-center gap-2"><RotateCcw size={15} /> Reset</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="admin-card p-4"><div className="text-xs text-muted-foreground">Visible Events</div><div className="text-2xl font-bold mt-1">{filtered.length}</div></div>
        <div className="admin-card p-4"><div className="text-xs text-muted-foreground">Success</div><div className="text-2xl font-bold mt-1">{filtered.filter(x => x.status === 'Success').length}</div></div>
        <div className="admin-card p-4"><div className="text-xs text-muted-foreground">Warnings</div><div className="text-2xl font-bold mt-1">{filtered.filter(x => x.status === 'Warning').length}</div></div>
        <div className="admin-card p-4"><div className="text-xs text-muted-foreground">Tracked Users</div><div className="text-2xl font-bold mt-1">{new Set(filtered.map(x => x.user)).size}</div></div>
      </div>

      <div className="admin-table-wrapper overflow-x-auto">
        <table className="admin-table min-w-[920px] w-full">
          <thead><tr><th>Time</th><th>Action</th><th>Module</th><th>User</th><th>Status</th><th>Details</th></tr></thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id}>
                <td className="whitespace-nowrap">{item.time}</td>
                <td className="font-semibold">{item.action}</td>
                <td>{item.module}</td>
                <td><div className="flex items-center gap-2"><UserCheck size={14} className="text-muted-foreground" /><span>{item.user}<span className="block text-xs text-muted-foreground">{item.role}</span></span></div></td>
                <td><span className={item.status === 'Success' ? 'admin-badge admin-badge-success' : 'admin-badge admin-badge-warning'}>{item.status}</span></td>
                <td className="text-muted-foreground">{item.details}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No activity matched the current filters.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
