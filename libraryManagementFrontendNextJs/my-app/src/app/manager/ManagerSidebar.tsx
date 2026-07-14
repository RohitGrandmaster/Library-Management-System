'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, BarChart2, Phone, Users, UserPlus, Users2,
  UserCheck, FolderOpen, Award, LayoutGrid, Armchair, RefreshCw,
  ArrowLeftRight, ClipboardList, History, Lock, IndianRupee,
  FileText, RotateCcw, CreditCard, Handshake, Shield, Clock,
  Ban, Receipt, DollarSign, CalendarCheck, ClipboardCheck,
  QrCode, Calendar, TrendingUp, BarChart, Wallet, BookOpen,
  MessageSquare, Bell, BellRing, Smartphone,
  LogOut, Menu, X, type LucideIcon,
} from 'lucide-react';

type NavItem = { group: string } | { href: string; icon: LucideIcon; label: string };

const NAV: NavItem[] = [
  { href: '/manager/manager_dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/manager/manager_reports',   icon: BarChart2,       label: 'Reports'   },
  { group: 'CRM' },
  { href: '/manager/manager_crm/enquiries',       icon: Phone,      label: 'Enquiries'        },
  { group: 'Students' },
  { href: '/manager/manager_students',            icon: Users,      label: 'All Students'     },
  { href: '/manager/manager_students/new',        icon: UserPlus,   label: 'New Admission'    },
  { href: '/manager/manager_students/group',      icon: Users2,     label: 'Group Admission'  },
  { href: '/manager/manager_students/alumni',     icon: UserCheck,  label: 'Alumni'           },
  { href: '/manager/manager_documents',           icon: FolderOpen, label: 'Document Vault'   },
  { href: '/manager/manager_students/referrals',  icon: Award,      label: 'Referral Bonus'   },
  { href: '/manager/manager_students/id-card',    icon: CreditCard, label: 'ID Card Generator'},
  { group: 'Seats & Shifts' },
  { href: '/manager/manager_seats_shifts_lockers/seat-matrix',      icon: LayoutGrid,     label: 'Seat Matrix'     },
  { href: '/manager/manager_seats_shifts_lockers/seat-management',  icon: Armchair,       label: 'Seats'           },
  { href: '/manager/manager_seats_shifts_lockers/shift-management', icon: RefreshCw,      label: 'Shifts'          },
  { href: '/manager/manager_seats_shifts_lockers/shift-migration',  icon: ArrowLeftRight, label: 'Shift Migration' },
  { href: '/manager/manager_seats_shifts_lockers/allocations',      icon: ClipboardList,  label: 'Allocations'     },
  { href: '/manager/manager_seats_shifts_lockers/seat-history',     icon: History,        label: 'Seat History'    },
  { href: '/manager/manager_seats_shifts_lockers/lockers',          icon: Lock,           label: 'Lockers'         },
  { href: '/manager/manager_seats_shifts_lockers/locker-matrix',    icon: LayoutGrid,     label: 'Locker Matrix'   },
  { group: 'Finance' },
  { href: '/manager/manager_finance/collect-fee',       icon: IndianRupee, label: 'Collect Fee'       },
  { href: '/manager/manager_finance/subscriptions',     icon: FileText,    label: 'Subscriptions'     },
  { href: '/manager/manager_finance/renewals',          icon: RotateCcw,   label: 'Renewals'          },
  { href: '/manager/manager_finance/payments',          icon: CreditCard,  label: 'Payments'          },
  { href: '/manager/manager_finance/payment-promises',  icon: Handshake,   label: 'Payment Promises'  },
  { href: '/manager/manager_finance/trust-score',       icon: Shield,      label: 'Trust Scores'      },
  { href: '/manager/manager_finance/security-deposits', icon: Wallet,      label: 'Security Deposits' },
  { href: '/manager/manager_finance/late-fees',         icon: Clock,       label: 'Late Fees'         },
  { href: '/manager/manager_finance/auto-suspend',      icon: Ban,         label: 'Auto-Suspend'      },
  { href: '/manager/manager_finance/invoice',           icon: Receipt,     label: 'Invoice'           },
  { href: '/manager/manager_finance/receipt',           icon: BookOpen,    label: 'Receipt'           },
  { href: '/manager/manager_finance/referrals',         icon: Award,       label: 'Referrals'         },
  { href: '/manager/manager_finance/refunds',           icon: DollarSign,  label: 'Refunds'           },
  { group: 'Operations' },
  { href: '/manager/manager_engagement/attendance',       icon: CalendarCheck,  label: 'Attendance'       },
  { href: '/manager/manager_engagement/absentee-report',  icon: ClipboardCheck, label: 'Absentee Report'  },
  { href: '/manager/manager_engagement/qr-scanner',       icon: QrCode,         label: 'QR Scanner'       },
  { href: '/manager/manager_engagement/holiday-calendar', icon: Calendar,       label: 'Holiday Calendar' },
  { group: 'Accounts & Assets' },
  { href: '/manager/manager_accounting/expenses',          icon: TrendingUp, label: 'Expenses'          },
  { href: '/manager/manager_accounting/daily-settlement',  icon: Receipt,    label: 'Daily Settlement'  },
  { href: '/manager/manager_accounting/seat-gap-report',   icon: LayoutGrid, label: 'Seat Gap Report'   },
  { href: '/manager/manager_accounting/assets',            icon: BarChart,   label: 'Assets'            },
  { href: '/manager/manager_accounting/asset-maintenance', icon: BarChart,   label: 'Asset Maintenance' },
  { group: 'Communication' },
  { href: '/manager/manager_communication/notices',             icon: Bell,          label: 'Notices'             },
  { href: '/manager/manager_communication/complaints',          icon: MessageSquare, label: 'Complaints'          },
  { href: '/manager/manager_communication/notification-center', icon: BellRing,      label: 'Notification Center' },
  { href: '/manager/manager_communication/whatsapp-logs',       icon: Smartphone,    label: 'WhatsApp Logs'       },
  { href: '/manager/manager_communication/whatsapp-templates',  icon: Smartphone,    label: 'WhatsApp Templates'  },
];

