'use client';
import { useState } from 'react';
import { 
  BarChart3, Users, Building2, Server, TrendingUp, CreditCard, 
  Activity, ShieldAlert, Globe, ArrowUpRight, Zap, RefreshCw,
  MoreHorizontal, Download, Clock
} from 'lucide-react';

// Mock Data
const METRICS = [
  { id: 'mrr', label: 'Monthly Recurring', value: '$124.5K', change: '+14.2%', trend: 'up', icon: <CreditCard size={20} />, color: 'emerald' },
  { id: 'tenants', label: 'Active Libraries', value: '412', change: '+12', trend: 'up', icon: <Building2 size={20} />, color: 'blue' },
  { id: 'users', label: 'Total End Users', value: '84.2K', change: '+2.1K', trend: 'up', icon: <Users size={20} />, color: 'violet' },
  { id: 'uptime', label: 'System Uptime', value: '99.99%', change: 'All systems operational', trend: 'neutral', icon: <Server size={20} />, color: 'indigo' }
];

const RECENT_ACTIVITY = [
  { id: 1, action: 'New Tenant Registered', target: 'StudyNest Patna', time: '10 mins ago', type: 'success' },
  { id: 2, action: 'Plan Upgraded', target: 'BookHaven BLR (to Enterprise)', time: '1 hour ago', type: 'info' },
  { id: 3, action: 'Database Backup Completed', target: 'Asia-South Cluster', time: '3 hours ago', type: 'success' },
  { id: 4, action: 'High CPU Usage Alert', target: 'Worker Node #4', time: '5 hours ago', type: 'warning' },
  { id: 5, action: 'Payment Failed', target: 'Readers Den Delhi', time: '1 day ago', type: 'error' }
];

const TENANTS = [
  { name: 'StudyNest Patna', plan: 'Enterprise', status: 'Active', mrr: '$1,990', health: 98 },
  { name: 'LibroHub Mumbai', plan: 'Pro', status: 'Active', mrr: '$199', health: 100 },
  { name: 'Readers Den Delhi', plan: 'Pro', status: 'Suspended', mrr: '$0', health: 45 },
  { name: 'BookHaven BLR', plan: 'Enterprise', status: 'Active', mrr: '$1,990', health: 92 },
];

