import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
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
    const s = await this.studentRepo.findOne({
      where: { id, ...(branchId ? { branch: { id: branchId } } : {}) },
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
}
