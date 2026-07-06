import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Refresh Token Guard
 * Uses the 'jwt-refresh' Passport strategy.
 * Applied on the POST /auth/refresh endpoint only.
 */
@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {}
