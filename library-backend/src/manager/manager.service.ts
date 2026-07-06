import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Between, In } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { Seat } from '../seats/entities/seat.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Seat)
    private readonly seatRepo: Repository<Seat>,
    @InjectRepository(Subscription)
    private readonly subRepo: Repository<Subscription>,
  ) {}

  async getDashboardData(branchId?: string) {
    // 1. KPI Data
    const totalStudents = await this.studentRepo.count({
      where: branchId ? { branch: { id: branchId } } : {},
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
      { title: 'Pending Enquiries', value: '0', icon: 'Phone', iconClass: 'mgr-kpi-icon--info', trend: '0 new today' },
      { title: 'Seats / Lockers Expiring (7 days)', value: expiringSubs.toString(), icon: 'Armchair', iconClass: 'mgr-kpi-icon--warning', trend: '' },
    ];

    // 2. Seats Matrix
    const seats = await this.seatRepo.find({
      where: branchId ? { branch: { id: branchId } } : {},
      take: 40,
    });
    
    const seatData = seats.map((seat, idx) => ({
      id: seat.seatNumber,
      status: idx % 3 === 0 ? 'available' : (idx % 7 === 0 ? 'expiring' : 'occupied'),
    }));

    // Fill up to 40 if needed
    for(let i = seatData.length; i < 40; i++) {
        seatData.push({ id: `X-${i+1}`, status: 'available' });
    }

    // 3. Action Items
    const actionItems = [
      { title: 'New Enquiries', count: 0, countClass: 'mgr-action-count', href: '/crm/enquiries', showRenew: false },
      { title: 'Follow-ups Due Today', count: 0, countClass: 'mgr-action-count', href: '#', showRenew: false },
      { title: 'Open Complaints', count: 0, countClass: 'mgr-action-count--warning', href: '/communication/complaints', showRenew: false },
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
}
