'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import { 
  BarChart2, Filter, FileText, Download, Printer, 
  PieChart, TrendingUp, Building2, Users, Database, FileSpreadsheet, RefreshCw
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  "Platform Overview", "Library Reports", "Branch Reports", "User Reports", 
  "Usage Reports", "Subscription Reports", "Financial Reports", "Circulation Summary", 
  "Book & Member Summary", "Security Reports", "Audit Reports", "Server Reports", 
  "API Reports", "Custom Reports"
];

// Mock Data for Reports Grid
const mockReportData = [
  { id: 'lib_01', name: 'StudyNest Patna', plan: 'Enterprise', status: 'Active', branches: 4, users: 450, books: 12500, revenue: '$499/mo', usage: '92%' },
  { id: 'lib_02', name: 'Readers Den Delhi', plan: 'Professional', status: 'Active', branches: 1, users: 120, books: 5400, revenue: '$199/mo', usage: '78%' },
  { id: 'lib_03', name: 'LibroHub Mumbai', plan: 'Basic', status: 'Suspended', branches: 1, users: 45, books: 1200, revenue: '$49/mo', usage: '12%' },
  { id: 'lib_04', name: 'Knowledge Tree', plan: 'Enterprise', status: 'Active', branches: 8, users: 1250, books: 45000, revenue: '$999/mo', usage: '98%' },
];

