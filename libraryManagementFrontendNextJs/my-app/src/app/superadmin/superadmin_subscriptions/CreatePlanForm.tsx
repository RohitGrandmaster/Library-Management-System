"use client";
import React, { useState } from 'react';
import { Save, CheckCircle, Loader2, CreditCard, Activity, Check } from 'lucide-react';

export default function CreatePlanForm({ onCancel }: { onCancel: () => void }) {
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
    <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl p-6 sm:p-8 w-full max-w-none mx-0 min-w-0 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
              <CreditCard className="text-pink-600 dark:text-pink-400" size={24} />
            </div>
            Create Subscription Plan
          </h2>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Configure pricing, resource limits, and feature access for SaaS tenants.</p>
        </div>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-700 dark:text-emerald-400 font-bold animate-in fade-in">
          <CheckCircle className="w-5 h-5" /> Plan successfully created!
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSave}>
        
        {/* Basic Pricing */}
        <div>
          <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400 mb-4 border-b border-pink-100 dark:border-pink-900/30 pb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-600"></span> Plan Identity & Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2"><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Plan Name <span className="text-red-500">*</span></label><input required type="text" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all shadow-sm hover:border-pink-300" placeholder="e.g. Enterprise Annual" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Price (USD) <span className="text-red-500">*</span></label><input required type="number" step="0.01" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all shadow-sm hover:border-pink-300" placeholder="0.00" /></div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Billing Cycle <span className="text-red-500">*</span></label>
              <select className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all shadow-sm hover:border-pink-300 cursor-pointer">
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Annually</option>
                <option>One-Time Lifetime</option>
              </select>
            </div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Trial Period (Days)</label><input type="number" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all shadow-sm hover:border-pink-300" placeholder="14" defaultValue="14" /></div>
          </div>
        </div>

        {/* Resource Limits */}
        <div>
          <h3 className="text-sm font-bold text-violet-600 dark:text-violet-400 mb-4 border-b border-violet-100 dark:border-violet-900/30 pb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-600"></span> Resource Constraints
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Max Libraries</label><input type="number" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none shadow-sm hover:border-violet-300" placeholder="1" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Max Branches</label><input type="number" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none shadow-sm hover:border-violet-300" placeholder="Unlimited" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Max Platform Users</label><input type="number" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none shadow-sm hover:border-violet-300" placeholder="10" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Max Books Inventory</label><input type="number" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none shadow-sm hover:border-violet-300" placeholder="10000" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Max End Members</label><input type="number" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none shadow-sm hover:border-violet-300" placeholder="5000" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Storage Limit (GB)</label><input type="number" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none shadow-sm hover:border-violet-300" placeholder="10" /></div>
            <div><label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">API Limits (Req/Min)</label><input type="number" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none shadow-sm hover:border-violet-300" placeholder="100" /></div>
          </div>
        </div>

        {/* Feature Access */}
        <div>
          <h3 className="text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400 mb-4 border-b border-fuchsia-100 dark:border-fuchsia-900/30 pb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fuchsia-600"></span> Premium Feature Access
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "White-labeling & Custom Branding", "Advanced Analytics & Reports", 
              "Email & SMS Integrations", "Priority Support (24/7 SLA)", 
              "Custom Domain Assignment", "Automated Daily Backups"
            ].map(feature => (
              <label key={feature} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-fuchsia-400 transition-colors">
                <input type="checkbox" className="w-4 h-4 text-fuchsia-600 rounded border-gray-300 focus:ring-fuchsia-500" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          <button type="button" onClick={onCancel} disabled={isSaving} className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-[#1E293B] dark:text-gray-300 dark:border-gray-600 dark:hover:bg-[#0D1F3C] rounded-xl transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSaving} className="px-8 py-2.5 text-sm font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-pink-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0">
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSaving ? 'Saving...' : 'Save Subscription Plan'}
          </button>
        </div>
      </form>
    </div>
  );
}
