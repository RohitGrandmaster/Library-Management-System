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
export class BulkImport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Branch)
  branch: Branch;

  @Column()
  entityType: string; // student, seat, locker, etc.

  @Column()
  fileName: string;

  @Column('int')
  totalRows: number;

  @Column('int')
  successCount: number;

  @Column('int')
  failureCount: number;

  @Column({ type: 'jsonb', default: [] })
  errors: { row: number; error: string }[];

  @ManyToOne(() => User)
  uploadedBy: User;

  @CreateDateColumn()
  uploadedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
