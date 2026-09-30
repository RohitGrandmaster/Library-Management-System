'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, Menu, Bell, CheckCircle, AlertTriangle, Plus, Activity, Server, Zap, ChevronDown, UserPlus, Building, Ticket } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (quickAddRef.current && !quickAddRef.current.contains(event.target as Node)) {
        setQuickAddOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sa-header flex items-center justify-between px-4 py-3 bg-[#0d0d14]/90 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
      
      {/* Left — Hamburger + Environment + Search */}
      <div className="flex items-center gap-4">
        <button className="sa-mobile-menu-btn text-white/50 hover:text-white" onClick={onMenuClick} title="Toggle menu">
          <Menu size={20} />
        </button>
        
        {/* Environment Badge */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <Server size={12} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Production Env</span>
        </div>

        {/* Global Scope Badge */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <GlobeIcon size={12} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Global Scope</span>
        </div>

        <div className="sa-header-search group relative ml-2 w-64 md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-indigo-400 transition-colors shrink-0" />
          <input 
            placeholder="Global search (Libraries, Users, Tickets)..." 
            className="w-full bg-white/5 border border-white/10 outline-none text-sm text-white rounded-lg pl-9 pr-12 py-2 focus:bg-white/10 focus:border-indigo-500/50 transition-all placeholder:text-white/30"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-black/40 border border-white/10 rounded px-1.5 py-0.5 pointer-events-none">
            <span className="text-[10px] font-medium text-white/40">⌘K</span>
          </div>
        </div>
      </div>

      {/* Right — Quick Actions + System Health + Bell */}
      <div className="sa-header-right flex items-center gap-3 md:gap-5">
        
        {/* Quick Add Dropdown */}
        <div className="relative" ref={quickAddRef}>
          <button 
            className="hidden md:flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-[0_0_10px_rgba(79,70,229,0.3)]"
            onClick={() => setQuickAddOpen(!quickAddOpen)}
          >
            <Plus size={14} /> Quick Action <ChevronDown size={14} />
          </button>
          
          {quickAddOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-[#151520] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                <Building size={14} className="text-emerald-400" /> Onboard Tenant
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                <UserPlus size={14} className="text-sky-400" /> Provision Admin
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                <Ticket size={14} className="text-amber-400" /> Issue Promo Code
              </button>
            </div>
          )}
        </div>

        {/* System Health Mini-Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 border-r border-white/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold text-white/50">API: 12ms</span>
        </div>

        <ThemeToggle />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            className="sa-header-notif-btn relative p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors" 
            title="Notifications"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-[#0d0d14]" />
          </button>

          {notifOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-[#151520] border border-white/10 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div>
                  <h4 className="text-sm font-bold text-white">System Alerts</h4>
                  <p className="text-[10px] text-white/50">You have 2 unread alerts</p>
                </div>
                <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300">Mark all read</button>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                <div className="flex gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer bg-indigo-500/5">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <CheckCircle size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">V2.4 Deployment Successful</p>
                    <p className="text-xs text-white/40 mt-0.5">All edge nodes updated.</p>
                    <p className="text-[10px] text-indigo-400 mt-1">2 mins ago</p>
                  </div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5"></div>
                </div>
                
                <div className="flex gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer bg-rose-500/5">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                    <AlertTriangle size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">High DB Connection Spikes</p>
                    <p className="text-xs text-white/40 mt-0.5">Postgres primary cluster reached 85%.</p>
                    <p className="text-[10px] text-rose-400 mt-1">1 hour ago</p>
                  </div>
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-1.5"></div>
                </div>

                <div className="flex gap-3 p-4 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Zap size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Daily Backup Completed</p>
                    <p className="text-xs text-white/40 mt-0.5">1.2 GB synced to AWS S3.</p>
                    <p className="text-[10px] text-white/30 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 border-t border-white/5 text-center bg-white/[0.02]">
                <button className="text-xs font-semibold text-white/60 hover:text-white transition-colors">View all notifications</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Helper icon component
function GlobeIcon({ size = 16, className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}
