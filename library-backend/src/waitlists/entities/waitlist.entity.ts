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

@Entity()
export class Waitlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => Shift, { nullable: true })
  preferredShift: Shift;

  @Column({ type: 'jsonb', nullable: true })
  preferredSlots: { start: string; end: string }[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  addedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
