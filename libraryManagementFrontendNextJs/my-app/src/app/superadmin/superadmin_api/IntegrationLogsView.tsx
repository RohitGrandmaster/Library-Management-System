"use client";
import React, { useRef, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { Search, Filter, ServerCog, ArrowRightLeft, RefreshCw, XCircle, CheckCircle, Terminal } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const mockLogs = [
  { id: 'req_101', endpoint: '/webhooks/payment/stripe', event: 'charge.succeeded', status: '200 OK', time: '12 ms', date: '2026-09-28 10:15:01', retry: 0 },
  { id: 'req_102', endpoint: '/webhooks/sms/twilio', event: 'message.delivered', status: '200 OK', time: '45 ms', date: '2026-09-28 10:12:44', retry: 0 },
  { id: 'req_103', endpoint: 'External: AWS S3', event: 'upload.avatar', status: '403 Forbidden', time: '120 ms', date: '2026-09-28 10:05:11', retry: 1, error: 'Invalid AWS Access Key' },
  { id: 'req_104', endpoint: '/api/v1/sync/sap', event: 'member.sync', status: '504 Timeout', time: '30000 ms', date: '2026-09-28 09:45:00', retry: 3, error: 'Upstream server did not respond' },
];

export default function IntegrationLogsView() {
  const gridRef = useRef<AgGridReact>(null);

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'Endpoint & Event', field: 'endpoint', flex: 2, minWidth: 250,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex flex-col justify-center h-full">
          <p className="font-bold text-gray-900 dark:text-white leading-tight font-mono text-xs mb-1">{p.data?.endpoint}</p>
          <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><ArrowRightLeft size={10} /> {p.data?.event}</p>
        </div>
      )
    },
    { 
      headerName: 'Status & Error', field: 'status', flex: 1.5, minWidth: 200,
      cellRenderer: (p: ICellRendererParams) => {
        const isError = p.data?.status.startsWith('4') || p.data?.status.startsWith('5');
        return (
          <div className="flex flex-col justify-center h-full gap-1">
            <span className={`w-fit px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 ${isError ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {isError ? <XCircle size={10} /> : <CheckCircle size={10} />} {p.data?.status}
            </span>
            {isError && p.data?.error && (
              <p className="text-[10px] text-red-600 dark:text-red-400 font-medium truncate" title={p.data?.error}>{p.data?.error}</p>
            )}
          </div>
        )
      }
    },
    { 
      headerName: 'Performance', field: 'time', flex: 1, minWidth: 120,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center h-full text-xs font-bold text-gray-700 dark:text-gray-300">
          {p.data?.time}
        </div>
      )
    },
    { 
      headerName: 'Retries', field: 'retry', flex: 1, minWidth: 120,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center h-full">
          {p.data?.retry > 0 ? (
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
              {p.data?.retry} Retries
            </span>
          ) : (
            <span className="text-xs text-gray-400 font-medium">None</span>
          )}
        </div>
      )
    },
    { 
      headerName: 'Timestamp & Payload', field: 'date', flex: 1.5, minWidth: 220,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center justify-between h-full w-full pr-4">
          <span className="text-xs font-bold text-gray-500">{p.data?.date}</span>
          <button className="p-1.5 bg-gray-100 hover:bg-amber-100 text-gray-600 hover:text-amber-600 dark:bg-gray-800 dark:hover:bg-amber-900/30 rounded transition-colors" title="View Req/Res Payload">
            <Terminal size={14} />
          </button>
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
            <ServerCog size={20} className="text-amber-500" /> Integration & Webhook Logs
          </h3>
          <p className="text-xs font-medium text-gray-500 mt-0.5">Debug raw HTTP requests, responses, and webhook deliveries.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search endpoints or events..." 
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm"
              onChange={e => gridRef.current?.api.setGridOption('quickFilterText', e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all hover:border-gray-400">
            <Filter size={14} className="text-gray-500" /> Errors Only
          </button>
        </div>
      </div>
      
      <div className="h-[600px] w-full">
        <AgGridReact
          ref={gridRef}
          theme={gridTheme}
          rowData={mockLogs}
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
