'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, Menu, Bell, CheckCircle, AlertTriangle } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sa-header">
      {/* Left — hamburger + search */}
      <div className="flex items-center gap-3">
        <button className="sa-mobile-menu-btn" onClick={onMenuClick} title="Toggle menu">
          <Menu size={18} />
        </button>
        <div className="sa-header-search">
          <Search size={14} className="sa-metric--muted shrink-0" />
          <input placeholder="Search libraries, tickets, logs..." />
        </div>
      </div>

      {/* Right — bell only */}
      <div className="sa-header-right">
        <ThemeToggle />
        <div className="relative" ref={notifRef}>
          <button 
            className="sa-header-notif-btn" 
            title="Notifications"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <Bell size={17} />
            <span className="sa-header-notif-badge" />
          </button>

          {notifOpen && (
            <div className="sa-notif-dropdown">
              <div className="sa-notif-dropdown-header">
                <div>
                  <h4 className="sa-notif-title">Notifications</h4>
                  <p className="sa-notif-subtitle">You have 2 new messages</p>
                </div>
                <button className="sa-btn-ghost sa-btn-ghost--sm">Mark all read</button>
              </div>
              <div className="sa-notif-list">
                <div className="sa-notif-item sa-notif-item--unread">
                  <div className="sa-notif-item-icon sa-notif-item-icon--success">
                    <CheckCircle size={14} />
                  </div>
                  <div className="sa-notif-item-content">
                    <p className="sa-notif-item-title">System updated</p>
                    <p className="sa-notif-item-time">2 mins ago</p>
                  </div>
                  <div className="sa-notif-unread-dot" />
                </div>
                <div className="sa-notif-item sa-notif-item--unread">
                  <div className="sa-notif-item-icon sa-notif-item-icon--warning">
                    <AlertTriangle size={14} />
                  </div>
                  <div className="sa-notif-item-content">
                    <p className="sa-notif-item-title">High server usage</p>
                    <p className="sa-notif-item-time">1 hour ago</p>
                  </div>
                  <div className="sa-notif-unread-dot" />
                </div>
                <div className="sa-notif-item">
                  <div className="sa-notif-item-icon sa-notif-item-icon--primary">
                    <Bell size={14} />
                  </div>
                  <div className="sa-notif-item-content">
                    <p className="sa-notif-item-title">Welcome to Smart Library 360</p>
                    <p className="sa-notif-item-time">1 day ago</p>
                  </div>
                </div>
              </div>
              <div className="sa-notif-dropdown-footer">
                <button className="sa-panel-view-all">View all notifications</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
