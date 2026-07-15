import { useState, useEffect, useMemo } from 'react';
import { fetchStudents } from '../manager_students_api/manager_students_api';
import { useDebounce } from './useDebounce';
import { useStudentsStore } from '../manager_students_context/manager_students_store';

/**
 * Custom hook to fetch and filter students.
 * DATA FLOW: API → useStudentsList → ManagerStudentsClient
 */
export function useStudentsList() {
  const { students, status, error, setStudents, setStatus, setError } = useStudentsStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');

  // Refetch when component mounts
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setStatus('loading');
      try {
        const data = await fetchStudents();
        if (mounted) {
          setStudents(data);
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
  }, [setStudents, setStatus, setError]);

  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() =>
    students.filter(s => {
      const q = debouncedSearch.toLowerCase();
      const matchSearch = !debouncedSearch ||
        s.name.toLowerCase().includes(q) ||
        s.phone.includes(debouncedSearch) ||
        s.smartId.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchShift  = shiftFilter  === 'all' || s.shift  === shiftFilter;
      return matchSearch && matchStatus && matchShift;
    }),
    [students, debouncedSearch, statusFilter, shiftFilter]
  );

  return {
    students,
    filtered,
    status,
    error,
    search, setSearch,
    statusFilter, setStatusFilter,
    shiftFilter, setShiftFilter
  };
}
