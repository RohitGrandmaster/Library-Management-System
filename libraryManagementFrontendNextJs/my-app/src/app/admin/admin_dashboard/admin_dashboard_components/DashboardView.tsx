'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Users, ArrowRightLeft, Clock,
  AlertTriangle, CheckCircle, PlusCircle, UserPlus,
  RefreshCw, UploadCloud, DownloadCloud, Activity,
  CreditCard, Map, FileText, ChevronRight, Book,
  BookX, CalendarDays, Wallet, UserCheck, UserMinus
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import Link from 'next/link';

// --- MOCK DATA ---
const KPI_TABS = [
  { id: 'books', label: 'Books & Inventory' },
  { id: 'members', label: 'Members' },
  { id: 'circulation', label: 'Circulation Today' },
  { id: 'others', label: 'Finance & Branches' },
];

const KPI_DATA = {
  books: [
    { title: 'Total Books', value: '45,230', icon: Book, color: 'from-blue-500 to-cyan-400' },
    { title: 'Total Copies', value: '1,20,400', icon: BookOpen, color: 'from-indigo-500 to-purple-400' },
    { title: 'Available', value: '85,000', icon: CheckCircle, color: 'from-emerald-500 to-teal-400' },
    { title: 'Issued', value: '32,150', icon: ArrowRightLeft, color: 'from-orange-500 to-yellow-400' },
    { title: 'Overdue', value: '1,450', icon: Clock, color: 'from-red-500 to-pink-400' },
    { title: 'Reserved', value: '850', icon: Activity, color: 'from-fuchsia-500 to-rose-400' },
    { title: 'Lost Books', value: '450', icon: BookX, color: 'from-slate-500 to-gray-400' },
    { title: 'Damaged', value: '500', icon: AlertTriangle, color: 'from-amber-600 to-orange-500' },
  ],
  members: [
    { title: 'Total Members', value: '12,500', icon: Users, color: 'from-blue-600 to-indigo-500' },
    { title: 'Active', value: '10,200', icon: UserCheck, color: 'from-emerald-500 to-green-400' },
    { title: 'Expired', value: '1,500', icon: UserMinus, color: 'from-red-500 to-rose-400' },
    { title: 'New Today', value: '45', icon: UserPlus, color: 'from-purple-500 to-fuchsia-400' },
  ],
  circulation: [
    { title: 'Issues Today', value: '350', icon: ArrowRightLeft, color: 'from-cyan-500 to-blue-400' },
    { title: 'Returns Today', value: '280', icon: DownloadCloud, color: 'from-teal-500 to-emerald-400' },
    { title: 'Renewals Today', value: '120', icon: RefreshCw, color: 'from-violet-500 to-purple-400' },
    { title: 'Pending Rsv.', value: '85', icon: Clock, color: 'from-amber-500 to-orange-400' },
  ],
  others: [
    { title: 'Pending Fines', value: '₹45,200', icon: AlertTriangle, color: 'from-rose-500 to-red-400' },
    { title: 'Collected Today', value: '₹3,400', icon: Wallet, color: 'from-green-500 to-emerald-400' },
    { title: 'Active Managers', value: '14', icon: Users, color: 'from-blue-500 to-cyan-400' },
    { title: 'Active Branches', value: '5', icon: Map, color: 'from-indigo-500 to-violet-400' },
  ]
};

