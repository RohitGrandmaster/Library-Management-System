import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

export interface LogActionParams {
  entity: string;
  entityId: string;
  action: string;
  oldValues?: Record<string, any> | null;
  newValues?: Record<string, any> | null;
  performedById?: string;
  performedByName?: string;
  performedByRole?: string;
  tenantId?: string;
  branchId?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Audit Logs Service
 * 
 * IMPORTANT: Never log sensitive data:
 * - Passwords (plaintext or hashed)
 * - JWT access tokens
 * - Refresh tokens
 * - OTP codes
 * - Raw Aadhaar / PAN numbers
 */
@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepo: Repository<AuditLog>,
  ) {}

  /**
   * Log any significant action in the system.
   * Call this from services after performing the action.
   */
  async log(params: LogActionParams): Promise<void> {
    try {
      // Sanitize old/new values — remove any sensitive fields before storing
      const sanitized = {
        oldValues: this.sanitize(params.oldValues),
        newValues: this.sanitize(params.newValues),
      };

      const browser = this.parseBrowser(params.userAgent);

      const log = this.auditLogRepo.create({
        entity: params.entity,
        entityId: params.entityId,
        action: params.action,
        oldValues: sanitized.oldValues,
        newValues: sanitized.newValues,
        performedById: params.performedById,
        performedByName: params.performedByName,
        performedByRole: params.performedByRole,
        tenantId: params.tenantId,
        branchId: params.branchId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent ? params.userAgent.substring(0, 500) : null,
        browser,
      });

      await this.auditLogRepo.save(log);
    } catch (error) {
      // Audit log failure should NOT break the main operation
      console.error('Failed to write audit log:', error?.message);
    }
  }

  /**
   * Get paginated audit logs — superadmin only
   */
  async findAll(
    page = 1,
    limit = 50,
    tenantId?: string,
    entity?: string,
    action?: string,
  ) {
    const query = this.auditLogRepo.createQueryBuilder('log')
      .orderBy('log.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (tenantId) query.andWhere('log.tenantId = :tenantId', { tenantId });
    if (entity)   query.andWhere('log.entity = :entity', { entity });
    if (action)   query.andWhere('log.action = :action', { action });

    const [logs, total] = await query.getManyAndCount();

    return {
      data: logs,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  /** Remove sensitive fields from stored data */
  private sanitize(obj: Record<string, any> | null | undefined): Record<string, any> | null {
    if (!obj) return null;
    const SENSITIVE_KEYS = [
      'password', 'passwordHash', 'refreshToken', 'refreshTokenHash',
      'accessToken', 'token', 'otp', 'pin', 'secret', 'cvv', 'aadhaar', 'pan',
    ];
    const sanitized = { ...obj };
    for (const key of SENSITIVE_KEYS) {
      if (key in sanitized) {
        sanitized[key] = '[REDACTED]';
      }
    }
    return sanitized;
  }

  /** Parse browser name from user agent string */
  private parseBrowser(userAgent?: string): string {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('Chrome'))  return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari'))  return 'Safari';
    if (userAgent.includes('Edge'))    return 'Edge';
    if (userAgent.includes('Opera'))   return 'Opera';
    return 'Other';
  }
}
