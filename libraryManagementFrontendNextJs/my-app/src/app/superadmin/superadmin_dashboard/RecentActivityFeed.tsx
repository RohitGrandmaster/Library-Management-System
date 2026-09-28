import React from 'react';
import Link from 'next/link';
import { 
  Library, Building2, UserPlus, CreditCard, ShieldAlert, Activity, AlertOctagon, Clock 
} from 'lucide-react';

const ACTIVITIES = [
  {
    icon: <Library className="w-5 h-5" />,
    color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    title: 'Latest library created',
    desc: 'StudyNest Patna registered on the platform.',
    time: '2 hours ago',
    href: '/superadmin/superadmin_libraries',
  },
  {
    icon: <Building2 className="w-5 h-5" />,
    color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    title: 'Latest branch created',
    desc: 'StudyNest - Kankarbagh Branch added.',
    time: '3 hours ago',
    href: '/superadmin/superadmin_branches',
  },
  {
    icon: <UserPlus className="w-5 h-5" />,
    color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
    title: 'Latest user created',
    desc: 'Manager account created for Rahul Verma.',
    time: '4 hours ago',
    href: '/superadmin/superadmin_users',
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    title: 'Latest subscription',
    desc: 'Scholar Spaces upgraded to Premium Annual Plan.',
    time: '5 hours ago',
    href: '/superadmin/superadmin_subscriptions',
  },
  {
    icon: <ShieldAlert className="w-5 h-5" />,
    color: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    title: 'Latest security event',
    desc: 'Multiple failed login attempts from IP 192.168.1.45',
    time: '12 hours ago',
    href: '/superadmin/superadmin_security',
  },
  {
    icon: <Activity className="w-5 h-5" />,
    color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    title: 'Latest audit event',
    desc: 'SuperAdmin modified Global Platform Settings.',
    time: '1 day ago',
    href: '/superadmin/superadmin_audit-logs',
  },
  {
    icon: <AlertOctagon className="w-5 h-5" />,
    color: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    title: 'Latest system error',
    desc: 'Payment Gateway Webhook Timeout.',
    time: '2 days ago',
    href: '/superadmin/superadmin_monitoring',
  }
];

export default function RecentActivityFeed() {
  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm mt-6 overflow-hidden">
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Clock size={16} className="text-blue-500" /> Recent Platform Activity
        </h3>
        <Link href="/superadmin/superadmin_audit-logs" className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline">
          View All Logs
        </Link>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {ACTIVITIES.map((item, i) => (
          <Link key={i} href={item.href} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-[#1E293B] transition-colors">
            <div className={`p-3 rounded-full ${item.color}`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.desc}</p>
            </div>
            <span className="text-xs font-medium text-gray-400 whitespace-nowrap">{item.time}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
