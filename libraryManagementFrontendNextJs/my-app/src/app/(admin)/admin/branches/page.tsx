'use client';

import { useState, useMemo, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Plus, Pencil, Trash2, CheckCircle, Search } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/(admin)/admin/reusable/gridTheme';

ModuleRegistry.registerModules([AllCommunityModule]);

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  manager: string;
  students: number;
  seats: number;
  status: 'Active' | 'Inactive';
}

const BRANCHES: Branch[] = [
  { id: 'B1', name: 'Main Branch',    address: '12, MG Road',       city: 'Pune',    phone: '9876543210', manager: 'Rajesh Kumar',  students: 248, seats: 60, status: 'Active'   },
  { id: 'B2', name: 'Branch 2',       address: '45, FC Road',       city: 'Pune',    phone: '9876543211', manager: 'Sunita Patil',  students: 180, seats: 40, status: 'Active'   },
  { id: 'B3', name: 'Kothrud Center', address: '8, Paud Road',      city: 'Pune',    phone: '9876543212', manager: 'Amit Desai',    students: 95,  seats: 30, status: 'Active'   },
  { id: 'B4', name: 'Nashik Branch',  address: '22, College Road',  city: 'Nashik',  phone: '9876543213', manager: 'Priya Joshi',   students: 0,   seats: 25, status: 'Inactive' },
];

