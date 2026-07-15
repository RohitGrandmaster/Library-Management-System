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
      const data = await fetchApi(LIBRARIES_URL_CONFIG.ENDPOINTS.GET_LIBRARIES);
      setLibraries(data);
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
    const updated = await fetchApi(LIBRARIES_URL_CONFIG.ENDPOINTS.UPDATE_LIBRARY(id), {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    setLibraries((libs) => libs.map((l: any) => (l.id === id ? { ...l, ...updated } : l)));
    return updated;
  };

  const toggleStatus = async (id: string) => {
    const lib = libraries.find((l) => l.id === id);
    if (!lib) throw new Error('Library not found');
    const newStatus = lib.status === 'Active' ? 'Maintenance' : 'Active';
    
    await fetchApi(LIBRARIES_URL_CONFIG.ENDPOINTS.UPDATE_STATUS(id), {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });
    
    setLibraries((libs) => libs.map((l: any) => (l.id === id ? { ...l, status: newStatus } : l)));
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
