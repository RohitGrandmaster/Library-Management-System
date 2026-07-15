import { create } from 'zustand';
import type { SeatData, FetchState } from '../manager_seats_shifts_lockers_types';

// RESPONSIBILITY: Module-scoped Zustand store for managing Seat Matrix API data.

interface SeatsState {
  seatsData: SeatData[];
  status: FetchState;
  error: string | null;
  setSeatsData: (data: SeatData[]) => void;
  setStatus: (status: FetchState) => void;
  setError: (error: string) => void;
}

export const useSeatsStore = create<SeatsState>((set) => ({
  seatsData: [],
  status: 'idle',
  error: null,
  setSeatsData: (data) => set({ seatsData: data }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
}));
