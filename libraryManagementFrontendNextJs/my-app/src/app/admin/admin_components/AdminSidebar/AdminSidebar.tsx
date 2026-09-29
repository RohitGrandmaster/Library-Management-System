'use client';

// RESPONSIBILITY: Renders the sidebar navigation for the admin module.
// DATA FLOW: AdminRoute -> AdminSidebar

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown, LogOut, Menu, X } from 'lucide-react';
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
import { logout } from '@/lib/auth';

type AdminLink = Extract<(typeof ADMIN_SIDEBAR_NAV)[number], { href: string }>;

const ADMIN_NAV_GROUPS: { group: string; items: AdminLink[] }[] = (() => {
  const groups: { group: string; items: AdminLink[] }[] = [];
  let current: { group: string; items: AdminLink[] } | null = null;
  for (const item of ADMIN_SIDEBAR_NAV) {
    if ('group' in item) {
      current = { group: item.group, items: [] };
      groups.push(current);
    } else if (current) {
      current.items.push(item);
    }
  }
  return groups;
})();

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: Props) {
  const pathname = usePathname();
  const [showLogout, setShowLogout] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => Object.fromEntries(ADMIN_NAV_GROUPS.map((group, index) => [group.group, index === 0])));

  useEffect(() => {
    const activeGroup = ADMIN_NAV_GROUPS.find(group => group.items.some(item => pathname === item.href || pathname.startsWith(item.href + '/')))?.group;
    if (activeGroup) setOpenGroups(current => current[activeGroup] ? current : { [activeGroup]: true });
  }, [pathname]);

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
        className={`admin-sidebar${collapsed ? ' admin-sidebar-collapsed' : ''}${mobileOpen ? ' admin-sidebar-mobile-open' : ''}`}
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
          {ADMIN_NAV_GROUPS.map((group) => {
            const groupOpen = openGroups[group.group];
            const groupHasActive = group.items.some(item => pathname === item.href || pathname.startsWith(item.href + '/'));

            return (
              <div key={group.group} className="admin-nav-group">
                {(!collapsed || mobileOpen) ? (
                  <button
                    type="button"
                    className={`admin-nav-group-label flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left ${groupHasActive ? 'text-foreground' : ''}`}
                    onClick={() => setOpenGroups(current => current[group.group] ? {} : { [group.group]: true })}
                    aria-expanded={groupOpen}
                  >
                    <span>{group.group}</span>
                    <ChevronDown size={14} className={`shrink-0 transition-transform ${groupOpen ? 'rotate-0' : '-rotate-90'}`} />
                  </button>
                ) : null}

                {(collapsed && !mobileOpen || groupOpen) && (
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

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
                  </div>
                )}
              </div>
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
                void logout();
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
