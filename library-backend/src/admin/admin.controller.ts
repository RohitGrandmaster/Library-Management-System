import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';

/**
 * Admin Controller
 *
 * RBAC: Admin and Superadmin only.
 * Tenant Isolation: TenantGuard ensures admin can only access their own tenant's data.
 * Zero Trust: Backend verifies role + tenantId from JWT every request.
 */
@ApiTags('Admin')
@ApiBearerAuth()
@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles('superadmin', 'admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Admin dashboard data (admin + superadmin only)' })
  async getDashboardData() {
    return this.adminService.getDashboardData();
  }

  @Get('reports')
  @ApiOperation({ summary: 'Admin reports data (admin + superadmin only)' })
  async getReportsData() {
    return this.adminService.getReportsData();
  }
}
