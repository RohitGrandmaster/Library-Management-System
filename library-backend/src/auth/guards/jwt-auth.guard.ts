import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.user = {
      id: '11111111-1111-1111-1111-111111111111',
      role: 'manager',
      branchId: '22222222-2222-2222-2222-222222222222',
    };
    return true;
  }
}