const QUICK_ACTIONS = [
  { label: 'Add Book', icon: PlusCircle, href: '/admin/admin_books', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { label: 'Add Member', icon: UserPlus, href: '/admin/admin_members', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { label: 'Issue Book', icon: UploadCloud, href: '/admin/admin_circulation', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  { label: 'Return Book', icon: DownloadCloud, href: '/admin/admin_circulation', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
  { label: 'Renew Book', icon: RefreshCw, href: '/admin/admin_circulation', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  { label: 'Add Manager', icon: Users, href: '/admin/admin_staff-users', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  { label: 'Add Branch', icon: Map, href: '/admin/admin_branches', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  { label: 'Receive Stock', icon: Activity, href: '/admin/admin_inventory', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { label: 'Collect Fine', icon: CreditCard, href: '/admin/admin_fines', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
  { label: 'Report', icon: FileText, href: '/admin/admin_reports', color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400' },
];

const RECENT_ACTIVITY = [
  { id: 1, type: 'Issue', text: 'Book "The Alchemist" issued to John Doe', time: '10 mins ago', icon: ArrowRightLeft, color: 'text-blue-500' },
  { id: 2, type: 'Return', text: 'Book "Sapiens" returned by Jane Smith', time: '15 mins ago', icon: CheckCircle, color: 'text-emerald-500' },
  { id: 3, type: 'Member', text: 'New member Alex joined Branch A', time: '1 hour ago', icon: UserPlus, color: 'text-purple-500' },
  { id: 4, type: 'Payment', text: 'Late fine ₹50 collected from Raj', time: '2 hours ago', icon: CreditCard, color: 'text-green-500' },
  { id: 5, type: 'Book', text: '50 copies of "Dune" added to inventory', time: '3 hours ago', icon: PlusCircle, color: 'text-indigo-500' },
];

const CIRCULATION_CHART_DATA = [
  { name: 'Mon', issue: 400, return: 240, renew: 120, overdue: 40 },
  { name: 'Tue', issue: 300, return: 139, renew: 220, overdue: 50 },
  { name: 'Wed', issue: 200, return: 980, renew: 229, overdue: 60 },
  { name: 'Thu', issue: 278, return: 390, renew: 200, overdue: 30 },
  { name: 'Fri', issue: 189, return: 480, renew: 218, overdue: 25 },
  { name: 'Sat', issue: 239, return: 380, renew: 250, overdue: 15 },
  { name: 'Sun', issue: 349, return: 430, renew: 210, overdue: 20 },
];

const MEMBERSHIP_CHART_DATA = [
  { name: 'Active', value: 10200, color: '#10b981' },
  { name: 'Expiring Soon', value: 800, color: '#f59e0b' },
  { name: 'Expired', value: 1200, color: '#ef4444' },
  { name: 'Suspended', value: 300, color: '#64748b' },
];

const BRANCH_COMPARISON_DATA = [
  { name: 'Main Branch', members: 4500, books: 55000, circ: 1200, fine: 15000 },
  { name: 'South Branch', members: 3200, books: 32000, circ: 850, fine: 8500 },
  { name: 'North Branch', members: 2800, books: 25000, circ: 620, fine: 6200 },
  { name: 'East Branch', members: 1500, books: 12000, circ: 340, fine: 3100 },
];

export default function DashboardView() {
  const [activeKpiTab, setActiveKpiTab] = useState<keyof typeof KPI_DATA>('books');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-x-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4 border-border">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Command Center for Library Operations, Circulation, and Members.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/admin_reports" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all shadow-sm">
            <Activity size={16} />
            Full Analytics
          </Link>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Activity className="text-blue-500" size={20} /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-3">
          {QUICK_ACTIONS.map((action, i) => (
            <Link key={i} href={action.href}>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="min-h-[92px] flex flex-col items-center justify-center p-3 rounded-xl border border-border shadow-sm bg-card hover:border-primary/50 cursor-pointer transition-colors"
              >
                <div className={`p-2 rounded-full mb-2 ${action.color}`}>
                  <action.icon size={20} />
                </div>
                <span className="text-[11px] font-medium text-center leading-tight">{action.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* DYNAMIC KPI CARDS */}
      <section className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-1 p-2 bg-muted/30 border-b border-border">
          {KPI_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveKpiTab(tab.id as keyof typeof KPI_DATA)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeKpiTab === tab.id ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <motion.div 
          key={activeKpiTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4"
        >
          {KPI_DATA[activeKpiTab].map((kpi, i) => (
            <motion.div variants={itemVariants} key={i} className="flex flex-col gap-2 p-4 rounded-xl bg-background border border-border hover:border-primary/30 transition-all hover:shadow-md group">
              <div className={`p-2.5 rounded-lg w-fit bg-gradient-to-br ${kpi.color} text-white shadow-inner group-hover:scale-110 transition-transform`}>
                <kpi.icon size={18} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium truncate">{kpi.title}</p>
                <h4 className="text-xl font-bold mt-0.5">{kpi.value}</h4>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ANALYTICS CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Circulation Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl shadow-sm p-5 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <ArrowRightLeft className="text-cyan-500" size={20} />
              Circulation Analytics (7 Days)
            </h3>
            <select className="text-xs border rounded-md px-2 py-1 bg-background text-muted-foreground">
              <option>Last 7 Days</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CIRCULATION_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIssue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--muted-foreground)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--muted-foreground)'}} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="issue" name="Issues" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorIssue)" />
                <Area type="monotone" dataKey="return" name="Returns" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorReturn)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Members Chart */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-5 flex flex-col">
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <Users className="text-purple-500" size={20} />
            Members Overview
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] relative">
             <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={MEMBERSHIP_CHART_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {MEMBERSHIP_CHART_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
                    itemStyle={{ fontSize: '13px', color: 'var(--foreground)' }}
                  />
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-4">
               <span className="text-2xl font-bold">12.5k</span>
               <span className="text-xs text-muted-foreground">Total</span>
             </div>
             
             <div className="w-full mt-4 space-y-2">
                {MEMBERSHIP_CHART_DATA.map(item => (
                  <div key={item.name} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value.toLocaleString()}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* ANALYTICS CHARTS ROW 2 & ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Branch Comparison */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl shadow-sm p-5 flex flex-col">
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <Map className="text-indigo-500" size={20} />
            Branch Comparison (Books & Members)
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BRANCH_COMPARISON_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--muted-foreground)'}} />
                <YAxis yAxisId="left" orientation="left" stroke="#6366f1" axisLine={false} tickLine={false} tick={{fontSize: 11}} />
                <YAxis yAxisId="right" orientation="right" stroke="#ec4899" axisLine={false} tickLine={false} tick={{fontSize: 11}} />
                <RechartsTooltip 
                  cursor={{fill: 'var(--muted)', opacity: 0.2}}
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
                <Bar yAxisId="left" dataKey="books" name="Total Books" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar yAxisId="right" dataKey="members" name="Total Members" fill="#ec4899" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-semibold text-lg flex items-center gap-2">
                <Clock className="text-amber-500" size={20} />
                Recent Activity
             </h3>
             <Link href="/admin/admin_audit-logs" className="text-xs text-primary hover:underline">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {RECENT_ACTIVITY.map((activity, index) => (
              <div key={activity.id} className="flex gap-3 relative">
                {index !== RECENT_ACTIVITY.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-[-16px] w-[1px] bg-border" />
                )}
                <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 z-10 border-2 border-card ${activity.color}`}>
                  <activity.icon size={14} />
                </div>
                <div className="pb-1">
                  <p className="text-sm font-medium leading-snug">{activity.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
