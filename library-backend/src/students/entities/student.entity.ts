import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { Branch } from '../../branches/entities/branch.entity';
import { StudentSlot } from '../../student-slots/entities/student-slot.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

@Entity()
@Unique(['branch', 'smartId'])
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  smartId: string; // LIB001, LIB002

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  parentPhone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  college: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  documents: { aadhar?: string; idProof?: string; photo?: string };

  @Column({ default: 'active' })
  status: string; // active, suspended, exited, blacklisted

  @Column('date', { nullable: true })
  exitDate: Date;

  @Column({ default: 0 })
  commitmentReliabilityScore: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  referralBonusBalance: number;

  @Column({ default: false })
  isAlumni: boolean;

  @ManyToOne(() => Branch)
  branch: Branch;

  @ManyToOne(() => Student, { nullable: true })
  referredBy: Student;

  @OneToMany(() => StudentSlot, (slot) => slot.student)
  slots: StudentSlot[];

  @OneToMany(() => Student, (student) => student.referredBy)
  referrals: Student[];

  @OneToMany(() => Subscription, (subscription) => subscription.student)
  subscriptions: Subscription[];

  @CreateDateColumn()
  joinDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
