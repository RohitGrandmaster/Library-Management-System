import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Shift } from '../../shifts/entities/shift.entity';
import { Seat } from '../../seats/entities/seat.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class ShiftMigration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => Shift)
  fromShift: Shift;

  @ManyToOne(() => Shift)
  toShift: Shift;

  @ManyToOne(() => Seat, { nullable: true })
  fromSeat: Seat;

  @ManyToOne(() => Seat, { nullable: true })
  toSeat: Seat;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  feeAdjustment: number; // positive = student pays more, negative = refund

  @ManyToOne(() => User)
  processedBy: User;

  @CreateDateColumn()
  migratedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
