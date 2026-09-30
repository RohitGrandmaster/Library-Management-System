'use client';
import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { IndianRupee, TrendingUp, TrendingDown, Users, Download, Building2, CreditCard, Activity } from 'lucide-react';

const REVENUE_DATA = [
  { month: 'Nov', MRR: 120000, Target: 100000 },
  { month: 'Dec', MRR: 145000, Target: 110000 },
  { month: 'Jan', MRR: 135000, Target: 120000 },
  { month: 'Feb', MRR: 175000, Target: 130000 },
  { month: 'Mar', MRR: 210000, Target: 145000 },
  { month: 'Apr', MRR: 245000, Target: 160000 },
];

const TENANT_GROWTH = [
  { month: 'Nov', Active: 12, Churned: 1 },
  { month: 'Dec', Active: 15, Churned: 0 },
  { month: 'Jan', Active: 14, Churned: 2 },
  { month: 'Feb', Active: 22, Churned: 1 },
  { month: 'Mar', Active: 28, Churned: 0 },
  { month: 'Apr', Active: 35, Churned: 1 },
];

const PLAN_DISTRIBUTION = [
  { name: 'Basic Plan', value: 45, color: 'var(--info)' },
  { name: 'Pro Plan', value: 35, color: 'var(--primary)' },
  { name: 'Enterprise', value: 20, color: 'var(--warning)' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e1e2d] border border-white/10 p-3 rounded-lg shadow-xl">
        <p className="text-white font-bold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm flex items-center gap-2" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            {entry.name}: <span className="font-bold">{entry.name.includes('MRR') || entry.name.includes('Target') ? `₹${entry.value.toLocaleString()}` : entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ReportsAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('Financials');

  const KPI_CARDS = [
    { label: 'Monthly Recurring Revenue (MRR)', value: '₹2,45,000', icon: IndianRupee, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', trend: '+16.6% vs last month', up: true },
    { label: 'Annual Run Rate (ARR)', value: '₹29,40,000', icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', trend: 'Projected', up: true },
    { label: 'Active SaaS Tenants (Libraries)', value: '35', icon: Building2, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20', trend: '+7 new this month', up: true },
    { label: 'Gross Churn Rate', value: '2.8%', icon: TrendingDown, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', trend: '-0.5% vs last month', up: true }, // Lower churn is good
  ];

  return (
    <div className="sa-page-animate pb-12">
      
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Nexus 360</span><span>/</span><span>Super Admin</span><span>/</span><span>Reports & Analytics</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title flex items-center gap-3">
            <Activity className="text-primary" size={28} /> Global SaaS Analytics
          </h1>
          <button className="sa-btn-primary">
            <Download size={16} /> Export Master PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {KPI_CARDS.map((kpi, i) => (
          <div key={i} className="sa-card p-5 border border-white/5 bg-white/[0.02]">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.border} border`}><kpi.icon size={24} className={kpi.color} /></div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${kpi.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {kpi.up ? <TrendingUp size={10}/> : <TrendingDown size={10}/>} {kpi.trend}
              </span>
            </div>
            <p className="text-xs text-white/50 font-medium uppercase tracking-wider mb-1">{kpi.label}</p>
            <h3 className="text-3xl font-bold text-white">{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2 overflow-x-auto hide-scrollbar">
        {['Financials', 'Tenant Growth', 'Subscription Mix'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-indigo-500/20 text-white border border-indigo-500/30' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="sa-card p-6 h-[500px] border border-white/5 flex flex-col">
        {activeTab === 'Financials' && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white">MRR Growth (6 Months)</h2>
              <p className="text-sm text-white/50">Actual Monthly Recurring Revenue vs Target Goal.</p>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Area type="monotone" dataKey="MRR" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorMRR)" />
                  <Line type="monotone" dataKey="Target" stroke="rgba(255,255,255,0.2)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'Tenant Growth' && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white">Active Tenants vs Churn</h2>
              <p className="text-sm text-white/50">Number of live libraries using the platform and those that cancelled.</p>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TENANT_GROWTH} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Bar dataKey="Active" fill="var(--success)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Churned" fill="var(--danger)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'Subscription Mix' && (
          <div className="flex-1 flex flex-col animate-fade-in items-center justify-center">
            <div className="mb-2 w-full text-left">
              <h2 className="text-lg font-bold text-white">Subscription Distribution</h2>
              <p className="text-sm text-white/50">Breakdown of tenants by pricing tier.</p>
            </div>
            <div className="flex-1 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PLAN_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={130}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {PLAN_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
