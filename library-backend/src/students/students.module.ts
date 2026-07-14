import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { Student } from './entities/student.entity';

import { Branch } from '../branches/entities/branch.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { Seat } from '../seats/entities/seat.entity';
import { Locker } from '../lockers/entities/locker.entity';
import { Plan } from '../plans/entities/plan.entity';
import { StudentSlot } from '../student-slots/entities/student-slot.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Payment } from '../payments/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Student, Branch, Shift, Seat, Locker, Plan, StudentSlot, Subscription, Payment
  ])],
  providers: [StudentsService],
  controllers: [StudentsController]
})
export class StudentsModule {}
