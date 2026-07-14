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
  { href: '/superadmin/superadmin_dashboard',       icon: LayoutDashboard, label: 'Dashboard'         },
  { href: '/superadmin/superadmin_setup-wizard',    icon: Wand2,           label: 'Setup Wizard'      },
  { href: '/superadmin/superadmin_libraries',       icon: Building2,       label: 'Libraries'         },
  { href: '/superadmin/superadmin_subscriptions',   icon: CreditCard,      label: 'Subscriptions'     },
  { href: '/superadmin/superadmin_billing',         icon: Receipt,         label: 'Billing'           },
  { href: '/superadmin/superadmin_support-tickets', icon: HeadphonesIcon,  label: 'Support Tickets'   },
  { href: '/superadmin/superadmin_audit-logs',      icon: ScrollText,      label: 'Audit Logs'        },
  { href: '/superadmin/superadmin_system-health',   icon: Activity,        label: 'System Health'     },
  { href: '/superadmin/superadmin_reports',         icon: BarChart2,       label: 'Reports'           },
  { href: '/superadmin/superadmin_settings',        icon: Settings,        label: 'Platform Settings' },
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
          title="Log out"
          aria-label="Log out"
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
            <p className="sa-wizard-modal-title">Log out?</p>
            <p className="sa-wizard-modal-desc">Are you sure you want to log out of the Super Admin panel?</p>
            <div className="flex gap-3 mt-4">
              <button className="sa-btn-ghost sa-btn-ghost--sm flex-1" onClick={() => setShowLogout(false)}>Cancel</button>
              <button className="sa-btn-ghost sa-btn-ghost--danger flex-1" onClick={() => router.push('/auth/login')}>Log out</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
