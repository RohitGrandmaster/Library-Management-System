"use client";
import React from 'react';
import { Key, RotateCw, Trash2, CheckCircle, AlertTriangle, Shield, Copy, Eye, BarChart2 } from 'lucide-react';

const mockKeys = [
  { id: 'pk_live_8a9...', name: 'Main Platform API', scope: 'Full Access', usage: '1.2M / 2M', limit: '2M/mo', status: 'Active', created: '2026-01-15' },
  { id: 'sk_test_9b2...', name: 'Staging Environment', scope: 'Read Only', usage: '5K / 100K', limit: '100K/mo', status: 'Active', created: '2026-05-20' },
  { id: 'pk_live_3c4...', name: 'Legacy Mobile App', scope: 'Custom', usage: '0 / 50K', limit: '50K/mo', status: 'Revoked', created: '2025-11-10' },
];

export default function ApiKeysView() {
  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1F3C] flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Key className="text-amber-500" size={24} /> API Key Management
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Manage programmatic access tokens, scopes, and rate limits.</p>
        </div>
        <button className="px-5 py-2.5 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 transition-all">
          Generate New Key
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {mockKeys.map((key, i) => (
            <div key={i} className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border ${key.status === 'Revoked' ? 'bg-gray-50 dark:bg-[#1E293B] border-gray-200 dark:border-gray-700 opacity-70' : 'bg-white dark:bg-[#0F172A] border-amber-100 dark:border-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700 shadow-sm transition-colors'}`}>
              
              <div className="flex-1 mb-4 md:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{key.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${key.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {key.status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                    <Shield size={10} /> {key.scope}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg w-fit">
                  <code className="text-xs font-mono font-bold text-gray-600 dark:text-gray-300">{key.id}••••••••••</code>
                  <button className="text-gray-400 hover:text-amber-500 transition-colors"><Eye size={14} /></button>
                  <button className="text-gray-400 hover:text-amber-500 transition-colors"><Copy size={14} /></button>
                </div>
              </div>

              <div className="flex-1 flex flex-col md:items-center mb-4 md:mb-0 px-4 md:border-l md:border-gray-100 dark:md:border-gray-800">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5"><BarChart2 size={14} /> Usage & Limits</p>
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    <span>{key.usage}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${key.status === 'Revoked' ? 'bg-gray-400' : 'bg-amber-400'}`} style={{ width: key.status === 'Revoked' ? '100%' : '60%' }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 md:border-l md:border-gray-100 dark:md:border-gray-800 pl-0 md:pl-6">
                <button 
                  disabled={key.status === 'Revoked'}
                  className="flex flex-1 md:flex-none items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-blue-600 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-300 transition-all disabled:opacity-50"
                >
                  <RotateCw size={14} /> Rotate
                </button>
                <button 
                  disabled={key.status === 'Revoked'}
                  className="flex flex-1 md:flex-none items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg shadow-sm hover:bg-red-50 dark:bg-[#1E293B] dark:border-red-900/30 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
                >
                  <Trash2 size={14} /> Revoke
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
