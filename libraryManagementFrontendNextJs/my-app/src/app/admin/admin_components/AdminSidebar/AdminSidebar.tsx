'use client';

// RESPONSIBILITY: Renders the sidebar navigation for the admin module.
// DATA FLOW: AdminRoute -> AdminSidebar

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ADMIN_SIDEBAR_NAV } from '@/app/admin/admin_constants/admin_constants';

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`admin-sidebar${mobileOpen ? ' admin-sidebar-mobile-open' : ''}`}
        style={{ width: collapsed ? 60 : 240 }}
      >
        <div className="admin-sidebar-logo">
          <Button
            variant="ghost"
            size="icon"
            onClick={mobileOpen ? onMobileClose : onToggle}
            aria-label={mobileOpen ? 'Close sidebar' : 'Toggle sidebar'}
            className="h-8 w-8 ml-2 hover:bg-muted/50"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
          {(!collapsed || mobileOpen) && (
            <span className="admin-sidebar-logo-text ml-2">📚 Smart Library</span>
          )}
        </div>

        <nav className="admin-sidebar-nav">
          {ADMIN_SIDEBAR_NAV.map((item, i) => {
            if ('group' in item) {
              if (collapsed && !mobileOpen) return null;
              return <div key={i} className="admin-nav-group-label">{item.group}</div>;
            }
            const Icon = item.icon;
            const isExactMatch = pathname === item.href;
            const isSubRouteMatch = pathname.startsWith(item.href + '/');
            const isActive = isExactMatch || (isSubRouteMatch && !ADMIN_SIDEBAR_NAV.some(
              nav => 'href' in nav && nav.href !== item.href && (pathname === nav.href || pathname.startsWith(nav.href + '/'))
            ));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item${isActive ? ' active' : ''}`}
                title={(collapsed && !mobileOpen) ? item.label : undefined}
                onClick={mobileOpen ? onMobileClose : undefined}
              >
                <Icon size={15} className="shrink-0 admin-nav-icon" />
                {(!collapsed || mobileOpen) && (
                  <span className="admin-nav-label">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {(!collapsed || mobileOpen) && (
          <div className="admin-sidebar-footer">
            <div className="admin-avatar">LA</div>
            <div className="admin-sidebar-user-info">
              <p className="admin-sidebar-user-name">Library Admin</p>
              <p className="admin-sidebar-user-email">admin@library.com</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 ml-auto"
              aria-label="Log out"
              onClick={() => setShowLogout(true)}
            >
              <LogOut size={14} />
            </Button>
          </div>
        )}
      </aside>

      <Dialog open={showLogout} onOpenChange={setShowLogout}>
        <DialogContent className="max-w-[400px] p-0 overflow-hidden bg-card border-none rounded-3xl shadow-2xl">
          <div className="bg-gradient-to-b from-red-500/20 to-transparent p-6 text-center pt-8">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
               <LogOut size={36} strokeWidth={2.5} className="ml-1" />
            </div>
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-extrabold text-foreground mb-1">Ready to leave?</DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground max-w-[280px] mx-auto">
                Are you sure you want to securely log out of your Admin session?
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="p-6 pt-2 grid grid-cols-2 gap-3 sm:justify-center">
            <Button 
              variant="outline" 
              onClick={() => setShowLogout(false)}
              className="w-full rounded-xl border-border bg-background hover:bg-muted font-bold h-12"
            >
              Stay Logged In
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                // Simulate session destruction
                alert('Session successfully destroyed.');
                router.push('/auth/login');
              }}
              className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold h-12 shadow-md shadow-red-500/20"
            >
              Yes, Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
