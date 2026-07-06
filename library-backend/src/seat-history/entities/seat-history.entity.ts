import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Seat } from '../../seats/entities/seat.entity';
import { Student } from '../../students/entities/student.entity';
import { Shift } from '../../shifts/entities/shift.entity';

@Entity()
export class SeatHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Seat)
  seat: Seat;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => Shift, { nullable: true })
  shift: Shift;

  @Column('date')
  occupiedFrom: Date;

  @Column('date', { nullable: true })
  occupiedTill: Date;

  @Column({ nullable: true })
  reason: string; // admission, shift_change, seat_change

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
