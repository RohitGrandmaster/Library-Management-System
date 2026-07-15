import { useEffect } from 'react';
import { fetchDashboardData } from '../manager_dashboard_api/manager_dashboard_api';
import { useDashboardStore } from '../manager_dashboard_context/manager_dashboard_store';

/**
 * Custom hook to fetch and manage dashboard data.
 * DATA FLOW: API → useDashboardData → ManagerDashboardClient
 */
export function useDashboardData() {
  const { data, status, error, setData, setStatus, setError } = useDashboardStore();

  // Refetch when component mounts
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setStatus('loading');
      try {
        const result = await fetchDashboardData();
        if (mounted) {
          setData(result);
          setStatus('success');
        }
      } catch (err: unknown) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setStatus('error');
        }
      }
    }
    loadData();

    return () => {
      mounted = false;
    };
  }, [setData, setStatus, setError]);

  return { data, status, error };
}
