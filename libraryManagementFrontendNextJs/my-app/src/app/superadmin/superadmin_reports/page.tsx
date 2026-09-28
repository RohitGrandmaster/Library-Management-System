'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import { 
  BarChart2, Filter, FileText, Download, Printer, 
  PieChart, TrendingUp, Building2, Users, Database, FileSpreadsheet, RefreshCw,
  LineChart, Search, Activity, ShieldAlert, CreditCard
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  { id: "Platform Overview", icon: PieChart, color: "sky", tabClass: "bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-900/20 dark:border-sky-800/50 dark:text-sky-400", iconClass: "text-sky-600 dark:text-sky-400" },
  { id: "Financial & Billing", icon: CreditCard, color: "emerald", tabClass: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400", iconClass: "text-emerald-600 dark:text-emerald-400" },
  { id: "Library & Usage Activity", icon: Users, color: "indigo", tabClass: "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800/50 dark:text-indigo-400", iconClass: "text-indigo-600 dark:text-indigo-400" },
  { id: "System & API Health", icon: Activity, color: "rose", tabClass: "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-400", iconClass: "text-rose-600 dark:text-rose-400" },
  { id: "Custom SQL Builder", icon: Database, color: "amber", tabClass: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400", iconClass: "text-amber-600 dark:text-amber-400" }
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
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 bg-sky-100 border border-sky-200 dark:bg-sky-900/30 dark:border-sky-800/40 dark:text-sky-400 px-2.5 py-1 rounded-full">{p.value}</span>
    )},
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 120, cellRenderer: (p: ICellRendererParams) => (
      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${p.value === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800/40 dark:text-emerald-400' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:border-red-800/40 dark:text-red-400'}`}>{p.value}</span>
    )},
    { field: 'branches', headerName: 'Branches', flex: 1, minWidth: 120, cellClass: 'font-medium' },
    { field: 'users', headerName: 'Total Users', flex: 1, minWidth: 120, cellClass: 'font-medium' },
    { field: 'books', headerName: 'Inventory', flex: 1, minWidth: 120, cellClass: 'font-medium' },
    { field: 'revenue', headerName: 'MRR', flex: 1, minWidth: 120, cellClass: 'font-black text-emerald-600 dark:text-emerald-400' },
    { field: 'usage', headerName: 'Platform Usage', flex: 1.5, minWidth: 160, cellRenderer: (p: ICellRendererParams) => {
      const val = parseInt(p.value.replace('%', ''));
      const isHigh = val > 85;
      const isLow = val < 30;
      return (
        <div className="flex items-center gap-3 h-full">
          <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className={`h-full ${isHigh ? 'bg-emerald-500' : isLow ? 'bg-rose-500' : 'bg-sky-500'} transition-all`} style={{ width: p.value }} />
          </div>
          <span className={`text-[11px] font-extrabold ${isHigh ? 'text-emerald-600 dark:text-emerald-400' : isLow ? 'text-rose-600 dark:text-rose-400' : 'text-sky-600 dark:text-sky-400'}`}>{p.value}</span>
        </div>
      )
    }},
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  const handleExport = (type: string) => {
    setIsExporting(type);
    setTimeout(() => setIsExporting(null), 1500);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "Custom SQL Builder":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden p-8 md:p-16 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500 min-h-[500px]">
             <div className="p-6 bg-amber-100 dark:bg-amber-900/40 rounded-full mb-6 shadow-inner border border-amber-200 dark:border-amber-800">
              <Database size={48} className="text-amber-500 dark:text-amber-400" />
            </div>
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">Custom SQL Query Builder</h4>
            <p className="text-gray-500 font-medium max-w-lg mx-auto mb-8">
              Create completely custom views by dragging and dropping fields or writing raw SQL queries. Custom reports can be scheduled and exported directly.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-6 py-3.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2">
                <Database size={18} /> Open SQL Editor
              </button>
              <button className="px-6 py-3.5 text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400 dark:hover:bg-amber-900/40 rounded-xl transition-all flex items-center gap-2">
                <FileSpreadsheet size={18} /> Visual Builder
              </button>
            </div>
          </div>
        );

      case "System & API Health":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden p-8 flex flex-col min-h-[500px] animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="flex-1 p-6 rounded-2xl bg-rose-50 border border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/50">
                <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-2"><ShieldAlert size={16}/> Blocked Requests</h3>
                <p className="text-4xl font-black text-rose-700 dark:text-rose-500">14.2K</p>
                <p className="text-xs font-bold text-gray-500 mt-2">DDoS attempts & Rate limited</p>
              </div>
              <div className="flex-1 p-6 rounded-2xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/50">
                <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Activity size={16}/> Global Uptime</h3>
                <p className="text-4xl font-black text-emerald-700 dark:text-emerald-500">99.99%</p>
                <p className="text-xs font-bold text-gray-500 mt-2">Last 30 Days rolling</p>
              </div>
              <div className="flex-1 p-6 rounded-2xl bg-indigo-50 border border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-900/50">
                <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-2"><RefreshCw size={16}/> API Calls / Min</h3>
                <p className="text-4xl font-black text-indigo-700 dark:text-indigo-500">24.5K</p>
                <p className="text-xs font-bold text-gray-500 mt-2">Peak: 31K at 10AM</p>
              </div>
            </div>
            <div className="flex-1 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1E293B] flex items-center justify-center">
              <p className="text-gray-400 font-bold flex flex-col items-center gap-3">
                <LineChart size={40} className="text-rose-300 dark:text-rose-900" />
                System Metric Visualization Area
              </p>
            </div>
          </div>
        );

      case "Platform Overview":
        return (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-xl"><Building2 size={24} /></div>
                  <span className="px-2.5 py-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"><TrendingUp size={10} /> +12%</span>
                </div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Libraries</h3>
                <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">452</p>
              </div>
              
              <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl"><Users size={24} /></div>
                  <span className="px-2.5 py-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"><TrendingUp size={10} /> +5.4%</span>
                </div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Global Active Users</h3>
                <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">84.2K</p>
              </div>

              <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl"><PieChart size={24} /></div>
                  <span className="px-2.5 py-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"><TrendingUp size={10} /> +18%</span>
                </div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total MRR</h3>
                <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">$42,500</p>
              </div>

              <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl"><Database size={24} /></div>
                  <span className="px-2.5 py-1 text-[10px] font-extrabold text-rose-700 bg-rose-50 dark:bg-rose-900/30 rounded-full border border-rose-200 dark:border-rose-800 flex items-center gap-1"><TrendingUp size={10} className="rotate-180" /> -2%</span>
                </div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Storage Used</h3>
                <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">4.2 TB</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden p-6 flex flex-col items-center justify-center min-h-[400px] border-dashed">
              <BarChart2 size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
              <h3 className="text-lg font-bold text-gray-600 dark:text-gray-400">Growth & Revenue Projections</h3>
              <p className="text-sm text-gray-400 mt-2">Main chart visualization area</p>
            </div>
          </div>
        );

      // Default Grid for Library & Usage / Financials
      case "Library & Usage Activity":
      case "Financial & Billing":
      default:
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col min-h-[550px]">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1F3C]/50 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet size={24} className={activeMenu === 'Financial & Billing' ? 'text-emerald-500' : 'text-indigo-500'} /> {activeMenu} Data
              </h3>
              <p className="text-xs text-gray-500 font-bold px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">Showing {mockReportData.length} records</p>
            </div>
            
            <div className="w-full flex-1 relative">
              <div className="absolute inset-0">
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
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-0 h-full">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 shrink-0">
        <div>
          <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Nexus 360</span><span>/</span><span className="text-sky-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Reports & Analytics</span>
          </div>
          <h1 className="sa-page-title text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-sky-100 dark:bg-sky-900/30 rounded-xl shadow-sm border border-sky-200/50 dark:border-sky-800/50">
              <BarChart2 size={28} className="text-sky-600 dark:text-sky-400" />
            </div>
            Global Reports & Analytics
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Aggregate platform data, visualize financial trends, and export compliance-ready CSV/PDF reports.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          {['PDF', 'Excel', 'CSV'].map(format => (
            <button 
              key={format}
              onClick={() => handleExport(format)}
              disabled={isExporting !== null}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all disabled:opacity-50"
            >
              {isExporting === format ? <RefreshCw size={14} className="animate-spin text-sky-500" /> : (format === 'PDF' ? <FileText size={16} className="text-red-500" /> : <Download size={16} className="text-emerald-500" />)}
              {isExporting === format ? 'Exporting...' : `Export ${format}`}
            </button>
          ))}
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all">
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="bg-white dark:bg-[#0F172A] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 mr-2 text-sm font-extrabold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          <Filter size={18} className="text-sky-500" /> Filters
        </div>
        
        <div className="flex-1 flex flex-wrap items-center gap-3">
          <div className="relative group">
            <select className="pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm text-gray-700 dark:text-gray-200 appearance-none min-w-[140px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <option>Year to Date (YTD)</option>
              <option>Last 30 Days</option>
              <option>Custom Range...</option>
            </select>
          </div>
          
          <div className="relative group">
            <select className="pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm text-gray-700 dark:text-gray-200 appearance-none min-w-[140px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <option>All Libraries</option>
              <option>StudyNest</option>
              <option>LibroHub</option>
            </select>
          </div>

          <div className="relative group">
            <select className="pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm text-gray-700 dark:text-gray-200 appearance-none min-w-[140px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <option>All Branches</option>
              <option>Main Branch Only</option>
            </select>
          </div>

          <div className="relative group">
            <select className="pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm text-gray-700 dark:text-gray-200 appearance-none min-w-[140px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <option>All Plans</option>
              <option>Enterprise</option>
              <option>Free Trial</option>
            </select>
          </div>

          <div className="relative group">
            <select className="pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm text-gray-700 dark:text-gray-200 appearance-none min-w-[140px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <option>Status: All</option>
              <option>Active</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>

        <button onClick={() => gridRef.current?.api.onFilterChanged()} className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/20 transition-all flex items-center gap-2 whitespace-nowrap">
          <Search size={14} /> Apply Filters
        </button>
      </div>

      {/* Sub-menu Grid */}
      <div className="shrink-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
        {SUB_MENUS.map(menu => {
          const Icon = menu.icon;
          const isActive = activeMenu === menu.id;
          
          return (
            <button
              key={menu.id}
              onClick={() => setActiveMenu(menu.id)}
              className={`flex flex-col items-center justify-center p-4 gap-2 rounded-2xl border text-center transition-all ${
                isActive 
                  ? `${menu.tabClass} shadow-md scale-[1.02]`
                  : 'bg-white dark:bg-[#0F172A] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-gray-900 dark:hover:text-white shadow-sm'
              }`}
            >
              <Icon size={20} className={isActive ? menu.iconClass : 'opacity-70'} />
              <span className="text-[11px] font-extrabold uppercase tracking-wider">{menu.id}</span>
            </button>
          )
        })}
      </div>

      {/* Dynamic Content */}
      <div className="w-full flex-1 min-h-0 overflow-y-auto pb-6 custom-scrollbar pr-2">
        {renderContent()}
      </div>
    </div>
  );
}
