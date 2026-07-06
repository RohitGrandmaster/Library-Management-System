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
import { Locker } from '../../lockers/entities/locker.entity';

@Entity()
export class StudentSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.slots, { onDelete: 'CASCADE' })
  student: Student;

  @ManyToOne(() => Shift, { nullable: true })
  shift: Shift;

  @Column({ type: 'jsonb', default: [] })
  customSlots: { start: string; end: string; days?: string[] }[];

  @ManyToOne(() => Seat, { nullable: true })
  seat: Seat;

  @ManyToOne(() => Locker, { nullable: true })
  locker: Locker;

  @Column('date')
  validFrom: Date;

  @Column('date')
  validTill: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
