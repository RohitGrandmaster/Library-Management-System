import { cookies } from 'next/headers';
import { DASHBOARD_URL_CONFIG } from '@/app/superadmin/superadmin_dashboard/superadmin_dashboard_url_config';
import type { DashboardDataResponse } from '@/app/superadmin/superadmin_dashboard/superadmin_dashboard_types';

export async function fetchDashboardData(): Promise<DashboardDataResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value || '';

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1';
  const url = `${API_BASE}${DASHBOARD_URL_CONFIG.ENDPOINTS.GET_DASHBOARD}`;

  // MOCKED for Frontend Prototype since Backend isn't active
  return {
    kpiCards: [], // Note: Superadmin currently renders static cards in DashboardOverview.tsx
    systemHealth: {
      uptime: '99.98%',
      activeUsers: 143,
      apiLatency: '42ms',
      lastBackup: '2 mins ago'
    },
    actionItems: [
      {
        id: '1',
        title: 'Database Backup Needed',
        description: 'No full backup in 48 hours.',
        type: 'warning',
        icon: 'Database',
        actionLabel: 'Run Backup',
        actionUrl: '/superadmin/superadmin_backup'
      }
    ],
    recentLibraries: [
      {
        initials: 'SN',
        name: 'StudyNest Patna',
        owner: 'Rahul K.',
        students: 240,
        status: 'active',
        plan: 'Enterprise',
        joinedAt: '2 Days ago'
      }
    ]
  };
}
