import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ManagerService } from './manager.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

/**
 * Manager Controller
 *
 * RBAC: Manager, Admin, Superadmin.
 * Branch Isolation: Manager can ONLY see their own branch data.
 *   - branchId is taken from JWT payload (set at login) — NOT from request body.
 *   - A manager cannot view Branch B data even if they manually send branchId in the request.
 * Zero Trust: TenantGuard verifies both tenantId and branchId from JWT.
 */
@ApiTags('Manager')
@ApiBearerAuth()
@Controller('manager')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles('manager', 'admin', 'superadmin')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Manager dashboard (branch-scoped data only)' })
  async getDashboard(@CurrentUser() user: any) {
    // branchId comes from the JWT token — NOT from request body/query
    // This prevents a manager from accessing another branch's data
    return this.managerService.getDashboardData(user.branchId);
  }

  @Get('reports')
  @ApiOperation({ summary: 'Manager reports' })
  async getReports() {
    return this.managerService.getReportsData();
  }

  @Get('student-reports')
  @ApiOperation({ summary: 'Student reports' })
  async getStudentReports() {
    return this.managerService.getStudentReportsData();
  }
}
