'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BarChart2, PhoneCall, Users, UserPlus, Users2,
  GraduationCap, FolderLock, Medal, LayoutGrid, Armchair, Timer,
  ArrowLeftRight, ClipboardList, ScrollText, Lock, Map, IndianRupee,
  RefreshCw, CreditCard, Wallet, Handshake, ShieldCheck, FileStack,
  Clock, Ban, Receipt, FileText, UserCheck, CalendarDays, ClipboardCheck,
  ScanQrCode, CalendarX, BadgeDollarSign, TrendingUp, Activity, Sofa,
  Wrench, Megaphone, MessageSquare, Bell, Smartphone, Building2, KeyRound,
  Tag, Hourglass, ShieldX, PackageSearch, Download, HardDrive, FileCheck2,
  Settings, UserCircle, Palette, type LucideProps,
} from 'lucide-react';
import type { FC } from 'react';

type NavItem  = { href: string; Icon: FC<LucideProps>; label: string };
type NavGroup = { group: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    group: '',
    items: [
      { href: '/dashboard', Icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/reports',   Icon: BarChart2,        label: 'Reports'   },
    ],
  },
  {
    group: 'CRM',
    items: [{ href: '/crm/enquiries', Icon: PhoneCall, label: 'Enquiries' }],
  },
  {
    group: 'Students',
    items: [
      { href: '/manager/students',                 Icon: Users,         label: 'All Students'    },
      { href: '/manager/students/new',   Icon: UserPlus,      label: 'New Admission'   },
      { href: '/manager/students/group-admission', Icon: Users2,        label: 'Group Admission' },
      { href: '/alumni',                   Icon: GraduationCap, label: 'Alumni'          },
      { href: '/document-vault',           Icon: FolderLock,    label: 'Document Vault'  },
      { href: '/referral-bonus',           Icon: Medal,         label: 'Referral Bonus'  },
    ],
  },
  {
    group: 'Seats & Shifts',
    items: [
      { href: '/seats_shifts_lockers/seat-matrix',     Icon: LayoutGrid,     label: 'Seat Matrix'     },
      { href: '/seats',           Icon: Armchair,       label: 'Seats'           },
      { href: '/shifts',          Icon: Timer,          label: 'Shifts'          },
      { href: '/shift-migration', Icon: ArrowLeftRight, label: 'Shift Migration' },
      { href: '/allocations',     Icon: ClipboardList,  label: 'Allocations'     },
      { href: '/seat-history',    Icon: ScrollText,     label: 'Seat History'    },
      { href: '/lockers',         Icon: Lock,           label: 'Lockers'         },
      { href: '/locker-matrix',   Icon: Map,            label: 'Locker Matrix'   },
    ],
  },
  {
    group: 'Finance',
    items: [
      { href: '/collect-fee',       Icon: IndianRupee,     label: 'Collect Fee'       },
      { href: '/subscriptions',     Icon: FileStack,       label: 'Subscriptions'     },
      { href: '/renewals',          Icon: RefreshCw,       label: 'Renewals'          },
      { href: '/payments',          Icon: CreditCard,      label: 'Payments'          },
      { href: '/payment-promises',  Icon: Handshake,       label: 'Payment Promises'  },
      { href: '/trust-scores',      Icon: ShieldCheck,     label: 'Trust Scores'      },
      { href: '/security-deposits', Icon: Wallet,          label: 'Security Deposits' },
      { href: '/late-fees',         Icon: Clock,           label: 'Late Fees'         },
      { href: '/auto-suspend',      Icon: Ban,             label: 'Auto-Suspend'      },
      { href: '/invoices',          Icon: Receipt,         label: 'Invoices'          },
      { href: '/receipts',          Icon: FileText,        label: 'Receipts'          },
      { href: '/referrals',         Icon: UserCheck,       label: 'Referrals'         },
      { href: '/refunds',           Icon: BadgeDollarSign, label: 'Refunds'           },
    ],
  },
  {
    group: 'Operations',
    items: [
      { href: '/attendance',       Icon: CalendarDays,   label: 'Attendance'       },
      { href: '/absentee-report',  Icon: ClipboardCheck, label: 'Absentee Report'  },
      { href: '/qr-scanner',       Icon: ScanQrCode,     label: 'QR Scanner'       },
      { href: '/holiday-calendar', Icon: CalendarX,      label: 'Holiday Calendar' },
    ],
  },
  {
    group: 'Accounts & Assets',
    items: [
      { href: '/accounting/expenses',           Icon: BadgeDollarSign, label: 'Expenses'           },
      { href: '/accounting/financial-reports',  Icon: TrendingUp,      label: 'Financial Reports'  },
      { href: '/accounting/daily-settlement',   Icon: Activity,        label: 'Daily Settlement'   },
      { href: '/accounting/seat-gap-report',    Icon: Sofa,            label: 'Seat Gap Report'    },
      { href: '/accounting/shift-gap-analyzer', Icon: ArrowLeftRight,  label: 'Shift Gap Analyzer' },
      { href: '/accounting/assets',             Icon: PackageSearch,   label: 'Assets'             },
      { href: '/accounting/asset-maintenance',  Icon: Wrench,          label: 'Asset Maintenance'  },
    ],
  },
  {
    group: 'Communication',
    items: [
      { href: '/communication/notices',             Icon: Megaphone,     label: 'Notices'             },
      { href: '/communication/complaints',          Icon: MessageSquare, label: 'Complaints'          },
      { href: '/communication/notification-center', Icon: Bell,          label: 'Notification Center' },
      { href: '/communication/whatsapp-logs',       Icon: Smartphone,    label: 'WhatsApp Logs'      },
      { href: '/communication/whatsapp-templates',  Icon: FileCheck2,    label: 'WhatsApp Templates'  },
    ],
  },
  {
    group: 'Admin',
    items: [
      { href: '/branches',     Icon: Building2,      label: 'Branches'           },
      { href: '/staff',        Icon: Users2,         label: 'Staff & Users'      },
      { href: '/permissions',  Icon: KeyRound,       label: 'Permissions'        },
      { href: '/plans',        Icon: IndianRupee,    label: 'Plans'              },
      { href: '/coupons',      Icon: Tag,            label: 'Coupons'            },
      { href: '/waitlist',     Icon: Hourglass,      label: 'Waitlist'           },
      { href: '/blacklist',    Icon: ShieldX,        label: 'Blacklist'          },
      { href: '/audit-logs',   Icon: ScrollText,     label: 'Audit Logs'         },
      { href: '/system/bulk-import',  Icon: PackageSearch,  label: 'Bulk Import'        },
      { href: '/system/data-export',  Icon: Download,       label: 'Data Export'        },
      { href: '/system/backups',      Icon: HardDrive,      label: 'Backups'            },
      { href: '/gst-settings', Icon: FileCheck2,     label: 'GST & Tax Settings' },
    ],
  },
  {
    group: 'System',
    items: [
      { href: '/system/settings',             Icon: Settings,   label: 'Settings'             },
      { href: '/system/profile',              Icon: UserCircle, label: 'Profile'              },
      { href: '/system/branding',             Icon: Palette,    label: 'Branding'             },
      { href: '/system/whatsapp-integration', Icon: Smartphone, label: 'WhatsApp Integration' },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`crm-sidebar${isOpen ? ' crm-sidebar--open' : ''}`}>
      <div className="crm-sidebar-spacer" />

      {NAV.map((group, gi) => (
        <div key={gi}>
          {group.group && <p className="crm-nav-group-label">{group.group}</p>}

          {group.items.map((item) => {
            const active =
              item.href === '/crm/enquiries'
                ? pathname.startsWith('/crm/enquiries')
                : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`crm-nav-item${active ? ' crm-nav-item--active' : ''}`}
                onClick={onClose}
                title={item.label}
              >
                <item.Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}

      <div className="crm-sidebar-bottom" />
    </aside>
  );
}
