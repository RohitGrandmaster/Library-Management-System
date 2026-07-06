import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Branch } from '../../branches/entities/branch.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class DailySettlement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Branch)
  branch: Branch;

  @Column('date')
  settlementDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  totalCashCollected: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalUPICollected: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalCardCollected: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalExpenses: number;

  @Column('decimal', { precision: 10, scale: 2 })
  netProfit: number;

  @ManyToOne(() => User)
  closedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
