import { create } from 'zustand';
import type { DashboardData, FetchState } from '../manager_dashboard_types';

// RESPONSIBILITY: Module-scoped Zustand store for managing Dashboard API data.

interface DashboardState {
  data: DashboardData | null;
  status: FetchState;
  error: string | null;
  setData: (data: DashboardData) => void;
  setStatus: (status: FetchState) => void;
  setError: (error: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  data: null,
  status: 'idle',
  error: null,
  setData: (data) => set({ data }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
}));
