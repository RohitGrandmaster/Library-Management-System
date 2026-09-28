"use client";
import React, { useState } from 'react';
import { Save, CheckCircle, Loader2, Users, Shield, Building2, Store } from 'lucide-react';

export default function CreateUserForm({ onCancel }: { onCancel: () => void }) {
  const [role, setRole] = useState('SuperAdmin');
  const [status, setStatus] = useState('Pending');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => {
        onCancel();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl p-6 sm:p-8 w-full max-w-none mx-0 min-w-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
              <Users className="text-teal-600 dark:text-teal-400" size={24} />
            </div>
            Register Platform User
          </h2>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Create authenticated users (SuperAdmin, Admin, or Manager) and define their scope.</p>
        </div>
        <div className="flex items-center gap-2 p-1.5 bg-gray-50 dark:bg-[#0D1F3C] rounded-xl border border-gray-200 dark:border-gray-700">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Initial Status:</span>
          {['Pending', 'Active', 'Suspended'].map(s => (
            <button 
              key={s} 
              type="button"
              onClick={() => setStatus(s)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${status === s ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20' : 'bg-transparent text-gray-500 hover:bg-gray-200 dark:hover:bg-[#1E293B]'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-700 dark:text-emerald-400 font-bold animate-in fade-in zoom-in-95 duration-300">
          <CheckCircle className="w-5 h-5" /> User account created successfully! Redirecting...
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSave}>
        {/* Section 1: Basic Info */}
        <div>
          <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 mb-4 border-b border-teal-100 dark:border-teal-900/30 pb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-600"></span> Personal Identity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Full Name <span className="text-red-500">*</span></label><input required type="text" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all shadow-sm hover:border-teal-300" placeholder="e.g. John Doe" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email Address <span className="text-red-500">*</span></label><input required type="email" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all shadow-sm hover:border-teal-300" placeholder="user@platform.com" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label><input type="tel" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all shadow-sm hover:border-teal-300" placeholder="+91 9999999999" /></div>
          </div>
        </div>

        {/* Section 2: Role & Scope */}
        <div>
          <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 mb-4 border-b border-purple-100 dark:border-purple-900/30 pb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span> Role & Assignment Scope
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
              <label className="block text-xs font-bold text-purple-900 dark:text-purple-300 mb-3 uppercase tracking-wider">Select System Role</label>
              <div className="space-y-3">
                {[
                  { id: 'SuperAdmin', label: 'SuperAdmin', icon: <Shield size={16} /> },
                  { id: 'Admin', label: 'Admin', icon: <Building2 size={16} /> },
                  { id: 'Manager', label: 'Manager', icon: <Store size={16} /> }
                ].map(r => (
                  <label key={r.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${role === r.id ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white dark:bg-[#0F172A] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-400'}`}>
                    <input type="radio" name="role" value={r.id} checked={role === r.id} onChange={() => setRole(r.id)} className="hidden" />
                    {r.icon}
                    <span className="font-bold text-sm">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              {role === 'SuperAdmin' && (
                <div className="p-6 bg-gray-50 dark:bg-[#0D1F3C] rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center h-full text-center">
                  <Shield size={40} className="text-purple-500 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Platform Scope</h4>
                  <p className="text-sm font-medium text-gray-500 mt-1">SuperAdmins have unrestricted global access across the entire Nexus 360 platform. No library or branch assignment is required.</p>
                </div>
              )}

              {role === 'Admin' && (
                <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800 flex flex-col h-full animate-in fade-in">
                  <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Building2 size={16} /> Library Scope Assignment
                  </h4>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Assign to Library <span className="text-red-500">*</span></label>
                  <select required className="w-full p-3 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none shadow-sm cursor-pointer">
                    <option value="">Select a Library...</option>
                    <option value="SN">StudyNest Patna (SN-001)</option>
                    <option value="RD">Readers Den Delhi (RD-092)</option>
                  </select>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-3 font-medium">Admins have full control over the selected library and all its child branches.</p>
                </div>
              )}

              {role === 'Manager' && (
                <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-200 dark:border-indigo-800 flex flex-col h-full animate-in fade-in">
                  <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Store size={16} /> Branch Scope Assignment
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Parent Library <span className="text-red-500">*</span></label>
                      <select required className="w-full p-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none shadow-sm cursor-pointer">
                        <option value="">1. Select a Library...</option>
                        <option value="SN">StudyNest Patna</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Assign to Branch <span className="text-red-500">*</span></label>
                      <select required className="w-full p-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none shadow-sm cursor-pointer">
                        <option value="">2. Select a Branch...</option>
                        <option value="KKB">Kankarbagh Branch (SN-KKB)</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-3 font-medium">Managers can only operate within the boundaries of their specifically assigned branch.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Credentials */}
        <div>
          <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-4 border-b border-rose-100 dark:border-rose-900/30 pb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span> Initial Credentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Temporary Password <span className="text-red-500">*</span></label>
              <input required type="text" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all shadow-sm font-mono tracking-widest" defaultValue="P@ssw0rd123!" />
              <p className="text-[11px] text-gray-500 font-semibold mt-1.5">* User will be forced to change this upon first login.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          <button type="button" onClick={onCancel} disabled={isSaving} className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-[#1E293B] dark:text-gray-300 dark:border-gray-600 dark:hover:bg-[#0D1F3C] rounded-xl transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSaving} className="px-8 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-teal-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0">
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSaving ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
}
