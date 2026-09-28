'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';

const ITEMS = [
  { title: 'Libraries / Organizations', description: 'Manage library organizations and their status.', href: '/superadmin/superadmin_libraries', keywords: 'libraries organizations library' },
  { title: 'Branch Management', description: 'Manage branches and locations.', href: '/superadmin/superadmin_branches', keywords: 'branches locations' },
  { title: 'Platform Users', description: 'Manage Super Admin platform users.', href: '/superadmin/superadmin_users', keywords: 'users platform accounts' },
  { title: 'Roles & Permissions', description: 'Manage roles and permission matrices.', href: '/superadmin/superadmin_roles', keywords: 'roles permissions access' },
  { title: 'Plans & Subscriptions', description: 'Manage subscription plans and subscriptions.', href: '/superadmin/superadmin_subscriptions', keywords: 'plans subscriptions billing' },
  { title: 'Feature Management', description: 'Control platform features.', href: '/superadmin/superadmin_features', keywords: 'features modules' },
  { title: 'Global Library Configuration', description: 'Manage global platform configuration.', href: '/superadmin/superadmin_global-config', keywords: 'configuration settings global' },
  { title: 'Security Center', description: 'Review security controls and events.', href: '/superadmin/superadmin_security', keywords: 'security authentication' },
  { title: 'Global Audit Center', description: 'Review platform audit activity.', href: '/superadmin/superadmin_audit-logs', keywords: 'audit logs activity' },
  { title: 'Backup & Disaster Recovery', description: 'Manage backup and recovery controls.', href: '/superadmin/superadmin_backup', keywords: 'backup disaster recovery restore' },
  { title: 'Monitoring & Alerts', description: 'Review system health and alerts.', href: '/superadmin/superadmin_monitoring', keywords: 'monitoring alerts health' },
  { title: 'Reports & Analytics', description: 'Review platform reports and analytics.', href: '/superadmin/superadmin_reports', keywords: 'reports analytics' },
  { title: 'Support & Operations', description: 'Manage support operations and tickets.', href: '/superadmin/superadmin_support-tickets', keywords: 'support tickets operations' },
  { title: 'Data Governance & Compliance', description: 'Review governance and compliance controls.', href: '/superadmin/superadmin_compliance', keywords: 'governance compliance data' },
  { title: 'System Settings', description: 'Manage system-wide settings.', href: '/superadmin/superadmin_settings', keywords: 'settings system' },
  { title: 'My Profile', description: 'Manage the Super Admin profile.', href: '/superadmin/superadmin_profile', keywords: 'profile account' },
];

export default function SuperAdminSearchPage() {
  const params = useSearchParams();
  const query = (params.get('q') || '').trim();
  const results = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter(item => `${item.title} ${item.description} ${item.keywords}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <div>
      <div className="sa-page-header">
        <div>
          <div className="sa-breadcrumb"><Link href="/superadmin/superadmin_dashboard">Super Admin</Link><span>/</span><span>Search</span></div>
          <h1 className="sa-page-title">Global Search</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{query ? `Results for “${query}”` : 'Search Super Admin modules.'}</p>
        </div>
        <Link href="/superadmin/superadmin_dashboard" className="sa-btn-ghost sa-btn-ghost--sm"><ArrowLeft size={14} /> Dashboard</Link>
      </div>

      <div className="sa-card p-4">
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-500 dark:text-gray-400">
          <Search size={16} />
          <span>{results.length} module{results.length === 1 ? '' : 's'} found</span>
        </div>
        {results.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.map(item => (
              <Link key={item.href} href={item.href} className="sa-card p-4 block hover:border-indigo-400 transition-colors">
                <div className="font-semibold text-gray-900 dark:text-white">{item.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">No Super Admin module matches this search.</div>
        )}
      </div>
    </div>
  );
}
