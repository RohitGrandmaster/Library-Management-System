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
@Controller('admin')
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

  @Get('audit-logs')
  async getAuditLogs() { return this.adminService.getEmptyArray(); }

  @Get('blacklist')
  async getBlacklist() { return this.adminService.getEmptyArray(); }

  @Get('branches')
  async getBranches() { return this.adminService.getEmptyArray(); }

  @Get('coupons')
  async getCoupons() { return this.adminService.getEmptyArray(); }

  @Get('expense-categories')
  async getExpenseCategories() { return this.adminService.getEmptyArray(); }

  @Get('expenses')
  async getExpenses() { return this.adminService.getEmptyArray(); }

  @Get('permissions')
  async getPermissions() { return this.adminService.getEmptyArray(); }

  @Get('plans')
  async getPlans() { return this.adminService.getEmptyArray(); }

  @Get('staff-users')
  async getStaffUsers() { return this.adminService.getEmptyArray(); }

  @Get('students')
  async getStudents() { return this.adminService.getEmptyArray(); }
}
