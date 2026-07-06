import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Branch } from '../../branches/entities/branch.entity';

@Entity()
export class Locker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lockerNumber: string;

  @ManyToOne(() => Branch)
  branch: Branch;

  @Column({ default: 'working' })
  status: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
