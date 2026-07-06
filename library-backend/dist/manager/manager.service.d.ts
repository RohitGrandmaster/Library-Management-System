import { Repository } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { Seat } from '../seats/entities/seat.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
export declare class ManagerService {
    private readonly studentRepo;
    private readonly seatRepo;
    private readonly subRepo;
    constructor(studentRepo: Repository<Student>, seatRepo: Repository<Seat>, subRepo: Repository<Subscription>);
    getDashboardData(branchId?: string): Promise<{
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
