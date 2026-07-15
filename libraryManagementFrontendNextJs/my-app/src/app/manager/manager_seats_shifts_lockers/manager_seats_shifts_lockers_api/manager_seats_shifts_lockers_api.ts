import { fetchApi } from '@/lib/api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchSeatMatrix(): Promise<any[]> {
  return await fetchApi('/seats_shifts_lockers/seat-matrix');
}
