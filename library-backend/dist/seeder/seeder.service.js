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
var SeederService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
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
let SeederService = SeederService_1 = class SeederService {
    roleRepo;
    permissionRepo;
    tenantRepo;
    branchRepo;
    userRepo;
    shiftRepo;
    seatRepo;
    planRepo;
    studentRepo;
    subscriptionRepo;
    paymentRepo;
    expenseRepo;
    logger = new common_1.Logger(SeederService_1.name);
    constructor(roleRepo, permissionRepo, tenantRepo, branchRepo, userRepo, shiftRepo, seatRepo, planRepo, studentRepo, subscriptionRepo, paymentRepo, expenseRepo) {
        this.roleRepo = roleRepo;
        this.permissionRepo = permissionRepo;
        this.tenantRepo = tenantRepo;
        this.branchRepo = branchRepo;
        this.userRepo = userRepo;
        this.shiftRepo = shiftRepo;
        this.seatRepo = seatRepo;
        this.planRepo = planRepo;
        this.studentRepo = studentRepo;
        this.subscriptionRepo = subscriptionRepo;
        this.paymentRepo = paymentRepo;
        this.expenseRepo = expenseRepo;
    }
    async seedCoreData() {
        this.logger.log('Starting Core DB Seeding...');
        const roles = ['superadmin', 'admin', 'manager'];
        const createdRoles = {};
        for (const r of roles) {
            let role = await this.roleRepo.findOne({ where: { name: r } });
            if (!role) {
                role = this.roleRepo.create({ name: r, description: `Role for ${r}` });
                await this.roleRepo.save(role);
            }
            createdRoles[r] = role;
        }
        let tenant = await this.tenantRepo.findOne({ where: { name: 'City Reading Hub' } });
        if (!tenant) {
            tenant = this.tenantRepo.create({
                name: 'City Reading Hub',
                ownerEmail: 'rajesh@cityreadinghub.com',
            });
            await this.tenantRepo.save(tenant);
        }
        const branches = [
            { name: 'StudyNest Patna', isActive: true },
            { name: 'BrainKraft Jaipur', isActive: true },
            { name: 'ReadHive Lucknow', isActive: false },
        ];
        const createdBranches = {};
        for (const b of branches) {
            let branch = await this.branchRepo.findOne({ where: { name: b.name }, relations: { tenant: true } });
            if (!branch) {
                branch = this.branchRepo.create({
                    name: b.name,
                    isActive: b.isActive,
                    tenant: tenant,
                });
                await this.branchRepo.save(branch);
            }
            createdBranches[b.name] = branch;
        }
        const users = [
            {
                email: 'owner@smartlibrary.com',
                phone: '9876543210',
                name: 'Rajesh Kumar',
                password: 'Owner@1234',
                role: createdRoles['superadmin'],
                branch: undefined,
            },
            {
                email: 'admin@smartlibrary.com',
                phone: '9876543211',
                name: 'Admin User',
                password: 'Admin@1234',
                role: createdRoles['admin'],
                branch: createdBranches['StudyNest Patna'],
            },
            {
                email: 'manager@smartlibrary.com',
                phone: '9876543212',
                name: 'Manager User',
                password: 'Manager@1234',
                role: createdRoles['manager'],
                branch: createdBranches['StudyNest Patna'],
            }
        ];
        for (const u of users) {
            let user = await this.userRepo.findOne({ where: { email: u.email } });
            if (!user) {
                user = this.userRepo.create(u);
                await this.userRepo.save(user);
            }
        }
        this.logger.log('Core DB Seeding Completed!');
        return { message: 'Seeding completed successfully' };
    }
    async seedAdminData() {
        this.logger.log('Starting Admin DB Seeding...');
        const tenant = await this.tenantRepo.findOne({ where: { name: 'City Reading Hub' } });
        const branch = await this.branchRepo.findOne({ where: { name: 'StudyNest Patna' }, relations: { tenant: true } });
        if (!branch)
            throw new Error('Branch not found. Run seed/core first.');
        const bId = branch.id;
        const shiftNames = ['Morning', 'Evening', 'Night', 'Full Day'];
        for (const s of shiftNames) {
            let shift = await this.shiftRepo.findOne({ where: { name: s, branch: { id: bId } } });
            if (!shift) {
                shift = this.shiftRepo.create();
                shift.name = s;
                shift.branch = branch;
                shift.startTime = '06:00';
                shift.endTime = '12:00';
                await this.shiftRepo.save(shift);
            }
        }
        for (let i = 1; i <= 24; i++) {
            let seat = await this.seatRepo.findOne({ where: { seatNumber: `S${i}`, branch: { id: bId } } });
            if (!seat) {
                seat = this.seatRepo.create();
                seat.seatNumber = `S${i}`;
                seat.branch = branch;
                await this.seatRepo.save(seat);
            }
        }
        const plans = [{ name: 'Monthly', price: 1000 }, { name: 'Quarterly', price: 2800 }];
        for (const p of plans) {
            let plan = await this.planRepo.findOne({ where: { name: p.name, branch: { id: bId } } });
            if (!plan) {
                plan = this.planRepo.create();
                plan.name = p.name;
                plan.price = p.price;
                plan.durationDays = 30;
                plan.branch = branch;
                await this.planRepo.save(plan);
            }
        }
        const students = [
            { name: 'Rohan Sharma', smartId: 'ST-002', seat: 'S2' },
            { name: 'Priya Mehta', smartId: 'ST-003', seat: 'S3' },
            { name: 'Amit Verma', smartId: 'ST-004', seat: 'S4' },
            { name: 'Sneha Rao', smartId: 'ST-006', seat: 'S6' },
        ];
        for (const s of students) {
            let student = await this.studentRepo.findOne({ where: { smartId: s.smartId, branch: { id: bId } } });
            if (!student) {
                student = this.studentRepo.create();
                student.name = s.name;
                student.smartId = s.smartId;
                student.phone = '9999999999';
                student.branch = branch;
                await this.studentRepo.save(student);
                const payment = this.paymentRepo.create();
                payment.amount = 1500;
                payment.mode = 'UPI';
                payment.paymentDate = new Date();
                payment.student = student;
                await this.paymentRepo.save(payment);
            }
        }
        this.logger.log('Admin DB Seeding Completed!');
        return { message: 'Admin Data Seeding completed' };
    }
};
exports.SeederService = SeederService;
exports.SeederService = SeederService = SeederService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __param(2, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __param(3, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(5, (0, typeorm_1.InjectRepository)(shift_entity_1.Shift)),
    __param(6, (0, typeorm_1.InjectRepository)(seat_entity_1.Seat)),
    __param(7, (0, typeorm_1.InjectRepository)(plan_entity_1.Plan)),
    __param(8, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(9, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(10, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(11, (0, typeorm_1.InjectRepository)(expense_entity_1.Expense)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SeederService);
//# sourceMappingURL=seeder.service.js.map