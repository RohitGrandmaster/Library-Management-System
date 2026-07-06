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
exports.ManagerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_entity_1 = require("../students/entities/student.entity");
const seat_entity_1 = require("../seats/entities/seat.entity");
const subscription_entity_1 = require("../subscriptions/entities/subscription.entity");
let ManagerService = class ManagerService {
    studentRepo;
    seatRepo;
    subRepo;
    constructor(studentRepo, seatRepo, subRepo) {
        this.studentRepo = studentRepo;
        this.seatRepo = seatRepo;
        this.subRepo = subRepo;
    }
    async getDashboardData(branchId) {
        const totalStudents = await this.studentRepo.count({
            where: branchId ? { branch: { id: branchId } } : {},
        });
        const attendancePercentage = '85%';
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const expiringSubs = await this.subRepo.count({
            where: {
                endDate: (0, typeorm_2.Between)(new Date(), nextWeek),
                ...(branchId ? { student: { branch: { id: branchId } } } : {})
            },
        });
        const kpiData = [
            { title: 'Active Students Today', value: totalStudents.toString(), icon: 'Users', iconClass: 'mgr-kpi-icon--primary', trend: '↑' },
            { title: "Today's Attendance", value: attendancePercentage, icon: 'CalendarCheck', iconClass: 'mgr-kpi-icon--success', trend: '' },
            { title: 'Pending Enquiries', value: '0', icon: 'Phone', iconClass: 'mgr-kpi-icon--info', trend: '0 new today' },
            { title: 'Seats / Lockers Expiring (7 days)', value: expiringSubs.toString(), icon: 'Armchair', iconClass: 'mgr-kpi-icon--warning', trend: '' },
        ];
        const seats = await this.seatRepo.find({
            where: branchId ? { branch: { id: branchId } } : {},
            take: 40,
        });
        const seatData = seats.map((seat, idx) => ({
            id: seat.seatNumber,
            status: idx % 3 === 0 ? 'available' : (idx % 7 === 0 ? 'expiring' : 'occupied'),
        }));
        for (let i = seatData.length; i < 40; i++) {
            seatData.push({ id: `X-${i + 1}`, status: 'available' });
        }
        const actionItems = [
            { title: 'New Enquiries', count: 0, countClass: 'mgr-action-count', href: '/crm/enquiries', showRenew: false },
            { title: 'Follow-ups Due Today', count: 0, countClass: 'mgr-action-count', href: '#', showRenew: false },
            { title: 'Open Complaints', count: 0, countClass: 'mgr-action-count--warning', href: '/communication/complaints', showRenew: false },
            { title: 'Payment Promises Due Today', count: 0, countClass: 'mgr-action-count--warning', href: '/finance/payment-promises', showRenew: false },
            { title: 'Maintenance / Broken Assets', count: 0, countClass: 'mgr-action-count--danger', href: '/asset-maintenance', showRenew: false },
            { title: 'Expiring Subscriptions', count: expiringSubs, countClass: 'mgr-action-count--warning', href: '/finance/subscriptions', showRenew: true },
        ];
        const recentStudents = await this.studentRepo.find({
            where: branchId ? { branch: { id: branchId } } : {},
            order: { joinDate: 'DESC' },
            take: 5,
        });
        const recentAdmissions = recentStudents.map(s => ({
            id: s.id,
            name: s.name,
            smartId: s.id.substring(0, 8),
            shift: 'Morning',
        }));
        return {
            kpiData,
            seatData,
            actionItems,
            recentAdmissions,
            recentEnquiries: [],
        };
    }
};
exports.ManagerService = ManagerService;
exports.ManagerService = ManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(1, (0, typeorm_1.InjectRepository)(seat_entity_1.Seat)),
    __param(2, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ManagerService);
//# sourceMappingURL=manager.service.js.map