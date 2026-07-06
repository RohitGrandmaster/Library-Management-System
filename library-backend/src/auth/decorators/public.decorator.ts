import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * @Public() decorator
 * Mark a route as publicly accessible — skips JwtAuthGuard.
 * Usage: @Public() on any controller method.
 * Example: @Public() @Get('health') getHealth() { ... }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
