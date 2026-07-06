'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/app/(superadmin)/superadmin/dashboard/Sidebar';
import Header from '@/app/(superadmin)/superadmin/dashboard/Header';
import '@/app/(superadmin)/superadmin.css';

const SUPERADMIN_ROUTES = [
  '/superadmin'
];

export function SuperadminRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isSuperadminRoute = SUPERADMIN_ROUTES.some(r => pathname.startsWith(r));

  if (!isSuperadminRoute) return <>{children}</>;

  // Setup wizard is explicitly mentioned as standalone, we can bypass the shell wrapper
  if (pathname.startsWith('/superadmin/setup-wizard')) {
     return <div className="superadmin-theme">{children}</div>;
  }

  return (
    <div className="superadmin-theme">
      <div className="sa-shell">
        {/* Mobile overlay */}
        <div
          className={`sa-sidebar-mobile-overlay ${sidebarOpen ? 'sa-sidebar-mobile-overlay--visible' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />
        <Sidebar open={sidebarOpen} />
        <div className="sa-shell-content">
          <Header onMenuClick={() => setSidebarOpen(o => !o)} />
          <main className="sa-shell-main">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
