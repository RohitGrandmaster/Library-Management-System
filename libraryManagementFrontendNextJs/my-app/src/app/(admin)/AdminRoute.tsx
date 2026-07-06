'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/app/(admin)/admin/Sidebar';
import Header from '@/app/(admin)/admin/Header';
import { AdminProvider } from '@/app/(admin)/AdminContext';
import '@/app/(admin)/admin.css';

// All route prefixes that belong to admin shell
const ADMIN_ROUTES = [
  '/admin/dashboard', '/admin/reports',
  '/admin/branches', '/admin/staff-users', '/admin/permissions',
  '/admin/plans', '/admin/coupons', '/admin/audit-logs', '/admin/blacklist',
  '/admin/settings', '/admin/expense-categories', '/admin/expenses', '/admin/students'
];

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdminRoute = ADMIN_ROUTES.some(r => pathname.startsWith(r));
  if (!isAdminRoute) return <>{children}</>;

  const sidebarWidth = collapsed ? 60 : 240;

  return (
    <AdminProvider>
      <div className="admin-theme admin-shell-flex">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        
        <div
          className="admin-main-offset"
          style={{ marginLeft: sidebarWidth }}
        >
        <Header
          sidebarWidth={sidebarWidth}
          onMobileOpen={() => setMobileOpen(true)}
        />
        <main className="admin-shell-content">
          {children}
        </main>
      </div>
    </div>
    </AdminProvider>
  );
}
