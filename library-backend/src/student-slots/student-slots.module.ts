import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentSlotsService } from './student-slots.service';
import { StudentSlotsController } from './student-slots.controller';
import { StudentSlot } from './entities/student-slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentSlot])],
  providers: [StudentSlotsService],
  controllers: [StudentSlotsController]
})
export class StudentSlotsModule {}
