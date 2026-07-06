import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/manager')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Get('dashboard')
  @Roles('manager')
  async getDashboard(@Req() req: any) {
    // req.user has { userId, role, tenantId, branchId }
    // If manager is assigned to a branch, we use branchId
    return this.managerService.getDashboardData(req.user.branchId);
  }
}
