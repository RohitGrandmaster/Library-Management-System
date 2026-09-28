// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_test.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminTestState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminTestStore = create<AdminTestState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