interface FormState { name: string; address: string; city: string; phone: string; manager: string; seats: string; }
const EMPTY_FORM: FormState = { name: '', address: '', city: '', phone: '', manager: '', seats: '' };

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    fetchApi('/admin/branches').then(data => {
      const mapped = data.map((b: any) => ({
        id: b.id,
        name: b.name,
        address: b.address,
        city: b.city || 'N/A',
        phone: b.contactPhone,
        manager: 'Manager Name',
        students: 0,
        seats: 50,
        status: b.isActive ? 'Active' : 'Inactive',
      }));
      setBranches(mapped);
    }).catch(console.error);
  }, []);
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState<string | null>(null);
  const [deleteId, setDeleteId]   = useState<string | null>(null);
  const [form, setForm]           = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors]       = useState<Partial<FormState>>({});
  const [search, setSearch]       = useState('');

  const filtered = branches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.city.toLowerCase().includes(search.toLowerCase()) ||
    b.manager.toLowerCase().includes(search.toLowerCase())
  );

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.name.trim())    e.name    = 'Branch name is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim())    e.city    = 'City is required';
    if (!form.phone.trim())   e.phone   = 'Phone is required';
    if (!form.manager.trim()) e.manager = 'Manager name is required';
    if (!form.seats || isNaN(Number(form.seats))) e.seats = 'Valid seat count required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(true);
  }

  function openEdit(b: Branch) {
    setEditId(b.id);
    setForm({ name: b.name, address: b.address, city: b.city, phone: b.phone, manager: b.manager, seats: String(b.seats) });
    setErrors({});
    setShowForm(true);
  }

  function handleSave() {
    if (!validate()) return;
    if (editId) {
      setBranches(prev => prev.map(b => b.id === editId ? { ...b, ...form, seats: Number(form.seats) } : b));
    } else {
      setBranches(prev => [...prev, {
        id: `B${Date.now()}`, ...form, seats: Number(form.seats), students: 0, status: 'Active'
      }]);
    }
    setShowForm(false);
  }

  function handleDelete() {
    if (deleteId) setBranches(prev => prev.filter(b => b.id !== deleteId));
    setDeleteId(null);
  }

  const f = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    setErrors(p => ({ ...p, [k]: undefined }));
  };

  const colDefs = useMemo<any[]>(() => [
    { field: 'name', headerName: 'Branch Name', flex: 1.5, minWidth: 150 },
    { field: 'city', headerName: 'City', flex: 1, minWidth: 120 },
    { field: 'manager', headerName: 'Manager', flex: 1.5, minWidth: 150 },
    { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 130 },
    {
      field: 'seats',
      headerName: 'Capacity',
      flex: 1,
      minWidth: 120,
      cellRenderer: (params: any) => (
        <span style={{ fontSize: 13, fontWeight: 500 }}>{params.data.students} / {params.value} Seats</span>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      cellRenderer: (params: any) => (
        <span className={`admin-badge ${params.value === 'Active' ? 'admin-badge-success' : 'admin-badge-danger'}`}>
          {params.value === 'Active' ? '✅ Active' : '🔴 Inactive'}
        </span>
      )
    },
    {
      headerName: 'Actions',
      flex: 1,
      minWidth: 100,
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

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingBottom: 40 }}>
      {/* Page Header */}
      <div className="admin-page-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 24 }}>
        <div>
          <p className="admin-breadcrumb">Smart Library 360 › Admin › Branches</p>
          <h1 className="admin-page-title">Branch Management</h1>
          <p className="admin-page-subtitle">Manage multiple branches and their managers.</p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn-primary" onClick={openAdd}>
            <Plus size={15} /> Add Branch
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16, position: 'relative', maxWidth: 360 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input
          className="admin-input"
          style={{ paddingLeft: 38 }}
          placeholder="Search by branch name, city or manager…"
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
            <h2 className="admin-modal-title">{editId ? 'Edit Branch' : 'Add New Branch'}</h2>
            <div className="admin-form-grid">
              <div className="admin-form-field admin-form-field-full">
                <label className="admin-label admin-label-required">Branch Name</label>
                <input className={`admin-input${errors.name ? ' admin-input-error' : ''}`} value={form.name} onChange={f('name')} placeholder="e.g. Main Branch" />
                {errors.name && <p className="admin-error">{errors.name}</p>}
              </div>
              <div className="admin-form-field admin-form-field-full">
                <label className="admin-label admin-label-required">Address</label>
                <input className={`admin-input${errors.address ? ' admin-input-error' : ''}`} value={form.address} onChange={f('address')} placeholder="Full address" />
                {errors.address && <p className="admin-error">{errors.address}</p>}
              </div>
              <div className="admin-form-field">
                <label className="admin-label admin-label-required">City</label>
                <input className={`admin-input${errors.city ? ' admin-input-error' : ''}`} value={form.city} onChange={f('city')} placeholder="Pune" />
                {errors.city && <p className="admin-error">{errors.city}</p>}
              </div>
              <div className="admin-form-field">
                <label className="admin-label admin-label-required">Phone</label>
                <input className={`admin-input${errors.phone ? ' admin-input-error' : ''}`} value={form.phone} onChange={f('phone')} placeholder="Contact number" />
                {errors.phone && <p className="admin-error">{errors.phone}</p>}
              </div>
              <div className="admin-form-field">
                <label className="admin-label admin-label-required">Manager Name</label>
                <input className={`admin-input${errors.manager ? ' admin-input-error' : ''}`} value={form.manager} onChange={f('manager')} placeholder="Assigned manager" />
                {errors.manager && <p className="admin-error">{errors.manager}</p>}
              </div>
              <div className="admin-form-field">
                <label className="admin-label admin-label-required">Total Seats</label>
                <input className={`admin-input${errors.seats ? ' admin-input-error' : ''}`} type="number" value={form.seats} onChange={f('seats')} placeholder="e.g. 50" />
                {errors.seats && <p className="admin-error">{errors.seats}</p>}
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="admin-btn-primary" onClick={handleSave}>
                <CheckCircle size={14} /> {editId ? 'Save Changes' : 'Add Branch'}
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
              <Trash2 size={18} /> Delete Branch
            </h2>
            <p className="admin-modal-desc">
              Are you sure you want to delete <strong>{branches.find(b => b.id === deleteId)?.name}</strong>? This action cannot be undone.
            </p>
            <div className="admin-modal-footer">
              <button className="admin-btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="admin-btn-danger" onClick={handleDelete}>Delete Branch</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
