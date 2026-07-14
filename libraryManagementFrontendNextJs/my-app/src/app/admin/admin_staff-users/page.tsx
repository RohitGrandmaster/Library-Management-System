'use client';

import { useState, useMemo, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { UserPlus, Pencil, Trash2, CheckCircle, Search, Users } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/admin/admin_reusable/gridTheme';

ModuleRegistry.registerModules([AllCommunityModule]);

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Admin' | 'Manager' | 'Staff';
  branch: string;
  status: 'Active' | 'Inactive';
  joinedDate: string;
}

const STAFF: StaffMember[] = [
  { id: 'S1', name: 'Rajesh Kumar',  email: 'rajesh@library.com',  phone: '9876543210', role: 'Admin',   branch: 'Main Branch',    status: 'Active',   joinedDate: '01/01/24' },
  { id: 'S2', name: 'Sunita Patil',  email: 'sunita@library.com',  phone: '9876543211', role: 'Manager', branch: 'Branch 2',       status: 'Active',   joinedDate: '15/03/24' },
  { id: 'S3', name: 'Amit Desai',    email: 'amit@library.com',    phone: '9876543212', role: 'Manager', branch: 'Kothrud Center', status: 'Active',   joinedDate: '01/06/24' },
  { id: 'S4', name: 'Priya Joshi',   email: 'priya@library.com',   phone: '9876543213', role: 'Staff',   branch: 'Main Branch',    status: 'Active',   joinedDate: '10/07/24' },
  { id: 'S5', name: 'Rahul Sharma',  email: 'rahul@library.com',   phone: '9876543214', role: 'Staff',   branch: 'Branch 2',       status: 'Inactive', joinedDate: '20/08/24' },
];

interface FormState { name: string; email: string; phone: string; role: 'Admin' | 'Manager' | 'Staff'; branch: string; }
const EMPTY: FormState = { name: '', email: '', phone: '', role: 'Staff', branch: 'Main Branch' };

