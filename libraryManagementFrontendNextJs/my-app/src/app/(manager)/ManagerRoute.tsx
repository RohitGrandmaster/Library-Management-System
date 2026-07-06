'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import ManagerSidebar from './ManagerSidebar';
import ManagerHeader from './ManagerHeader';
import './manager.css';

const MANAGER_ROUTES = [
  '/manager',
  '/crm/enquiries',
  '/students',
  '/documents',
  '/seats_shifts_lockers',
  '/finance',
  '/engagement',
  '/expenses',
  '/financial-reports',
  '/daily-settlement',
  '/seat-gap-report',
  '/shift-gap-analyzer',
  '/assets',
  '/asset-maintenance',
  '/communication',
  '/student-reports',
];

export function ManagerRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isManagerRoute = MANAGER_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/') || pathname.startsWith(r));
  if (!isManagerRoute) return <>{children}</>;

  const sidebarWidth = collapsed ? 60 : 240;

  return (
    <div className="mgr-theme">
      <div className="mgr-shell-flex">
        <ManagerSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="mgr-main-offset" style={{ marginLeft: sidebarWidth }}>
          <ManagerHeader
            sidebarWidth={sidebarWidth}
            onMobileOpen={() => setMobileOpen(true)}
          />
          <main className="mgr-shell-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
