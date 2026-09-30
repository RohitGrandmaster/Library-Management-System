'use client';
import { useState, useMemo } from 'react';
import { 
  Building2, Plus, Settings, CheckCircle2, 
  MapPin, Phone, Search, Edit2, ShieldAlert
} from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/admin/admin_reusable/gridTheme';

ModuleRegistry.registerModules([AllCommunityModule]);

const MOCK_BRANCHES = [
  { id: 'BR-01', name: 'Central Hub', code: 'CH-PUNE', manager: 'Rajesh Kumar', phone: '+91 9876543210', address: 'MG Road, Pune', books: 12400, members: 840, status: 'Active' },
  { id: 'BR-02', name: 'East Wing', code: 'EW-PUNE', manager: 'Sunita Patil', phone: '+91 9876543211', address: 'Kalyani Nagar, Pune', books: 8200, members: 420, status: 'Active' },
  { id: 'BR-03', name: 'West End', code: 'WE-PUNE', manager: 'Amit Desai', phone: '+91 9876543212', address: 'Baner, Pune', books: 5600, members: 215, status: 'Maintenance' },
];

export default function AdminBranchesPage() {
  const [activeTab, setActiveTab] = useState('All Branches');
  const [search, setSearch] = useState('');

  const tabs = [
    { name: 'All Branches', icon: Building2 },
    { name: 'Add Branch', icon: Plus },
    { name: 'Branch Configuration', icon: Settings },
  ];

  const colDefs = useMemo<any[]>(() => [
    { field: 'name', headerName: 'Branch Name', flex: 1.5 },
    { field: 'code', headerName: 'Branch Code', flex: 1 },
    { field: 'manager', headerName: 'Manager', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1.5 },
    { field: 'books', headerName: 'Total Books', flex: 0.8 },
    { field: 'members', headerName: 'Total Members', flex: 0.8 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      cellRenderer: (params: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          params.value === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
        }`}>
          {params.value}
        </span>
      )
    },
    {
      headerName: 'Actions',
      flex: 1,
      cellRenderer: () => (
        <div className="flex items-center gap-2 mt-2">
          <button className="text-indigo-400 hover:text-indigo-300 font-medium text-xs">View</button>
          <button className="text-emerald-400 hover:text-emerald-300 font-medium text-xs">Edit</button>
        </div>
      )
    }
  ], []);

  const filtered = useMemo(() => {
    return MOCK_BRANCHES.filter(b => 
      b.name.toLowerCase().includes(search.toLowerCase()) || 
      b.city?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="ad-page-animate">
      <div className="flex flex-col gap-1 mb-8">
        <div className="admin-breadcrumb" style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>
          <span>Nexus 360</span><span> / </span><span>Admin</span><span> / </span><span style={{ color: 'var(--primary)' }}>Branches</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title flex items-center gap-3" style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>
            <Building2 className="text-primary" size={28} /> Master Branches
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.name 
                ? 'bg-primary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon size={16} /> {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="admin-card p-0 h-[600px] flex flex-col overflow-hidden">
        
        {activeTab === 'All Branches' && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/10">
              <div className="relative w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input 
                  type="text" 
                  className="admin-input pl-9" 
                  placeholder="Search branches..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button onClick={() => setActiveTab('Add Branch')} className="admin-btn-primary">
                <Plus size={16} /> Add Branch
              </button>
            </div>
            <div className="flex-1 w-full">
              <AgGridReact
                theme={gridTheme}
                rowData={filtered}
                columnDefs={colDefs}
                headerHeight={48}
                rowHeight={60}
                defaultColDef={{ sortable: true, filter: true, resizable: true }}
              />
            </div>
          </div>
        )}

        {activeTab === 'Add Branch' && (
          <div className="p-6 overflow-y-auto h-full animate-fade-in">
            <div className="max-w-2xl">
              <h2 className="text-lg font-bold text-white mb-2">Create New Branch</h2>
              <p className="text-sm text-white/50 mb-8">Deploy a new physical library branch to the Nexus 360 network.</p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Branch Name</label>
                  <input type="text" placeholder="e.g. Central Hub" className="admin-input" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Branch Code</label>
                  <input type="text" placeholder="e.g. CH-PUNE" className="admin-input" />
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                  <label className="text-sm font-semibold text-white/80">Full Address</label>
                  <textarea placeholder="Complete physical address" className="admin-input h-20 py-2 resize-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Contact Number</label>
                  <input type="tel" placeholder="+91" className="admin-input" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Email Address</label>
                  <input type="email" placeholder="branch@example.com" className="admin-input" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Working Hours</label>
                  <input type="text" placeholder="08:00 AM - 10:00 PM" className="admin-input" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Status</label>
                  <select className="admin-input appearance-none bg-black/20">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <button className="admin-btn-primary bg-primary hover:bg-primary-hover border-none">
                  <CheckCircle2 size={16} /> Save Branch
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Branch Configuration' && (
          <div className="flex-1 h-full flex flex-col items-center justify-center text-white/40 animate-fade-in">
            <Settings size={64} className="mb-4 opacity-30 text-primary" />
            <h2 className="text-xl font-bold text-white mb-2">Global Branch Settings</h2>
            <p className="text-sm text-center max-w-sm">Configure working hours, holidays, and multi-branch transfer rules here.</p>
          </div>
        )}

      </div>
    </div>
  );
}
