import {
  LayoutDashboard, BarChart2, History,
  FileText, User, Building2, Key, Tag,
  Ban, LucideIcon, IndianRupee, Users,
  RotateCcw, Phone, MessageSquare, Handshake, AlertCircle
} from 'lucide-react';
import { AdminNavItem } from '../admin_types/admin_types';
import { ADMIN_ROUTES } from '../admin_url_config';

/**
 * Sidebar Navigation Configuration
 */
export const ADMIN_SIDEBAR_NAV: AdminNavItem[] = [
  { href: ADMIN_ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
  { href: ADMIN_ROUTES.REPORTS,   icon: BarChart2,       label: 'Reports'   },
  { group: 'Admin' },
  { href: ADMIN_ROUTES.BRANCHES,    icon: Building2, label: 'Branches'      },
  { href: ADMIN_ROUTES.STAFF_USERS, icon: User,      label: 'Staff & Users' },
  { href: ADMIN_ROUTES.PERMISSIONS, icon: Key,       label: 'Permissions'   },
  { href: ADMIN_ROUTES.PLANS,       icon: FileText,  label: 'Plans'         },
  { href: ADMIN_ROUTES.COUPONS,     icon: Tag,       label: 'Coupons'       },
  { href: ADMIN_ROUTES.BLACKLIST,   icon: Ban,       label: 'Blacklist'     },
  { href: ADMIN_ROUTES.AUDIT_LOGS,  icon: History,   label: 'Audit Logs'    },
  { group: 'Operations (All Branches)' },
  { href: ADMIN_ROUTES.EXPENSES,    icon: IndianRupee, label: 'Expenses'    },
  { href: ADMIN_ROUTES.STUDENTS,    icon: Users,       label: 'Students'    },
  { group: 'Configuration' },
  { href: ADMIN_ROUTES.EXPENSE_CATEGORIES, icon: Tag, label: 'Expense Types' },
  { href: ADMIN_ROUTES.SETTINGS,    icon: Key,       label: 'Settings'      },
];

/**
 * Icon color & background tokens for KPI cards on Dashboard.
 * Values MUST be CSS token strings — no hex allowed in TSX files.
 */
export const ADMIN_KPI_META = [
  { icon: Users,       iconColor: 'var(--primary)', iconBg: 'var(--icon-bg-primary)' },
  { icon: IndianRupee, iconColor: 'var(--success)', iconBg: 'var(--icon-bg-success)' },
  { icon: Armchair,    iconColor: 'var(--warning)', iconBg: 'var(--icon-bg-warning)' },
  { icon: AlertCircle, iconColor: 'var(--danger)',  iconBg: 'var(--icon-bg-danger)'  },
] as const;

// Importing Armchair to use in KPI_META
import { Armchair } from 'lucide-react';


/**
 * Action Icons mapped to label
 */
export const ADMIN_ACTION_ICONS: Record<string, LucideIcon> = {
  'Fee Renewals Due': RotateCcw,
  'New Enquiries':    Phone,
  'Complaint Open':   MessageSquare,
  'PTP Dates Today':  Handshake,
};
