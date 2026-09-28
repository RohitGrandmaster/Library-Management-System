'use client';
import { useState } from 'react';
import { 
  ShieldAlert, Shield, Building2, Store, Save, RefreshCw, CheckCircle, 
  Info, History, Lock, ShieldCheck, Key
} from 'lucide-react';

const SUB_MENUS = [
  { id: 'Role Matrix Builder', icon: Shield, desc: 'Configure platform access' },
  { id: 'Permission History', icon: History, desc: 'Audit role changes' },
  { id: 'Custom Roles', icon: Key, desc: 'Define tenant-specific roles' }
] as const;

const ROLES = [
  { id: 'SuperAdmin', label: 'SuperAdmin', desc: 'Global Platform Access', icon: <ShieldCheck size={24} />, color: 'purple' },
  { id: 'Admin', label: 'Admin', desc: 'Library Level Access', icon: <Building2 size={24} />, color: 'blue' },
  { id: 'Manager', label: 'Manager', desc: 'Branch Level Access', icon: <Store size={24} />, color: 'indigo' }
];

const MODULES = [
  "Libraries", "Branches", "Platform Users", "Books Inventory", "Members", 
  "Circulation", "Reservations", "Fines & Payments", "Reports & Analytics", "System Settings"
];

const ACTIONS = [
  { id: 'read', label: 'Read/View' },
  { id: 'create', label: 'Create/Add' },
  { id: 'edit', label: 'Edit/Update' },
  { id: 'delete', label: 'Delete/Archive' },
  { id: 'export', label: 'Export' },
  { id: 'print', label: 'Print' },
  { id: 'approve', label: 'Approve' },
  { id: 'manage', label: 'Manage' }
];

// Seed initial permissions
const seedPermissions = () => {
  const perms: Record<string, Record<string, boolean>> = {};
  MODULES.forEach(mod => {
    perms[mod] = {};
    ACTIONS.forEach(act => {
      perms[mod][act.id] = true;
    });
  });
  return perms;
};

