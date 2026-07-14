import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { Seat } from '../seats/entities/seat.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Enquiry } from '../enquiries/entities/enquiry.entity';
import { Complaint } from '../complaints/entities/complaint.entity';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Seat)
    private readonly seatRepo: Repository<Seat>,
    @InjectRepository(Subscription)
    private readonly subRepo: Repository<Subscription>,
    @InjectRepository(Enquiry)
    private readonly enquiryRepo: Repository<Enquiry>,
    @InjectRepository(Complaint)
    private readonly complaintRepo: Repository<Complaint>,
  ) {}

  async getDashboardData(branchId?: string) {
    // 1. KPI Data
    const totalStudents = await this.studentRepo.count({
      where: branchId ? { branch: { id: branchId } } : {},
    });

    const pendingEnquiries = await this.enquiryRepo.count({
      where: { status: 'new' }
    });

    const openComplaints = await this.complaintRepo.count({
      where: { status: 'open' }
    });

    // Mock Attendance for now
    const attendancePercentage = '85%';

    // Expiring within 7 days
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const expiringSubs = await this.subRepo.count({
      where: {
        endDate: Between(new Date(), nextWeek),
        ...(branchId ? { student: { branch: { id: branchId } } } : {})
      },
    });

    const kpiData = [
      { title: 'Active Students Today', value: totalStudents.toString(), icon: 'Users', iconClass: 'mgr-kpi-icon--primary', trend: '↑' },
      { title: "Today's Attendance", value: attendancePercentage, icon: 'CalendarCheck', iconClass: 'mgr-kpi-icon--success', trend: '' },
      { title: 'Pending Enquiries', value: pendingEnquiries.toString(), icon: 'Phone', iconClass: 'mgr-kpi-icon--info', trend: `${pendingEnquiries} new today` },
      { title: 'Seats / Lockers Expiring (7 days)', value: expiringSubs.toString(), icon: 'Armchair', iconClass: 'mgr-kpi-icon--warning', trend: '' },
    ];

    // 2. Seats Matrix
    const seats = await this.seatRepo.find({
      where: branchId ? { branch: { id: branchId } } : {},
      take: 40,
    });
    
    const seatData = seats.map((seat, idx) => ({
      id: seat.seatNumber,
      status: seat.status || (idx % 3 === 0 ? 'available' : (idx % 7 === 0 ? 'expiring' : 'occupied')),
    }));

    // Fill up to 40 if needed
    for(let i = seatData.length; i < 40; i++) {
        seatData.push({ id: `X-${i+1}`, status: 'available' });
    }

    // 3. Action Items
    const actionItems = [
      { title: 'New Enquiries', count: pendingEnquiries, countClass: 'mgr-action-count', href: '/crm/enquiries', showRenew: false },
      { title: 'Follow-ups Due Today', count: 0, countClass: 'mgr-action-count', href: '#', showRenew: false },
      { title: 'Open Complaints', count: openComplaints, countClass: 'mgr-action-count--warning', href: '/communication/complaints', showRenew: false },
      { title: 'Payment Promises Due Today', count: 0, countClass: 'mgr-action-count--warning', href: '/finance/payment-promises', showRenew: false },
      { title: 'Maintenance / Broken Assets', count: 0, countClass: 'mgr-action-count--danger', href: '/asset-maintenance', showRenew: false },
      { title: 'Expiring Subscriptions', count: expiringSubs, countClass: 'mgr-action-count--warning', href: '/finance/subscriptions', showRenew: true },
    ];

    // 4. Recent Admissions
    const recentStudents = await this.studentRepo.find({
      where: branchId ? { branch: { id: branchId } } : {},
      order: { joinDate: 'DESC' },
      take: 5,
    });
    const recentAdmissions = recentStudents.map(s => ({
      id: s.id,
      name: s.name,
      smartId: s.id.substring(0, 8),
      shift: 'Morning',
    }));

    return {
      kpiData,
      seatData,
      actionItems,
      recentAdmissions,
      recentEnquiries: [],
    };
  }

  async getReportsData() {
    const totalStudents = await this.studentRepo.count();
    const activeStudents = await this.studentRepo.count({ where: { status: 'Active' } });
    
    // Complaints summary
    let totalComplaints = await this.complaintRepo.count();
    if (totalComplaints === 0) {
      await this.complaintRepo.save([
        this.complaintRepo.create({ title: 'Internet slow', description: 'Wi-Fi is very slow in Hall A', status: 'open', isAnonymous: false }),
        this.complaintRepo.create({ title: 'AC not working', description: 'AC unit 2 is broken', status: 'open', isAnonymous: true }),
        this.complaintRepo.create({ title: 'Cleanliness', description: 'Restrooms need cleaning', status: 'resolved', isAnonymous: false }),
        this.complaintRepo.create({ title: 'Noise issue', description: 'People talking in quiet zone', status: 'resolved', isAnonymous: true }),
        this.complaintRepo.create({ title: 'Chair broken', description: 'Chair 45 is broken', status: 'resolved', isAnonymous: false })
      ]);
    }
    
    const openComplaints = await this.complaintRepo.count({ where: { status: 'open' } });
    const resolvedComplaints = await this.complaintRepo.count({ where: { status: 'resolved' } });

    // Seat summary
    const totalSeats = await this.seatRepo.count();
    const availableSeats = await this.seatRepo.count({ where: { status: 'available' } });

    return {
      kpiCards: [
        { title: 'Total Revenue', value: '₹1,24,500', icon: 'IndianRupee', iconClass: 'mgr-kpi-icon--success', trend: '+12%' },
        { title: 'Active Students', value: activeStudents.toString(), icon: 'Users', iconClass: 'mgr-kpi-icon--primary', trend: '+5%' },
        { title: 'New Admissions', value: '18', icon: 'UserPlus', iconClass: 'mgr-kpi-icon--info', trend: 'This month' },
        { title: 'Resolved Complaints', value: resolvedComplaints.toString(), icon: 'CheckCircle', iconClass: 'mgr-kpi-icon--success', trend: '' },
      ],
      occupancyData: [
        { name: 'Morning', value: 45 },
        { name: 'Afternoon', value: 30 },
        { name: 'Evening', value: 65 },
        { name: 'Night', value: 20 },
      ],
      growthData: [
        { date: 'Mon', joined: 4, exited: 1 },
        { date: 'Tue', joined: 3, exited: 0 },
        { date: 'Wed', joined: 7, exited: 2 },
        { date: 'Thu', joined: 5, exited: 1 },
        { date: 'Fri', joined: 2, exited: 0 },
      ],
      attendanceData: [
        { day: 'Mon', avg: 85 },
        { day: 'Tue', avg: 88 },
        { day: 'Wed', avg: 82 },
        { day: 'Thu', avg: 90 },
        { day: 'Fri', avg: 87 },
      ],
      absenteesChartData: [
        { name: 'Rahul K.', absences: 4 },
        { name: 'Amit M.', absences: 3 },
      ],
      complaintsData: [
        { name: 'Open', value: openComplaints },
        { name: 'Resolved', value: resolvedComplaints },
      ],
      absenteeRows: [
        { name: 'Rahul K.', smartId: 'ST-001', shift: 'Morning', daysAbsent: 4, lastPresent: '2026-07-10' },
        { name: 'Amit M.', smartId: 'ST-002', shift: 'Evening', daysAbsent: 3, lastPresent: '2026-07-11' },
      ],
      conversionRows: [
        { month: 'Jan', newEnq: 120, converted: 40, rate: '33%' },
        { month: 'Feb', newEnq: 150, converted: 60, rate: '40%' },
      ],
      seatRows: [
        { shift: 'Morning', occupancy: '85%', avgDuration: '4.5 hrs' },
        { shift: 'Evening', occupancy: '92%', avgDuration: '4.8 hrs' },
      ],
      lockerRows: [
        { type: 'Standard', occupied: 45, total: 50, pct: '90%' },
        { type: 'Large', occupied: 18, total: 20, pct: '90%' },
      ],
      maintenanceRows: [
        { item: 'AC Unit 1', location: 'Hall A', reported: '2026-07-12', priority: 'High' },
        { item: 'Chair #45', location: 'Hall B', reported: '2026-07-10', priority: 'Medium' },
      ]
    };
  }

  async getStudentReportsData() {
    const totalStudents = await this.studentRepo.count();
    const activeStudents = await this.studentRepo.count({ where: { status: 'Active' } });
    
    // Complaints summary
    let totalComplaints = await this.complaintRepo.count();
    if (totalComplaints === 0) {
      await this.complaintRepo.save([
        this.complaintRepo.create({ title: 'Internet slow', description: 'Wi-Fi is very slow in Hall A', status: 'open', isAnonymous: false }),
        this.complaintRepo.create({ title: 'AC not working', description: 'AC unit 2 is broken', status: 'open', isAnonymous: true }),
        this.complaintRepo.create({ title: 'Cleanliness', description: 'Restrooms need cleaning', status: 'resolved', isAnonymous: false }),
        this.complaintRepo.create({ title: 'Noise issue', description: 'People talking in quiet zone', status: 'resolved', isAnonymous: true }),
        this.complaintRepo.create({ title: 'Chair broken', description: 'Chair 45 is broken', status: 'resolved', isAnonymous: false })
      ]);
    }

    const openComplaints = await this.complaintRepo.count({ where: { status: 'open' } });
    const resolvedComplaints = await this.complaintRepo.count({ where: { status: 'resolved' } });

    return {
      kpiCards: [
        { title: 'Total Students', value: totalStudents.toString(), icon: 'Users', color: '#6366f1', trend: '+12% from last month' },
        { title: 'Active Students', value: activeStudents.toString(), icon: 'Users', color: '#10b981', trend: '+5% from last month' },
        { title: 'New Admissions', value: '24', icon: 'UserPlus', color: '#f59e0b', trend: 'This month' },
        { title: 'Open Complaints', value: openComplaints.toString(), icon: 'Phone', color: '#ef4444', trend: 'Needs attention' },
      ],
      shiftOccupancyData: [
        { name: 'Morning', occupancy: 85 },
        { name: 'Afternoon', occupancy: 40 },
        { name: 'Evening', occupancy: 95 },
        { name: 'Night', occupancy: 30 },
      ],
      studentGrowthData: [
        { date: 'Week 1', joined: 10, exited: 2 },
        { date: 'Week 2', joined: 15, exited: 1 },
        { date: 'Week 3', joined: 8, exited: 3 },
        { date: 'Week 4', joined: 12, exited: 0 },
      ],
      attendanceTrendData: [
        { date: 'Mon', attendance: 85 },
        { date: 'Tue', attendance: 88 },
        { date: 'Wed', attendance: 82 },
        { date: 'Thu', attendance: 90 },
        { date: 'Fri', attendance: 87 },
      ],
      topAbsenteesData: [
        { name: 'Rahul K.', absent: 4 },
        { name: 'Amit M.', absent: 3 },
      ],
      complaintStatusData: [
        { name: 'Open', value: openComplaints },
        { name: 'Resolved', value: resolvedComplaints },
      ],
      absenteeReportData: [
        { id: 1, name: 'Rahul K.', smartId: 'ST-001', daysAbsent: 4, lastPresent: '2026-07-10', shift: 'Morning' },
        { id: 2, name: 'Amit M.', smartId: 'ST-002', daysAbsent: 3, lastPresent: '2026-07-11', shift: 'Evening' },
      ],
      enquiryConversionData: [
        { id: 1, month: 'January', new: 150, converted: 45 },
        { id: 2, month: 'February', new: 180, converted: 75 },
      ],
      seatUtilizationData: [
        { id: 1, shift: 'Morning', utilization: 85, occupancy: 85, total: 100 },
        { id: 2, shift: 'Evening', utilization: 95, occupancy: 95, total: 100 },
      ],
      lockerUtilizationData: [
        { id: 1, type: 'Standard', occupied: 45, total: 50, pct: '90%' },
        { id: 2, type: 'Large', occupied: 18, total: 20, pct: '90%' },
      ],
      maintenanceData: [
        { id: 1, item: 'AC Unit 1', location: 'Hall A', reported: '2026-07-12', priority: 'High' },
        { id: 2, item: 'Chair #45', location: 'Hall B', reported: '2026-07-10', priority: 'Medium' },
      ]
    };
  }
}
