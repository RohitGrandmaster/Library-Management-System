'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Wand2, Building2, CreditCard, Receipt,
  HeadphonesIcon, ScrollText, Activity, Settings, BarChart2, LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/superadmin/superadmin_dashboard',             icon: LayoutDashboard, label: '01. Dashboard' },
  { href: '/superadmin/superadmin_libraries',             icon: Building2,       label: '02. Libraries / Organizations' },
  { href: '/superadmin/superadmin_branches',              icon: Building2,       label: '03. Branch Management' },
  { href: '/superadmin/superadmin_users',                 icon: Settings,        label: '04. Platform Users' },
  { href: '/superadmin/superadmin_roles',                 icon: Settings,        label: '05. Roles & Permissions' },
  { href: '/superadmin/superadmin_subscriptions',         icon: CreditCard,      label: '06. Plans & Subscriptions' },
  { href: '/superadmin/superadmin_features',              icon: Wand2,           label: '07. Feature Management' },
  { href: '/superadmin/superadmin_global-config',         icon: Settings,        label: '08. Global Library Configuration' },
  { href: '/superadmin/superadmin_server',                icon: Activity,        label: '09. Server & Infrastructure' },
  { href: '/superadmin/superadmin_database',              icon: Activity,        label: '10. Database & Data' },
  { href: '/superadmin/superadmin_jobs',                  icon: Activity,        label: '11. Jobs & Scheduler' },
  { href: '/superadmin/superadmin_api',                   icon: Activity,        label: '12. API & Integrations' },
  { href: '/superadmin/superadmin_communication',         icon: HeadphonesIcon,  label: '13. Notifications & Communication' },
  { href: '/superadmin/superadmin_security',              icon: Activity,        label: '14. Security Center' },
  { href: '/superadmin/superadmin_audit-logs',            icon: ScrollText,      label: '15. Global Audit Center' },
  { href: '/superadmin/superadmin_backup',                icon: Activity,        label: '16. Backup & Disaster Recovery' },
  { href: '/superadmin/superadmin_monitoring',            icon: Activity,        label: '17. Monitoring & Alerts' },
  { href: '/superadmin/superadmin_reports',               icon: BarChart2,       label: '18. Reports & Analytics' },
  { href: '/superadmin/superadmin_support-tickets',       icon: HeadphonesIcon,  label: '19. Support & Operations' },
  { href: '/superadmin/superadmin_governance',            icon: Settings,        label: '20. Data Governance & Compliance' },
  { href: '/superadmin/superadmin_settings',              icon: Settings,        label: '21. System Settings' },
  { href: '/superadmin/superadmin_profile',               icon: Settings,        label: '22. My Profile' },
  { href: '#logout',                                      icon: LogOut,          label: '23. Logout' },
];

interface SidebarProps {
  open?: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <aside className={`sa-sidebar ${open ? 'sa-sidebar--open' : ''}`}>
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
        {NAV_ITEMS.map(({ href, icon: Icon, label }, i) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          const iconColors = ['#4F46E5', '#059669', '#D97706', '#2563EB', '#7C3AED', '#E11D48', '#0D9488'];
          const color = iconColors[i % iconColors.length];
          
          if (href === '#logout') {
            return (
              <button
                key={href}
                onClick={() => setShowLogout(true)}
                className="sa-nav-link text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
              >
                <Icon size={17} />
                <span className="font-bold">{label}</span>
              </button>
            )
          }

          return (
            <Link
              key={href}
              href={href}
              className={`sa-nav-link ${isActive ? 'sa-nav-link--active' : ''}`}
            >
              <Icon size={17} style={{ color: isActive ? 'inherit' : color }} />
              <span>{label}</span>
            </Link>
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
          onClick={() => setShowLogout(true)}
          title="Logout"
          aria-label="Logout"
        >
          <LogOut size={15} />
        </button>
      </div>

      {showLogout && (
        <div className="sa-wizard-modal-overlay" onClick={() => setShowLogout(false)}>
          <div className="sa-wizard-modal" style={{ maxWidth: 360 }} onClick={e => e.stopPropagation()}>
            <div className="sa-wizard-modal-icon">
              <LogOut size={20} className="sa-metric--warning" />
            </div>
            <p className="sa-wizard-modal-title">Logout</p>
            <p className="sa-wizard-modal-desc font-bold text-gray-800 dark:text-gray-200 mt-2">Are you sure you want to logout?</p>
            <div className="flex gap-3 mt-6">
              <button className="sa-btn-ghost sa-btn-ghost--sm flex-1 font-bold" onClick={() => setShowLogout(false)}>Cancel</button>
              <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors" onClick={() => router.push('/auth/login')}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
