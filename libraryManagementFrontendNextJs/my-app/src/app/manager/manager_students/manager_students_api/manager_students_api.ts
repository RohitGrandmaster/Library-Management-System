import { fetchApi } from '@/lib/api';
import type { Student } from '../manager_students_types';

export async function fetchStudents(): Promise<Student[]> {
  return await fetchApi('/students');
}
