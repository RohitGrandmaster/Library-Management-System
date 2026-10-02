'use client';

// RESPONSIBILITY: Renders the sidebar navigation for the admin module.
// DATA FLOW: AdminRoute -> AdminSidebar

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, Menu, X, type LucideIcon } from 'lucide-react';
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

const ALL_HREFS = ADMIN_SIDEBAR_NAV.filter((n): n is { href: string; icon: LucideIcon; label: string } => 'href' in n).map(n => n.href);
const ICON_COLORS = ['#4F46E5', '#059669', '#D97706', '#2563EB', '#7C3AED', '#E11D48', '#0D9488'];

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

  function isActive(href: string): boolean {
    if (pathname === href) return true;
    if (href !== '/' && pathname.startsWith(href + '/')) {
      const moreSpecific = ALL_HREFS.some(
        other => other !== href && other.startsWith(href) && pathname.startsWith(other)
      );
      return !moreSpecific;
    }
    return false;
  }

  return (
    <>
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 30,
            backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)'
          }}
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        style={{
          width: collapsed ? 60 : 240,
          position: 'fixed',
          left: mobileOpen ? 0 : 0,
          transform: mobileOpen ? 'translateX(0)' : 'none',
          top: 0, height: '100%',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border)',
          transition: 'width 0.3s, transform 0.3s',
          overflow: 'hidden',
          boxShadow: mobileOpen ? '4px 0 32px rgba(0, 0, 0, 0.5)' : 'none'
        }}
      >
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px',
          height: 64, flexShrink: 0, borderBottom: '1px solid var(--border)',
        }}>
          <button
            onClick={mobileOpen ? onMobileClose : onToggle}
            style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              cursor: 'pointer', display: 'flex', padding: 4, borderRadius: 4
            }}
            aria-label={mobileOpen ? 'Close sidebar' : 'Toggle sidebar'}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          {(!collapsed || mobileOpen) && (
            <span style={{
              fontSize: 14, fontWeight: 700, color: 'var(--text-primary)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>📚 Smart Library</span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {ADMIN_SIDEBAR_NAV.map((item, i) => {
            if ('group' in item) {
              if (collapsed && !mobileOpen) return null;
              return (
                <div key={i} style={{
                  fontSize: 10, fontWeight: 700, color: 'var(--primary)',
                  textTransform: 'uppercase', letterSpacing: '0.1em', padding: '16px 14px 4px',
                }}>{item.group}</div>
              );
            }
            const Icon = item.icon;
            const active = isActive(item.href);
            const color = ICON_COLORS[i % ICON_COLORS.length];
            return (
              <Link
                key={item.href}
                href={item.href}
                title={(collapsed && !mobileOpen) ? item.label : undefined}
                onClick={mobileOpen ? onMobileClose : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: active ? '10px 14px 10px 11px' : '10px 14px',
                  borderRadius: 8,
                  fontSize: 14, fontWeight: 500,
                  color: active ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: active ? 'var(--primary-subtle)' : 'transparent',
                  borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
                  transition: 'background-color 0.15s, color 0.15s',
                  cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap',
                }}
              >
                <Icon size={15} style={{ color: active ? 'var(--primary)' : color, flexShrink: 0 }} />
                {(!collapsed || mobileOpen) && (
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14 }}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {(!collapsed || mobileOpen) && (
          <div style={{
            padding: 12, flexShrink: 0,
            borderTop: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
              backgroundColor: 'var(--primary)', color: '#ffffff',
              flexShrink: 0, cursor: 'pointer',
            }}>AD</div>
            <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>Library Admin</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>admin@library.com</p>
            </div>
            <button
              style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
              aria-label="Log out"
              onClick={() => setShowLogout(true)}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </aside>

      <Dialog open={showLogout} onOpenChange={setShowLogout}>
        <DialogContent className="max-w-[360px]">
          <DialogHeader>
            <DialogTitle>Log out?</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your session?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setShowLogout(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => router.push('/auth/login')}>Log out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
