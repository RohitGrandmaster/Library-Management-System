import { Controller, Get, Post, Patch, Delete, Body, Req, UseGuards, Param } from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  async getAllStudents(@Req() req: any) {
    // Hardcode branchId for testing if req.user is missing
    const branchId = req.user?.branchId || '8a0c079e-1fca-476b-8390-58c5b8c29d08';
    return this.studentsService.findAll(branchId);
  }

  @Get(':id')
  @Roles('superadmin', 'admin', 'manager')
  async getStudentById(@Param('id') id: string, @Req() req: any) {
    return this.studentsService.findOne(id, req.user?.branchId);
  }

  @Post()
  @Roles('superadmin', 'admin', 'manager')
  async createStudent(@Body() data: any, @Req() req: any) {
    return this.studentsService.create(req.user?.branchId, data);
  }

  @Patch(':id')
  @Roles('superadmin', 'admin', 'manager')
  async updateStudent(@Param('id') id: string, @Body() data: any, @Req() req: any) {
    return this.studentsService.update(id, req.user?.branchId, data);
  }

  @Delete(':id')
  @Roles('superadmin', 'admin', 'manager')
  async deleteStudent(@Param('id') id: string, @Req() req: any) {
    return this.studentsService.remove(id, req.user?.branchId);
  }
}
