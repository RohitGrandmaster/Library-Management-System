'use client';

import { useState, useEffect } from 'react';
import { Download, FileText, IndianRupee, Users, Wallet, TrendingUp, BarChart2, PieChart as PieIcon, Activity } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from 'recharts';
import KpiCard from '@/app/admin/reusable/KpiCard';
import { fetchApi } from '@/lib/api';

type Range = 'thisMonth' | 'last3Months' | 'thisYear';

const RANGE_OPTIONS: { label: string; key: Range }[] = [
  { label: 'This Month',    key: 'thisMonth'    },
  { label: 'Last 3 Months', key: 'last3Months'  },
  { label: 'This Year',     key: 'thisYear'     },
];

const KPI_META = [
  { icon: IndianRupee, iconColor: 'var(--primary)', iconBg: 'var(--icon-bg-primary)' },
  { icon: Wallet,      iconColor: 'var(--danger)',  iconBg: 'var(--icon-bg-danger)'  },
  { icon: TrendingUp,  iconColor: 'var(--success)', iconBg: 'var(--icon-bg-success)' },
  { icon: Users,       iconColor: 'var(--purple)',  iconBg: 'var(--icon-bg-purple)'  },
] as const;

const AXIS_TICK = { fill: 'var(--text-secondary)', fontSize: 11 } as const;

const TOOLTIP_STYLE = {
  contentStyle: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    fontSize: 12,
    color: 'var(--text-primary)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  },
  labelStyle:  { color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 4 },
  itemStyle:   { color: 'var(--text-primary)'   },
  cursor:      { fill: 'rgba(99,102,241,0.06)'  },
} as const;

