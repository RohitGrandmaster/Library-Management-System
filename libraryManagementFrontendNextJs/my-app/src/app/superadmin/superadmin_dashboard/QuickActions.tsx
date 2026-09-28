import React from 'react';
import Link from 'next/link';
import { 
  Library, Building2, UserPlus, CreditCard, ShieldAlert, Activity, DatabaseBackup, Wrench
} from 'lucide-react';

const ACTIONS = [
  { label: "Create Library", icon: <Library className="w-6 h-6" />, href: "/superadmin/superadmin_libraries/create", color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { label: "Create Branch", icon: <Building2 className="w-6 h-6" />, href: "/superadmin/superadmin_branches/create", color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
  { label: "Create User", icon: <UserPlus className="w-6 h-6" />, href: "/superadmin/superadmin_users/create", color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400" },
  { label: "Create Plan", icon: <CreditCard className="w-6 h-6" />, href: "/superadmin/superadmin_subscriptions/create", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { label: "View Security Alerts", icon: <ShieldAlert className="w-6 h-6" />, href: "/superadmin/superadmin_security", color: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
  { label: "View Audit", icon: <Activity className="w-6 h-6" />, href: "/superadmin/superadmin_audit-logs", color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
  { label: "Create Backup", icon: <DatabaseBackup className="w-6 h-6" />, href: "/superadmin/superadmin_backup/create", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  { label: "Maintenance Mode", icon: <Wrench className="w-6 h-6" />, href: "/superadmin/superadmin_server", color: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
];

export default function QuickActions() {
  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm mt-6">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-8 gap-4">
        {ACTIONS.map((action, idx) => (
          <Link key={idx} href={action.href} className="flex flex-col items-center justify-center p-4 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#1E293B] transition-all group">
            <div className={`p-4 rounded-full mb-3 ${action.color} group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
