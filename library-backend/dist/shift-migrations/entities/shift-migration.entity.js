"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftMigration = void 0;
const typeorm_1 = require("typeorm");
const student_entity_1 = require("../../students/entities/student.entity");
const shift_entity_1 = require("../../shifts/entities/shift.entity");
const seat_entity_1 = require("../../seats/entities/seat.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let ShiftMigration = class ShiftMigration {
    id;
    student;
    fromShift;
    toShift;
    fromSeat;
    toSeat;
    feeAdjustment;
    processedBy;
    migratedAt;
    updatedAt;
};
exports.ShiftMigration = ShiftMigration;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ShiftMigration.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.Student),
    __metadata("design:type", student_entity_1.Student)
], ShiftMigration.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shift_entity_1.Shift),
    __metadata("design:type", shift_entity_1.Shift)
], ShiftMigration.prototype, "fromShift", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shift_entity_1.Shift),
    __metadata("design:type", shift_entity_1.Shift)
], ShiftMigration.prototype, "toShift", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => seat_entity_1.Seat, { nullable: true }),
    __metadata("design:type", seat_entity_1.Seat)
], ShiftMigration.prototype, "fromSeat", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => seat_entity_1.Seat, { nullable: true }),
    __metadata("design:type", seat_entity_1.Seat)
], ShiftMigration.prototype, "toSeat", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ShiftMigration.prototype, "feeAdjustment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], ShiftMigration.prototype, "processedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ShiftMigration.prototype, "migratedAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ShiftMigration.prototype, "updatedAt", void 0);
exports.ShiftMigration = ShiftMigration = __decorate([
    (0, typeorm_1.Entity)()
], ShiftMigration);
//# sourceMappingURL=shift-migration.entity.js.map