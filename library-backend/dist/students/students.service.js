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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_entity_1 = require("./entities/student.entity");
let StudentsService = class StudentsService {
    studentRepo;
    constructor(studentRepo) {
        this.studentRepo = studentRepo;
    }
    async findAll(branchId) {
        const students = await this.studentRepo.find({
            where: branchId ? { branch: { id: branchId } } : {},
            relations: {
                branch: true,
                subscriptions: { plan: true },
                slots: { seat: true, shift: true }
            },
            order: { joinDate: 'DESC' }
        });
        return students.map(s => {
            const activeSub = s.subscriptions?.find(sub => sub.status === 'active') || s.subscriptions?.[0];
            const activeSlot = s.slots?.[0];
            return {
                id: s.id,
                smartId: s.id.substring(0, 8).toUpperCase(),
                name: s.name,
                phone: s.phone,
                branch: s.branch?.name || 'N/A',
                shift: activeSlot?.shift?.name || 'N/A',
                seat: activeSlot?.seat?.seatNumber || 'N/A',
                plan: activeSub?.plan?.name || 'N/A',
                status: activeSub ? activeSub.status : 'Inactive',
                due: activeSub?.dueAmount || 0,
                joined: s.joinDate ? s.joinDate.toLocaleDateString('en-IN') : 'N/A',
                email: s.email,
                parentPhone: s.parentPhone,
                college: s.college,
            };
        });
    }
    async findOne(id, branchId) {
        const s = await this.studentRepo.findOne({
            where: { id, ...(branchId ? { branch: { id: branchId } } : {}) },
            relations: {
                branch: true,
                subscriptions: { plan: true },
                slots: { seat: true, shift: true }
            }
        });
        if (!s) {
            throw new common_1.NotFoundException('Student not found');
        }
        const activeSub = s.subscriptions?.find(sub => sub.status === 'active') || s.subscriptions?.[0];
        const activeSlot = s.slots?.[0];
        return {
            id: s.id,
            smartId: s.id.substring(0, 8).toUpperCase(),
            name: s.name,
            firstName: s.name.split(' ')[0] || '',
            lastName: s.name.split(' ')[1] || '',
            phone: s.phone,
            email: s.email,
            parentPhone: s.parentPhone,
            college: s.college,
            branch: s.branch?.name || 'N/A',
            shift: activeSlot?.shift?.name || 'N/A',
            seat: activeSlot?.seat?.seatNumber || 'N/A',
            plan: activeSub?.plan?.name || 'N/A',
            status: activeSub ? activeSub.status : 'Inactive',
            due: activeSub?.dueAmount || 0,
            joined: s.joinDate ? s.joinDate.toLocaleDateString('en-IN') : 'N/A',
            history: s.subscriptions?.map(sub => ({
                plan: sub.plan?.name,
                startDate: sub.startDate,
                endDate: sub.endDate,
                amount: sub.totalAmount,
                status: sub.status
            })) || [],
        };
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StudentsService);
//# sourceMappingURL=students.service.js.map