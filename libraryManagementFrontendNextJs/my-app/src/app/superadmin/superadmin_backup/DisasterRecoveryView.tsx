"use client";
import React from 'react';
import { 
  ShieldAlert, Activity, ServerCrash, RotateCcw, 
  CheckCircle, AlertTriangle, FileCheck, ShieldCheck
} from 'lucide-react';

export default function DisasterRecoveryView() {
  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-orange-50/50 dark:bg-orange-900/10 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-orange-600 dark:text-orange-400 flex items-center gap-2">
            <ShieldAlert size={24} /> Disaster Recovery (DR) Operations
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Platform failover strategies, recovery plans, and verification tests.</p>
        </div>
        <button className="px-5 py-2.5 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <RotateCcw size={16} /> Init Failover
        </button>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* DR Plan & Status */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
              <Activity size={16} className="text-orange-500" /> Recovery Status
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-400">Primary Region (Mumbai)</span>
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase bg-emerald-500 text-white rounded-full flex items-center gap-1 shadow-sm"><CheckCircle size={10} /> Active & Healthy</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Failover Region (Singapore)</span>
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase bg-slate-500 text-white rounded-full flex items-center gap-1 shadow-sm"><ServerCrash size={10} /> Standby Ready</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">RPO & RTO Metrics</p>
              <div className="flex gap-4">
                <div className="flex-1 bg-gray-50 dark:bg-[#0F172A] p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 font-bold mb-1">Recovery Point Obj. (RPO)</p>
                  <p className="text-lg font-extrabold text-orange-600 dark:text-orange-400">15 Mins</p>
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-[#0F172A] p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 font-bold mb-1">Recovery Time Obj. (RTO)</p>
                  <p className="text-lg font-extrabold text-orange-600 dark:text-orange-400">4 Hours</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
              <ShieldCheck size={16} className="text-orange-500" /> Failover Information
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-4">
              In the event of a catastrophic primary region failure, triggering manual failover will route all traffic via Global DNS to the Singapore read-replica, promoting it to Master.
            </p>
            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg text-xs font-bold text-red-700 dark:text-red-400">
              <AlertTriangle size={16} /> 
              Requires 2 SuperAdmins authorization to execute.
            </div>
          </div>
        </div>

        {/* Verification & Testing */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
              <FileCheck size={16} className="text-orange-500" /> Recovery Testing & Verification
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-orange-300 dark:hover:border-orange-700 transition-colors cursor-pointer group">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">Daily Backup Verification</h4>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded">Passed</span>
                </div>
                <p className="text-xs text-gray-500">Automated checksum verification of last night's database dump.</p>
                <p className="text-xs text-gray-400 mt-2">Last Run: Today, 03:00 AM</p>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-orange-300 dark:hover:border-orange-700 transition-colors cursor-pointer group">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">Monthly Restore Test (Dry Run)</h4>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-yellow-100 text-yellow-700 rounded">Pending</span>
                </div>
                <p className="text-xs text-gray-500">Restores a 10% snapshot to a dummy environment to verify data integrity.</p>
                <button className="mt-3 px-4 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 transition-colors">
                  Run Test Now
                </button>
              </div>
              
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-orange-300 dark:hover:border-orange-700 transition-colors cursor-pointer group">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">Disaster Recovery Plan (PDF)</h4>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded">v2.4</span>
                </div>
                <p className="text-xs text-gray-500">Official ISO-27001 compliant recovery playbook.</p>
                <button className="mt-3 px-4 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 transition-colors">
                  View Document
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
