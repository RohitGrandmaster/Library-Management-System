"use client";
import React, { useState } from 'react';
import { Save, CheckCircle, Loader2, Building2 } from 'lucide-react';

export default function CreateBranchForm({ onCancel }: { onCancel: () => void }) {
  const [status, setStatus] = useState('Draft');
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
    <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl p-8 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <Building2 className="text-indigo-600 dark:text-indigo-400" size={28} /> Create New Branch
          </h2>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Register a new physical branch under an existing library.</p>
        </div>
        <div className="flex items-center gap-2 p-1.5 bg-gray-50 dark:bg-[#0D1F3C] rounded-xl border border-gray-200 dark:border-gray-700">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Status:</span>
          {['Draft', 'Pending', 'Active'].map(s => (
            <button 
              key={s} 
              type="button"
              onClick={() => setStatus(s)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${status === s ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-transparent text-gray-500 hover:bg-gray-200 dark:hover:bg-[#1E293B]'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-700 dark:text-emerald-400 font-bold animate-in fade-in zoom-in-95 duration-300">
          <CheckCircle className="w-5 h-5" /> Branch created successfully! Redirecting...
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSave}>
        {/* Section 1: Basic & Association */}
        <div>
          <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-4 border-b border-indigo-100 dark:border-indigo-900/30 pb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Branch Identification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Parent Library <span className="text-red-500">*</span></label>
              <select required className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none shadow-sm hover:border-indigo-300 transition-all cursor-pointer">
                <option value="">Select a Library to attach this branch to...</option>
                <option value="SN-001">StudyNest Patna (SN-001)</option>
                <option value="RD-092">Readers Den Delhi (RD-092)</option>
              </select>
            </div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Branch Name <span className="text-red-500">*</span></label><input required type="text" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm hover:border-indigo-300" placeholder="e.g. Kankarbagh Branch" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Branch Code <span className="text-red-500">*</span></label><input required type="text" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm hover:border-indigo-300" placeholder="e.g. SN-KKB" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Branch ID</label><input type="text" className="w-full p-2.5 bg-gray-100 dark:bg-[#0D1F3C] border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 font-mono cursor-not-allowed" value="AUTO-GENERATED" readOnly /></div>
          </div>
        </div>

        {/* Section 2: Operational Info */}
        <div>
          <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mb-4 border-b border-cyan-100 dark:border-cyan-900/30 pb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-600"></span> Operations & Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Branch Manager</label><input type="text" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all shadow-sm hover:border-cyan-300" placeholder="Assign Manager..." /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Contact Number</label><input type="tel" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all shadow-sm hover:border-cyan-300" placeholder="+91 9000000000" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email</label><input type="email" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all shadow-sm hover:border-cyan-300" placeholder="branch@library.com" /></div>
            <div className="lg:col-span-2"><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Address</label><input type="text" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all shadow-sm hover:border-cyan-300" placeholder="Full branch address..." /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Working Hours</label><input type="text" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all shadow-sm hover:border-cyan-300" placeholder="09:00 AM - 08:00 PM" /></div>
          </div>
        </div>

        {/* Section 3: Branch Limits */}
        <div>
          <h3 className="text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400 mb-4 border-b border-fuchsia-100 dark:border-fuchsia-900/30 pb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fuchsia-600"></span> Branch Limits (Allocation)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Max Members</label><input type="number" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-sm hover:border-fuchsia-300" placeholder="e.g. 500" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Max Books</label><input type="number" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-sm hover:border-fuchsia-300" placeholder="e.g. 2000" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Max Users (Staff)</label><input type="number" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-sm hover:border-fuchsia-300" placeholder="e.g. 5" /></div>
          </div>
          <p className="text-[11px] text-gray-500 font-semibold mt-3">* These limits cannot exceed the global limits defined in the Parent Library Subscription Plan.</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          <button type="button" onClick={onCancel} disabled={isSaving} className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-[#1E293B] dark:text-gray-300 dark:border-gray-600 dark:hover:bg-[#0D1F3C] rounded-xl transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSaving} className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0">
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSaving ? 'Saving...' : 'Save Branch'}
          </button>
        </div>
      </form>
    </div>
  );
}
