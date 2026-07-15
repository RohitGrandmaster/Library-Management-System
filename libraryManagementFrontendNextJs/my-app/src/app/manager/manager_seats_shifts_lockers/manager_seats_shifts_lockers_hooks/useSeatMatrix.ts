import { useState, useEffect, useMemo } from 'react';
import { fetchSeatMatrix } from '../manager_seats_shifts_lockers_api/manager_seats_shifts_lockers_api';
import { useSeatsStore } from '../manager_seats_shifts_lockers_context/manager_seats_shifts_lockers_store';
import type { SeatData } from '../manager_seats_shifts_lockers_types';

/**
 * Custom hook to fetch and filter seat matrix data.
 * DATA FLOW: API → useSeatMatrix → SeatMatrixClient
 */
export function useSeatMatrix() {
  const { seatsData, status, error, setSeatsData, setStatus, setError } = useSeatsStore();
  
  const [activeTab, setActiveTab] = useState('All');
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Refetch when component mounts
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setStatus('loading');
      try {
        const data = await fetchSeatMatrix();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped = data.map((s: any) => ({
          uuid: s.id,
          id: s.seatNumber.replace('S-', ''),
          status: (s.isActive ? 'free' : 'maintenance') as 'free' | 'maintenance',
        }));
        if (mounted) {
          setSeatsData(mapped);
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
  }, [setSeatsData, setStatus, setError]);

  const visible = useMemo(() => {
    if (activeTab === 'All') return seatsData;
    return seatsData.filter(s => s.shift === activeTab || s.status === 'free' || s.status === 'maintenance');
  }, [seatsData, activeTab]);

  const freeCount = useMemo(() => visible.filter(s => s.status === 'free').length, [visible]);

  return {
    status,
    error,
    visible,
    freeCount,
    activeTab, setActiveTab,
    selectedSeat, setSelectedSeat,
    date, setDate
  };
}
