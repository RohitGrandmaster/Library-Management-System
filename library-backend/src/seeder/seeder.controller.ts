import { Controller, Post } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('seed')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('core')
  async seedCore() {
    return await this.seederService.seedCoreData();
  }

  @Post('admin')
  async seedAdmin() {
    return await this.seederService.seedAdminData();
  }
}
