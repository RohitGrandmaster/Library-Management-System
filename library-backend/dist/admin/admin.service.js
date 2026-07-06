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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_entity_1 = require("../students/entities/student.entity");
const payment_entity_1 = require("../payments/entities/payment.entity");
const seat_entity_1 = require("../seats/entities/seat.entity");
let AdminService = class AdminService {
    studentRepo;
    paymentRepo;
    seatRepo;
    constructor(studentRepo, paymentRepo, seatRepo) {
        this.studentRepo = studentRepo;
        this.paymentRepo = paymentRepo;
        this.seatRepo = seatRepo;
    }
    async getDashboardData() {
        const totalStudents = await this.studentRepo.count();
        const payments = await this.paymentRepo.find({ relations: { student: true } });
        const todayCollection = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const seats = await this.seatRepo.find();
        const seatData = [
            { id: "S1", shift: "Morning", status: "free", fee: "Paid" },
            { id: "S2", shift: "Morning", status: "occupied", fee: "Due", occupant: "Rohan Sharma", expiry: "30/07/25", studentId: "2" },
            { id: "S3", shift: "Evening", status: "occupied", fee: "Paid", occupant: "Priya Mehta", expiry: "05/08/25", studentId: "3" },
            { id: "S4", shift: "Morning", status: "expiring", fee: "Due", occupant: "Amit Verma", expiry: "28/07/25", studentId: "4" },
            { id: "S5", shift: "Night", status: "maintenance", fee: "Paid" },
            { id: "S6", shift: "Evening", status: "occupied", fee: "Due", occupant: "Sneha Rao", expiry: "10/08/25", studentId: "6" },
            { id: "S7", shift: "Morning", status: "free", fee: "Paid" },
            { id: "S8", shift: "Night", status: "free", fee: "Paid" },
            { id: "S9", shift: "Evening", status: "free", fee: "Paid" },
            { id: "S10", shift: "Morning", status: "occupied", fee: "Due", occupant: "Karan Singh", expiry: "01/08/25", studentId: "10" },
            { id: "S11", shift: "Night", status: "expiring", fee: "Due", occupant: "Divya Nair", expiry: "27/07/25", studentId: "11" },
            { id: "S12", shift: "Evening", status: "occupied", fee: "Paid", occupant: "Rahul Gupta", expiry: "15/08/25", studentId: "12" },
            { id: "S13", shift: "Morning", status: "free", fee: "Paid" },
            { id: "S14", shift: "Night", status: "free", fee: "Paid" },
            { id: "S15", shift: "Evening", status: "maintenance", fee: "Paid" },
            { id: "S16", shift: "Morning", status: "occupied", fee: "Due", occupant: "Pooja Sharma", expiry: "03/08/25", studentId: "16" },
            { id: "S17", shift: "Morning", status: "free", fee: "Paid" },
            { id: "S18", shift: "Evening", status: "occupied", fee: "Paid", occupant: "Nikhil Joshi", expiry: "20/08/25", studentId: "18" },
            { id: "S19", shift: "Night", status: "occupied", fee: "Paid", occupant: "Ananya Das", expiry: "12/08/25", studentId: "19" },
            { id: "S20", shift: "Morning", status: "expiring", fee: "Due", occupant: "Vikram Patel", expiry: "29/07/25", studentId: "20" },
            { id: "S21", shift: "Evening", status: "free", fee: "Paid" },
            { id: "S22", shift: "Morning", status: "occupied", fee: "Paid", occupant: "Sanya Dua", expiry: "18/08/25", studentId: "22" },
            { id: "S23", shift: "Night", status: "free", fee: "Paid" },
            { id: "S24", shift: "Evening", status: "expiring", fee: "Due", occupant: "Mohit Arya", expiry: "26/07/25", studentId: "24" }
        ];
        const recentPayments = payments.map(p => ({
            name: p.student?.name || 'Unknown',
            initials: (p.student?.name || 'U').substring(0, 2).toUpperCase(),
            amount: `₹${p.amount}`,
            mode: p.mode,
            timeAgo: "2m ago",
            studentId: p.student?.id || "1"
        }));
        if (recentPayments.length === 0) {
            recentPayments.push({ name: "Arjun Sharma", initials: "AS", amount: "₹1,500", mode: "UPI", timeAgo: "2m ago", studentId: "1" }, { name: "Riya Kapoor", initials: "RK", amount: "₹2,200", mode: "Cash", timeAgo: "15m ago", studentId: "3" }, { name: "Vikram Verma", initials: "VV", amount: "₹1,500", mode: "UPI", timeAgo: "1h ago", studentId: "4" }, { name: "Sanya Dua", initials: "SD", amount: "₹3,500", mode: "Card", timeAgo: "3h ago", studentId: "22" }, { name: "Mohit Arya", initials: "MA", amount: "₹1,500", mode: "Bank Transfer", timeAgo: "5h ago", studentId: "24" });
        }
        return {
            kpiCards: [
                { label: "Active Students", value: totalStudents > 0 ? totalStudents.toString() : "1,248", trend: { value: "12% vs last month", up: true }, sub: "Total enrolled" },
                { label: "Today's Collection", value: todayCollection > 0 ? `₹${todayCollection}` : "₹42,500", trend: { value: "8% vs yesterday", up: true }, sub: "Gross revenue today" },
                { label: "Occupied Seats", value: `${seats.length > 0 ? seats.length : "48"} / 60`, trend: { value: "3% vs last week", up: false }, sub: "80% occupancy rate" },
                { label: "Pending Actions", value: "11", trend: { value: "2 new today", up: false }, sub: "Dues + Enquiries + Complaints" }
            ],
            seats: seatData,
            shifts: ["Morning", "Evening", "Night"],
            actionItems: [
                { label: "Fee Renewals Due", count: 5, type: "danger", href: "/finance/renewals" },
                { label: "New Enquiries", count: 2, type: "warning", href: "/crm/enquiries" },
                { label: "Complaint Open", count: 1, type: "danger", href: "/communication/complaints" },
                { label: "PTP Dates Today", count: 3, type: "warning", href: "/finance/payment-promises" }
            ],
            recentPayments
        };
    }
    async getReportsData() {
        const totalStudents = await this.studentRepo.count();
        const payments = await this.paymentRepo.find();
        let totalRev = payments.reduce((acc, p) => acc + Number(p.amount), 0);
        if (totalRev === 0)
            totalRev = 142000;
        return {
            kpiCards: [
                { label: 'Total Revenue', value: `₹${totalRev.toLocaleString('en-IN')}`, trend: { value: '12% vs last period', up: true }, sub: 'Fees collected' },
                { label: 'Total Expenses', value: '₹34,500', trend: { value: '5% vs last period', up: false }, sub: 'Operational costs' },
                { label: 'Net Profit', value: `₹${(totalRev - 34500).toLocaleString('en-IN')}`, trend: { value: '8% vs last period', up: true }, sub: 'Revenue - Expenses' },
                { label: 'Active Enrollments', value: totalStudents > 0 ? totalStudents : 1248, trend: { value: '45 new this period', up: true }, sub: 'Across all branches' },
            ],
            incomeVsExpense: {
                thisMonth: [{ month: 'Week 1', income: 42000, expense: 12000 }, { month: 'Week 2', income: 38000, expense: 8000 }, { month: 'Week 3', income: 45000, expense: 9500 }, { month: 'Week 4', income: 52000, expense: 14000 }],
                last3Months: [{ month: 'May', income: 180000, expense: 52000 }, { month: 'Jun', income: 210000, expense: 61000 }, { month: 'Jul', income: 195000, expense: 48000 }],
                thisYear: [{ month: 'Jan', income: 150000, expense: 42000 }, { month: 'Feb', income: 165000, expense: 45000 }, { month: 'Mar', income: 180000, expense: 48000 }, { month: 'Apr', income: 190000, expense: 50000 }, { month: 'May', income: 180000, expense: 52000 }, { month: 'Jun', income: 210000, expense: 61000 }, { month: 'Jul', income: 195000, expense: 48000 }],
            },
            shiftOccupancy: [
                { name: 'Morning', value: 45, color: 'var(--chart-indigo)' },
                { name: 'Evening', value: 35, color: 'var(--chart-purple)' },
                { name: 'Night', value: 20, color: 'var(--chart-amber)' },
            ],
            revenueTrend: {
                thisMonth: [{ month: 'W1', revenue: 42000 }, { month: 'W2', revenue: 38000 }, { month: 'W3', revenue: 45000 }, { month: 'W4', revenue: 52000 }],
                last3Months: [{ month: 'May', revenue: 180000 }, { month: 'Jun', revenue: 210000 }, { month: 'Jul', revenue: 195000 }],
                thisYear: [{ month: 'Jan', revenue: 150000 }, { month: 'Feb', revenue: 165000 }, { month: 'Mar', revenue: 180000 }, { month: 'Apr', revenue: 190000 }, { month: 'May', revenue: 180000 }, { month: 'Jun', revenue: 210000 }, { month: 'Jul', revenue: 195000 }],
            },
            studentGrowth: {
                thisMonth: [{ month: 'W1', joined: 12, exited: 2 }, { month: 'W2', joined: 15, exited: 3 }, { month: 'W3', joined: 8, exited: 1 }, { month: 'W4', joined: 10, exited: 4 }],
                last3Months: [{ month: 'May', joined: 45, exited: 12 }, { month: 'Jun', joined: 52, exited: 15 }, { month: 'Jul', joined: 38, exited: 8 }],
                thisYear: [{ month: 'Jan', joined: 30, exited: 5 }, { month: 'Feb', joined: 35, exited: 8 }, { month: 'Mar', joined: 40, exited: 10 }, { month: 'Apr', joined: 42, exited: 11 }, { month: 'May', joined: 45, exited: 12 }, { month: 'Jun', joined: 52, exited: 15 }, { month: 'Jul', joined: 38, exited: 8 }],
            }
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(2, (0, typeorm_1.InjectRepository)(seat_entity_1.Seat)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map