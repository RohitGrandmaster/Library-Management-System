import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Branch } from '../../branches/entities/branch.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  // ── RBAC / Multi-Tenant ─────────────────────────────
  @Column({ nullable: true })
  tenantId: string; // UUID of tenant — mandatory for non-superadmin

  @ManyToOne(() => Branch, (branch) => branch.users, { nullable: true })
  branch: Branch;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  // ── Authentication Security Fields ───────────────────
  @Column({ nullable: true, select: false })
  refreshTokenHash: string | null; // bcrypt hash of the refresh token stored in DB

  @Column({ default: 0 })
  failedLoginAttempts: number; // increments on wrong password

  @Column({ nullable: true })
  lockUntil: Date | null; // account locked until this time (after 5 failed attempts)

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  lastLoginIp: string;

  // ── Soft Delete (never hard-delete) ──────────────────
  @DeleteDateColumn()
  deletedAt: Date | null; // TypeORM soft delete — sets this field instead of DELETE

  @Column({ nullable: true })
  deletedBy: string; // userId of who performed the delete

  // ── Timestamps ───────────────────────────────────────
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