export default function AdminReportsPage() {
  const [range, setRange]   = useState<Range>('last3Months');
  const [branch, setBranch] = useState('All Branches');
  const [data, setData]     = useState<any>(null);

  useEffect(() => {
    fetchApi('/admin/reports').then(setData).catch(console.error);
  }, []);

  if (!data) return <div className="p-8">Loading reports...</div>;

  const incomeData  = data.incomeVsExpense[range];
  const revenueData = data.revenueTrend[range];
  const growthData  = data.studentGrowth[range];

  function handleExport(type: 'PDF' | 'Excel') {
    toast.success(`${type} export started — file will download shortly.`, { duration: 3000 });
  }

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontSize: 13,
          },
        }}
      />

      <div className="space-y-6 pb-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-1 tracking-widest uppercase font-medium">Smart Library 360 › Admin › Reports</p>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Analytics & Reports</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Financial health and operational overview across branches</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Range filter */}
            <div className="admin-tab-bar">
              {RANGE_OPTIONS.map(o => (
                <button
                  key={o.key}
                  onClick={() => setRange(o.key)}
                  className={`admin-tab${range === o.key ? ' active' : ''}`}
                >
                  {o.label}
                </button>
              ))}
            </div>

            {/* Branch filter */}
            <select
              value={branch}
              onChange={e => setBranch(e.target.value)}
              className="admin-select admin-select-sm"
            >
              <option>All Branches</option>
              <option>Main Branch</option>
              <option>Branch 2</option>
              <option>Kothrud Center</option>
              <option>Nashik Branch</option>
            </select>

            <button onClick={() => handleExport('PDF')} className="admin-btn-ghost admin-btn-sm">
              <FileText size={14} /> Export PDF
            </button>
            <button onClick={() => handleExport('Excel')} className="admin-btn-primary admin-btn-sm">
              <Download size={14} /> Export Excel
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.kpiCards.map((card: any, i: number) => (
            <KpiCard
              key={i}
              label={card.label}
              value={card.value}
              icon={KPI_META[i].icon}
              iconColor={KPI_META[i].iconColor}
              iconBg={KPI_META[i].iconBg}
              trend={card.trend as { value: string; up: boolean }}
              sub={card.sub}
            />
          ))}
        </div>

        {/* Charts 2×2 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Chart 1: Income vs Expenses */}
          <div className="admin-card p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--icon-bg-primary)' }}>
                  <BarChart2 size={14} style={{ color: 'var(--primary)' }} />
                </div>
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Income vs Expenses</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--chart-indigo)' }} />
                  <span className="text-xs text-[var(--text-secondary)]">Income</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--chart-red)' }} />
                  <span className="text-xs text-[var(--text-secondary)]">Expense</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={incomeData} barCategoryGap="30%" barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-line)" vertical={false} />
                <XAxis dataKey="month" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <YAxis
                  tick={AXIS_TICK}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `₹${(Number(v) / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  {...TOOLTIP_STYLE}
                  formatter={((v: any, name: string) => [`₹${Number(v).toLocaleString('en-IN')}`, name]) as any}
                />
                <Bar dataKey="income"  fill="var(--chart-indigo)" radius={[5,5,0,0]} name="Income"  maxBarSize={28} />
                <Bar dataKey="expense" fill="var(--chart-red)"    radius={[5,5,0,0]} name="Expense" maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2: Shift-wise Occupancy Donut */}
          <div className="admin-card p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--icon-bg-warning)' }}>
                <PieIcon size={14} style={{ color: 'var(--warning)' }} />
              </div>
              <h3 className="font-semibold text-sm text-[var(--text-primary)]">Shift-wise Occupancy %</h3>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data.shiftOccupancy}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  strokeWidth={0}
                >
                  {data.shiftOccupancy.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip
                  {...TOOLTIP_STYLE}
                  formatter={((v: any, name: string) => [`${v}%`, name]) as any}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: 'var(--text-secondary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 3: Monthly Revenue Trend — Area */}
          <div className="admin-card p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--icon-bg-success)' }}>
                  <Activity size={14} style={{ color: 'var(--success)' }} />
                </div>
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Monthly Revenue Trend</h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                {RANGE_OPTIONS.find(o => o.key === range)?.label}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGradAdmin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--chart-green)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-green)" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-line)" vertical={false} />
                <XAxis dataKey="month" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <YAxis
                  tick={AXIS_TICK}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `₹${(Number(v) / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  {...TOOLTIP_STYLE}
                  formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--chart-green)"
                  strokeWidth={2.5}
                  fill="url(#revGradAdmin)"
                  dot={{ fill: 'var(--chart-green)', r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: 'var(--chart-green)', strokeWidth: 2, stroke: 'var(--bg-card)' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 4: Student Growth */}
          <div className="admin-card p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--icon-bg-purple)' }}>
                  <Users size={14} style={{ color: 'var(--purple)' }} />
                </div>
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Student Growth</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--chart-indigo)' }} />
                  <span className="text-xs text-[var(--text-secondary)]">Joined</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--chart-red)' }} />
                  <span className="text-xs text-[var(--text-secondary)]">Exited</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={growthData} barCategoryGap="30%" barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-line)" vertical={false} />
                <XAxis dataKey="month" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <Tooltip
                  {...TOOLTIP_STYLE}
                  formatter={((v: any, name: string) => [v, name]) as any}
                />
                <Bar dataKey="joined" fill="var(--chart-indigo)" radius={[5,5,0,0]} name="Joined" maxBarSize={28} />
                <Bar dataKey="exited" fill="var(--chart-red)"    radius={[5,5,0,0]} name="Exited" maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Branch Summary Table */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-section-title">Branch-wise Summary</h3>
            <span className="admin-badge admin-badge-primary">{RANGE_OPTIONS.find(o => o.key === range)?.label}</span>
          </div>
          <div className="admin-card-body-flush">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                  {['Branch', 'Revenue', 'Expenses', 'Net Profit', 'Students', 'Occupancy'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { branch: 'Main Branch',    revenue: '₹62,000', expense: '₹18,000', profit: '₹44,000', students: 248, occ: 92 },
                  { branch: 'Branch 2',       revenue: '₹48,000', expense: '₹14,500', profit: '₹33,500', students: 180, occ: 85 },
                  { branch: 'Kothrud Center', revenue: '₹28,000', expense: '₹9,000',  profit: '₹19,000', students: 95,  occ: 78 },
                  { branch: 'Nashik Branch',  revenue: '₹14,000', expense: '₹5,000',  profit: '₹9,000',  students: 42,  occ: 60 },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{row.branch}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--primary)', fontWeight: 600, fontSize: 13 }}>{row.revenue}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--danger)', fontWeight: 600, fontSize: 13 }}>{row.expense}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--success)', fontWeight: 600, fontSize: 13 }}>{row.profit}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontSize: 13 }}>{row.students}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 9999, overflow: 'hidden' }}>
                          <div style={{ width: `${row.occ}%`, height: '100%', borderRadius: 9999, background: row.occ >= 85 ? 'var(--chart-green)' : row.occ >= 70 ? 'var(--chart-amber)' : 'var(--chart-red)' }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: row.occ >= 85 ? 'var(--success)' : row.occ >= 70 ? 'var(--warning)' : 'var(--danger)', minWidth: 32 }}>{row.occ}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}
