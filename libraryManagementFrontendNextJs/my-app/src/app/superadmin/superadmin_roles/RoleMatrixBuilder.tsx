"use client";
import React, { useState } from 'react';
import { Shield, Building2, Store, Save, RefreshCw, CheckCircle, Info } from 'lucide-react';

const ROLES = [
  { id: 'SuperAdmin', label: 'SuperAdmin', desc: 'Global Platform Access', icon: <Shield size={24} />, color: 'purple' },
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
  { id: 'manage', label: 'Manage/Settings' }
];

// Seed initial permissions
const seedPermissions = () => {
  const perms: Record<string, Record<string, boolean>> = {};
  MODULES.forEach(mod => {
    perms[mod] = {};
    ACTIONS.forEach(act => {
      // Some mock defaults: SuperAdmin has everything. Others have less.
      perms[mod][act.id] = true;
    });
  });
  return perms;
};

export default function RoleMatrixBuilder() {
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

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1200);
  };

  const currentRoleObj = ROLES.find(r => r.id === activeRole);

  return (
    <div className="flex flex-col gap-6 w-full h-full flex-1 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ROLES.map(role => (
          <div 
            key={role.id}
            onClick={() => setActiveRole(role.id)}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
              activeRole === role.id 
                ? `bg-orange-50 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)] dark:bg-orange-900/10 dark:border-orange-500 scale-105` 
                : 'bg-white border-gray-100 hover:border-orange-300 hover:bg-orange-50/50 dark:bg-[#0F172A] dark:border-gray-800 dark:hover:border-orange-700/50 dark:hover:bg-[#0D1F3C]'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                activeRole === role.id 
                  ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-orange-500/30' 
                  : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
              }`}>
                {role.icon}
              </div>
              <div>
                <h3 className={`text-xl font-extrabold ${activeRole === role.id ? 'text-orange-700 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>
                  {role.label}
                </h3>
                <p className="text-sm font-semibold text-gray-500">{role.desc}</p>
              </div>
            </div>
            
            {activeRole === role.id && (
              <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-500/20 flex items-center justify-between text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                Editing Matrix <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span></span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Permission Matrix */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col flex-1">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1F3C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              Permission Matrix for <span className="text-orange-600 dark:text-orange-400">{activeRole}</span>
            </h3>
            {activeRole === 'SuperAdmin' ? (
              <p className="text-sm font-medium text-red-500 flex items-center gap-1.5 mt-1">
                <Info size={14} /> SuperAdmin permissions are hardcoded and cannot be modified.
              </p>
            ) : (
              <p className="text-sm font-medium text-gray-500 mt-1">Toggle the switches to enable or disable specific module actions.</p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in slide-in-from-right-4">
                <CheckCircle size={16} /> Saved!
              </span>
            )}
            <button 
              onClick={handleSave}
              disabled={isSaving || activeRole === 'SuperAdmin'}
              className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl shadow-lg shadow-orange-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              Save Matrix
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b-2 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0F172A] sticky left-0 z-10 w-64 min-w-[250px]">
                  <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Platform Modules</span>
                </th>
                {ACTIONS.map(act => (
                  <th key={act.id} className="p-4 border-b-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1F3C] text-center min-w-[100px]">
                    <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">{act.label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULES.map((mod, idx) => (
                <tr key={mod} className="hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-colors group">
                  <td className="p-4 border-b border-r border-gray-100 dark:border-gray-800 font-bold text-sm text-gray-700 dark:text-gray-300 bg-white group-hover:bg-orange-50/30 dark:bg-[#0F172A] dark:group-hover:bg-[#1E293B] sticky left-0 z-10 transition-colors">
                    {mod}
                  </td>
                  {ACTIONS.map(act => {
                    const isAllowed = permissions[mod][act.id];
                    // Mocking logic to make admin/manager have fewer defaults visually, if needed.
                    // For now they are togglable based on state.
                    const disabled = activeRole === 'SuperAdmin';
                    
                    return (
                      <td key={act.id} className="p-4 border-b border-gray-100 dark:border-gray-800 text-center">
                        <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={activeRole === 'SuperAdmin' ? true : isAllowed}
                            onChange={() => togglePermission(mod, act.id)}
                            disabled={disabled}
                          />
                          <div className={`w-11 h-6 rounded-full transition-all peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800
                            ${(activeRole === 'SuperAdmin' || isAllowed) 
                                ? 'bg-orange-500 after:translate-x-full after:border-white' 
                                : 'bg-gray-200 dark:bg-gray-700 after:border-gray-300 dark:after:border-gray-600'}
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                          ></div>
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
