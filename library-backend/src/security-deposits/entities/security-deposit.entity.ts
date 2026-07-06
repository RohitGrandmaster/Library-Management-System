import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class SecurityDeposit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student)
  student: Student;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'held' })
  status: string; // held, refunded, forfeited

  @Column({ nullable: true })
  refundDate: Date;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  deductionAmount: number; // If damages etc.

  @Column({ nullable: true })
  deductionReason: string;

  @ManyToOne(() => User)
  collectedBy: User;

  @ManyToOne(() => User, { nullable: true })
  refundedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
