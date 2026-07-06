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
export class WhatsAppTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Branch)
  branch: Branch;

  @Column()
  templateType: string; // welcome, fee_reminder, renewal_alert, receipt, notice, absentee_alert, ptp_reminder

  @Column('text')
  messageBody: string; // e.g. "Hi {name}, your fee of ₹{amount} is due on {duedate}."

  @Column({ type: 'jsonb', default: [] })
  variables: string[]; // ['name', 'amount', 'duedate', 'planname', 'libraryname', 'phone', 'seat']

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User)
  updatedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