export default function SuperAdminDashboardPage() {
  const [timeRange, setTimeRange] = useState('7d');
  
  return (
    <div className="flex flex-col gap-6 w-full h-full min-h-[calc(100vh-6rem)] animate-in fade-in zoom-in-95 duration-300 pb-8">
      
      {/* Page Header */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Nexus 360</span><span>/</span><span className="text-blue-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Command Center</span>
          </div>
          <h1 className="sa-page-title text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm border border-blue-200/50 dark:border-blue-800/50">
              <BarChart3 size={24} />
            </div>
            Global Overview
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Monitor platform health, tenant growth, MRR metrics, and recent administrative activities across the Nexus 360 ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="1y">Last 1 Year</option>
          </select>
          <button className="px-4 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm transition-colors flex items-center gap-2">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 shrink-0">
        {METRICS.map(metric => (
          <div key={metric.id} className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 flex items-start justify-between group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${metric.color}-500/5 dark:bg-${metric.color}-500/10 rounded-bl-full transition-transform group-hover:scale-110`}></div>
            <div className="relative z-10 w-full">
              <div className="flex justify-between items-center mb-4">
                <div className={`w-10 h-10 rounded-xl bg-${metric.color}-50 dark:bg-${metric.color}-900/20 text-${metric.color}-600 dark:text-${metric.color}-400 flex items-center justify-center border border-${metric.color}-100 dark:border-${metric.color}-800/50 shadow-sm`}>
                  {metric.icon}
                </div>
                {metric.trend === 'up' && (
                  <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">
                    <TrendingUp size={12} /> {metric.change}
                  </span>
                )}
                {metric.trend === 'neutral' && (
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{metric.change}</span>
                )}
              </div>
              <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">{metric.label}</h3>
              <div className="text-3xl font-black text-gray-900 dark:text-white leading-none">{metric.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        
        {/* Left Column (Charts & Tables) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Revenue & Growth Chart (Placeholder visual) */}
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 flex-1 flex flex-col relative overflow-hidden">
             <div className="flex justify-between items-center mb-6 relative z-10">
               <div>
                 <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                   <Activity size={20} className="text-blue-500" /> Platform Growth
                 </h3>
                 <p className="text-xs font-semibold text-gray-500 mt-1">Tenant acquisition vs MRR over time</p>
               </div>
               <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"><MoreHorizontal size={18} className="text-gray-400" /></button>
             </div>
             
             {/* Decorative Chart Representation */}
             <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2 relative z-10">
                {[40, 60, 45, 80, 55, 90, 75, 100, 85, 110, 95, 120].map((h, i) => (
                  <div key={i} className="w-full relative flex items-end justify-center group h-full">
                    <div 
                      className="w-full max-w-[32px] bg-blue-500/20 dark:bg-blue-500/10 rounded-t-lg transition-all group-hover:bg-blue-500/40"
                      style={{ height: `${h}%` }}
                    >
                      <div className="w-full bg-blue-600 dark:bg-blue-500 rounded-t-lg absolute bottom-0 left-0 transition-all group-hover:opacity-80" style={{ height: `${h * 0.6}%` }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Top Tenants Table */}
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-0 flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
               <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                 <Building2 size={20} className="text-indigo-500" /> Top Performing Tenants
               </h3>
               <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">View All <ArrowUpRight size={14}/></button>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/50 dark:bg-[#1E293B]/50 text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Tenant Name</th>
                    <th className="px-6 py-4">Current Plan</th>
                    <th className="px-6 py-4">Monthly Rev</th>
                    <th className="px-6 py-4">Health Score</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {TENANTS.map((t, i) => (
                    <tr key={i} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                      <td className="px-6 py-4 font-extrabold text-gray-900 dark:text-white whitespace-nowrap">{t.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-[10px] font-extrabold uppercase tracking-wider">{t.plan}</span>
                      </td>
                      <td className="px-6 py-4 font-black text-gray-800 dark:text-gray-200">{t.mrr}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className={`h-full ${t.health > 90 ? 'bg-emerald-500' : t.health > 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${t.health}%` }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-gray-500">{t.health}/100</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm border flex items-center gap-1.5 w-fit
                          ${t.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800/50' : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-800/50'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div> {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Activity Feed & Quick Actions) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* Quick Shortcuts */}
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Zap size={20} className="text-amber-500" /> Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Add Tenant', icon: <Building2 size={16}/>, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
                { label: 'New Plan', icon: <CreditCard size={16}/>, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
                { label: 'System Audit', icon: <ShieldAlert size={16}/>, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
                { label: 'Global Alert', icon: <Globe size={16}/>, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
              ].map((btn, i) => (
                <button key={i} className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1E293B] hover:border-gray-300 dark:hover:border-gray-600 flex flex-col items-center justify-center gap-2 transition-all shadow-sm group">
                  <div className={`p-2 rounded-lg ${btn.color} group-hover:scale-110 transition-transform`}>{btn.icon}</div>
                  <span className="text-[11px] font-extrabold text-gray-700 dark:text-gray-300">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-0 flex flex-col flex-1">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
               <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                 <RefreshCw size={20} className="text-violet-500" /> Live Audit Stream
               </h3>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">
                {RECENT_ACTIVITY.map((item, index) => {
                  let color = 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:border-gray-700';
                  if (item.type === 'success') color = 'bg-emerald-50 text-emerald-500 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50';
                  if (item.type === 'warning') color = 'bg-amber-50 text-amber-500 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50';
                  if (item.type === 'error') color = 'bg-rose-50 text-rose-500 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800/50';
                  if (item.type === 'info') color = 'bg-blue-50 text-blue-500 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50';

                  return (
                    <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#0F172A] ${color} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10`}>
                        <Activity size={14} />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1E293B] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-extrabold text-gray-900 dark:text-white text-sm">{item.action}</div>
                        </div>
                        <div className="text-xs font-semibold text-gray-500 mb-2 truncate" title={item.target}>{item.target}</div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          <Clock size={10} /> {item.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
