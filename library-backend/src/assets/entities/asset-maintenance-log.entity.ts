import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Asset } from './asset.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class AssetMaintenanceLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Asset)
  asset: Asset;

  @Column()
  remark: string;

  @Column('date')
  nextDueDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  cost: number;

  @Column('date')
  servicedDate: Date;

  @ManyToOne(() => User)
  servicedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
