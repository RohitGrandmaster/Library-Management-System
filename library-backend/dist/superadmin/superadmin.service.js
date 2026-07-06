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
exports.SuperadminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tenant_entity_1 = require("../tenants/entities/tenant.entity");
const branch_entity_1 = require("../branches/entities/branch.entity");
const user_entity_1 = require("../users/entities/user.entity");
let SuperadminService = class SuperadminService {
    tenantRepo;
    branchRepo;
    userRepo;
    constructor(tenantRepo, branchRepo, userRepo) {
        this.tenantRepo = tenantRepo;
        this.branchRepo = branchRepo;
        this.userRepo = userRepo;
    }
    async getDashboardData() {
        const totalLibraries = await this.branchRepo.count();
        const totalStudents = 14820;
        const branches = await this.branchRepo.find({ relations: { tenant: true } });
        const recentLibraries = branches.map(b => ({
            initials: b.name.substring(0, 2).toUpperCase(),
            name: b.name,
            owner: b.tenant?.ownerEmail || 'Unknown',
            students: Math.floor(Math.random() * 500),
            status: b.isActive ? 'active' : 'inactive',
            plan: 'Pro',
            joinedAt: b.createdAt || new Date(),
        }));
        return {
            kpiCards: [
                { title: "Total Libraries", value: totalLibraries.toString(), icon: "store", trend: "+4 this month" },
                { title: "Total Students", value: totalStudents.toString(), icon: "groups", subtitle: "Across all branches" },
                { title: "Platform Revenue", value: "₹ 2,14,000", icon: "currency_rupee", trend: "+18%" },
                { title: "Pending Setups", value: "5", icon: "pending_actions", alert: "Needs Attention" }
            ],
            recentLibraries,
            actionItems: [
                { icon: "warning", text: "5 Libraries Pending Setup", type: "error" },
                { icon: "credit_card_off", text: "3 Subscriptions Expiring", type: "error" },
                { icon: "support_agent", text: "8 Support Tickets Open", type: "tertiary" },
                { icon: "cloud_upload", text: "Last Backup: 2h ago", type: "tertiary" }
            ],
            systemHealth: {
                uptime: "99.97%",
                activeUsers: await this.userRepo.count(),
                apiLatency: "42ms",
                lastBackup: "2h ago"
            }
        };
    }
};
exports.SuperadminService = SuperadminService;
exports.SuperadminService = SuperadminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __param(1, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SuperadminService);
//# sourceMappingURL=superadmin.service.js.map