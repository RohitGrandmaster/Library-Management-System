"use client";
import React, { useState } from 'react';
import { Save, Image as ImageIcon, CheckCircle, Loader2 } from 'lucide-react';

export default function CreateLibraryForm({ onCancel }: { onCancel: () => void }) {
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
    <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl p-6 sm:p-8 w-full max-w-none mx-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Create New Library</h2>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Register a new organization and define their subscription limits.</p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-1.5 bg-gray-50 dark:bg-[#0D1F3C] rounded-xl border border-gray-200 dark:border-gray-700">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 w-full sm:w-auto mb-1 sm:mb-0">Lifecycle:</span>
          {['Draft', 'Pending', 'Active'].map(s => (
            <button 
              key={s} 
              type="button"
              onClick={() => setStatus(s)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${status === s ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-transparent text-gray-500 hover:bg-gray-200 dark:hover:bg-[#1E293B]'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-700 dark:text-emerald-400 font-bold">
          <CheckCircle className="w-5 h-5" /> Library created successfully! Redirecting...
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSave}>
        {/* Section 1: Basic Info */}
        <div>
          <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-100 dark:border-blue-900/30 pb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span> Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Library Name <span className="text-red-500">*</span></label><input required type="text" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm hover:border-blue-300" placeholder="e.g. StudyNest" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Library Code <span className="text-red-500">*</span></label><input required type="text" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm hover:border-blue-300" placeholder="e.g. SN-001" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Unique ID</label><input type="text" className="w-full p-2.5 bg-gray-100 dark:bg-[#0D1F3C] border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 font-mono cursor-not-allowed" value="AUTO-GENERATED" readOnly /></div>
          </div>
        </div>

        {/* Section 2: Contact Info */}
        <div>
          <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-4 border-b border-emerald-100 dark:border-emerald-900/30 pb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Contact & Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Owner/Primary Contact</label><input type="text" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm hover:border-emerald-300" placeholder="John Doe" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email</label><input type="email" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm hover:border-emerald-300" placeholder="admin@library.com" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Phone</label><input type="tel" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm hover:border-emerald-300" placeholder="+91 9876543210" /></div>
            <div className="lg:col-span-3"><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Address</label><input type="text" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm hover:border-emerald-300" placeholder="123 Main Street" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">City</label><input type="text" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm hover:border-emerald-300" placeholder="Mumbai" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">State</label><input type="text" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm hover:border-emerald-300" placeholder="Maharashtra" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Country</label><input type="text" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm hover:border-emerald-300" defaultValue="India" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Pincode</label><input type="text" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm hover:border-emerald-300" placeholder="400001" /></div>
            <div className="lg:col-span-2"><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Website</label><input type="url" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm hover:border-emerald-300" placeholder="https://..." /></div>
          </div>
        </div>

        {/* Section 3: Subscription & Limits */}
        <div>
          <h3 className="text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400 mb-4 border-b border-fuchsia-100 dark:border-fuchsia-900/30 pb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fuchsia-600"></span> Subscription & Limits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Plan</label>
              <select className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-sm hover:border-fuchsia-300">
                <option>Basic Plan</option><option>Pro Plan</option><option>Enterprise Plan</option>
              </select>
            </div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Start Date</label><input type="date" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-sm hover:border-fuchsia-300" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Expiry Date</label><input type="date" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-sm hover:border-fuchsia-300" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Max Branches</label><input type="number" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-sm hover:border-fuchsia-300" placeholder="3" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Max Users (Staff)</label><input type="number" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-sm hover:border-fuchsia-300" placeholder="10" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Max Books</label><input type="number" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-sm hover:border-fuchsia-300" placeholder="5000" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Max Members</label><input type="number" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-sm hover:border-fuchsia-300" placeholder="1000" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Storage Limit</label><input type="text" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-sm hover:border-fuchsia-300" placeholder="5 GB" /></div>
          </div>
        </div>

        {/* Section 4: Assets & Registration */}
        <div>
          <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-4 border-b border-orange-100 dark:border-orange-900/30 pb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-600"></span> Registration & Assets
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Registration Information (GST/Tax ID)</label>
              <textarea className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none h-32 shadow-sm hover:border-orange-300 resize-none" placeholder="GSTIN or Tax details..."></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Library Logo</label>
              <div className="w-full h-32 bg-gray-50 dark:bg-[#1E293B] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors group">
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2 group-hover:text-orange-500 transition-colors" />
                <span className="text-sm font-bold text-gray-600 group-hover:text-orange-600 transition-colors">Click to upload logo</span>
                <span className="text-xs text-gray-400 mt-1">SVG, PNG, JPG (max 2MB)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          <button type="button" onClick={onCancel} disabled={isSaving} className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-[#1E293B] dark:text-gray-300 dark:border-gray-600 dark:hover:bg-[#0D1F3C] rounded-xl transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSaving} className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0">
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSaving ? 'Saving...' : 'Save Library'}
          </button>
        </div>
      </form>
    </div>
  );
}
