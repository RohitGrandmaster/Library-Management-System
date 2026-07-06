import { Branch } from '../../branches/entities/branch.entity';
import { User } from '../../users/entities/user.entity';
export declare class DailySettlement {
    id: string;
    branch: Branch;
    settlementDate: Date;
    totalCashCollected: number;
    totalUPICollected: number;
    totalCardCollected: number;
    totalExpenses: number;
    netProfit: number;
    closedBy: User;
    createdAt: Date;
    updatedAt: Date;
}
