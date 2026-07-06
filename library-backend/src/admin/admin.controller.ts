import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @Roles('superadmin', 'admin')
  async getDashboardData() {
    return this.adminService.getDashboardData();
  }

  @Get('reports')
  @Roles('superadmin', 'admin')
  async getReportsData() {
    return this.adminService.getReportsData();
  }
}
