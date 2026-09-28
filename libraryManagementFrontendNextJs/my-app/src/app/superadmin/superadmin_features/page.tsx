'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

import FeatureDetailsView from './FeatureDetailsView';
import { 
  Wand2, Search, Filter, TestTube, CheckCircle, XCircle, 
  Flag, Lock, Power, Zap, FlaskConical, AlertTriangle, PlayCircle
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const SUB_MENUS = [
  { id: "Feature Catalog", icon: Wand2, color: "fuchsia", tabClass: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700 dark:bg-fuchsia-900/20 dark:border-fuchsia-800/50 dark:text-fuchsia-400", iconClass: "text-fuchsia-600 dark:text-fuchsia-400" },
  { id: "Feature Flags", icon: Flag, color: "indigo", tabClass: "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800/50 dark:text-indigo-400", iconClass: "text-indigo-600 dark:text-indigo-400" },
  { id: "Beta Programs", icon: FlaskConical, color: "emerald", tabClass: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400", iconClass: "text-emerald-600 dark:text-emerald-400" },
  { id: "Maintenance Config", icon: AlertTriangle, color: "amber", tabClass: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400", iconClass: "text-amber-600 dark:text-amber-400" }
];

// Mock Data
const mockFeatures = [
  { id: '1', name: 'Barcode Integration', desc: 'Scan books and ID cards via barcode.', status: 'Enabled', type: 'Core', usage: 120 },
  { id: '2', name: 'Online Reservations', desc: 'Allow members to hold books online.', status: 'Enabled', type: 'Add-on', usage: 85 },
  { id: '3', name: 'WhatsApp Notifications', desc: 'Send alerts directly via WhatsApp API.', status: 'Beta', type: 'Integration', usage: 15 },
  { id: '4', name: 'Online Payment Gateway', desc: 'Accept fine payments via Razorpay/Stripe.', status: 'Enabled', type: 'Core', usage: 200 },
  { id: '5', name: 'Advanced Reports (AI)', desc: 'AI-driven analytics and custom exports.', status: 'Beta', type: 'Premium', usage: 40 },
  { id: '6', name: 'Multiple Branch Support', desc: 'Centralized control for multi-location libs.', status: 'Enabled', type: 'Core', usage: 50 },
  { id: '7', name: 'GraphQL API Access', desc: 'GraphQL endpoints for external connections.', status: 'Disabled', type: 'Developer', usage: 0 },
  { id: '8', name: 'Automated S3 Backup', desc: 'Daily database snapshots to AWS S3.', status: 'Enabled', type: 'Infrastructure', usage: 300 },
];

export default function FeaturesPage() {
  const [activeMenu, setActiveMenu] = useState("Feature Catalog");
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const gridRef = useRef<AgGridReact>(null);

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'Feature Module', field: 'name', flex: 2, minWidth: 260,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-3 h-full cursor-pointer group" onClick={() => setSelectedFeature(p.data)}>
          <div className="w-10 h-10 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-900/40 border border-fuchsia-200 dark:border-fuchsia-800/50 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 font-extrabold text-sm group-hover:scale-110 group-hover:bg-fuchsia-600 group-hover:text-white transition-all shadow-sm">
            <Wand2 size={18} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-extrabold text-gray-900 dark:text-white group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors leading-tight">{p.data?.name}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider truncate max-w-[200px]" title={p.data?.desc}>{p.data?.desc}</p>
          </div>
        </div>
      ),
    },
    { 
      headerName: 'Category', field: 'type', flex: 1, minWidth: 140,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center h-full">
           <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
             {p.data?.type}
           </span>
        </div>
      )
    },
    { 
      headerName: 'Platform Usage', field: 'usage', flex: 1, minWidth: 140,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex flex-col justify-center h-full">
          <span className="text-sm font-black text-gray-900 dark:text-white">{p.data?.usage} Tenants</span>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-1 max-w-[100px]">
            <div className="h-full bg-blue-500" style={{ width: `${Math.min((p.data?.usage / 300) * 100, 100)}%` }} />
          </div>
        </div>
      )
    },
    { 
      headerName: 'Global Status', field: 'status', flex: 1, minWidth: 140,
      cellRenderer: (p: ICellRendererParams) => {
        let colors = 'bg-gray-50 text-gray-700 dark:bg-gray-900/40 dark:text-gray-400 border-gray-200 dark:border-gray-700';
        let icon = <XCircle size={12} />;
        
        if (p.data?.status === 'Enabled') {
          colors = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
          icon = <CheckCircle size={12} />;
        }
        if (p.data?.status === 'Beta') {
          colors = 'bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400 border-violet-200 dark:border-violet-800';
          icon = <TestTube size={12} />;
        }
        
        return (
          <div className="flex items-center h-full">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm border flex items-center gap-1.5 ${colors}`}>
              {icon} {p.data?.status}
            </span>
          </div>
        )
      }
    },
    {
      headerName: 'Action', field: 'id', flex: 1, minWidth: 100, sortable: false, filter: false,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center h-full">
          <button onClick={() => setSelectedFeature(p.data)} className="px-3 py-1.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Configure
          </button>
        </div>
      )
    }
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  if (selectedFeature) {
    return <FeatureDetailsView feature={selectedFeature} onBack={() => setSelectedFeature(null)} />;
  }

  const renderContent = () => {
    switch (activeMenu) {
      case "Feature Flags":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 min-h-[500px]">
             <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-indigo-50/50 dark:bg-indigo-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                  <Flag size={24} /> UI Feature Flags
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Kill-switches and dark launches for front-end components.</p>
              </div>
            </div>
            <div className="p-6 md:p-8 space-y-4">
              {[
                { name: 'Enable New Dashboard UI', key: 'UI_V2_DASHBOARD', status: true },
                { name: 'Show Advanced Search Filters', key: 'UI_ADV_SEARCH', status: true },
                { name: 'Display Maintenance Banner', key: 'SYS_MAINT_BANNER', status: false },
                { name: 'Allow Guest Checkout', key: 'OPAC_GUEST_CHK', status: false },
              ].map((flag, idx) => (
                <label key={idx} className="flex items-center justify-between p-5 bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-gray-700 cursor-pointer shadow-sm hover:border-indigo-300 transition-colors group">
                  <div>
                    <span className="text-sm font-extrabold text-gray-900 dark:text-white block group-hover:text-indigo-600 transition-colors">{flag.name}</span>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1 block font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded w-fit">{flag.key}</span>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${flag.status ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${flag.status ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )
        
      case "Beta Programs":
      case "Maintenance Config":
        return (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-gray-50/30 dark:bg-[#0D1F3C]/20 animate-in zoom-in-95 duration-500 min-h-[500px]">
            <div className="p-5 bg-gray-100 dark:bg-gray-800 rounded-full mb-6 shadow-inner">
               {activeMenu === "Beta Programs" ? <FlaskConical size={48} className="text-gray-400" /> : <AlertTriangle size={48} className="text-gray-400" />}
            </div>
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">{activeMenu} Settings</h4>
            <p className="text-gray-500 font-medium max-w-lg mx-auto">
              Configure tenant inclusion lists and access controls for this module.
            </p>
          </div>
        )

      case "Feature Catalog":
      default:
        return (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 flex flex-col min-h-0 h-full">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
              {[
                { title: 'Total Features', value: '48', icon: <Wand2 size={24} />, color: 'fuchsia' },
                { title: 'Active Globally', value: '32', icon: <Power size={24} />, color: 'emerald' },
                { title: 'In Beta Testing', value: '6', icon: <TestTube size={24} />, color: 'violet' },
                { title: 'Disabled Modules', value: '10', icon: <Lock size={24} />, color: 'gray' }
              ].map(stat => (
                <div key={stat.title} className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between group overflow-hidden relative">
                   <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 dark:bg-${stat.color}-500/10 rounded-bl-full transition-transform group-hover:scale-110`}></div>
                  <div className="relative z-10">
                    <h3 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">{stat.title}</h3>
                    <div className="text-3xl font-black text-gray-900 dark:text-white leading-none">{stat.value}</div>
                  </div>
                  <div className={`relative z-10 w-14 h-14 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 flex items-center justify-center border border-${stat.color}-100 dark:border-${stat.color}-800/50 shadow-sm`}>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col flex-1 min-h-[400px]">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1F3C]/50 flex justify-between items-center shrink-0">
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <Zap size={20} className="text-fuchsia-500" /> Platform Feature Rollouts
                </h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:text-fuchsia-600 shadow-sm"><Filter size={16} /></button>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search Features..." className="pl-9 pr-4 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none shadow-sm" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0">
                  <AgGridReact
                    ref={gridRef}
                    theme={gridTheme}
                    rowData={mockFeatures}
                    columnDefs={colDefs}
                    rowHeight={64}
                    headerHeight={48}
                    onGridReady={onGridReady}
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-[calc(100vh-6rem)]">
      
      {/* Page Header */}
      <div className="shrink-0">
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-fuchsia-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Features</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center shadow-sm border border-fuchsia-200/50 dark:border-fuchsia-800/50">
                <Wand2 size={24} />
              </div>
              Feature Management
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Control global feature modules, toggle UI flags, orchestrate beta testing programs, and manage system maintenance mode.</p>
          </div>
        </div>
      </div>

      {/* Sub-menu Grid */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
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
      <div className="w-full flex-1 min-h-0 relative">
        {renderContent()}
      </div>
    </div>
  );
}
