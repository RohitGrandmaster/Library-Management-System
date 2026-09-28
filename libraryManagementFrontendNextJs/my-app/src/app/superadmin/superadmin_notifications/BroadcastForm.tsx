"use client";
import React, { useState } from 'react';
import { Megaphone, Users, Building2, Store, Send, Loader2, CheckCircle } from 'lucide-react';

export default function BroadcastForm() {
  const [target, setTarget] = useState('All Libraries');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const targets = [
    { id: 'All Libraries', icon: <Building2 size={16} /> },
    { id: 'Selected Libraries', icon: <Building2 size={16} /> },
    { id: 'Selected Branches', icon: <Store size={16} /> },
    { id: 'Platform Admins', icon: <Users size={16} /> },
    { id: 'Branch Managers', icon: <Users size={16} /> }
  ];

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1F3C] flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Megaphone className="text-rose-500" size={24} /> New Global Broadcast
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Send a high-priority system announcement or alert to specific tenant groups.</p>
        </div>
      </div>

      <form onSubmit={handleBroadcast} className="p-6 lg:p-10 flex flex-col xl:flex-row gap-10">
        
        {/* Left Side: Target Audience Selection */}
        <div className="flex-1 space-y-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-2">
            1. Select Target Audience
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {targets.map(t => (
              <label 
                key={t.id} 
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  target === t.id 
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 shadow-sm' 
                    : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0F172A] hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <input 
                  type="radio" 
                  name="broadcast_target" 
                  value={t.id} 
                  checked={target === t.id}
                  onChange={(e) => setTarget(e.target.value)}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  target === t.id ? 'border-rose-500' : 'border-gray-300 dark:border-gray-700'
                }`}>
                  {target === t.id && <div className="w-2.5 h-2.5 bg-rose-500 rounded-full" />}
                </div>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {t.icon} {t.id}
                </div>
              </label>
            ))}
          </div>

          {/* Conditional Multi-Select if 'Selected' is chosen */}
          {(target === 'Selected Libraries' || target === 'Selected Branches') && (
            <div className="animate-in slide-in-from-top-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Search & Select Specific {target.split(' ')[1]}</label>
              <input type="text" placeholder={`Type to search ${target.toLowerCase()}...`} className="w-full p-3 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all shadow-sm" />
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-1.5">
                  StudyNest Patna <button className="hover:text-red-500">&times;</button>
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-1.5">
                  LibroHub Mumbai <button className="hover:text-red-500">&times;</button>
                </span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-2 mt-6">
              2. Delivery Channels
            </h3>
            <div className="flex flex-wrap gap-4">
              {['In-App Notification', 'Email', 'Push (Mobile)', 'SMS'].map((ch, idx) => (
                <label key={idx} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked={idx < 2} className="w-4 h-4 text-rose-500 border-gray-300 rounded focus:ring-rose-500 cursor-pointer" />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{ch}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Message Editor */}
        <div className="flex-1 space-y-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-2">
            3. Broadcast Message
          </h3>
          
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Subject / Title</label>
            <input type="text" required placeholder="e.g. Scheduled System Maintenance" className="w-full p-3 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all shadow-sm" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Message Body</label>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/10 transition-all shadow-sm bg-white dark:bg-[#0F172A]">
              <div className="p-2 border-b border-gray-100 dark:border-gray-800 flex gap-2 bg-gray-50 dark:bg-[#0D1F3C]">
                <button type="button" className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded font-bold text-gray-700 dark:text-gray-300 text-xs">B</button>
                <button type="button" className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded italic font-serif text-gray-700 dark:text-gray-300 text-xs">I</button>
                <button type="button" className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded underline text-gray-700 dark:text-gray-300 text-xs">U</button>
              </div>
              <textarea required rows={6} placeholder="Type your announcement here..." className="w-full p-3 bg-transparent border-none outline-none text-sm resize-none" />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4 border-t border-gray-100 dark:border-gray-800">
            {sent && (
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in slide-in-from-right-4">
                <CheckCircle size={16} /> Broadcast Sent Successfully
              </span>
            )}
            <button 
              type="submit"
              disabled={isSending}
              className="px-8 py-3 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-lg shadow-rose-500/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {isSending ? 'Dispatching...' : 'Send Broadcast Now'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
