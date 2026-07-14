import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Branch } from '../branches/entities/branch.entity';
import { User } from '../users/entities/user.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { Seat } from '../seats/entities/seat.entity';
import { Plan } from '../plans/entities/plan.entity';
import { Student } from '../students/entities/student.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { StudentSlot } from '../student-slots/entities/student-slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, Tenant, Branch, User, Shift, Seat, Plan, Student, Subscription, Payment, Expense, StudentSlot])],
  controllers: [SeederController],
  providers: [SeederService],
})
export class SeederModule {}
