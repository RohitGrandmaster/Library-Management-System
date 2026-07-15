import { create } from 'zustand';
import type { Student, FetchState } from '../manager_students_types';

// RESPONSIBILITY: Module-scoped Zustand store for managing Students API data.

interface StudentsState {
  students: Student[];
  status: FetchState;
  error: string | null;
  setStudents: (students: Student[]) => void;
  setStatus: (status: FetchState) => void;
  setError: (error: string) => void;
}

export const useStudentsStore = create<StudentsState>((set) => ({
  students: [],
  status: 'idle',
  error: null,
  setStudents: (students) => set({ students }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
}));
