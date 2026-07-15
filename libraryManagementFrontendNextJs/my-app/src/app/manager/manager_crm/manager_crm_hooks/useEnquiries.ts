import { useState, useEffect, useMemo } from 'react';
import { fetchEnquiries } from '../manager_crm_api/manager_crm_api';
import { useCrmStore } from '../manager_crm_context/manager_crm_store';
import type { EnquiryStatus } from '../manager_crm_types';

// Use debounce to prevent excessive renders during search (Rule 15)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

/**
 * Custom hook to manage Enquiries data, searching, and filtering.
 * DATA FLOW: API → useEnquiries → EnquiriesClient
 */
export function useEnquiries() {
  const { enquiries, status, error, setEnquiries, setStatus, setError, updateEnquiryStatus } = useCrmStore();
  
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Refetch when component mounts
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setStatus('loading');
      try {
        const data = await fetchEnquiries();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped = data.map((e: any) => ({
          id: e.id,
          name: e.name,
          phone: e.phone,
          shift: e.preferredShift,
          status: e.status.charAt(0).toUpperCase() + e.status.slice(1),
          handledBy: e.handledBy?.name || 'Unassigned',
          addedDate: new Date(e.createdAt).toLocaleDateString(),
          avatar: e.name.substring(0, 2).toUpperCase()
        }));
        if (mounted) {
          setEnquiries(mapped);
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
    return () => { mounted = false; };
  }, [setEnquiries, setStatus, setError]);

  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      const matchSearch =
        e.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        e.phone.includes(debouncedSearch.replace(/\D/g, ''));
      const matchStatus = statusFilter === 'All' || e.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [enquiries, debouncedSearch, statusFilter]);

  const getCardsByStatus = (status: EnquiryStatus) => {
    return filtered.filter((e) => e.status === status);
  };

  return {
    status,
    error,
    filtered,
    view, setView,
    search, setSearch,
    statusFilter, setStatusFilter,
    getCardsByStatus,
    updateEnquiryStatus
  };
}
