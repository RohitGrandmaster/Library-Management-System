'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, Menu, Bell, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [read, setRead] = useState(false);
  const router = useRouter();
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const q = search.trim();
    if (q) router.push(`/superadmin/superadmin_search?q=${encodeURIComponent(q)}`);
  };

  return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sa-header">
      {/* Left — hamburger + search */}
      <div className="flex items-center gap-3">
        <button className="sa-mobile-menu-btn" onClick={onMenuClick} title="Toggle menu">
          <Menu size={18} />
        </button>
        <form className="sa-header-search" onSubmit={submitSearch} role="search">
          <Search size={14} className="sa-metric--muted shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search libraries, tickets, logs..." aria-label="Search Super Admin" />
          {search && <button type="button" aria-label="Clear search" onClick={() => setSearch("")} className="sa-btn-icon"><X size={13} /></button>}
        </form>
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
            {!read && <span className="sa-header-notif-badge" />}
          </button>

          {notifOpen && (
            <div className="sa-notif-dropdown">
              <div className="sa-notif-dropdown-header">
                <div>
                  <h4 className="sa-notif-title">Notifications</h4>
                  <p className="sa-notif-subtitle">{read ? "You are all caught up" : "You have 2 new messages"}</p>
                </div>
                <button className="sa-btn-ghost sa-btn-ghost--sm" onClick={() => setRead(true)} disabled={read}>Mark all read</button>
              </div>
              <div className="sa-notif-list">
                <div className={`sa-notif-item ${!read ? "sa-notif-item--unread" : ""}`}>
                  <div className="sa-notif-item-icon sa-notif-item-icon--success">
                    <CheckCircle size={14} />
                  </div>
                  <div className="sa-notif-item-content">
                    <p className="sa-notif-item-title">System updated</p>
                    <p className="sa-notif-item-time">2 mins ago</p>
                  </div>
                  {!read && <div className="sa-notif-unread-dot" />}
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
                <button className="sa-panel-view-all" onClick={() => { setNotifOpen(false); router.push("/superadmin/superadmin_notifications"); }}>View all notifications</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
