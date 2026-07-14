'use client';
import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { IndianRupee, TrendingUp, TrendingDown, Users, Download, FileSpreadsheet, CheckCircle } from 'lucide-react';

// ── Chart data ────────────────────────────────────────────────────────────────
const REVENUE_EXPENSE = [
  { month: 'Nov', Revenue: 142000, Expenses: 45000 },
  { month: 'Dec', Revenue: 158000, Expenses: 52000 },
  { month: 'Jan', Revenue: 134000, Expenses: 41000 },
  { month: 'Feb', Revenue: 172000, Expenses: 58000 },
  { month: 'Mar', Revenue: 196000, Expenses: 61000 },
  { month: 'Apr', Revenue: 214000, Expenses: 67000 },
];

const REVENUE_TREND = [
  { month: 'May', Revenue: 88000  }, { month: 'Jun', Revenue: 97000  },
  { month: 'Jul', Revenue: 112000 }, { month: 'Aug', Revenue: 125000 },
  { month: 'Sep', Revenue: 138000 }, { month: 'Oct', Revenue: 119000 },
  { month: 'Nov', Revenue: 142000 }, { month: 'Dec', Revenue: 158000 },
  { month: 'Jan', Revenue: 134000 }, { month: 'Feb', Revenue: 172000 },
  { month: 'Mar', Revenue: 196000 }, { month: 'Apr', Revenue: 214000 },
];

const STUDENT_GROWTH = [
  { month: 'Nov', Joined: 320, Exited: 85  },
  { month: 'Dec', Joined: 410, Exited: 110 },
  { month: 'Jan', Joined: 280, Exited: 70  },
  { month: 'Feb', Joined: 490, Exited: 130 },
  { month: 'Mar', Joined: 520, Exited: 95  },
  { month: 'Apr', Joined: 380, Exited: 88  },
];

const OCCUPANCY = [
  { name: 'Morning',     value: 42 },
  { name: 'Afternoon',   value: 31 },
  { name: 'Evening',     value: 18 },
  { name: 'Unallocated', value: 9  },
];

// Dynamic data-driven colours — CSS var strings (Rule 3 allowed)
const PIE_COLORS = ['var(--primary)', 'var(--success)', 'var(--warning)', 'var(--border)'];

// ── KPI cards ─────────────────────────────────────────────────────────────────
const KPI_CARDS = [
  { label: 'Total Revenue This Month', value: '₹2,14,000', iconCls: 'sa-reports-kpi-icon--primary', Icon: IndianRupee,  trend: '+18% vs last month', trendCls: 'sa-reports-kpi-trend--up',   TrendIcon: TrendingUp   },
  { label: 'Total Expenses',           value: '₹67,000',   iconCls: 'sa-reports-kpi-icon--danger',  Icon: TrendingDown, trend: '+9% vs last month',  trendCls: 'sa-reports-kpi-trend--down', TrendIcon: TrendingDown },
  { label: 'Net Profit',               value: '₹1,47,000', iconCls: 'sa-reports-kpi-icon--success', Icon: TrendingUp,   trend: '+22% vs last month', trendCls: 'sa-reports-kpi-trend--up',   TrendIcon: TrendingUp   },
  { label: 'Active Libraries',         value: '38',         iconCls: 'sa-reports-kpi-icon--warning', Icon: Users,        trend: '+4 this month',      trendCls: 'sa-reports-kpi-trend--up',   TrendIcon: TrendingUp   },
];

const DATE_RANGES = ['This Month', 'Last 3 Months', 'Last 6 Months', 'This Year'];

// ── Shared chart style (CSS var strings — no hex) ─────────────────────────────
const AXIS_TICK = { fill: 'var(--text-secondary)', fontSize: 11, fontFamily: 'Inter, sans-serif' } as const;
const GRID_COLOR = 'var(--border)';
const TOOLTIP_CONTENT_STYLE = {
  background: 'var(--bg-sidebar)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontSize: 12,
  color: 'var(--text-primary)',
};

// Type-safe recharts formatters (cast needed — recharts ValueType includes arrays)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rupeeFormatter = (value: any) => [`₹${Number(value ?? 0).toLocaleString()}`, ''] as [string, string];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pctFormatter   = (value: any) => [`${value ?? 0}%`, ''] as [string, string];

