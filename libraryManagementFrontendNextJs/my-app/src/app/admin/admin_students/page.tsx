'use client';

// RESPONSIBILITY: Renders the Admin Students page, managing client-side fetching and AG Grid presentation.
// DATA FLOW: fetchAdminStudents -> AdminStudentsPage -> AgGridReact

import { useState, useMemo, useEffect } from 'react';
import { Users, Download, Search, Printer, Upload, MessageSquare, Mail } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/admin/admin_reusable/gridTheme';
import { useAdmin } from '@/app/admin/admin_context/AdminContext';
import { fetchAdminStudents } from '@/app/admin/admin_api/admin_api';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function AdminStudentsPage() {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const { selectedBranch } = useAdmin();

  useEffect(() => {
    const mockStudents = [
      { id: '1001', fullName: 'Rahul Sharma', branch: 'Main Branch' },
      { id: '1002', fullName: 'Sneha Patil', branch: 'Main Branch' },
      { id: '1003', fullName: 'Amit Kumar', branch: 'Main Branch' },
      { id: '1004', fullName: 'Priya Singh', branch: 'Downtown Branch' },
      { id: '1005', fullName: 'Vikram Verma', branch: 'Main Branch' }
    ];

    fetchAdminStudents().then(data => {
      const sourceData = (Array.isArray(data) && data.length > 0) ? data : mockStudents;
      const mapped = sourceData.map((s: any) => ({
        id: 'STU-' + s.id.substring(0, 4).toUpperCase(),
        name: s.fullName,
        shift: s.id === '1001' ? 'Morning' : s.id === '1002' ? 'Evening' : 'Night',
        seat: `A-${s.id.slice(-2)}`,
        plan: 'Monthly',
        status: 'Active',
        branch: s.branch
      }));
      setStudents(mapped);
    }).catch(() => {
      const mapped = mockStudents.map((s: any) => ({
        id: 'STU-' + s.id.substring(0, 4).toUpperCase(),
        name: s.fullName,
        shift: 'Morning',
        seat: `A-${s.id.slice(-2)}`,
        plan: 'Monthly',
        status: 'Active',
        branch: s.branch
      }));
      setStudents(mapped);
    });
  }, []);

  const filtered = students.filter(s => {
    if (selectedBranch !== 'All Branches' && s.branch !== selectedBranch) return false;
    
    return s.name.toLowerCase().includes(search.toLowerCase());
  });

  const colDefs = useMemo<any[]>(() => [
    { field: 'id', headerName: 'ID', flex: 0.8, minWidth: 100 },
    { field: 'name', headerName: 'Student Name', flex: 1.5, minWidth: 150 },
    { field: 'shift', headerName: 'Shift', flex: 1.5, minWidth: 180 },
    { field: 'seat', headerName: 'Seat', flex: 0.8, minWidth: 100 },
    { field: 'plan', headerName: 'Plan', flex: 1, minWidth: 120 },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 1, 
      minWidth: 120, 
      cellRenderer: (params: any) => (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ 
          background: params.value === 'Active' ? 'var(--success-bg)' : 'var(--danger-bg)',
          color: params.value === 'Active' ? 'var(--success)' : 'var(--danger)'
        }}>
            {params.value}
        </span>
    ) },
  ], []);

  return (
    <div className="h-full flex flex-col pb-10 space-y-6">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <p className="text-xs text-[var(--text-secondary)] mb-1 tracking-widest uppercase font-medium">Smart Library 360 › Admin › Students</p>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{selectedBranch} - Students</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Overview of students enrolled in the currently selected branch.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--primary-subtle)] transition-colors">
            <Upload size={14} /> Import
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--primary-subtle)] transition-colors">
            <Download size={14} /> CSV
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--primary-subtle)] transition-colors">
            <Printer size={14} /> Print
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[#10B981] hover:bg-[rgba(16,185,129,0.1)] transition-colors">
            <MessageSquare size={14} /> WhatsApp
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[#6366F1] hover:bg-[rgba(99,102,241,0.1)] transition-colors">
            <Mail size={14} /> Email
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg py-2.5 pl-9 pr-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors"
            placeholder="Search by student name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* AG Grid Table */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden border border-[var(--border)]">
        <AgGridReact
          rowData={filtered}
          columnDefs={colDefs}
          theme={gridTheme}
          defaultColDef={{ sortable: true, filter: true, resizable: true }}
          headerHeight={44}
          rowHeight={56}
        />
      </div>
    </div>
  );
}
