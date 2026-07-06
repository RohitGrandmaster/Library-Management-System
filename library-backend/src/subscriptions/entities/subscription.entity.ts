import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Plan } from '../../plans/entities/plan.entity';
import { Coupon } from '../../coupons/entities/coupon.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.subscriptions)
  student: Student;

  @ManyToOne(() => Plan)
  plan: Plan;

  @Column('date')
  startDate: Date;

  @Column('date')
  endDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  baseAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discountApplied: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  lateFeeAdded: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  dueAmount: number;

  @Column({ default: 'active' })
  status: string; // active, expired, suspended, cancelled

  @ManyToOne(() => Coupon, { nullable: true })
  couponUsed: Coupon;

  @Column({ default: false })
  isGroupDiscount: boolean;

  @Column({ nullable: true })
  groupAdmissionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
