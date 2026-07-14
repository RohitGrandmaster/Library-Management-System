import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SuperadminService } from './superadmin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

/**
 * Superadmin Controller
 *
 * RBAC: Superadmin ONLY — no admin, no manager.
 * Zero Trust: Backend verifies role from JWT — frontend role claims are ignored.
 * Any unauthorized access returns 401/403 — not a redirect to a login page from backend.
 */
@ApiTags('Superadmin')
@ApiBearerAuth()
@Controller('superadmin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('superadmin')
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Superadmin dashboard KPIs and system overview' })
  async getDashboard() {
    return await this.superadminService.getDashboardData();
  }
}
