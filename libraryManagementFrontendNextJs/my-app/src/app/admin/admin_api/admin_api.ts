import { fetchApi } from '@/lib/api';
import { ADMIN_API_ROUTES } from '../admin_url_config';

/**
 * Fetches dashboard data.
 */
export async function fetchAdminDashboard() {
  return fetchApi(ADMIN_API_ROUTES.DASHBOARD);
}


