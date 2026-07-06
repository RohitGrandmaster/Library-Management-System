import { Repository } from 'typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Branch } from '../branches/entities/branch.entity';
import { User } from '../users/entities/user.entity';
export declare class SuperadminService {
    private tenantRepo;
    private branchRepo;
    private userRepo;
    constructor(tenantRepo: Repository<Tenant>, branchRepo: Repository<Branch>, userRepo: Repository<User>);
    getDashboardData(): Promise<{
        kpiCards: ({
            title: string;
            value: string;
            icon: string;
            trend: string;
            subtitle?: undefined;
            alert?: undefined;
        } | {
            title: string;
            value: string;
            icon: string;
            subtitle: string;
            trend?: undefined;
            alert?: undefined;
        } | {
            title: string;
            value: string;
            icon: string;
            alert: string;
            trend?: undefined;
            subtitle?: undefined;
        })[];
        recentLibraries: {
            initials: string;
            name: string;
            owner: string;
            students: number;
            status: string;
            plan: string;
            joinedAt: Date;
        }[];
        actionItems: {
            icon: string;
            text: string;
            type: string;
        }[];
        systemHealth: {
            uptime: string;
            activeUsers: number;
            apiLatency: string;
            lastBackup: string;
        };
    }>;
}
