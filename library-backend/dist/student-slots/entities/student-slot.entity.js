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
exports.StudentSlot = void 0;
const typeorm_1 = require("typeorm");
const student_entity_1 = require("../../students/entities/student.entity");
const shift_entity_1 = require("../../shifts/entities/shift.entity");
const seat_entity_1 = require("../../seats/entities/seat.entity");
const locker_entity_1 = require("../../lockers/entities/locker.entity");
let StudentSlot = class StudentSlot {
    id;
    student;
    shift;
    customSlots;
    seat;
    locker;
    validFrom;
    validTill;
    isActive;
    createdAt;
    updatedAt;
};
exports.StudentSlot = StudentSlot;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StudentSlot.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.Student, (student) => student.slots, { onDelete: 'CASCADE' }),
    __metadata("design:type", student_entity_1.Student)
], StudentSlot.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shift_entity_1.Shift, { nullable: true }),
    __metadata("design:type", shift_entity_1.Shift)
], StudentSlot.prototype, "shift", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], StudentSlot.prototype, "customSlots", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => seat_entity_1.Seat, { nullable: true }),
    __metadata("design:type", seat_entity_1.Seat)
], StudentSlot.prototype, "seat", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => locker_entity_1.Locker, { nullable: true }),
    __metadata("design:type", locker_entity_1.Locker)
], StudentSlot.prototype, "locker", void 0);
__decorate([
    (0, typeorm_1.Column)('date'),
    __metadata("design:type", Date)
], StudentSlot.prototype, "validFrom", void 0);
__decorate([
    (0, typeorm_1.Column)('date'),
    __metadata("design:type", Date)
], StudentSlot.prototype, "validTill", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], StudentSlot.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StudentSlot.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], StudentSlot.prototype, "updatedAt", void 0);
exports.StudentSlot = StudentSlot = __decorate([
    (0, typeorm_1.Entity)()
], StudentSlot);
//# sourceMappingURL=student-slot.entity.js.map