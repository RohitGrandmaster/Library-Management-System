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
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Branch)
  branch: Branch;

  @Column()
  name: string; // AC, Fan, Projector

  @Column('int')
  quantity: number;

  @Column({ nullable: true })
  purchaseDate: Date;

  @Column({ default: 'working' })
  status: string; // working, maintenance, broken

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
