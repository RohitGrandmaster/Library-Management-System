import { Controller, Get, Req, UseGuards, Param } from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @Roles('superadmin', 'admin', 'manager')
  async getAllStudents(@Req() req: any) {
    // If user is a manager, req.user.branchId is set.
    return this.studentsService.findAll(req.user.branchId);
  }

  @Get(':id')
  @Roles('superadmin', 'admin', 'manager')
  async getStudentById(@Param('id') id: string, @Req() req: any) {
    return this.studentsService.findOne(id, req.user?.branchId);
  }
}
