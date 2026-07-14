import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { Student } from '../students/entities/student.entity';
import { Seat } from '../seats/entities/seat.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Enquiry } from '../enquiries/entities/enquiry.entity';
import { Complaint } from '../complaints/entities/complaint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Seat, Subscription, Enquiry, Complaint])],
  providers: [ManagerService],
  controllers: [ManagerController]
})
export class ManagerModule {}
