import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Student } from '../../students/entities/student.entity';

@Entity()
export class Enquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  preferredShift: string;

  @Column({ default: 'new' })
  status: string; // new, visited, interested, converted, lost

  @Column({ type: 'jsonb', default: [] })
  followUps: { date: Date; remark: string; by: string }[];

  @ManyToOne(() => User)
  handledBy: User;

  @ManyToOne(() => Student, { nullable: true })
  convertedToStudent: Student;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
