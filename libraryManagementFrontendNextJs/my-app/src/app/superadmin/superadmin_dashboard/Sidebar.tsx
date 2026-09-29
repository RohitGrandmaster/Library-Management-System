'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearAuthState } from '@/lib/auth';
import {
  LayoutDashboard, Wand2, Building2, CreditCard, Users, ShieldCheck,
  Server, Database, ListChecks, Plug, MessageCircle,
  Shield, DatabaseBackup, Activity, BarChart2, LifeBuoy, FileCheck,
  Settings, UserCircle, LogOut, ScrollText,
} from 'lucide-react';

type NavItem = { href: string; icon: typeof LayoutDashboard; label: string };
type NavGroup = { group: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    group: 'Overview',
    items: [
      { href: '/superadmin/superadmin_dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/superadmin/superadmin_reports', icon: BarChart2, label: 'Reports & Analytics' },
    ],
  },
  {
    group: 'Organization & Access',
    items: [
      { href: '/superadmin/superadmin_libraries', icon: Building2, label: 'Libraries / Organizations' },
      { href: '/superadmin/superadmin_branches', icon: Building2, label: 'Branch Management' },
      { href: '/superadmin/superadmin_users', icon: Users, label: 'Platform Users' },
      { href: '/superadmin/superadmin_roles', icon: ShieldCheck, label: 'Roles & Permissions' },
      { href: '/superadmin/superadmin_subscriptions', icon: CreditCard, label: 'Plans & Subscriptions' },
      { href: '/superadmin/superadmin_features', icon: Wand2, label: 'Feature Management' },
    ],
  },
  {
    group: 'Platform',
    items: [
      { href: '/superadmin/superadmin_global-config', icon: Settings, label: 'Global Library Configuration' },
      { href: '/superadmin/superadmin_server', icon: Server, label: 'Server & Infrastructure' },
      { href: '/superadmin/superadmin_database', icon: Database, label: 'Database & Data' },
      { href: '/superadmin/superadmin_jobs', icon: ListChecks, label: 'Jobs & Scheduler' },
      { href: '/superadmin/superadmin_api', icon: Plug, label: 'API & Integrations' },
      { href: '/superadmin/superadmin_communication', icon: MessageCircle, label: 'Notifications & Communication' },
    ],
  },
  {
    group: 'Security & Governance',
    items: [
      { href: '/superadmin/superadmin_security', icon: Shield, label: 'Security Center' },
      { href: '/superadmin/superadmin_audit-logs', icon: ScrollText, label: 'Global Audit Center' },
      { href: '/superadmin/superadmin_backup', icon: DatabaseBackup, label: 'Backup & Disaster Recovery' },
      { href: '/superadmin/superadmin_monitoring', icon: Activity, label: 'Monitoring & Alerts' },
      { href: '/superadmin/superadmin_compliance', icon: FileCheck, label: 'Data Governance & Compliance' },
    ],
  },
  {
    group: 'Support & System',
    items: [
      { href: '/superadmin/superadmin_support', icon: LifeBuoy, label: 'Support & Operations' },
      { href: '/superadmin/superadmin_support-tickets', icon: LifeBuoy, label: 'Support Escalations' },
      { href: '/superadmin/superadmin_settings', icon: Settings, label: 'System Settings' },
      { href: '/superadmin/superadmin_profile', icon: UserCircle, label: 'My Profile' },
    ],
  },
];

interface SidebarProps {
  open?: boolean;
  onNavigate?: () => void;
}

export default function Sidebar({ open, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NAV_GROUPS.map((group, index) => [group.group, index === 0]))
  );

  useEffect(() => {
    const activeGroup = NAV_GROUPS.find(group =>
      group.items.some(item => pathname === item.href || pathname.startsWith(item.href + '/'))
    )?.group;

    if (activeGroup) {
      setOpenGroups(current => current[activeGroup] ? current : { [activeGroup]: true });
    }
  }, [pathname]);

  return (
    <aside className={\`sa-sidebar \${open ? 'sa-sidebar--open' : ''}\`}>
      <div className="sa-sidebar-logo-area">
        <div className="sa-sidebar-logo-box">
          <span className="text-white text-xs font-bold">N</span>
        </div>
        <div>
          <p className="sa-sidebar-logo-name">Nexus 360</p>
          <p className="sa-sidebar-logo-sub">Super Admin Panel</p>
        </div>
      </div>

      <div className="sa-sidebar-divider" />

      <nav className="sa-sidebar-nav">
        {NAV_GROUPS.map(group => {
          const groupOpen = !!openGroups[group.group];
          const groupHasActive = group.items.some(item =>
            pathname === item.href || pathname.startsWith(item.href + '/')
          );

          return (
            <div key={group.group} className="sa-nav-group">
              <button
                type="button"
                className={\`sa-nav-group-button\${groupHasActive ? ' sa-nav-group-button--active' : ''}\`}
                onClick={() =>
                  setOpenGroups(current =>
                    current[group.group] ? {} : { [group.group]: true }
                  )
                }
                aria-expanded={groupOpen}
              >
                <span>{group.group}</span>
                <span
                  className={\`sa-nav-group-chevron\${groupOpen ? ' sa-nav-group-chevron--open' : ''}\`}
                  aria-hidden="true"
                >
                  ⌄
                </span>
              </button>

              {groupOpen && (
                <div className="sa-nav-group-items">
                  {group.items.map(({ href, icon: Icon, label }) => {
                    const isActive = pathname === href || pathname.startsWith(href + '/');

                    return (
                      <Link
                        key={href}
                        href={href}
                        className={\`sa-nav-link \${isActive ? 'sa-nav-link--active' : ''}\`}
                        onClick={onNavigate}
                        title={label}
                      >
                        <Icon size={17} />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="sa-sidebar-footer">
        <div className="sa-header-avatar-icon shrink-0">SA</div>
        <div className="sa-sidebar-footer-avatar">
          <p className="sa-sidebar-footer-name">Super Admin</p>
          <p className="sa-sidebar-footer-role">Platform Owner</p>
        </div>
        <button
          className="sa-btn-icon sa-btn-icon--danger"
          type="button"
          onClick={() => setShowLogout(true)}
          title="Logout"
          aria-label="Logout"
        >
          <LogOut size={15} />
        </button>
      </div>

      {showLogout && (
        <div className="sa-wizard-modal-overlay" onClick={() => setShowLogout(false)}>
          <div
            className="sa-wizard-modal"
            style={{ maxWidth: 360 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="sa-wizard-modal-icon">
              <LogOut size={20} className="sa-metric--warning" />
            </div>
            <p className="sa-wizard-modal-title">Logout</p>
            <p className="sa-wizard-modal-desc font-bold text-gray-800 dark:text-gray-200 mt-2">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-3 mt-6">
              <button
                className="sa-btn-ghost sa-btn-ghost--sm flex-1 font-bold"
                type="button"
                onClick={() => setShowLogout(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
                type="button"
                onClick={() => {
                  clearAuthState();
                  router.replace('/auth/login');
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
