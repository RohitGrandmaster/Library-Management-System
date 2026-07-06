import { ManagerService } from './manager.service';
export declare class ManagerController {
    private readonly managerService;
    constructor(managerService: ManagerService);
    getDashboard(req: any): Promise<{
        kpiData: {
            title: string;
            value: string;
            icon: string;
            iconClass: string;
            trend: string;
        }[];
        seatData: {
            id: string;
            status: string;
        }[];
        actionItems: {
            title: string;
            count: number;
            countClass: string;
            href: string;
            showRenew: boolean;
        }[];
        recentAdmissions: {
            id: string;
            name: string;
            smartId: string;
            shift: string;
        }[];
        recentEnquiries: never[];
    }>;
}
