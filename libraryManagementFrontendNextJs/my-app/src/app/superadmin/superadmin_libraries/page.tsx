'use client';
import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { Eye, Edit2, ShieldAlert, Plus, X, MapPin, Users, CheckCircle, AlertTriangle, Save, Loader } from 'lucide-react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';

ModuleRegistry.registerModules([AllCommunityModule]);

type Library = {
  id: string; name: string; location: string; seats: number; occupied: number;
  status: string; plan: string; owner: string; phone: string; joined: string;
};
type Mode = 'view' | 'edit';

function LibraryPanel({ lib, mode, onClose, onSave, onSuspend }: {
  lib: Library; mode: Mode;
  onClose: () => void;
  onSave: (updated: Library) => void;
  onSuspend: (id: string) => void;
}) {
  const [editing, setEditing] = useState(mode === 'edit');
  const [form, setForm] = useState({ name: lib.name, owner: lib.owner, phone: lib.phone, location: lib.location, plan: lib.plan });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const pct = Math.round((lib.occupied / lib.seats) * 100);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await fetchApi(`/superadmin/libraries/${lib.id}`, {
        method: 'PATCH',
        body: JSON.stringify(form),
      });
      onSave({ ...lib, ...updated });
      setSaved(true);
      setTimeout(() => { setSaved(false); setEditing(false); }, 1200);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sa-panel-overlay" onClick={onClose}>
      <div className="sa-panel-backdrop" />
      <div className="sa-panel-drawer" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-[var(--text-primary)]">{lib.name}</h2>
            <p className="text-[13px] text-[var(--text-secondary)] flex items-center gap-1 mt-1"><MapPin size={12} />{lib.location}</p>
          </div>
          <div className="flex items-center gap-1">
            {!editing && <button className="sa-btn-icon" onClick={() => setEditing(true)}><Edit2 size={15} /></button>}
            <button className="sa-btn-icon" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        {editing ? (
          <div className="space-y-3">
            {([['Library Name','name'],['Owner','owner'],['Phone','phone'],['Location','location']] as [string,string][]).map(([label, key]) => (
              <div key={key}>
                <label className="sa-label">{label}</label>
                <input className="sa-input" value={(form as any)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
            <div>
              <label className="sa-label">Plan</label>
              <select className="sa-select w-full" value={form.plan}
                onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}>
                {['Basic','Pro','Enterprise'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {[['Owner',lib.owner],['Phone',lib.phone],['Plan',lib.plan],['Joined',lib.joined]].map(([label,val]) => (
              <div key={label} className="sa-panel-info-cell">
                <p className="sa-panel-info-label">{label}</p>
                <p className="sa-panel-info-value">{val}</p>
              </div>
            ))}
          </div>
        )}

        <div className="sa-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-[var(--text-primary)] flex items-center gap-2"><Users size={14} /> Seat Occupancy</p>
            <span className={pct > 90 ? 'sa-occupancy-pct--high' : 'sa-occupancy-pct--ok'}>{pct}%</span>
          </div>
          <div className="sa-progress-track">
            <div className={pct > 90 ? 'sa-progress-fill--danger' : 'sa-progress-fill--success'} style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[12px] text-[var(--text-secondary)] mt-2">{lib.occupied} occupied / {lib.seats} total seats</p>
        </div>

        <div>
          {lib.status === 'Active'
            ? <span className="sa-badge sa-badge--success"><CheckCircle size={11} /> Active</span>
            : <span className="sa-badge sa-badge--warning"><AlertTriangle size={11} /> Maintenance</span>}
        </div>

        <div className="flex gap-3 pt-2">
          {editing ? (
            <>
              <button className="sa-btn-primary sa-btn-primary--flex" onClick={handleSave} disabled={saving}>
                {saving ? <><Loader size={14} className="animate-spin" /> Saving...</>
                  : saved ? <><CheckCircle size={14} /> Saved!</>
                  : <><Save size={14} /> Save Changes</>}
              </button>
              <button className="sa-btn-ghost sa-btn-primary--flex" onClick={() => setEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button className="sa-btn-primary sa-btn-primary--flex" onClick={() => setEditing(true)}><Edit2 size={14} /> Edit Library</button>
              <button className="sa-btn-ghost sa-btn-primary--flex sa-btn-ghost--danger" onClick={() => { onSuspend(lib.id); onClose(); }}>
                <ShieldAlert size={14} /> {lib.status === 'Active' ? 'Suspend' : 'Reactivate'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LibrariesPage() {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Library | null>(null);
  const [panelMode, setPanelMode] = useState<Mode>('view');
  const [toast, setToast] = useState('');
  const gridRef = useRef<AgGridReact>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    fetchApi('/superadmin/libraries')
      .then(data => { setLibraries(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const handleSave = (updated: Library) => {
    setLibraries(libs => libs.map(l => l.id === updated.id ? updated : l));
    setSelected(updated);
    showToast(`✅ ${updated.name} updated successfully`);
  };

  const handleSuspend = async (id: string) => {
    const lib = libraries.find(l => l.id === id);
    if (!lib) return;
    const newStatus = lib.status === 'Active' ? 'Maintenance' : 'Active';
    try {
      await fetchApi(`/superadmin/libraries/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setLibraries(libs => libs.map(l => l.id === id ? { ...l, status: newStatus } : l));
      showToast('⚠️ Library status updated');
    } catch (err) {
      showToast('❌ Failed to update status');
    }
  };

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'Library Name', field: 'name', flex: 2, minWidth: 180,
      cellRenderer: (p: ICellRendererParams<Library>) => (
        <div>
          <p className="font-medium text-[var(--text-primary)]">{p.data?.name}</p>
          <p className="text-[11px] text-[var(--text-secondary)]">{p.data?.plan} Plan</p>
        </div>
      ),
    },
    { headerName: 'Location', field: 'location', flex: 1.5, minWidth: 160, cellClass: () => 'sa-cell-muted' },
    {
      headerName: 'Seats', field: 'occupied', flex: 1, minWidth: 120,
      cellRenderer: (p: ICellRendererParams<Library>) => {
        const pct = Math.round(((p.data?.occupied ?? 0) / (p.data?.seats ?? 1)) * 100);
        return (
          <div className="flex flex-col gap-1.5 justify-center h-full">
            <span className="text-[13px] font-medium text-[var(--text-primary)]">
              {p.data?.occupied}<span className="text-[var(--text-secondary)]">/{p.data?.seats}</span>
            </span>
            <div className="sa-progress-track w-20">
              <div className={pct > 90 ? 'sa-progress-fill--danger' : 'sa-progress-fill--success'} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      },
    },
    {
      headerName: 'Status', field: 'status', flex: 1, minWidth: 120,
      cellRenderer: (p: ICellRendererParams<Library>) => (
        p.data?.status === 'Active'
          ? <span className="sa-badge sa-badge--success">✅ Active</span>
          : <span className="sa-badge sa-badge--warning">⚠️ Maintenance</span>
      ),
    },
    {
      headerName: 'Actions', field: 'id', flex: 1, minWidth: 120, sortable: false, filter: false,
      cellRenderer: (p: ICellRendererParams<Library>) => (
        <div className="flex items-center gap-1 h-full">
          <button className="sa-btn-icon" onClick={e => { e.stopPropagation(); setPanelMode('view'); setSelected(p.data!); }}><Eye size={15} /></button>
          <button className="sa-btn-icon sa-btn-icon--success" onClick={e => { e.stopPropagation(); setPanelMode('edit'); setSelected(p.data!); }}><Edit2 size={15} /></button>
          <button className="sa-btn-icon sa-btn-icon--danger" onClick={e => { e.stopPropagation(); handleSuspend(p.data!.id); }}><ShieldAlert size={15} /></button>
        </div>
      ),
    },
  ], [libraries]);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <>
      {toast && <div className="sa-toast">{toast}</div>}
      {selected && (
        <LibraryPanel lib={selected} mode={panelMode} onClose={() => setSelected(null)} onSave={handleSave} onSuspend={handleSuspend} />
      )}

      <div className="flex flex-col gap-1 mb-6">
        <div className="sa-breadcrumb">
          <span>Nexus 360</span><span>/</span><span>Super Admin</span><span>/</span><span>Libraries</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="sa-page-title">Registered Libraries</h1>
          <Link href="/superadmin/superadmin_setup-wizard" className="sa-btn-primary"><Plus size={15} /> Add Branch</Link>
        </div>
      </div>

      <div className="sa-card overflow-hidden">
        <div className="sa-actions-bar justify-between">
          <input type="text" placeholder="Search by name or location..." className="sa-input w-72"
            onChange={e => gridRef.current?.api.setGridOption('quickFilterText', e.target.value)} />
          <span className="text-[12px] text-[var(--text-secondary)]">{libraries.length} libraries</span>
        </div>
        <div style={{ height: 420 }}>
          <AgGridReact
            ref={gridRef}
            theme={gridTheme}
            rowData={libraries}
            columnDefs={colDefs}
            rowHeight={60}
            headerHeight={44}
            onGridReady={onGridReady}
            onRowClicked={p => { setPanelMode('view'); setSelected(p.data); }}
            pagination={true}
            paginationPageSize={10}
            suppressCellFocus={true}
          />
        </div>
      </div>
    </>
  );
}