export default function ReportsAnalyticsPage() {
  const [activeMenu, setActiveMenu] = useState("Platform Overview");
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const gridRef = useRef<AgGridReact>(null);

  const colDefs = useMemo<any[]>(() => [
    { field: 'name', headerName: 'Tenant Library', flex: 2, minWidth: 200, cellClass: 'font-bold text-gray-900 dark:text-white' },
    { field: 'plan', headerName: 'Subscription Plan', flex: 1.5, minWidth: 150, cellRenderer: (p: ICellRendererParams) => (
      <span className="text-xs font-bold text-sky-700 bg-sky-100 dark:bg-sky-900/30 dark:text-sky-400 px-2 py-1 rounded">{p.value}</span>
    )},
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 120, cellRenderer: (p: ICellRendererParams) => (
      <span className={`text-xs font-bold px-2 py-1 rounded ${p.value === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{p.value}</span>
    )},
    { field: 'branches', headerName: 'Branches', flex: 1, minWidth: 120 },
    { field: 'users', headerName: 'Total Users', flex: 1, minWidth: 120 },
    { field: 'books', headerName: 'Book Inventory', flex: 1, minWidth: 150 },
    { field: 'revenue', headerName: 'MRR Revenue', flex: 1, minWidth: 130, cellClass: 'font-bold text-emerald-600 dark:text-emerald-400' },
    { field: 'usage', headerName: 'Platform Usage', flex: 1, minWidth: 140, cellRenderer: (p: ICellRendererParams) => (
      <div className="flex items-center gap-2 h-full">
        <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-sky-500" style={{ width: p.value }} />
        </div>
        <span className="text-[10px] font-bold text-gray-500">{p.value}</span>
      </div>
    )},
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  const handleExport = (type: string) => {
    setIsExporting(type);
    setTimeout(() => setIsExporting(null), 1500);
  };

  const renderContent = () => {
    if (activeMenu === "Custom Reports") {
      return (
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden p-16 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
           <div className="p-5 bg-sky-100 dark:bg-sky-900/40 rounded-full mb-6 shadow-inner">
            <Database size={48} className="text-sky-500 dark:text-sky-400" />
          </div>
          <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">Custom SQL Query Builder</h4>
          <p className="text-gray-500 font-medium max-w-lg mx-auto mb-8">
            Create completely custom views by dragging and dropping fields or writing raw SQL queries. Custom reports can be scheduled and exported directly.
          </p>
          <button className="px-6 py-3 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-lg shadow-sky-500/20 transition-all">
            Open Query Builder
          </button>
        </div>
      );
    }

    if (activeMenu === "Platform Overview") {
      return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-xl"><Building2 size={24} /></div>
                <span className="px-2 py-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center gap-1"><TrendingUp size={10} /> +12%</span>
              </div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Libraries</h3>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">452</p>
            </div>
            
            <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl"><Users size={24} /></div>
                <span className="px-2 py-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center gap-1"><TrendingUp size={10} /> +5.4%</span>
              </div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Global Active Users</h3>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">84.2K</p>
            </div>

            <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl"><PieChart size={24} /></div>
              </div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total MRR</h3>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">$42,500</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden p-6 flex items-center justify-center h-64 border-dashed">
            <p className="text-gray-400 font-bold flex items-center gap-2"><BarChart2 /> Advanced Charts Visualization Area</p>
          </div>
        </div>
      );
    }

    // Default Grid for Library/Financial/Etc Reports
    return (
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1F3C] flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet size={20} className="text-sky-500" /> {activeMenu} Data
          </h3>
          <p className="text-xs text-gray-500 font-bold">Showing {mockReportData.length} records based on filters</p>
        </div>
        <div className="h-[500px] w-full">
          <AgGridReact
            ref={gridRef}
            theme={gridTheme}
            rowData={mockReportData}
            columnDefs={colDefs}
            rowHeight={56}
            headerHeight={48}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Nexus 360</span><span>/</span><span className="text-sky-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Reports & Analytics</span>
          </div>
          <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-xl shadow-sm border border-sky-200/50 dark:border-sky-800/50">
              <BarChart2 size={28} className="text-sky-600 dark:text-sky-400" />
            </div>
            Global Reports & Analytics
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Aggregate platform data, visualize financial trends, and export compliance-ready CSV/PDF reports.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {['PDF', 'Excel', 'CSV'].map(format => (
            <button 
              key={format}
              onClick={() => handleExport(format)}
              disabled={isExporting !== null}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all disabled:opacity-50"
            >
              {isExporting === format ? <RefreshCw size={14} className="animate-spin text-sky-500" /> : (format === 'PDF' ? <FileText size={14} className="text-red-500" /> : <Download size={14} className="text-emerald-500" />)}
              {isExporting === format ? 'Exporting...' : `Export ${format}`}
            </button>
          ))}
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all">
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="bg-white dark:bg-[#0F172A] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-3 sticky top-4 z-10">
        <div className="flex items-center gap-2 mr-2 text-sm font-bold text-gray-700 dark:text-gray-300">
          <Filter size={16} className="text-sky-500" /> Filters:
        </div>
        <select className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold outline-none focus:border-sky-500 shadow-sm text-gray-600 dark:text-gray-300">
          <option>Date: Year to Date (YTD)</option>
          <option>Last 30 Days</option>
          <option>Custom Range...</option>
        </select>
        <select className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold outline-none focus:border-sky-500 shadow-sm text-gray-600 dark:text-gray-300">
          <option>All Libraries</option>
          <option>StudyNest</option>
          <option>LibroHub</option>
        </select>
        <select className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold outline-none focus:border-sky-500 shadow-sm text-gray-600 dark:text-gray-300">
          <option>All Branches</option>
          <option>Main Branch Only</option>
        </select>
        <select className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold outline-none focus:border-sky-500 shadow-sm text-gray-600 dark:text-gray-300">
          <option>All Plans</option>
          <option>Enterprise</option>
          <option>Free Trial</option>
        </select>
        <select className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold outline-none focus:border-sky-500 shadow-sm text-gray-600 dark:text-gray-300">
          <option>Status: All</option>
          <option>Active</option>
          <option>Suspended</option>
        </select>
        
        <div className="flex-1"></div>
        <button onClick={() => gridRef.current?.api.onFilterChanged()} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors">
          Apply Filters
        </button>
      </div>

      {/* Sub-menu Tabs */}
      <div className="flex gap-1.5 pb-2 pt-1 px-1 overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {SUB_MENUS.map(menu => (
          <button
            key={menu}
            onClick={() => setActiveMenu(menu)}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all shadow-sm flex-1 ${
              activeMenu === menu 
                ? 'bg-sky-600 text-white shadow-sky-600/20 scale-105' 
                : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-sky-50 dark:hover:bg-[#1E293B] hover:text-sky-600 hover:border-sky-200'
            }`}
          >
            {menu}
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
      <div className="w-full mt-2">
        {renderContent()}
      </div>
    </div>
  );
}
