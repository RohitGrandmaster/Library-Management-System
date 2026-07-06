import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locker } from './entities/locker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Locker])],
  providers: []
})
export class LockersModule {}
