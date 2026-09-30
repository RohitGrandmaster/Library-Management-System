import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '@/lib/api';
import { LIBRARIES_URL_CONFIG } from '@/app/superadmin/superadmin_libraries/superadmin_libraries_url_config';
import type { Library } from '@/app/superadmin/superadmin_libraries/superadmin_libraries_types';

export function useLibraries() {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLibraries = useCallback(async () => {
    setLoading(true);
    try {
      // ── Frontend-only Mock Data (no backend required) ──────────────────────────
      const mockData: Library[] = [
        { id: '1', name: 'StudyNest Patna', location: 'Patna, Bihar', branches: 3, students: 450, plan: 'Pro', status: 'Active', revenue: 150000, joinedAt: '2023-01-15' },
        { id: '2', name: 'The Alexandria Modern', location: 'Delhi', branches: 5, students: 1240, plan: 'Enterprise', status: 'Active', revenue: 520000, joinedAt: '2022-11-10' },
        { id: '3', name: 'Scholar Spaces', location: 'Mumbai', branches: 1, students: 890, plan: 'Starter', status: 'Maintenance', revenue: 0, joinedAt: '2024-02-20' },
        { id: '4', name: 'Gyan Kendra', location: 'Pune', branches: 2, students: 560, plan: 'Pro', status: 'Active', revenue: 210000, joinedAt: '2023-08-05' },
        { id: '5', name: 'City Reading Hub', location: 'Ahmedabad', branches: 4, students: 2100, plan: 'Enterprise', status: 'Active', revenue: 850000, joinedAt: '2021-06-12' },
      ];
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLibraries(mockData);
    } catch (err) {
      console.error(err);
      setError('Failed to load libraries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLibraries();
  }, [loadLibraries]);

  const updateLibrary = async (id: string, updates: Partial<Library>) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    let updatedLibrary: Library | null = null;
    setLibraries((libs) => libs.map((l) => {
      if (l.id === id) {
        updatedLibrary = { ...l, ...updates };
        return updatedLibrary;
      }
      return l;
    }));
    
    return updatedLibrary || updates;
  };

  const toggleStatus = async (id: string) => {
    const lib = libraries.find((l) => l.id === id);
    if (!lib) throw new Error('Library not found');
    const newStatus = lib.status === 'Active' ? 'Maintenance' : 'Active';
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    setLibraries((libs) => libs.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    return newStatus;
  };

  return {
    libraries,
    loading,
    error,
    updateLibrary,
    toggleStatus,
  };
}
