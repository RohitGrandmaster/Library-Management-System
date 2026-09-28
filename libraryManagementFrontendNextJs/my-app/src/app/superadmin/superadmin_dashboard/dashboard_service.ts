import { cookies } from 'next/headers';
import { DASHBOARD_URL_CONFIG } from '@/app/superadmin/superadmin_dashboard/superadmin_dashboard_url_config';
import type { DashboardDataResponse } from '@/app/superadmin/superadmin_dashboard/superadmin_dashboard_types';

export async function fetchDashboardData(): Promise<DashboardDataResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value || '';

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1';
  const url = `${API_BASE}${DASHBOARD_URL_CONFIG.ENDPOINTS.GET_DASHBOARD}`;

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return null;
    }
    
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch dashboard data', err);
    return null;
  }
}
