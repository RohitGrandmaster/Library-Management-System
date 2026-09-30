'use client';

// RESPONSIBILITY: Renders the top header for the admin module.
// DATA FLOW: AdminRoute -> AdminHeader

import { Building2, Bell, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAdmin } from '@/app/admin/admin_context/AdminContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  sidebarWidth: number;
  onMobileOpen: () => void;
}

export default function AdminHeader({ sidebarWidth, onMobileOpen }: HeaderProps) {
  const { selectedBranch, setSelectedBranch } = useAdmin();

  return (
    <header className="admin-header" style={{ left: sidebarWidth }}>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMobileOpen}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </Button>

        <div className="flex items-center gap-2">
          <Building2 size={15} className="text-muted-foreground hidden sm:block" />
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger 
              className="w-[180px] h-9 text-sm font-medium border-none shadow-none focus:ring-0"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
            >
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', zIndex: 9999 }}>
              <SelectItem value="Main Branch" style={{ cursor: 'pointer' }}>Main Branch</SelectItem>
              <SelectItem value="Branch 2" style={{ cursor: 'pointer' }}>Branch 2</SelectItem>
              <SelectItem value="Kothrud Center" style={{ cursor: 'pointer' }}>Kothrud Center</SelectItem>
              <SelectItem value="Nashik Branch" style={{ cursor: 'pointer' }}>Nashik Branch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="admin-bell-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="admin-bell-dot" />
        </button>
        <div className="admin-avatar">
          LA
        </div>
      </div>
    </header>
  );
}
