"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const seeder_service_1 = require("./seeder.service");
const seeder_controller_1 = require("./seeder.controller");
const role_entity_1 = require("../roles/entities/role.entity");
const permission_entity_1 = require("../permissions/entities/permission.entity");
const tenant_entity_1 = require("../tenants/entities/tenant.entity");
const branch_entity_1 = require("../branches/entities/branch.entity");
const user_entity_1 = require("../users/entities/user.entity");
const shift_entity_1 = require("../shifts/entities/shift.entity");
const seat_entity_1 = require("../seats/entities/seat.entity");
const plan_entity_1 = require("../plans/entities/plan.entity");
const student_entity_1 = require("../students/entities/student.entity");
const subscription_entity_1 = require("../subscriptions/entities/subscription.entity");
const payment_entity_1 = require("../payments/entities/payment.entity");
const expense_entity_1 = require("../expenses/entities/expense.entity");
let SeederModule = class SeederModule {
};
exports.SeederModule = SeederModule;
exports.SeederModule = SeederModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([role_entity_1.Role, permission_entity_1.Permission, tenant_entity_1.Tenant, branch_entity_1.Branch, user_entity_1.User, shift_entity_1.Shift, seat_entity_1.Seat, plan_entity_1.Plan, student_entity_1.Student, subscription_entity_1.Subscription, payment_entity_1.Payment, expense_entity_1.Expense])],
        controllers: [seeder_controller_1.SeederController],
        providers: [seeder_service_1.SeederService],
    })
], SeederModule);
//# sourceMappingURL=seeder.module.js.map