export default function RolesPage() {
  const [activeMenu, setActiveMenu] = useState('Role Matrix Builder');
  const [activeRole, setActiveRole] = useState('Admin');
  const [permissions, setPermissions] = useState(seedPermissions());
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const togglePermission = (mod: string, act: string) => {
    if (activeRole === 'SuperAdmin') return; // Cannot edit SuperAdmin
    
    setPermissions(prev => ({
      ...prev,
      [mod]: {
        ...prev[mod],
        [act]: !prev[mod][act]
      }
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1200);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'Permission History':
      case 'Custom Roles':
        return (
          <div className="flex flex-col items-center justify-center text-center p-16 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-[#0D1F3C]/20 animate-in zoom-in-95 duration-500 min-h-[400px]">
             <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-6 shadow-inner border border-orange-200 dark:border-orange-800">
               {activeMenu === 'Permission History' ? <History size={48} /> : <Key size={48} />}
             </div>
             <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">{activeMenu} Module</h3>
             <p className="text-gray-500 font-medium max-w-md mx-auto">
               This area allows you to view historical changes made to the matrix, or define custom scoped roles for specific tenants.
             </p>
          </div>
        );

      case 'Role Matrix Builder':
      default:
        return (
          <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Role Selection Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {ROLES.map(role => (
                <div 
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all group ${
                    activeRole === role.id 
                      ? `bg-orange-50 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)] dark:bg-orange-900/20 dark:border-orange-500 scale-105` 
                      : 'bg-white border-gray-100 hover:border-orange-300 hover:bg-orange-50/50 dark:bg-[#1E293B] dark:border-gray-700 dark:hover:border-orange-700/50 dark:hover:bg-[#0D1F3C]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-colors ${
                      activeRole === role.id 
                        ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-orange-500/30' 
                        : 'bg-gray-100 text-gray-400 dark:bg-gray-800 group-hover:bg-orange-100 group-hover:text-orange-500 dark:group-hover:bg-orange-900/40'
                    }`}>
                      {role.icon}
                    </div>
                    <div>
                      <h3 className={`text-xl font-extrabold transition-colors ${activeRole === role.id ? 'text-orange-700 dark:text-orange-400' : 'text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400'}`}>
                        {role.label}
                      </h3>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{role.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Matrix Form Area */}
            <form onSubmit={handleSave} className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-orange-50/50 dark:bg-orange-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    <ShieldAlert className="text-orange-500" size={20} /> Matrix Configuration
                  </h3>
                  <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
                    Editing privileges for: <span className="font-extrabold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded-md">{activeRole}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-300 transition-colors">
                    Reset
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving || activeRole === 'SuperAdmin'}
                    className="px-6 py-2 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 border border-transparent rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                    {isSaving ? 'Saving...' : 'Save Matrix'}
                  </button>
                </div>
              </div>

              {activeRole === 'SuperAdmin' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-b border-blue-100 dark:border-blue-900/40 flex items-start gap-3">
                  <Info size={18} className="text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800 dark:text-blue-300 font-bold">
                    SuperAdmin role is immutable. This role has unrestricted access to all platform resources globally. The matrix below is displayed for visualization purposes only and cannot be modified.
                  </p>
                </div>
              )}

              <div className="overflow-x-auto custom-scrollbar flex-1">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-[#1E293B] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-6 py-4 sticky left-0 z-10 bg-gray-50 dark:bg-[#1E293B] border-r border-gray-200 dark:border-gray-700 shadow-[10px_0_15px_-3px_rgba(0,0,0,0.05)]">Module / Resource</th>
                      {ACTIONS.map(act => (
                        <th key={act.id} className="px-4 py-4 text-center border-b border-gray-200 dark:border-gray-700 min-w-[90px]">{act.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {MODULES.map(mod => (
                      <tr key={mod} className="hover:bg-orange-50/30 dark:hover:bg-orange-900/5 transition-colors">
                        <td className="px-6 py-4 sticky left-0 z-10 bg-white dark:bg-[#0F172A] border-r border-gray-100 dark:border-gray-800 shadow-[10px_0_15px_-3px_rgba(0,0,0,0.02)] font-extrabold text-gray-900 dark:text-white whitespace-nowrap">
                          {mod}
                        </td>
                        {ACTIONS.map(act => (
                          <td key={`${mod}-${act.id}`} className="px-4 py-4 text-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={permissions[mod]?.[act.id] || false}
                                onChange={() => togglePermission(mod, act.id)}
                                disabled={activeRole === 'SuperAdmin'}
                              />
                              <div className={`w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500 ${activeRole === 'SuperAdmin' ? 'opacity-70 cursor-not-allowed' : ''}`}></div>
                            </label>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Status Footer */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-transparent flex justify-end items-center h-14">
                {saved && (
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg animate-in fade-in slide-in-from-right-2">
                    <CheckCircle size={14} /> Matrix successfully updated for {activeRole}.
                  </div>
                )}
              </div>
            </form>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-[calc(100vh-6rem)]">
      
      {/* Sidebar Navigation */}
      <div className="lg:w-64 shrink-0 flex flex-col bg-white dark:bg-[#0F172A] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1F3C]/30">
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
            <ShieldAlert size={20} className="text-orange-600 dark:text-orange-400" /> Access Control
          </h2>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Security Engine</p>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {SUB_MENUS.map(menu => {
            const Icon = menu.icon;
            const isActive = activeMenu === menu.id;
            
            return (
              <button
                key={menu.id}
                onClick={() => setActiveMenu(menu.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group ${
                  isActive 
                    ? `bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50 shadow-sm`
                    : 'bg-transparent text-gray-600 dark:text-gray-400 border border-transparent hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? `bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400` : 'bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <div className={`text-xs font-extrabold mb-0.5 ${isActive ? 'text-orange-700 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'}`}>{menu.id}</div>
                  <div className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? 'text-orange-500/80 dark:text-orange-400/80' : 'text-gray-400'}`}>{menu.desc}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Page Header */}
        <div className="shrink-0 mb-6">
          <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Nexus 360</span><span>/</span><span className="text-orange-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Roles</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="sa-page-title text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-sm border border-orange-200/50 dark:border-orange-800/50">
                  <Lock size={24} />
                </div>
                Roles & Permissions
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Control the global access architecture and module permissions for all authenticated platform roles.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Fields Area */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