export default function ReportsPage() {
  const [range,    setRange]    = useState('Last 6 Months');
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <>
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Nexus 360</span><span>/</span><span>Super Admin</span><span>/</span><span>Reports</span>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="sa-page-title">Platform Reports & Analytics</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
              {DATE_RANGES.map(r => (
                <button key={r} onClick={() => setRange(r)}
                  className={`sa-filter-tab ${range === r ? 'sa-filter-tab--active' : ''}`}>
                  {r}
                </button>
              ))}
            </div>
            <button className="sa-btn-export" onClick={handleExport}>
              {exported
                ? <><CheckCircle size={13} className="sa-metric--success" /> Exported!</>
                : <><Download size={13} /> Export PDF</>}
            </button>
            <button className="sa-btn-export" onClick={handleExport}>
              <FileSpreadsheet size={13} /> Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {KPI_CARDS.map(k => (
          <div key={k.label} className="sa-reports-kpi">
            <div className={`sa-reports-kpi-icon ${k.iconCls}`}>
              <k.Icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="sa-reports-kpi-label">{k.label}</p>
              <p className="sa-reports-kpi-value">{k.value}</p>
              <span className={`sa-reports-kpi-trend ${k.trendCls}`}>
                <k.TrendIcon size={12} /> {k.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 2×2 Chart Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Revenue vs Expenses */}
        <div className="sa-chart-card">
          <div className="sa-chart-card-header">
            <div>
              <p className="sa-chart-card-title">Revenue vs Expenses</p>
              <p className="sa-chart-card-sub">Grouped comparison — last 6 months</p>
            </div>
          </div>
          <div className="sa-chart-card-body--h280">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_EXPENSE} barCategoryGap="30%">
                <CartesianGrid vertical={false} stroke={GRID_COLOR} strokeOpacity={0.4} />
                <XAxis dataKey="month" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${(Number(v) / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={TOOLTIP_CONTENT_STYLE} formatter={rupeeFormatter} />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
                <Bar dataKey="Revenue"  fill="var(--primary)" radius={[4,4,0,0]} />
                <Bar dataKey="Expenses" fill="var(--danger)"  radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Shift Occupancy Donut */}
        <div className="sa-chart-card">
          <div className="sa-chart-card-header">
            <div>
              <p className="sa-chart-card-title">Shift-wise Seat Occupancy</p>
              <p className="sa-chart-card-sub">Percentage of occupied seats per shift</p>
            </div>
          </div>
          <div className="sa-chart-card-body--h280">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={OCCUPANCY} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3}>
                  {OCCUPANCY.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_CONTENT_STYLE} formatter={pctFormatter} />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend Line */}
        <div className="sa-chart-card">
          <div className="sa-chart-card-header">
            <div>
              <p className="sa-chart-card-title">Monthly Revenue Trend</p>
              <p className="sa-chart-card-sub">Rolling 12-month platform revenue</p>
            </div>
          </div>
          <div className="sa-chart-card-body--h280">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_TREND}>
                <CartesianGrid vertical={false} stroke={GRID_COLOR} strokeOpacity={0.4} />
                <XAxis dataKey="month" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${(Number(v) / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={TOOLTIP_CONTENT_STYLE} formatter={rupeeFormatter} />
                <Line type="monotone" dataKey="Revenue" stroke="var(--success)" strokeWidth={2}
                  dot={{ fill: 'var(--success)', r: 4 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Growth */}
        <div className="sa-chart-card">
          <div className="sa-chart-card-header">
            <div>
              <p className="sa-chart-card-title">Student Growth</p>
              <p className="sa-chart-card-sub">Joined vs Exited per month</p>
            </div>
          </div>
          <div className="sa-chart-card-body--h280">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STUDENT_GROWTH} barCategoryGap="30%">
                <CartesianGrid vertical={false} stroke={GRID_COLOR} strokeOpacity={0.4} />
                <XAxis dataKey="month" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_CONTENT_STYLE} />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
                <Bar dataKey="Joined" fill="var(--info)"   radius={[4,4,0,0]} />
                <Bar dataKey="Exited" fill="var(--danger)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </>
  );
}
