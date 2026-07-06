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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const expense_entity_1 = require("./entities/expense.entity");
let ExpensesService = class ExpensesService {
    expenseRepo;
    constructor(expenseRepo) {
        this.expenseRepo = expenseRepo;
    }
    async findAll(branchId) {
        const expenses = await this.expenseRepo.find({
            where: branchId ? { branch: { id: branchId } } : {},
            relations: {
                branch: true,
                category: true,
                addedBy: true,
            },
            order: { createdAt: 'DESC' }
        });
        return expenses.map(e => ({
            id: e.id,
            date: e.expenseDate ? new Date(e.expenseDate).toLocaleDateString('en-IN') : e.createdAt.toLocaleDateString('en-IN'),
            category: e.category?.name || 'Uncategorized',
            amount: e.amount,
            description: e.description,
            branch: e.branch?.name || 'N/A',
            recordedBy: e.addedBy?.name || 'System',
        }));
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(expense_entity_1.Expense)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map