import {
  LayoutDashboard, Activity, Building2, Users, BookOpen, UserCheck,
  ArrowRightLeft, Bookmark, ShoppingCart, Truck, Boxes, IndianRupee,
  Bell, BarChart2, History, ShieldAlert, Settings, LifeBuoy, User,
  Database, ScrollText
} from 'lucide-react';
import { AdminNavItem } from '../admin_types/admin_types';
import { ADMIN_ROUTES } from '../admin_url_config';

/**
 * Sidebar Navigation Configuration for Library OS Admin
 */
export const ADMIN_SIDEBAR_NAV: AdminNavItem[] = [
  { group: 'Overview' },
  { href: ADMIN_ROUTES.DASHBOARD,    icon: LayoutDashboard, label: 'Dashboard' },
  { href: ADMIN_ROUTES.OVERVIEW,     icon: Activity,        label: 'Library Overview' },
  
  { group: 'Management' },
  { href: ADMIN_ROUTES.BRANCHES,     icon: Building2,       label: 'Branches' },
  { href: ADMIN_ROUTES.STAFF,        icon: UserCheck,       label: 'Staff & Managers' },
  { href: ADMIN_ROUTES.BOOKS,        icon: BookOpen,        label: 'Books & Catalog' },
  { href: ADMIN_ROUTES.MEMBERS,      icon: Users,           label: 'Members' },
  
  { group: 'Operations' },
  { href: ADMIN_ROUTES.CIRCULATION,  icon: ArrowRightLeft,  label: 'Circulation' },
  { href: ADMIN_ROUTES.RESERVATIONS, icon: Bookmark,        label: 'Reservations' },
  { href: ADMIN_ROUTES.ACQUISITION,  icon: ShoppingCart,    label: 'Acquisition' },
  { href: ADMIN_ROUTES.VENDORS,      icon: Truck,           label: 'Vendors' },
  { href: ADMIN_ROUTES.INVENTORY,    icon: Boxes,           label: 'Inventory' },
  { href: ADMIN_ROUTES.FINES,        icon: IndianRupee,     label: 'Fines & Payments' },
  
  { group: 'Engagement & Analytics' },
  { href: ADMIN_ROUTES.COMMUNICATION,icon: Bell,            label: 'Communications' },
  { href: ADMIN_ROUTES.REPORTS,      icon: BarChart2,       label: 'Reports' },
  
  { group: 'System & Security' },
  { href: ADMIN_ROUTES.AUDIT,        icon: History,         label: 'Library Audit' },
  { href: ADMIN_ROUTES.ACTIVITY_LOGS,icon: ScrollText,      label: 'Activity Logs' },
  { href: ADMIN_ROUTES.SECURITY,     icon: ShieldAlert,     label: 'Security' },
  { href: ADMIN_ROUTES.IMPORT_EXPORT,icon: Database,        label: 'Import/Export Data' },
  { href: ADMIN_ROUTES.SETTINGS,     icon: Settings,        label: 'Settings' },
  { href: ADMIN_ROUTES.SUPPORT,      icon: LifeBuoy,        label: 'Support' },
  { href: ADMIN_ROUTES.PROFILE,      icon: User,            label: 'My Profile' },
];

/**
 * Icon color & background tokens for KPI cards on Dashboard.
 * Values MUST be CSS token strings — no hex allowed in TSX files.
 */
export const ADMIN_KPI_META = [
  { icon: Users,       iconColor: 'var(--primary)', iconBg: 'var(--icon-bg-primary)' },
  { icon: IndianRupee, iconColor: 'var(--success)', iconBg: 'var(--icon-bg-success)' },
  { icon: BookOpen,    iconColor: 'var(--warning)', iconBg: 'var(--icon-bg-warning)' },
  { icon: ShieldAlert, iconColor: 'var(--danger)',  iconBg: 'var(--icon-bg-danger)'  },
] as const;

/**
 * Action Icons mapped to label
 */
export const ADMIN_ACTION_ICONS: Record<string, any> = {
  'Total Members': Users,
  'Pending Fines': IndianRupee,
  'Books Issued': BookOpen,
  'Security Alerts': ShieldAlert,
};
