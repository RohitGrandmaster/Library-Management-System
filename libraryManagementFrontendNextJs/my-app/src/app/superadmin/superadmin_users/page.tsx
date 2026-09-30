'use client';
import { useState, useMemo } from 'react';
import { Plus, Shield, ShieldCheck, Key, History, Activity, X, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  branch: string;
  status: string;
  lastLogin: string;
}

const INITIAL_USERS: UserData[] = [
  { id: '1', name: 'Rahul Sharma', username: 'rahul.s', email: 'rahul@nexus360.com', role: 'SuperAdmin', branch: 'Global', status: 'Active', lastLogin: '2024-03-10 09:30 AM' },
  { id: '2', name: 'Amit Verma', username: 'amit.v', email: 'amit@studynest.com', role: 'Admin', branch: 'StudyNest Patna', status: 'Active', lastLogin: '2024-03-09 11:15 AM' },
  { id: '3', name: 'Priya Das', username: 'priya.d', email: 'priya@studynest.com', role: 'Manager', branch: 'StudyNest Patna', status: 'Inactive', lastLogin: '2024-02-28 04:20 PM' },
];

export default function UsersAndAccessPage() {
  const [activeTab, setActiveTab] = useState('All Users');
  const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<UserData | null>(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', username: '', email: '', role: 'Manager', branch: 'Global' });

  const handleOpenAdd = () => {
    setEditUser(null);
    setFormData({ name: '', username: '', email: '', role: 'Manager', branch: 'Global' });
    setShowModal(true);
  };

  const handleOpenEdit = (user: UserData) => {
    setEditUser(user);
    setFormData({ name: user.name, username: user.username, email: user.email, role: user.role, branch: user.branch });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) return;

    if (editUser) {
      setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...formData } : u));
    } else {
      const newUser: UserData = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        status: 'Active',
        lastLogin: 'Never',
      };
      setUsers(prev => [newUser, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return u;
    }));
  };

  const tabs = [
    { name: 'All Users', icon: Shield },
    { name: 'Roles & Permissions', icon: ShieldCheck },
    { name: 'User Sessions', icon: Activity },
  ];

  const columnDefs = useMemo(() => [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1, 
      cellClass: 'sa-cell-primary-bold',
      cellRenderer: (p: any) => (
        <div className="flex items-center gap-2 h-full">
          <div className="sa-avatar-cell">{p.value.charAt(0)}</div>
          <span>{p.value}</span>
        </div>
      )
    },
    { field: 'email', headerName: 'Email', flex: 1.2, cellClass: 'sa-cell-muted' },
    { 
      field: 'role', 
      headerName: 'Role', 
      flex: 1,
      cellRenderer: (p: any) => (
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          p.value === 'SuperAdmin' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
          p.value === 'Admin' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
          'bg-orange-500/10 text-orange-400 border border-orange-500/20'
        }`}>
          {p.value}
        </span>
      )
    },
    { field: 'branch', headerName: 'Branch', flex: 1, cellClass: 'sa-cell-muted' },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 0.8,
      cellRenderer: (p: any) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
          p.value === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }`}>
          {p.value}
        </span>
      )
    },
    { field: 'lastLogin', headerName: 'Last Login', flex: 1, cellClass: 'sa-cell-muted-sm' },
    {
      headerName: 'Actions',
      flex: 1,
      cellRenderer: (p: any) => (
        <div className="flex items-center gap-3 h-full">
          <button onClick={() => toggleStatus(p.data.id)} className="text-amber-400 hover:text-amber-300 font-medium text-xs">
            {p.data.status === 'Active' ? 'Suspend' : 'Activate'}
          </button>
          <button onClick={() => handleOpenEdit(p.data)} className="text-indigo-400 hover:text-indigo-300 font-medium text-xs">
            Edit
          </button>
          <button onClick={() => handleDelete(p.data.id)} className="text-rose-400 hover:text-rose-300 font-medium text-xs">
            Delete
          </button>
        </div>
      )
    }
  ], []);

  return (
    <div className="sa-page-animate">
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Nexus 360</span><span>/</span><span>Super Admin</span><span>/</span><span>Users & Access</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title">Users & Access</h1>
          <button onClick={handleOpenAdd} className="sa-btn-primary">
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.name 
                ? 'bg-indigo-500/20 text-white border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon size={16} /> {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="sa-card p-0 overflow-hidden h-[600px] flex flex-col">
        {activeTab === 'All Users' ? (
          <div className="flex-1 w-full">
            <AgGridReact
              theme={gridTheme}
              rowData={users}
              columnDefs={columnDefs}
              headerHeight={48}
              rowHeight={64}
              suppressCellFocus
              domLayout="normal"
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/40">
            <ShieldCheck size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">{activeTab} Configuration</p>
            <p className="text-sm mt-1">Advanced RBAC configurations available here.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="sa-wizard-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="sa-wizard-modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield size={20} className="text-primary" /> {editUser ? 'Edit User' : 'Add New User'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white"><X size={20}/></button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Full Name</label>
                  <input type="text" className="sa-input" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Username</label>
                  <input type="text" className="sa-input" value={formData.username} onChange={e => setFormData(p => ({...p, username: e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-white/70 block mb-1">Email Address</label>
                <input type="email" className="sa-input" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Role</label>
                  <select className="sa-input" value={formData.role} onChange={e => setFormData(p => ({...p, role: e.target.value}))}>
                    <option value="SuperAdmin">SuperAdmin</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Branch</label>
                  <input type="text" className="sa-input" value={formData.branch} onChange={e => setFormData(p => ({...p, branch: e.target.value}))} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button className="sa-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="sa-btn-primary" onClick={handleSave}>{editUser ? 'Save Changes' : 'Create User'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
