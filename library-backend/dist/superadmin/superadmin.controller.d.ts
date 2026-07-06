import { SuperadminService } from './superadmin.service';
export declare class SuperadminController {
    private readonly superadminService;
    constructor(superadminService: SuperadminService);
    getDashboard(): Promise<{
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
