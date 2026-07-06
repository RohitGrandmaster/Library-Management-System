'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/app/(admin)/admin/Sidebar';
import Header from '@/app/(admin)/admin/Header';
import '@/app/(admin)/admin.css';
import '@/app/(system)/system.css';

const SYSTEM_ROUTES = [
  '/system/bulk-import', '/system/data-export', '/system/backups',
  '/system/settings', '/system/profile', '/system/branding', '/system/whatsapp-integration'
];

export function SystemRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isSystemRoute = SYSTEM_ROUTES.some(r => pathname.startsWith(r));

  if (!isSystemRoute) return <>{children}</>;

  const sidebarWidth = collapsed ? 60 : 240;

  return (
    <div className="admin-theme admin-shell-flex">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="admin-main-offset" style={{ marginLeft: sidebarWidth }}>
        <Header sidebarWidth={sidebarWidth} onMobileOpen={() => setMobileOpen(true)} />
        <main className="admin-shell-content">
          {children}
        </main>
      </div>
    </div>
  );
}
