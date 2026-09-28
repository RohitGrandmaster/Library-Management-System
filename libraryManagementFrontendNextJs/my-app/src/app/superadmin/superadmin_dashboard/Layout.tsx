'use client';

import { useState } from 'react';
import Sidebar from '@/app/superadmin/superadmin_dashboard/Sidebar';
import Header from '@/app/superadmin/superadmin_dashboard/Header';

export default function SuperAdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="superadmin-theme sa-shell dark bg-[#030712] text-[#F0F0FF]">
      {/* Mobile Overlay */}
      <div 
        className={`sa-sidebar-mobile-overlay ${sidebarOpen ? 'sa-sidebar-mobile-overlay--visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Fixed Sidebar */}
      <Sidebar open={sidebarOpen} />

      {/* Main Content Area */}
      <div className="sa-shell-content">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="sa-shell-main space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
