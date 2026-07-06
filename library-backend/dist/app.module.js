"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_pino_1 = require("nestjs-pino");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const branches_module_1 = require("./branches/branches.module");
const tenants_module_1 = require("./tenants/tenants.module");
const roles_module_1 = require("./roles/roles.module");
const permissions_module_1 = require("./permissions/permissions.module");
const students_module_1 = require("./students/students.module");
const shifts_module_1 = require("./shifts/shifts.module");
const seats_module_1 = require("./seats/seats.module");
const student_slots_module_1 = require("./student-slots/student-slots.module");
const plans_module_1 = require("./plans/plans.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const payments_module_1 = require("./payments/payments.module");
const expenses_module_1 = require("./expenses/expenses.module");
const attendance_module_1 = require("./attendance/attendance.module");
const seeder_module_1 = require("./seeder/seeder.module");
const complaints_module_1 = require("./complaints/complaints.module");
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
const superadmin_module_1 = require("./superadmin/superadmin.module");
const admin_module_1 = require("./admin/admin.module");
const coupons_module_1 = require("./coupons/coupons.module");
const lockers_module_1 = require("./lockers/lockers.module");
const manager_module_1 = require("./manager/manager.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USER'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    autoLoadEntities: true,
                    synchronize: true,
                }),
                inject: [config_1.ConfigService],
            }),
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    transport: {
                        target: 'pino-pretty',
                        options: {
                            singleLine: true,
                        },
                    },
                },
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            branches_module_1.BranchesModule,
            tenants_module_1.TenantsModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            students_module_1.StudentsModule,
            shifts_module_1.ShiftsModule,
            seats_module_1.SeatsModule,
            student_slots_module_1.StudentSlotsModule,
            plans_module_1.PlansModule,
            subscriptions_module_1.SubscriptionsModule,
            payments_module_1.PaymentsModule,
            expenses_module_1.ExpensesModule,
            attendance_module_1.AttendanceModule,
            seeder_module_1.SeederModule,
            complaints_module_1.ComplaintsModule,
            audit_logs_module_1.AuditLogsModule,
            superadmin_module_1.SuperadminModule,
            admin_module_1.AdminModule,
            coupons_module_1.CouponsModule,
            lockers_module_1.LockersModule,
            manager_module_1.ManagerModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map