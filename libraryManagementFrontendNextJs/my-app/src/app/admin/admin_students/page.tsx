'use client';

import { useState, useMemo, useEffect } from 'react';
import { Users, Download, Search } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/admin/admin_reusable/gridTheme';
import { useAdmin } from '@/app/admin/AdminContext';
import { fetchApi } from '@/lib/api';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function AdminStudentsPage() {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const { selectedBranch } = useAdmin();

  useEffect(() => {
    fetchApi('/admin/admin_students').then(data => {
      const mapped = data.map((s: any) => ({
        id: 'STU-' + s.id.substring(0, 4).toUpperCase(),
        name: s.fullName,
        shift: 'Morning', // default or mock
        seat: 'A-10',
        plan: 'Monthly',
        status: 'Active',
      }));
      setStudents(mapped);
    }).catch(console.error);
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
        <span className={`admin-badge ${params.value === 'Active' ? 'admin-badge-success' : 'admin-badge-danger'}`}>
            {params.value}
        </span>
    ) },
  ], []);

  return (
    <div className="h-full flex flex-col pb-10 space-y-6">
      <div className="admin-page-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 24 }}>
        <div>
          <p className="admin-breadcrumb">Smart Library 360 &gt; Admin &gt; Students</p>
          <h1 className="admin-page-title">{selectedBranch} - Students</h1>
          <p className="admin-page-subtitle">Overview of students enrolled in the currently selected branch.</p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn-outline" style={{ display: 'flex', alignItems: 'center' }}>
            <Download size={16} className="mr-2" /> Export List
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
          <input
            className="admin-input"
            style={{ paddingLeft: '36px', width: '100%' }}
            placeholder="Search by student name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-wrapper" style={{ flex: 1, minHeight: 400 }}>
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
