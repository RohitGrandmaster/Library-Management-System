import type { DashboardData } from '../manager_dashboard_types';

export async function fetchDashboardData(): Promise<DashboardData> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    kpiData: [
      { title: 'Total Members', value: 124, trend: '+12% this month', icon: 'Users', iconClass: 'text-blue-500' },
      { title: 'Active Students', value: 89, trend: 'Currently present', icon: 'BookOpen', iconClass: 'text-emerald-500' },
      { title: 'Expiring Soon', value: 12, trend: 'Next 7 days', icon: 'AlertCircle', iconClass: 'text-amber-500' },
      { title: 'Today\'s Revenue', value: '₹4,500', trend: '3 renewals', icon: 'IndianRupee', iconClass: 'text-purple-500' }
    ],
    seatData: [
      { id: 'A1', status: 'occupied' }, { id: 'A2', status: 'available' },
      { id: 'A3', status: 'reserved' }, { id: 'A4', status: 'occupied' }
    ],
    actionItems: [
      { title: 'Pending Renewals', count: '12', countClass: 'bg-amber-100 text-amber-700', showRenew: true, href: '/manager/renewals' },
      { title: 'New Enquiries', count: '5', countClass: 'bg-blue-100 text-blue-700', showRenew: false, href: '/manager/enquiries' },
    ],
    recentAdmissions: [
      { name: 'Rahul Kumar', smartId: 'LIB-001', shift: 'Morning Shift' },
      { name: 'Priya Sharma', smartId: 'LIB-002', shift: 'Evening Shift' }
    ],
    recentEnquiries: [
      { name: 'Amit Singh', phone: '+91 9876543210', status: 'Hot' },
      { name: 'Neha Gupta', phone: '+91 8765432109', status: 'Follow Up' }
    ]
  };
}
