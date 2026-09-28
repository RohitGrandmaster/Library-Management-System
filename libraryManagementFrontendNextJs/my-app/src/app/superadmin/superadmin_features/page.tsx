'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import FeatureDetailsView from './FeatureDetailsView';
import { Wand2, Search, Filter, TestTube, CheckCircle, XCircle } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  "Feature Catalog", "Feature Flags", "Library-wise Features", "Branch-wise Features", 
  "Plan-wise Features", "Beta Features", "Experimental Features", "Maintenance Controls"
];

// Mock Data
const mockFeatures = [
  { id: '1', name: 'Barcode Integration', desc: 'Scan books and ID cards via barcode.', status: 'Enabled', type: 'Core', usage: 120 },
  { id: '2', name: 'Online Reservations', desc: 'Allow members to hold books online.', status: 'Enabled', type: 'Add-on', usage: 85 },
  { id: '3', name: 'WhatsApp Notifications', desc: 'Send alerts directly via WhatsApp API.', status: 'Beta', type: 'Integration', usage: 15 },
  { id: '4', name: 'Online Payment Gateway', desc: 'Accept fine payments via Razorpay/Stripe.', status: 'Enabled', type: 'Core', usage: 200 },
  { id: '5', name: 'Advanced Reports', desc: 'AI-driven analytics and custom exports.', status: 'Beta', type: 'Premium', usage: 40 },
  { id: '6', name: 'Multiple Branch Support', desc: 'Centralized control for multi-location libs.', status: 'Enabled', type: 'Core', usage: 50 },
  { id: '7', name: 'API Access', desc: 'GraphQL endpoints for external connections.', status: 'Disabled', type: 'Developer', usage: 0 },
  { id: '8', name: 'Automated Backup', desc: 'Daily database snapshots to AWS S3.', status: 'Enabled', type: 'Infrastructure', usage: 300 },
];

export default function FeaturesPage() {
  const [activeMenu, setActiveMenu] = useState("Feature Catalog");
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const gridRef = useRef<AgGridReact>(null);

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'Feature Module', field: 'name', flex: 2, minWidth: 260,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-3 h-full cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 font-extrabold text-sm group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-sm">
            <Wand2 size={18} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-bold text-gray-900 dark:text-white group-hover:text-violet-600 transition-colors leading-tight">{p.data?.name}</p>
            <p className="text-[11px] text-gray-500 font-semibold truncate max-w-[200px]" title={p.data?.desc}>{p.data?.desc}</p>
          </div>
        </div>
      ),
    },
    { 
      headerName: 'Category', field: 'type', flex: 1, minWidth: 140,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center h-full text-sm font-bold text-gray-700 dark:text-gray-300">
          {p.data?.type}
        </div>
      )
    },
    { 
      headerName: 'Platform Usage', field: 'usage', flex: 1, minWidth: 140,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-2 h-full">
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{p.data?.usage} Tenants</span>
        </div>
      )
    },
    { 
      headerName: 'Global Status', field: 'status', flex: 1, minWidth: 140,
      cellRenderer: (p: ICellRendererParams) => {
        let colors = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
        let icon = <XCircle size={12} />;
        
        if (p.data?.status === 'Enabled') {
          colors = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
          icon = <CheckCircle size={12} />;
        }
        if (p.data?.status === 'Beta') {
          colors = 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400 border-violet-200 dark:border-violet-800';
          icon = <TestTube size={12} />;
        }
        
        return (
          <div className="flex items-center h-full">
            <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm border flex items-center gap-1.5 ${colors}`}>
              {icon} {p.data?.status}
            </span>
          </div>
        )
      }
    }
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  const getFilteredFeatures = () => {
    if (activeMenu === "Feature Flags") return mockFeatures.filter(p => p.status === 'Disabled');
    if (activeMenu === "Beta Features" || activeMenu === "Experimental Features") return mockFeatures.filter(p => p.status === 'Beta');
    return mockFeatures;
  };

  if (selectedFeature) {
    return <FeatureDetailsView feature={selectedFeature} onBack={() => setSelectedFeature(null)} />;
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full flex-1 animate-in fade-in zoom-in-95 duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Nexus 360</span><span>/</span><span className="text-violet-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Feature Management</span>
          </div>
          <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-xl shadow-sm border border-violet-200/50 dark:border-violet-800/50">
              <Wand2 size={28} className="text-violet-600 dark:text-violet-400" />
            </div>
            Feature Management
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-2xl">Toggle modules globally, deploy beta features to specific branches, or limit API access based on subscription plans.</p>
        </div>
      </div>

      {/* Sub-menu Tabs */}
      <div className="flex gap-1.5 pb-2 pt-1 px-1 overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {SUB_MENUS.map(menu => (
          <button
            key={menu}
            onClick={() => setActiveMenu(menu)}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all shadow-sm flex-1 ${
              activeMenu === menu 
                ? 'bg-violet-600 text-white shadow-violet-600/20 scale-105' 
                : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-violet-50 dark:hover:bg-[#1E293B] hover:text-violet-600 hover:border-violet-200'
            }`}
          >
            {menu}
          </button>
        ))}
      </div>

      {/* Main Content Area based on Tab */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col flex-1">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-[#0D1F3C]">
          <div className="relative max-w-md w-full">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search features, modules, or tags..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all shadow-sm"
              onChange={e => gridRef.current?.api.setGridOption('quickFilterText', e.target.value)}
            />
          </div>
          <button onClick={() => gridRef.current?.api.setFilterModel(null)} className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all hover:border-gray-400">
              <Filter size={16} className="text-gray-500" /> Reset Filters
            </button>
        </div>
        
        <div className="flex-1 w-full min-h-0 relative">
          <AgGridReact
            ref={gridRef}
            theme={gridTheme}
            rowData={getFilteredFeatures()}
            columnDefs={colDefs}
            rowHeight={72}
            headerHeight={52}
            onGridReady={onGridReady}
            onRowClicked={p => setSelectedFeature(p.data)}
            pagination={true}
            paginationPageSize={15}
            rowClass="cursor-pointer hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
