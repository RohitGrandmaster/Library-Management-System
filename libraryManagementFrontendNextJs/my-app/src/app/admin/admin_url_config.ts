/**
 * URL Configuration for the Admin Module
 * Contains all internal routes and external API endpoints for Library OS.
 */

export const ADMIN_ROUTES = {
  PREFIX: '/admin',
  DASHBOARD: '/admin/admin_dashboard',
  OVERVIEW: '/admin/admin_library_overview',
  BRANCHES: '/admin/admin_branches',
  STAFF: '/admin/admin_staff-users',
  MEMBERS: '/admin/admin_members',
  COMMUNICATION: '/admin/admin_communication',
  REPORTS: '/admin/admin_reports',
  AUDIT: '/admin/admin_audit',
  SECURITY: '/admin/admin_security',
  SETTINGS: '/admin/admin_settings',
  SUPPORT: '/admin/admin_support',
  PROFILE: '/admin/admin_profile',
  IMPORT_EXPORT: '/admin/admin_import-export',
  ACTIVITY_LOGS: '/admin/admin_activity-logs',
} as const;

export const ADMIN_API_ROUTES = {
  DASHBOARD: '/admin/dashboard',
} as const;