export default function AdminStaffUsersPage() {
  const [staff, setStaff]       = useState<StaffMember[]>([]);

  useEffect(() => {
    fetchApi('/admin/admin_staff-users').then(data => {
      const mapped = data.map((u: any) => ({
        id: u.id,
        name: u.fullName,
        email: u.email,
        phone: u.phone,
        role: u.role === 'manager' ? 'Manager' : 'Staff',
        branch: 'Main Branch',
        status: u.isActive ? 'Active' : 'Inactive',
        joinedDate: new Date().toLocaleDateString()
      }));
      setStaff(mapped);
    }).catch(console.error);
  }, []);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm]         = useState<FormState>(EMPTY);
  const [errors, setErrors]     = useState<Partial<FormState>>({});
  const [search, setSearch]     = useState('');

  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.name.trim())  e.name  = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function openAdd() {
    setEditId(null); setForm(EMPTY); setErrors({}); setShowForm(true);
  }

  function openEdit(s: StaffMember) {
    setEditId(s.id);
    setForm({ name: s.name, email: s.email, phone: s.phone, role: s.role, branch: s.branch });
    setErrors({}); setShowForm(true);
  }

  function handleSave() {
    if (!validate()) return;
    if (editId) {
      setStaff(prev => prev.map(s => s.id === editId ? { ...s, ...form } : s));
    } else {
      setStaff(prev => [...prev, {
        id: `S${Date.now()}`, ...form, status: 'Active',
        joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }),
      }]);
    }
    setShowForm(false);
  }

  function handleDelete() {
    if (deleteId) setStaff(prev => prev.filter(s => s.id !== deleteId));
    setDeleteId(null);
  }

  const f = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [k]: e.target.value as any }));
    setErrors(p => ({ ...p, [k]: undefined }));
  };

  const roleBadgeClass = (role: string) => {
    if (role === 'Admin')   return 'admin-badge admin-badge-purple';
    if (role === 'Manager') return 'admin-badge admin-badge-info';
    return 'admin-badge admin-badge-success';
  };

  const colDefs = useMemo<any[]>(() => [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 200 },
    { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 120 },
    {
      field: 'role', headerName: 'Role', flex: 1, minWidth: 120,
      cellRenderer: (params: any) => (
        <span className={roleBadgeClass(params.value)}>{params.value}</span>
      )
    },
    { field: 'branch', headerName: 'Branch', flex: 1, minWidth: 150 },
    { field: 'joinedDate', headerName: 'Joined', flex: 1, minWidth: 120 },
    {
      field: 'status', headerName: 'Status', flex: 1, minWidth: 120,
      cellRenderer: (params: any) => (
        <span className={`admin-badge ${params.value === 'Active' ? 'admin-badge-success' : 'admin-badge-danger'}`}>
          {params.value}
        </span>
      )
    },
    {
      headerName: 'Actions',
      flex: 1,
      minWidth: 120,
      sortable: false,
      cellRenderer: (params: any) => (
        <div style={{ display: 'flex', gap: 6, height: '100%', alignItems: 'center' }}>
          <button className="admin-btn-icon" onClick={() => openEdit(params.data)} title="Edit">
            <Pencil size={14} />
          </button>
          <button className="admin-btn-icon" onClick={() => setDeleteId(params.data.id)} title="Delete" style={{ color: 'var(--danger)' }}>
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ], []);

  const stats = [
    { label: 'Admin',   count: staff.filter(s => s.role === 'Admin').length,   color: 'var(--purple)' },
    { label: 'Manager', count: staff.filter(s => s.role === 'Manager').length, color: 'var(--info)'   },
    { label: 'Staff',   count: staff.filter(s => s.role === 'Staff').length,   color: 'var(--success)'},
    { label: 'Total',   count: staff.length,                                   color: 'var(--primary)'},
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingBottom: 40 }}>
      {/* Page Header */}
      <div className="admin-page-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 24 }}>
        <div>
          <p className="admin-breadcrumb">Smart Library 360 › Admin › Staff &amp; Users</p>
          <h1 className="admin-page-title">Staff &amp; Users</h1>
          <p className="admin-page-subtitle">Manage staff accounts and their branch assignments.</p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn-primary" onClick={openAdd}>
            <UserPlus size={15} /> Add Staff
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {stats.map(s => (
          <div key={s.label} className="admin-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `color-mix(in srgb, ${s.color} 12%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Users size={16} style={{ color: s.color }} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>{s.label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{s.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16, position: 'relative', maxWidth: 360 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input
          className="admin-input"
          style={{ paddingLeft: 38 }}
          placeholder="Search by name, email or role…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* AG Grid */}
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

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2 className="admin-modal-title">{editId ? 'Edit Staff Member' : 'Add Staff Member'}</h2>
            <div className="admin-form-grid">
              <div className="admin-form-field admin-form-field-full">
                <label className="admin-label admin-label-required">Full Name</label>
                <input className={`admin-input${errors.name ? ' admin-input-error' : ''}`} value={form.name} onChange={f('name')} placeholder="Full name" />
                {errors.name && <p className="admin-error">{errors.name}</p>}
              </div>
              <div className="admin-form-field admin-form-field-full">
                <label className="admin-label admin-label-required">Email</label>
                <input className={`admin-input${errors.email ? ' admin-input-error' : ''}`} type="email" value={form.email} onChange={f('email')} placeholder="email@library.com" />
                {errors.email && <p className="admin-error">{errors.email}</p>}
              </div>
              <div className="admin-form-field">
                <label className="admin-label admin-label-required">Phone</label>
                <input className={`admin-input${errors.phone ? ' admin-input-error' : ''}`} value={form.phone} onChange={f('phone')} placeholder="9876543210" />
                {errors.phone && <p className="admin-error">{errors.phone}</p>}
              </div>
              <div className="admin-form-field">
                <label className="admin-label">Role</label>
                <select className="admin-select" style={{ width: '100%', padding: '10px 14px' }} value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as any }))}>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <div className="admin-form-field admin-form-field-full">
                <label className="admin-label">Branch</label>
                <select className="admin-select" style={{ width: '100%', padding: '10px 14px' }} value={form.branch} onChange={e => setForm(p => ({ ...p, branch: e.target.value }))}>
                  <option value="Main Branch">Main Branch</option>
                  <option value="Branch 2">Branch 2</option>
                  <option value="Kothrud Center">Kothrud Center</option>
                  <option value="Nashik Branch">Nashik Branch</option>
                </select>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="admin-btn-primary" onClick={handleSave}>
                <CheckCircle size={14} /> {editId ? 'Save Changes' : 'Add Staff'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <h2 className="admin-modal-title" style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Trash2 size={18} /> Remove Staff Member
            </h2>
            <p className="admin-modal-desc">
              Are you sure you want to remove <strong>{staff.find(s => s.id === deleteId)?.name}</strong>? Their account will be deactivated.
            </p>
            <div className="admin-modal-footer">
              <button className="admin-btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="admin-btn-danger" onClick={handleDelete}>Remove Staff</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
