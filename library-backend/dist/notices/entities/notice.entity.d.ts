import { Branch } from '../../branches/entities/branch.entity';
import { User } from '../../users/entities/user.entity';
export declare class Notice {
    id: string;
    title: string;
    message: string;
    validTill: Date;
    branch: Branch;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}
