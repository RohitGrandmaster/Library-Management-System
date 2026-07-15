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

export async function fetchAllocations(): Promise<any[]> {
  return new Promise(resolve => setTimeout(() => resolve([
    { studentName: 'Alex Rivera', smartId: 'LIB-001', seatNo: 'S-02', shift: 'Morning', customSlots: '8AM–10AM, 5PM–8PM', lockerNo: 'A01', validFrom: '01 Oct 2024', validTill: '31 Oct 2024', daysLeft: 7, status: 'Active' },
    { studentName: 'Priya Sharma', smartId: 'LIB-002', seatNo: 'S-11', shift: 'Evening', customSlots: '—', lockerNo: '—', validFrom: '15 Sep 2024', validTill: '14 Oct 2024', daysLeft: 3, status: 'Active' },
    { studentName: 'Rohan Mehta', smartId: 'LIB-003', seatNo: 'S-22', shift: 'Morning', customSlots: '—', lockerNo: 'B04', validFrom: '01 Sep 2024', validTill: '30 Sep 2024', daysLeft: -5, status: 'Expired' },
    { studentName: 'Sneha Patel', smartId: 'LIB-004', seatNo: 'S-36', shift: 'Full Day', customSlots: '—', lockerNo: '—', validFrom: '10 Oct 2024', validTill: '09 Nov 2024', daysLeft: 20, status: 'Active' },
    { studentName: 'Vikram Rao', smartId: 'LIB-005', seatNo: 'S-45', shift: 'Evening', customSlots: '6PM–9PM', lockerNo: 'C10', validFrom: '20 Oct 2024', validTill: '19 Nov 2024', daysLeft: 30, status: 'Active' },
    { studentName: 'Ananya Gupta', smartId: 'LIB-006', seatNo: 'S-08', shift: 'Morning', customSlots: '—', lockerNo: '—', validFrom: '05 Oct 2024', validTill: '04 Oct 2024', daysLeft: 12, status: 'Suspended' },
  ]), 500));
}

export async function fetchSeatHistory(): Promise<any[]> {
  return new Promise(resolve => setTimeout(() => resolve([
    { seatNo: 'S-12', studentName: 'Rahul Verma', smartId: 'LIB-088', shift: 'Morning', occupiedFrom: '01 Jan 2024', occupiedTill: '31 Mar 2024', duration: '90 days', reason: 'Admission' },
    { seatNo: 'S-12', studentName: 'Pooja Nair', smartId: 'LIB-045', shift: 'Morning', occupiedFrom: '01 Apr 2024', occupiedTill: '15 Jun 2024', duration: '75 days', reason: 'Seat Change' },
    { seatNo: 'S-12', studentName: 'Arjun Singh', smartId: 'LIB-112', shift: 'Morning', occupiedFrom: '01 Jul 2024', occupiedTill: '30 Sep 2024', duration: '91 days', reason: 'Shift Change' },
    { seatNo: 'S-07', studentName: 'Meera Joshi', smartId: 'LIB-033', shift: 'Evening', occupiedFrom: '15 Feb 2024', occupiedTill: '14 May 2024', duration: '89 days', reason: 'Admission' },
    { seatNo: 'S-07', studentName: 'Karan Malhotra', smartId: 'LIB-077', shift: 'Evening', occupiedFrom: '01 Jun 2024', occupiedTill: '10 Aug 2024', duration: '70 days', reason: 'Seat Change' },
    { seatNo: 'S-31', studentName: 'Divya Kapoor', smartId: 'LIB-099', shift: 'Full Day', occupiedFrom: '01 Mar 2024', occupiedTill: '31 Aug 2024', duration: '183 days', reason: 'Admission' },
  ]), 500));
}
