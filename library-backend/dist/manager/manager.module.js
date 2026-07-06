"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const manager_service_1 = require("./manager.service");
const manager_controller_1 = require("./manager.controller");
const student_entity_1 = require("../students/entities/student.entity");
const seat_entity_1 = require("../seats/entities/seat.entity");
const subscription_entity_1 = require("../subscriptions/entities/subscription.entity");
let ManagerModule = class ManagerModule {
};
exports.ManagerModule = ManagerModule;
exports.ManagerModule = ManagerModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([student_entity_1.Student, seat_entity_1.Seat, subscription_entity_1.Subscription])],
        providers: [manager_service_1.ManagerService],
        controllers: [manager_controller_1.ManagerController]
    })
], ManagerModule);
//# sourceMappingURL=manager.module.js.map