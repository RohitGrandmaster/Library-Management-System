"use client";
import React, { useRef, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { Search, Filter, ShieldAlert, ArrowRight } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const mockHistory = [
  { id: 1, role: 'Admin', module: 'Users', action: 'Delete/Archive', oldVal: 'Allowed', newVal: 'Denied', changedBy: 'SuperAdmin (SA-01)', time: '2026-09-28 10:30 AM', reason: 'Security Policy Update v2', ip: '192.168.1.45', session: 'sess_938xn1' },
  { id: 2, role: 'Manager', module: 'Reports', action: 'Export', oldVal: 'Denied', newVal: 'Allowed', changedBy: 'SuperAdmin (SA-01)', time: '2026-09-27 04:15 PM', reason: 'Requested by regional managers', ip: '192.168.1.45', session: 'sess_722mb9' },
  { id: 3, role: 'Admin', module: 'System Settings', action: 'Manage/Settings', oldVal: 'Allowed', newVal: 'Denied', changedBy: 'System Automation', time: '2026-09-20 01:00 AM', reason: 'Automated lockdown', ip: '10.0.0.1', session: 'sys_auto' },
  { id: 4, role: 'Manager', module: 'Fines & Payments', action: 'Approve', oldVal: 'Allowed', newVal: 'Denied', changedBy: 'SuperAdmin (SA-02)', time: '2026-09-15 11:20 AM', reason: 'Audit requirement', ip: '110.45.22.19', session: 'sess_118qk4' },
];

export default function PermissionHistory() {
  const gridRef = useRef<AgGridReact>(null);

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'Role & Module', field: 'role', flex: 1.5, minWidth: 200,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex flex-col justify-center h-full">
          <p className="font-bold text-gray-900 dark:text-white leading-tight">Role: <span className="text-orange-600 dark:text-orange-400">{p.data?.role}</span></p>
          <p className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">Module: {p.data?.module} <ArrowRight size={10} /> {p.data?.action}</p>
        </div>
      )
    },
    { 
      headerName: 'Permission Change', field: 'oldVal', flex: 1.5, minWidth: 200,
      cellRenderer: (p: ICellRendererParams) => {
        const isGranted = p.data?.newVal === 'Allowed';
        return (
          <div className="flex items-center gap-3 h-full">
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.data?.oldVal === 'Allowed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{p.data?.oldVal}</span>
            <ArrowRight size={14} className="text-gray-400" />
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${isGranted ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
              {p.data?.newVal}
            </span>
          </div>
        )
      }
    },
    { 
      headerName: 'Reason & Actor', field: 'changedBy', flex: 2, minWidth: 250,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex flex-col justify-center h-full">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate" title={p.data?.reason}>"{p.data?.reason}"</p>
          <p className="text-[11px] font-medium text-gray-500">By: {p.data?.changedBy} ({p.data?.ip})</p>
        </div>
      )
    },
    { 
      headerName: 'Timestamp', field: 'time', flex: 1, minWidth: 150,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center h-full text-xs font-bold text-gray-500">
          {p.data?.time}
        </div>
      )
    }
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-[#0D1F3C]">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldAlert size={20} className="text-orange-500" /> Matrix Audit Trail
          </h3>
          <p className="text-xs font-medium text-gray-500 mt-0.5">Track every change made to the roles and permission matrices.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search audit logs..." 
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-sm"
              onChange={e => gridRef.current?.api.setGridOption('quickFilterText', e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all hover:border-gray-400">
            <Filter size={14} className="text-gray-500" /> Filter
          </button>
        </div>
      </div>
      
      <div className="h-[600px] w-full">
        <AgGridReact
          ref={gridRef}
          theme={gridTheme}
          rowData={mockHistory}
          columnDefs={colDefs}
          rowHeight={64}
          headerHeight={52}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={15}
        />
      </div>
    </div>
  );
}