// All nav hrefs for specificity check
const ALL_HREFS = NAV.filter((n): n is { href: string; icon: LucideIcon; label: string } => 'href' in n).map(n => n.href);

const ICON_COLORS = ['#4F46E5', '#059669', '#D97706', '#2563EB', '#7C3AED', '#E11D48', '#0D9488'];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function ManagerSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  function isActive(href: string): boolean {
    // Exact match always wins
    if (pathname === href) return true;
    // For sub-route match: only active if NO more-specific nav item also matches
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
        <div className="mgr-sidebar-overlay" onClick={onMobileClose} aria-hidden="true" />
      )}

      <aside
        className={`mgr-sidebar${mobileOpen ? ' mgr-sidebar-mobile-open' : ''}`}
        style={{ width: collapsed ? 60 : 240 }}
      >
        <div className="mgr-sidebar-logo">
          <button
            onClick={mobileOpen ? onMobileClose : onToggle}
            className="mgr-menu-btn"
            aria-label={mobileOpen ? 'Close sidebar' : 'Toggle sidebar'}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          {(!collapsed || mobileOpen) && (
            <span className="mgr-sidebar-logo-text">📚 Smart Library 360</span>
          )}
        </div>

        <nav className="mgr-sidebar-nav">
          {NAV.map((item, i) => {
            if ('group' in item) {
              if (collapsed && !mobileOpen) return null;
              return <div key={i} className="mgr-nav-group-label">{item.group}</div>;
            }
            const Icon = item.icon;
            const active = isActive(item.href);
            const color = ICON_COLORS[i % ICON_COLORS.length];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mgr-nav-item${active ? ' active' : ''}`}
                title={(collapsed && !mobileOpen) ? item.label : undefined}
                onClick={mobileOpen ? onMobileClose : undefined}
              >
                <Icon size={15} className="shrink-0" style={{ color: active ? 'inherit' : color }} />
                {(!collapsed || mobileOpen) && (
                  <span className="mgr-nav-label">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {(!collapsed || mobileOpen) && (
          <div className="mgr-sidebar-footer">
            <div className="mgr-avatar">MG</div>
            <div className="mgr-sidebar-user-info">
              <p className="mgr-sidebar-user-name">Manager</p>
              <p className="mgr-sidebar-user-email">manager@library.com</p>
            </div>
            <button className="mgr-logout-btn" aria-label="Log out" onClick={() => setShowLogout(true)}>
              <LogOut size={14} />
            </button>
          </div>
        )}
      </aside>

      {showLogout && (
        <div className="mgr-modal-overlay" onClick={() => setShowLogout(false)}>
          <div className="mgr-modal" onClick={e => e.stopPropagation()}>
            <p className="mgr-modal-title">Log out?</p>
            <p className="mgr-modal-desc">Are you sure you want to log out?</p>
            <div className="mgr-modal-footer">
              <button className="mgr-btn-ghost mgr-btn-sm" onClick={() => setShowLogout(false)}>Cancel</button>
              <button className="mgr-btn-danger mgr-btn-sm" onClick={() => router.push('/auth/login')}>Log out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
