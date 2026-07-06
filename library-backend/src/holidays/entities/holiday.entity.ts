import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Branch } from '../../branches/entities/branch.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
@Unique(['branch', 'date'])
export class Holiday {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Branch)
  branch: Branch;

  @Column('date')
  date: Date;

  @Column()
  name: string; // "Holi", "Diwali", "Republic Day", "Library Maintenance Day"

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isRecurringYearly: boolean; // true = har saal same date par repeat hoga

  @ManyToOne(() => User)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
