import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

/**
 * Audit Log Entity
 * Stores every critical action in the system.
 * Never log: passwords, JWTs, refresh tokens, OTPs.
 * 
 * Tracks: Login, Logout, Payment, Student Delete/Update, Seat Change,
 *         Expense, Role Change, Permission Change, etc.
 */
@Entity('audit_logs')
@Index(['tenantId', 'createdAt']) // Fast queries per tenant
@Index(['entity', 'entityId'])   // Fast queries per record
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // What entity was affected
  @Column()
  entity: string; // e.g., 'Student', 'Payment', 'Seat', 'User', 'Role'

  @Column()
  entityId: string; // UUID of the affected record

  @Column()
  action: string; // e.g., 'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'PAYMENT_COLLECTED', 'SEAT_CHANGED', 'ROLE_CHANGED'

  // Before/after state — for UPDATE and DELETE
  @Column({ type: 'jsonb', nullable: true })
  oldValues: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  newValues: Record<string, any> | null;

  // Who performed the action
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  performedBy: User | null;

  @Column({ nullable: true })
  performedById: string | null;

  @Column({ nullable: true })
  performedByName: string | null;

  @Column({ nullable: true })
  performedByRole: string | null;

  // Multi-tenant context
  @Column({ nullable: true })
  tenantId: string | null;

  @Column({ nullable: true })
  branchId: string | null;

  // Request context — for forensics
  @Column({ nullable: true })
  ipAddress: string | null;

  @Column({ nullable: true })
  userAgent: string | null; // browser/device info

  @Column({ nullable: true })
  browser: string | null; // parsed browser name

  // Timestamp
  @CreateDateColumn()
  createdAt: Date;
}
