import { Branch } from '../../branches/entities/branch.entity';
import { User } from '../../users/entities/user.entity';
export declare class Holiday {
    id: string;
    branch: Branch;
    date: Date;
    name: string;
    description: string;
    isRecurringYearly: boolean;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}
