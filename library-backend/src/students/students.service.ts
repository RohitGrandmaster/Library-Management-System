import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';

import { Branch } from '../branches/entities/branch.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { Seat } from '../seats/entities/seat.entity';
import { Locker } from '../lockers/entities/locker.entity';
import { Plan } from '../plans/entities/plan.entity';
import { StudentSlot } from '../student-slots/entities/student-slot.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Payment } from '../payments/entities/payment.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Branch) private readonly branchRepo: Repository<Branch>,
    @InjectRepository(Shift) private readonly shiftRepo: Repository<Shift>,
    @InjectRepository(Seat) private readonly seatRepo: Repository<Seat>,
    @InjectRepository(Locker) private readonly lockerRepo: Repository<Locker>,
    @InjectRepository(Plan) private readonly planRepo: Repository<Plan>,
    @InjectRepository(StudentSlot) private readonly slotRepo: Repository<StudentSlot>,
    @InjectRepository(Subscription) private readonly subRepo: Repository<Subscription>,
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
  ) {}

  async findAll(branchId?: string) {
    const students = await this.studentRepo.find({
      where: branchId ? { branch: { id: branchId } } : {},
      relations: {
        branch: true,
        subscriptions: { plan: true },
        slots: { seat: true, shift: true }
      },
      order: { joinDate: 'DESC' }
    });

    return students.map(s => {
      const activeSub = s.subscriptions?.find(sub => sub.status === 'active') || s.subscriptions?.[0];
      const activeSlot = s.slots?.[0];

      return {
        id: s.id,
        smartId: s.id.substring(0, 8).toUpperCase(),
        name: s.name,
        phone: s.phone,
        branch: s.branch?.name || 'N/A',
        shift: activeSlot?.shift?.name || 'N/A',
        seat: activeSlot?.seat?.seatNumber || 'N/A',
        plan: activeSub?.plan?.name || 'N/A',
        status: activeSub ? activeSub.status : 'Inactive',
        due: activeSub?.dueAmount || 0,
        joined: s.joinDate ? s.joinDate.toLocaleDateString('en-IN') : 'N/A',
        email: s.email,
        parentPhone: s.parentPhone,
        college: s.college,
      };
    });
  }

  async findOne(id: string, branchId?: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    const whereClause = isUuid 
      ? { id, ...(branchId ? { branch: { id: branchId } } : {}) }
      : { smartId: id, ...(branchId ? { branch: { id: branchId } } : {}) };

    const s = await this.studentRepo.findOne({
      where: whereClause,
      relations: {
        branch: true,
        subscriptions: { plan: true },
        slots: { seat: true, shift: true }
      }
    });

    if (!s) {
      throw new NotFoundException('Student not found');
    }

    const activeSub = s.subscriptions?.find(sub => sub.status === 'active') || s.subscriptions?.[0];
    const activeSlot = s.slots?.[0];

    return {
      id: s.id,
      smartId: s.id.substring(0, 8).toUpperCase(),
      name: s.name,
      firstName: s.name.split(' ')[0] || '',
      lastName: s.name.split(' ')[1] || '',
      phone: s.phone,
      email: s.email,
      parentPhone: s.parentPhone,
      college: s.college,
      branch: s.branch?.name || 'N/A',
      shift: activeSlot?.shift?.name || 'N/A',
      seat: activeSlot?.seat?.seatNumber || 'N/A',
      plan: activeSub?.plan?.name || 'N/A',
      status: activeSub ? activeSub.status : 'Inactive',
      due: activeSub?.dueAmount || 0,
      joined: s.joinDate ? s.joinDate.toLocaleDateString('en-IN') : 'N/A',
      history: s.subscriptions?.map(sub => ({
          plan: sub.plan?.name,
          startDate: sub.startDate,
          endDate: sub.endDate,
          amount: sub.totalAmount,
          status: sub.status
      })) || [],
    };
  }

  async create(branchId: string, data: any) {
    const branch = await this.branchRepo.findOne({ where: { id: branchId } });
    if (!branch) throw new NotFoundException('Branch not found');

    const totalStudents = await this.studentRepo.count({ where: { branch: { id: branchId } } });
    const smartId = `LIB${String(totalStudents + 1).padStart(3, '0')}`;

    const student = this.studentRepo.create({
      smartId,
      name: data.fullName || data.name,
      phone: data.phone,
      parentPhone: data.parentPhone,
      email: data.email,
      college: data.college,
      branch: branch,
    });
    await this.studentRepo.save(student);

    // Resolve relationships
    const shiftStr = data.shift?.split(' ')[0]; // e.g. "Morning (8 AM-2 PM)" -> "Morning"
    const shift = await this.shiftRepo.findOne({ where: { name: shiftStr, branch: { id: branchId } } });
    const seat = await this.seatRepo.findOne({ where: { seatNumber: data.seat, branch: { id: branchId } } });
    const plan = await this.planRepo.findOne({ where: { name: data.plan, branch: { id: branchId } } });
    
    // Create slot
    if (shift && seat) {
      const slot = this.slotRepo.create({
        student,
        shift,
        seat,
        validFrom: new Date(),
        validTill: new Date(new Date().setMonth(new Date().getMonth() + (plan?.durationDays ? plan.durationDays / 30 : 1))),
      });
      await this.slotRepo.save(slot);
    }

    // Create Subscription
    if (plan) {
      const sub = this.subRepo.create({
        student,
        plan,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + (plan.durationDays / 30))),
        baseAmount: plan.price,
        discountApplied: Number(data.manualDiscount) || 0,
        totalAmount: plan.price - (Number(data.manualDiscount) || 0),
        paidAmount: Number(data.amountPaid) || 0,
        dueAmount: (plan.price - (Number(data.manualDiscount) || 0)) - (Number(data.amountPaid) || 0),
      });
      await this.subRepo.save(sub);

      // Create Payment
      if (Number(data.amountPaid) > 0) {
        const payment = this.paymentRepo.create({
          student,
          subscription: sub,
          amount: Number(data.amountPaid),
          mode: data.paymentMode || 'UPI',
          transactionId: data.transactionId,
        });
        await this.paymentRepo.save(payment);
      }
    }

    return student;
  }

  async update(id: string, branchId: string, data: any) {
    const student = await this.studentRepo.findOne({
      where: { id, branch: { id: branchId } }
    });
    if (!student) throw new NotFoundException('Student not found');
    
    if (data.name) student.name = data.name;
    if (data.phone) student.phone = data.phone;
    if (data.parentPhone !== undefined) student.parentPhone = data.parentPhone;
    if (data.email !== undefined) student.email = data.email;
    if (data.college !== undefined) student.college = data.college;
    if (data.status) student.status = data.status;

    await this.studentRepo.save(student);
    return student;
  }

  async remove(id: string, branchId: string) {
    const student = await this.studentRepo.findOne({
      where: { id, branch: { id: branchId } }
    });
    if (!student) throw new NotFoundException('Student not found');
    
    student.status = 'Suspended';
    student.exitDate = new Date();
    await this.studentRepo.save(student);
    
    return { message: 'Student suspended successfully' };
  }
}
