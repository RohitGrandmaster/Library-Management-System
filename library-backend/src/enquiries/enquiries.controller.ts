import { Controller, Get, Param, Patch, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EnquiriesService } from './enquiries.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('CRM Enquiries')
@ApiBearerAuth()
@Controller('crm/enquiries')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all CRM enquiries' })
  async findAll() {
    return this.enquiriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single CRM enquiry by ID' })
  async findOne(@Param('id') id: string) {
    return this.enquiriesService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update status of an enquiry' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('reason') reason?: string,
  ) {
    return this.enquiriesService.updateStatus(id, status, reason);
  }

  @Post(':id/follow-ups')
  @ApiOperation({ summary: 'Add a follow-up to an enquiry' })
  async addFollowUp(
    @Param('id') id: string,
    @Body() followUp: { date: Date; remark: string; by: string },
  ) {
    return this.enquiriesService.addFollowUp(id, followUp);
  }
}
