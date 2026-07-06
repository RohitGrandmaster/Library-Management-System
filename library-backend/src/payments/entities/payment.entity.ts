import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => Subscription, { nullable: true })
  subscription: Subscription;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'cash' })
  mode: string; // cash, upi, card, bank_transfer

  @Column({ nullable: true })
  transactionId: string;

  @Column({ nullable: true })
  lateFee: number;

  @Column({ nullable: true })
  remark: string;

  @ManyToOne(() => User)
  receivedBy: User;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  paymentDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
