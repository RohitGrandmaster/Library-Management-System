'use client';
import { useState } from 'react';
import { Save, ShieldCheck, Mail, Building, CheckCircle } from 'lucide-react';

const NOTIF_ITEMS = [
  { id: 'welcome', label: 'Send Welcome Email to New Tenants',     default: true },
  { id: 'invoice', label: 'Auto-send SaaS Invoice via WhatsApp',   default: true },
  { id: 'backup',  label: 'Alert Owner on Failed Backup',          default: true },
  { id: 'ticket',  label: 'Notify me when Support Ticket created', default: false },
];

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [platform, setPlatform] = useState({ name: 'Smart Library 360', email: 'support@library360.com', phone: '+91 9988776655' });
  const [security, setSecurity] = useState({ maxAttempts: 5, autoLogout: 30 });
  const [checks, setChecks] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_ITEMS.map((n: any) => [n.id, n.default]))
  );

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      {saved && (
        <div className="sa-toast sa-toast--success">
          <CheckCircle size={16} /> Settings saved successfully!
        </div>
      )}

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Nexus 360</span><span>/</span><span>Super Admin</span><span>/</span><span>Settings</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="sa-page-title">Global Security & Base Config</h1>
          <button className="sa-btn-primary" onClick={handleSave}>
            {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* Platform Identity */}
          <div className="sa-card p-6">
            <h2 className="text-base font-bold text-primary mb-5 flex items-center gap-2">
              <Building size={15} className="text-primary" /> Platform Identity
            </h2>
            <div className="space-y-4">
              <div>
                <label className="sa-label">Platform Name</label>
                <input type="text" className="sa-input" value={platform.name}
                  onChange={e => setPlatform(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="sa-label">Support Email</label>
                  <input type="text" className="sa-input" value={platform.email}
                    onChange={e => setPlatform(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <label className="sa-label">Contact Phone</label>
                  <input type="text" className="sa-input" value={platform.phone}
                    onChange={e => setPlatform(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="sa-card p-6">
            <h2 className="text-base font-bold text-primary mb-5 flex items-center gap-2">
              <Mail size={15} className="text-success" /> SaaS Auto-Notifications
            </h2>
            <div className="space-y-4">
              {NOTIF_ITEMS.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setChecks(c => ({ ...c, [item.id]: !c[item.id] }))}>
                  <div className={`sa-toggle-track ${checks[item.id] ? 'sa-toggle-track--on' : ''}`}>
                    <div className={`sa-toggle-thumb ${checks[item.id] ? 'sa-toggle-thumb--on' : ''}`} />
                  </div>
                  <span className="text-sm text-primary select-none">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Security */}
          <div className="sa-card p-6">
            <h2 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
              <ShieldCheck size={15} className="text-warning" /> Security Defaults
            </h2>
            <p className="text-sm text-secondary mb-4 leading-relaxed">
              These settings enforce strict security policies across all newly provisioned library branches automatically.
            </p>
            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <label className="sa-label">Max Login Attempts</label>
                <input type="number" className="sa-input" min={1} max={10}
                  value={security.maxAttempts}
                  onChange={e => setSecurity(s => ({ ...s, maxAttempts: +e.target.value }))} />
              </div>
              <div>
                <label className="sa-label">Staff Auto-Logout (Mins)</label>
                <input type="number" className="sa-input" min={5} max={120}
                  value={security.autoLogout}
                  onChange={e => setSecurity(s => ({ ...s, autoLogout: +e.target.value }))} />
              </div>
            </div>
          </div>

          <div className="sa-card-tip">
            💡 Changes apply to all <strong>newly provisioned</strong> branches. Existing branches retain their current settings until manually updated.
          </div>
        </div>
      </div>
    </>
  );
}
