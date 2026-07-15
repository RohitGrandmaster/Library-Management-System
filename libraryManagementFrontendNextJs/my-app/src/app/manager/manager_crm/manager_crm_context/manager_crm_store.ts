import { create } from 'zustand';
import type { Enquiry, FetchState } from '../manager_crm_types';

// RESPONSIBILITY: Module-scoped Zustand store for managing CRM Enquiries API data.

interface CrmState {
  enquiries: Enquiry[];
  status: FetchState;
  error: string | null;
  setEnquiries: (enquiries: Enquiry[]) => void;
  updateEnquiryStatus: (id: string, status: Enquiry['status']) => void;
  setStatus: (status: FetchState) => void;
  setError: (error: string) => void;
}

export const useCrmStore = create<CrmState>((set) => ({
  enquiries: [],
  status: 'idle',
  error: null,
  setEnquiries: (enquiries) => set({ enquiries }),
  updateEnquiryStatus: (id, status) => set((state) => ({
    enquiries: state.enquiries.map(enq => enq.id === id ? { ...enq, status } : enq)
  })),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
}));
