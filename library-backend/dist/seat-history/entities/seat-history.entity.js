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
exports.SeatHistory = void 0;
const typeorm_1 = require("typeorm");
const seat_entity_1 = require("../../seats/entities/seat.entity");
const student_entity_1 = require("../../students/entities/student.entity");
const shift_entity_1 = require("../../shifts/entities/shift.entity");
let SeatHistory = class SeatHistory {
    id;
    seat;
    student;
    shift;
    occupiedFrom;
    occupiedTill;
    reason;
    createdAt;
    updatedAt;
};
exports.SeatHistory = SeatHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SeatHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => seat_entity_1.Seat),
    __metadata("design:type", seat_entity_1.Seat)
], SeatHistory.prototype, "seat", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.Student),
    __metadata("design:type", student_entity_1.Student)
], SeatHistory.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shift_entity_1.Shift, { nullable: true }),
    __metadata("design:type", shift_entity_1.Shift)
], SeatHistory.prototype, "shift", void 0);
__decorate([
    (0, typeorm_1.Column)('date'),
    __metadata("design:type", Date)
], SeatHistory.prototype, "occupiedFrom", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { nullable: true }),
    __metadata("design:type", Date)
], SeatHistory.prototype, "occupiedTill", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SeatHistory.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SeatHistory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SeatHistory.prototype, "updatedAt", void 0);
exports.SeatHistory = SeatHistory = __decorate([
    (0, typeorm_1.Entity)()
], SeatHistory);
//# sourceMappingURL=seat-history.entity.js.map