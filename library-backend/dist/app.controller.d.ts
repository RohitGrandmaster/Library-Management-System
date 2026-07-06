import { AppService } from './app.service';
import { DataSource } from 'typeorm';
export declare class AppController {
    private readonly appService;
    private readonly dataSource;
    constructor(appService: AppService, dataSource: DataSource);
    getHello(): string;
    getEnquiries(): Promise<any>;
    getComplaints(): Promise<any>;
    getNotices(): Promise<any>;
    getPayments(): Promise<any>;
    getRefunds(): Promise<{
        id: string;
        name: string;
        amount: number;
        date: Date;
        status: string;
    }[]>;
    getSeatMatrix(): Promise<any>;
    getLockers(): Promise<any>;
    getStudents(): Promise<any>;
    getStaffUsers(): Promise<any>;
    getPlans(): Promise<any>;
    getCoupons(): Promise<any>;
    getAuditLogs(): Promise<any>;
    getBranches(): Promise<any>;
    getBlacklist(): Promise<any>;
    getAdminExpenses(): Promise<any>;
    getAdminExpenseCategories(): Promise<{
        id: string;
        name: string;
        description: string;
    }[]>;
    getAdminPermissions(): Promise<{
        module: string;
        actions: {
            label: string;
            key: string;
            roles: {
                Manager: boolean;
            };
        }[];
    }[]>;
}
