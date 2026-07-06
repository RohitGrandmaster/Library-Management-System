import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Check if the requested branchId (e.g. in body or query or param) matches the user's branchId
    // Superadmin bypasses this check.
    if (user && user.role === 'superadmin') {
      return true;
    }

    const requestedBranchId = request.body.branchId || request.query.branchId || request.params.branchId;
    
    if (requestedBranchId && user.branchId !== requestedBranchId) {
      throw new ForbiddenException('You do not have access to this branch.');
    }

    return true;
  }
}
