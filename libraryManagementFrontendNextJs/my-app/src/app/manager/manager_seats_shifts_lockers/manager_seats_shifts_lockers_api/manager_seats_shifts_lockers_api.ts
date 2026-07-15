import { fetchApi } from '@/lib/api';

// MOCK APIs for seats and lockers to prevent 500 errors
export async function fetchSeatMatrix(): Promise<any[]> {
  return new Promise(resolve => setTimeout(() => resolve([
    { id: '1', seatNumber: 'S-01', isActive: true, shift: 'Morning' },
    { id: '2', seatNumber: 'S-02', isActive: false, shift: 'Evening' },
    { id: '3', seatNumber: 'S-03', isActive: true, shift: 'Full Day' },
  ]), 500));
}

export async function fetchLockerMatrix(): Promise<any[]> {
  return new Promise(resolve => setTimeout(() => resolve([
    { id: '1', lockerNumber: 'L-01', isActive: true },
    { id: '2', lockerNumber: 'L-02', isActive: false },
    { id: '3', lockerNumber: 'L-03', isActive: true },
  ]), 500));
}
