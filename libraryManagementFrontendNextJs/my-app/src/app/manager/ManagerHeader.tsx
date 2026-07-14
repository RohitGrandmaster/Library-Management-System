'use client';

import { Bell, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface Props {
  sidebarWidth: number;
  onMobileOpen: () => void;
}

export default function ManagerHeader({ sidebarWidth, onMobileOpen }: Props) {
  return (
    <header className="mgr-header" style={{ left: sidebarWidth }}>

      <div className="mgr-header-left">
        <button className="mgr-mobile-menu-btn" onClick={onMobileOpen} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <span className="mgr-header-branch-name" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
          📚 Smart Library 360
        </span>
      </div>

      <div className="mgr-header-right">
        <ThemeToggle />
        <button className="mgr-bell-btn" aria-label="Notifications">
          <Bell size={17} />
          <span className="mgr-bell-dot" />
        </button>
        <div className="mgr-avatar" title="Manager">MG</div>
      </div>

    </header>
  );
}
