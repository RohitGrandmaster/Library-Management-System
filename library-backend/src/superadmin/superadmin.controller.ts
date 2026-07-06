import { Controller, Get } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';

@Controller('api/superadmin')
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) {}

  @Get('dashboard')
  async getDashboard() {
    return await this.superadminService.getDashboardData();
  }
}
