'use client';
import { useState } from 'react';
import { MapPin, Edit2, X, Users, CheckCircle, AlertTriangle, Save, Loader, ShieldAlert } from 'lucide-react';
import type { Library, LibraryPanelMode } from '@/app/superadmin/superadmin_libraries/superadmin_libraries_types';

interface LibraryPanelProps {
  lib: Library;
  mode: LibraryPanelMode;
  onClose: () => void;
  onSave: (updated: Library) => Promise<void>;
  onSuspend: (id: string) => Promise<void>;
}

export default function LibraryPanel({ lib, mode, onClose, onSave, onSuspend }: LibraryPanelProps) {
  const [editing, setEditing] = useState(mode === 'edit');
  const [form, setForm] = useState({ name: lib.name, owner: lib.owner, phone: lib.phone, location: lib.location, plan: lib.plan });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const pct = Math.round((lib.occupied / lib.seats) * 100);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ ...lib, ...form });
      setSaved(true);
      setTimeout(() => { setSaved(false); setEditing(false); }, 1200);
    } catch (err) {
      console.error(err);
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
            <h2 className="text-[18px] font-bold text-primary">{lib.name}</h2>
            <p className="text-[13px] text-secondary flex items-center gap-1 mt-1"><MapPin size={12} />{lib.location}</p>
          </div>
          <div className="flex items-center gap-1">
            {!editing && <button className="sa-btn-icon" onClick={() => setEditing(true)}><Edit2 size={15} /></button>}
            <button className="sa-btn-icon" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        {editing ? (
          <div className="space-y-3">
            {([['Library Name','name'],['Owner','owner'],['Phone','phone'],['Location','location']] as const).map(([label, key]) => (
              <div key={key}>
                <label className="sa-label">{label}</label>
                <input className="sa-input" value={(form as Record<string, string>)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
            <div>
              <label className="sa-label">Plan</label>
              <select className="sa-select w-full" value={form.plan}
                onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}>
                {['Basic','Pro','Enterprise'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {([['Owner',lib.owner],['Phone',lib.phone],['Plan',lib.plan],['Joined',lib.joined]] as const).map(([label,val]) => (
              <div key={label} className="sa-panel-info-cell">
                <p className="sa-panel-info-label">{label}</p>
                <p className="sa-panel-info-value">{val}</p>
              </div>
            ))}
          </div>
        )}

        <div className="sa-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-primary flex items-center gap-2"><Users size={14} /> Seat Occupancy</p>
            <span className={pct > 90 ? 'sa-occupancy-pct--high' : 'sa-occupancy-pct--ok'}>{pct}%</span>
          </div>
          <div className="sa-progress-track">
            <div className={pct > 90 ? 'sa-progress-fill--danger' : 'sa-progress-fill--success'} style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[12px] text-secondary mt-2">{lib.occupied} occupied / {lib.seats} total seats</p>
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
