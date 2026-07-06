import { Repository } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Seat } from '../seats/entities/seat.entity';
export declare class AdminService {
    private studentRepo;
    private paymentRepo;
    private seatRepo;
    constructor(studentRepo: Repository<Student>, paymentRepo: Repository<Payment>, seatRepo: Repository<Seat>);
    getDashboardData(): Promise<{
        kpiCards: {
            label: string;
            value: string;
            trend: {
                value: string;
                up: boolean;
            };
            sub: string;
        }[];
        seats: ({
            id: string;
            shift: string;
            status: string;
            fee: string;
            occupant?: undefined;
            expiry?: undefined;
            studentId?: undefined;
        } | {
            id: string;
            shift: string;
            status: string;
            fee: string;
            occupant: string;
            expiry: string;
            studentId: string;
        })[];
        shifts: string[];
        actionItems: {
            label: string;
            count: number;
            type: string;
            href: string;
        }[];
        recentPayments: {
            name: string;
            initials: string;
            amount: string;
            mode: string;
            timeAgo: string;
            studentId: string;
        }[];
    }>;
    getReportsData(): Promise<{
        kpiCards: ({
            label: string;
            value: string;
            trend: {
                value: string;
                up: boolean;
            };
            sub: string;
        } | {
            label: string;
            value: number;
            trend: {
                value: string;
                up: boolean;
            };
            sub: string;
        })[];
        incomeVsExpense: {
            thisMonth: {
                month: string;
                income: number;
                expense: number;
            }[];
            last3Months: {
                month: string;
                income: number;
                expense: number;
            }[];
            thisYear: {
                month: string;
                income: number;
                expense: number;
            }[];
        };
        shiftOccupancy: {
            name: string;
            value: number;
            color: string;
        }[];
        revenueTrend: {
            thisMonth: {
                month: string;
                revenue: number;
            }[];
            last3Months: {
                month: string;
                revenue: number;
            }[];
            thisYear: {
                month: string;
                revenue: number;
            }[];
        };
        studentGrowth: {
            thisMonth: {
                month: string;
                joined: number;
                exited: number;
            }[];
            last3Months: {
                month: string;
                joined: number;
                exited: number;
            }[];
            thisYear: {
                month: string;
                joined: number;
                exited: number;
            }[];
        };
    }>;
}
