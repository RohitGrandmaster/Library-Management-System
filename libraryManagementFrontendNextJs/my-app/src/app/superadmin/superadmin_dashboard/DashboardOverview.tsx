import React from 'react';
import Link from 'next/link';
import { 
  Library, Building2, User, Users, BookOpen, AlertCircle, Clock, CheckCircle2, XCircle, FileText, Database, ShieldAlert,
  Server, HardDrive, DollarSign, Activity, AlertTriangle, BookMarked, PauseCircle, Archive
} from 'lucide-react';

const STATS_GROUPS = [
  {
    title: "Libraries & Branches",
    items: [
      { label: "Total Libraries", value: "2,451", href: "/superadmin/superadmin_libraries", icon: <Library className="w-5 h-5 text-blue-600 dark:text-blue-400" />, bg: "bg-blue-50 dark:bg-blue-900/30" },
      { label: "Active Libraries", value: "2,130", href: "/superadmin/superadmin_libraries?status=active", icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />, bg: "bg-emerald-50 dark:bg-emerald-900/30" },
      { label: "Pending Libraries", value: "145", href: "/superadmin/superadmin_libraries?status=pending", icon: <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />, bg: "bg-yellow-50 dark:bg-yellow-900/30" },
      { label: "Suspended Libraries", value: "89", href: "/superadmin/superadmin_libraries?status=suspended", icon: <PauseCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />, bg: "bg-orange-50 dark:bg-orange-900/30" },
      { label: "Archived Libraries", value: "87", href: "/superadmin/superadmin_libraries?status=archived", icon: <Archive className="w-5 h-5 text-gray-600 dark:text-gray-400" />, bg: "bg-gray-100 dark:bg-gray-800" },
      { label: "Total Branches", value: "8,942", href: "/superadmin/superadmin_branches", icon: <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />, bg: "bg-indigo-50 dark:bg-indigo-900/30" },
      { label: "Active Branches", value: "8,500", href: "/superadmin/superadmin_branches?status=active", icon: <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />, bg: "bg-green-50 dark:bg-green-900/30" },
    ]
  },
  {
    title: "Users & Engagement",
    items: [
      { label: "Total Admins", value: "4,102", href: "/superadmin/superadmin_users?role=admin", icon: <ShieldAlert className="w-5 h-5 text-purple-600 dark:text-purple-400" />, bg: "bg-purple-50 dark:bg-purple-900/30" },
      { label: "Total Managers", value: "15,840", href: "/superadmin/superadmin_users?role=manager", icon: <User className="w-5 h-5 text-sky-600 dark:text-sky-400" />, bg: "bg-sky-50 dark:bg-sky-900/30" },
      { label: "Total Users", value: "45,920", href: "/superadmin/superadmin_users", icon: <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />, bg: "bg-cyan-50 dark:bg-cyan-900/30" },
      { label: "Total Members across platform", value: "2.4M", href: "/superadmin/superadmin_users?type=member", icon: <Users className="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-400" />, bg: "bg-fuchsia-50 dark:bg-fuchsia-900/30" },
    ]
  },
  {
    title: "Books & Circulation",
    items: [
      { label: "Total Books across platform", value: "18.5M", href: "/superadmin/superadmin_reports", icon: <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />, bg: "bg-amber-50 dark:bg-amber-900/30" },
      { label: "Total Active Circulation", value: "1.2M", href: "/superadmin/superadmin_reports", icon: <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />, bg: "bg-emerald-50 dark:bg-emerald-900/30" },
      { label: "Total Overdue Books", value: "145K", href: "/superadmin/superadmin_reports", icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />, bg: "bg-red-50 dark:bg-red-900/30" },
      { label: "Total Reservations", value: "89K", href: "/superadmin/superadmin_reports", icon: <BookMarked className="w-5 h-5 text-blue-600 dark:text-blue-400" />, bg: "bg-blue-50 dark:bg-blue-900/30" },
    ]
  },
  {
    title: "Financial Overview",
    items: [
      { label: "Total Fine Generated", value: "₹4.5M", href: "/superadmin/superadmin_reports", icon: <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />, bg: "bg-gray-100 dark:bg-gray-800" },
      { label: "Total Fine Collected", value: "₹3.8M", href: "/superadmin/superadmin_reports", icon: <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />, bg: "bg-green-50 dark:bg-green-900/30" },
    ]
  },
  {
    title: "System & Security",
    items: [
      { label: "Storage Used", value: "4.8 TB", href: "/superadmin/superadmin_server", icon: <HardDrive className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />, bg: "bg-indigo-50 dark:bg-indigo-900/30" },
      { label: "Database Size", value: "850 GB", href: "/superadmin/superadmin_database", icon: <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />, bg: "bg-blue-50 dark:bg-blue-900/30" },
      { label: "Active Sessions", value: "12,450", href: "/superadmin/superadmin_server", icon: <Server className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />, bg: "bg-cyan-50 dark:bg-cyan-900/30" },
      { label: "Failed Login Attempts", value: "342", href: "/superadmin/superadmin_security", icon: <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />, bg: "bg-red-50 dark:bg-red-900/30" },
      { label: "Security Alerts", value: "12", href: "/superadmin/superadmin_security", icon: <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />, bg: "bg-orange-50 dark:bg-orange-900/30" },
      { label: "System Health", value: "99.9%", href: "/superadmin/superadmin_monitoring", icon: <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />, bg: "bg-green-50 dark:bg-green-900/30" },
    ]
  }
];

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      {STATS_GROUPS.map((group, idx) => (
        <div key={idx} className="bg-white dark:bg-[#0F172A] rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">{group.title}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {group.items.map((stat, sIdx) => (
              <Link key={sIdx} href={stat.href} className="flex flex-col p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1F3C] hover:bg-white dark:hover:bg-[#1E293B] hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700 transition-all group hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <span className={`p-2 rounded-lg shadow-sm ${stat.bg} group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{stat.value}</div>
                <div className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-semibold leading-tight">{stat.label}</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
