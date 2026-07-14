import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BranchesModule } from './branches/branches.module';
import { TenantsModule } from './tenants/tenants.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { StudentsModule } from './students/students.module';
import { ShiftsModule } from './shifts/shifts.module';
import { SeatsModule } from './seats/seats.module';
import { StudentSlotsModule } from './student-slots/student-slots.module';
import { PlansModule } from './plans/plans.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PaymentsModule } from './payments/payments.module';
import { ExpensesModule } from './expenses/expenses.module';
import { AttendanceModule } from './attendance/attendance.module';
import { SeederModule } from './seeder/seeder.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { SuperadminModule } from './superadmin/superadmin.module';
import { AdminModule } from './admin/admin.module';
import { CouponsModule } from './coupons/coupons.module';
import { LockersModule } from './lockers/lockers.module';
import { ManagerModule } from './manager/manager.module';
import { EnquiriesModule } from './enquiries/enquiries.module';

@Module({
  imports: [
    // ── Config ─────────────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ── Rate Limiting (Global) ──────────────────────────────────────────────────
    // Login endpoint has extra throttling via @Throttle decorator (5/min)
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,    // 1 minute
        limit: 60,     // 60 requests per minute for general APIs
      },
      {
        name: 'medium',
        ttl: 900000,   // 15 minutes
        limit: 300,    // 300 requests per 15 minutes
      },
    ]),

    // ── Database ───────────────────────────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        // IMPORTANT: synchronize: false in production — use migrations
        // Set TYPEORM_SYNC=true in .env ONLY for development
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        ssl: configService.get<string>('NODE_ENV') === 'production'
          ? { rejectUnauthorized: false }
          : false,
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // ── Logging (Pino) ─────────────────────────────────────────────────────────
    LoggerModule.forRoot({
      pinoHttp: {
        // Never log sensitive request/response fields
        redact: ['req.headers.authorization', 'req.body.password', 'req.body.token'],
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined,
      },
    }),

    // ── Feature Modules ────────────────────────────────────────────────────────
    AuthModule,
    UsersModule,
    BranchesModule,
    TenantsModule,
    RolesModule,
    PermissionsModule,
    StudentsModule,
    ShiftsModule,
    SeatsModule,
    StudentSlotsModule,
    PlansModule,
    SubscriptionsModule,
    PaymentsModule,
    ExpensesModule,
    AttendanceModule,
    SeederModule,
    ComplaintsModule,
    AuditLogsModule,
    SuperadminModule,
    AdminModule,
    CouponsModule,
    LockersModule,
    ManagerModule,
    EnquiriesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply ThrottlerGuard globally — every route is rate limited
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
