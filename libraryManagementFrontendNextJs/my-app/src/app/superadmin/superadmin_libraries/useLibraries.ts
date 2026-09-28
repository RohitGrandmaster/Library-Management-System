import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '@/lib/api';
import { LIBRARIES_URL_CONFIG } from '@/app/superadmin/superadmin_libraries/superadmin_libraries_url_config';
import type { Library } from '@/app/superadmin/superadmin_libraries/superadmin_libraries_types';

export function useLibraries() {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dummyLibraries: Library[] = [
    { id: '1', name: 'StudyNest Patna', location: 'Patna, Bihar', seats: 500, occupied: 430, status: 'Active', plan: 'Enterprise', owner: 'Amit Kumar', phone: '+91-9876543210', joined: '2023-01-15' },
    { id: '2', name: 'Readers Den Delhi', location: 'New Delhi', seats: 1200, occupied: 1100, status: 'Active', plan: 'Enterprise', owner: 'Rajiv Sharma', phone: '+91-9876543211', joined: '2023-03-22' },
    { id: '3', name: 'LibroHub Mumbai', location: 'Mumbai, MH', seats: 800, occupied: 400, status: 'Suspended', plan: 'Pro', owner: 'Priya Desai', phone: '+91-9876543212', joined: '2023-05-10' },
    { id: '4', name: 'BookHaven BLR', location: 'Bangalore, KA', seats: 600, occupied: 540, status: 'Active', plan: 'Pro', owner: 'Rahul Iyer', phone: '+91-9876543213', joined: '2023-06-05' },
    { id: '5', name: 'Pune Readers', location: 'Pune, MH', seats: 250, occupied: 150, status: 'Active', plan: 'Basic', owner: 'Sneha Kulkarni', phone: '+91-9876543214', joined: '2023-07-18' },
    { id: '6', name: 'Knowledge Lounge', location: 'Kolkata, WB', seats: 350, occupied: 0, status: 'Archived', plan: 'Basic', owner: 'Ayan Das', phone: '+91-9876543215', joined: '2022-11-30' },
    { id: '7', name: 'Chennai Nexus', location: 'Chennai, TN', seats: 450, occupied: 300, status: 'Pending', plan: 'Pro', owner: 'Karthik N', phone: '+91-9876543216', joined: '2024-01-12' },
    { id: '8', name: 'Hyd Library', location: 'Hyderabad, TS', seats: 800, occupied: 780, status: 'Expired', plan: 'Enterprise', owner: 'Swathi Reddy', phone: '+91-9876543217', joined: '2022-05-20' },
    { id: '9', name: 'Ahm Library', location: 'Ahmedabad, GJ', seats: 300, occupied: 0, status: 'Pending', plan: 'Basic', owner: 'Vikram Patel', phone: '+91-9876543218', joined: '2024-02-01' },
    { id: '10', name: 'Jaipur Readers', location: 'Jaipur, RJ', seats: 150, occupied: 100, status: 'Unverified', plan: 'Basic', owner: 'Ritu Sharma', phone: '+91-9876543219', joined: '2024-02-15' },
  ];

  const loadLibraries = useCallback(async () => {
    setLoading(true);
    try {
      // Hardcoded data substitution for UI completeness
      setLibraries(dummyLibraries);
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
