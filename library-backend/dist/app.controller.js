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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const typeorm_1 = require("typeorm");
let AppController = class AppController {
    appService;
    dataSource;
    constructor(appService, dataSource) {
        this.appService = appService;
        this.dataSource = dataSource;
    }
    getHello() {
        return this.appService.getHello();
    }
    async getEnquiries() {
        return this.dataSource.query('SELECT * FROM enquiry ORDER BY "createdAt" DESC');
    }
    async getComplaints() {
        return this.dataSource.query('SELECT * FROM complaint ORDER BY "createdAt" DESC');
    }
    async getNotices() {
        return this.dataSource.query('SELECT * FROM notice ORDER BY "createdAt" DESC');
    }
    async getPayments() {
        const exps = await this.dataSource.query('SELECT * FROM expense ORDER BY "createdAt" DESC');
        return exps.map((e) => ({
            id: e.id, studentName: 'Mock Student', amount: e.amount, date: e.expenseDate, status: 'completed'
        }));
    }
    async getRefunds() {
        return [
            { id: '1', name: 'John', amount: 500, date: new Date(), status: 'processed' },
            { id: '2', name: 'Amit', amount: 1000, date: new Date(), status: 'pending' },
            { id: '3', name: 'Priya', amount: 200, date: new Date(), status: 'processed' },
        ];
    }
    async getSeatMatrix() {
        return this.dataSource.query('SELECT * FROM seat ORDER BY "seatNumber" ASC');
    }
    async getLockers() {
        return this.dataSource.query('SELECT * FROM locker ORDER BY "lockerNumber" ASC');
    }
    async getStudents() {
        return this.dataSource.query('SELECT * FROM student ORDER BY "registrationDate" DESC');
    }
    async getStaffUsers() {
        return this.dataSource.query('SELECT * FROM "user" WHERE role = \'manager\' ORDER BY "createdAt" DESC');
    }
    async getPlans() {
        return this.dataSource.query('SELECT * FROM plan ORDER BY price ASC');
    }
    async getCoupons() {
        return this.dataSource.query('SELECT * FROM coupon ORDER BY "validUntil" DESC');
    }
    async getAuditLogs() {
        return this.dataSource.query('SELECT * FROM audit_log ORDER BY "createdAt" DESC');
    }
    async getBranches() {
        return this.dataSource.query('SELECT * FROM branch ORDER BY name ASC');
    }
    async getBlacklist() {
        return this.dataSource.query('SELECT * FROM blacklist ORDER BY date DESC');
    }
    async getAdminExpenses() {
        return this.dataSource.query('SELECT * FROM expense ORDER BY "createdAt" DESC');
    }
    async getAdminExpenseCategories() {
        return [
            { id: '1', name: 'Rent', description: 'Monthly rent' },
            { id: '2', name: 'Electricity', description: 'Power bill' },
        ];
    }
    async getAdminPermissions() {
        return [
            {
                module: 'Students',
                actions: [
                    { label: 'View Students', key: 'students.view', roles: { Manager: true } },
                    { label: 'Add Student', key: 'students.add', roles: { Manager: true } },
                    { label: 'Edit Student', key: 'students.edit', roles: { Manager: true } },
                    { label: 'Delete Student', key: 'students.delete', roles: { Manager: false } },
                    { label: 'Mark Exit', key: 'students.exit', roles: { Manager: true } },
                ],
            },
            {
                module: 'Finance',
                actions: [
                    { label: 'Collect Fee', key: 'finance.collect', roles: { Manager: true } },
                    { label: 'View Payments', key: 'finance.view', roles: { Manager: true } },
                    { label: 'View Profit', key: 'finance.profit', roles: { Manager: false } },
                    { label: 'Issue Refund', key: 'finance.refund', roles: { Manager: false } },
                    { label: 'Apply Discount', key: 'finance.discount', roles: { Manager: true } },
                ],
            }
        ];
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('hello'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('crm/enquiries'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getEnquiries", null);
__decorate([
    (0, common_1.Get)('communication/complaints'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getComplaints", null);
__decorate([
    (0, common_1.Get)('communication/notices'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getNotices", null);
__decorate([
    (0, common_1.Get)('finance/payments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getPayments", null);
__decorate([
    (0, common_1.Get)('finance/refunds'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getRefunds", null);
__decorate([
    (0, common_1.Get)('seats_shifts_lockers/seat-matrix'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getSeatMatrix", null);
__decorate([
    (0, common_1.Get)('seats_shifts_lockers/lockers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getLockers", null);
__decorate([
    (0, common_1.Get)('admin/students'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getStudents", null);
__decorate([
    (0, common_1.Get)('admin/staff-users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getStaffUsers", null);
__decorate([
    (0, common_1.Get)('admin/plans'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getPlans", null);
__decorate([
    (0, common_1.Get)('admin/coupons'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getCoupons", null);
__decorate([
    (0, common_1.Get)('admin/audit-logs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Get)('admin/branches'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getBranches", null);
__decorate([
    (0, common_1.Get)('admin/blacklist'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getBlacklist", null);
__decorate([
    (0, common_1.Get)('admin/expenses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAdminExpenses", null);
__decorate([
    (0, common_1.Get)('admin/expense-categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAdminExpenseCategories", null);
__decorate([
    (0, common_1.Get)('admin/permissions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAdminPermissions", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [app_service_1.AppService,
        typeorm_1.DataSource])
], AppController);
//# sourceMappingURL=app.controller.js.map