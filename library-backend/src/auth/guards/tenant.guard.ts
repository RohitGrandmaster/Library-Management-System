import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

/**
 * Tenant Guard — Multi-Tenant Isolation
 *
 * Zero Trust Principle: Never trust data from the frontend.
 * The tenant and branch context comes from the verified JWT payload ONLY.
 *
 * Rules:
 * - Superadmin: full access to all tenants
 * - Admin: can only access their own tenant's data
 * - Manager: can only access their own branch's data (subset of admin)
 *
 * If a request tries to access a different tenant's branchId → 403 Forbidden.
 * One library can NEVER see another library's data.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // Superadmin has full cross-tenant access
    if (user.role === 'superadmin') {
      return true;
    }

    // Extract requested tenantId from request (body, query, or params)
    const requestedTenantId =
      request.body?.tenantId ||
      request.query?.tenantId ||
      request.params?.tenantId;

    // If a tenantId is specified in request, it must match the user's tenantId from JWT
    if (requestedTenantId && user.tenantId && requestedTenantId !== user.tenantId) {
      throw new ForbiddenException(
        'Cross-tenant access denied. You can only access your own library data.',
      );
    }

    // For manager role — also enforce branch isolation
    const requestedBranchId =
      request.body?.branchId ||
      request.query?.branchId ||
      request.params?.branchId;

    if (user.role === 'manager' && requestedBranchId && user.branchId) {
      if (requestedBranchId !== user.branchId) {
        throw new ForbiddenException(
          'Branch access denied. You can only access your assigned branch data.',
        );
      }
    }

    return true;
  }
}
