import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

/**
 * JWT Access Token Strategy
 * - Extracts JWT from Authorization: Bearer <token>
 * - Verifies signature using JWT_SECRET (no fallback — will throw if not set)
 * - Validates user is still active and not locked
 * - Attaches full user context (userId, role, tenantId, branchId) to request
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET env variable is not set! Refusing to start.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated. Contact support.');
    }
    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new UnauthorizedException(
        `Account is temporarily locked until ${user.lockUntil.toISOString()}. Too many failed login attempts.`,
      );
    }
    return {
      userId: payload.sub,
      phone: payload.phone,
      role: payload.role,
      tenantId: payload.tenantId,
      branchId: payload.branchId,
      name: payload.name,
    };
  }
}
